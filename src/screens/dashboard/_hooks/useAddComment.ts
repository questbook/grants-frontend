import { useCallback, useContext, useMemo } from 'react'
import { defaultChainId } from 'src/constants/chains'
import { reSubmitProposalMutation } from 'src/generated/mutation'
import { addCommentMutation } from 'src/generated/mutation/addComment'
import { executeMutation } from 'src/graphql/apollo'
import { useQuery } from 'src/libraries/hooks/useQuery'
import logger from 'src/libraries/logger'
import { AmplitudeContext } from 'src/libraries/utils/amplitude'
import {
	getKeyForApplication,
	getSecureChannelFromPublicKey,
} from 'src/libraries/utils/pii'
import { PIIForCommentType } from 'src/libraries/utils/types'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { GrantsProgramContext, WebwalletContext } from 'src/pages/_app'
import { getMemberPublicKeysQuery } from 'src/screens/dashboard/_data/getMemberPublicKeysQuery'
import { DashboardContext } from 'src/screens/dashboard/Context'


interface Props {
  setStep: (step: number | undefined) => void
  setTransactionHash: (hash: string) => void
}

function useAddComment({ setStep, setTransactionHash }: Props) {
	const { role, grant } = useContext(GrantsProgramContext)!
	const { scwAddress, webwallet } = useContext(WebwalletContext)!
	const { proposals, selectedProposals } = useContext(DashboardContext)!
	const { trackAmplitudeEvent } = useContext(AmplitudeContext)!

	const proposal = useMemo(() => {
		return proposals.find((p) => selectedProposals.has(p.id))
	}, [proposals, selectedProposals])

	const chainId = useMemo(() => {
		return (getSupportedChainIdFromWorkspace(proposal?.grant?.workspace) ?? defaultChainId)
	}, [proposal?.grant?.workspace])

	logger.info({ chainId }, 'Chain ID (Comment)')

	const { fetchMore: fetchMorePublicKeys } = useQuery({
		query: getMemberPublicKeysQuery
	})

	const fetchPublicKeys = useCallback(async() => {
		if(!proposal?.grant?.workspace?.id || !proposal?.id) {
			return []
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const results: any = await fetchMorePublicKeys({
			workspaceId: proposal?.grant?.workspace?.id,
			applicationIds: [proposal?.id],
		})

		return [
			...(results?.workspace?.members?.map((m: {
				actorId: string
				publicKey: string
			}) => ({
				actorId: m.actorId,
				publicKey: m.publicKey,
			})) ?? []),
			{
				actorId: results?.grantApplications?.[0]?.applicantId,
				publicKey: results?.grantApplications?.[0]?.applicantPublicKey,
			},
		].filter((k) => k.publicKey)
	}, [proposal])

	const addComment = async(
		message: string,
		isPrivate: boolean,
		tag?: string,
	) => {
		if(
			!webwallet ||
      !scwAddress ||
      !proposal?.id ||
      !proposal?.grant?.id ||
      !proposal?.grant?.workspace?.id
		) {
			logger.info(
				{
					webwallet,
					scwAddress,
					proposal,
					grant: proposal?.grant?.id,
					workspace: !proposal?.grant?.workspace?.id,
				},
				'Missing Data (Comment)',
			)
			return
		}

		setStep(0)

		const messageHash = message
		let json: PIIForCommentType = {
			sender: scwAddress,
			message: messageHash,
			timestamp: Math.floor(Date.now() / 1000),
			tag,
			role,
		}

		if(isPrivate) {
			const publicKeys = await fetchPublicKeys()
			logger.info({ publicKeys }, 'Public Keys (Comment)')
			const piiMap: { [actorId: string]: string } = {}
			for(const { actorId, publicKey } of publicKeys) {
				if(!publicKey || !actorId) {
					continue
				}

				const channel = await getSecureChannelFromPublicKey(
					webwallet,
					publicKey,
					getKeyForApplication(proposal.id),
				)
				const encryptedData = await channel.encrypt(JSON.stringify(json))
				logger.info(
					{
						privateKey: webwallet.privateKey,
						publicKey,
						extraInfo: getKeyForApplication(proposal.id),
						data: json,
						answer: encryptedData,
					},
					'Encrypted Data (Comment)',
				)
				piiMap[actorId] = encryptedData
			}

			json = { pii: piiMap }
		}

		logger.info(json, 'JSON (Comment)')

		const commentHash = (await (JSON.stringify(json)))
		logger.info({ commentHash }, 'Comment Hash (Comment)')

		if(tag === 'accept' || tag === 'reject' || tag === 'resubmit' || tag === 'review' || tag === 'cancelled') {
			const toState = tag === 'accept' ? 'approved' : tag === 'reject' ? 'rejected' : tag === 'review' ? 'review' : tag === 'cancelled' ? 'cancelled' : 'resubmit'
			await trackAmplitudeEvent('Proposal_Action', {
				action: toState,
				programName: grant?.title,
				proposalId: proposal.id,
			})
			const methodArgs = {
				id: proposal.id,
				grant: proposal.grant.id,
				workspaceId: proposal.grant.workspace.id,
				applicantId: scwAddress,
				state: toState,
				feedback: JSON.parse(commentHash),
			}
			setTransactionHash('')
			logger.info({ methodArgs }, 'Method Args (Comment)')
			return await executeMutation(reSubmitProposalMutation, methodArgs)

		} else {

			const methodArgs = {
				workspace: proposal.grant.workspace.id,
				grant: proposal.grant.id,
				application: proposal.id,
				isPrivate,
				comment: JSON.parse(commentHash),
				sender: scwAddress,
			}
			logger.info({ methodArgs }, 'Method Args (Comment)')
			setTransactionHash('')
			return await executeMutation(addCommentMutation, methodArgs)
		}
	}

	return {
		addComment,
	}
}

export default useAddComment
