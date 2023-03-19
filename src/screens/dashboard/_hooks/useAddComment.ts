import { useCallback, useContext, useMemo } from 'react'
import { defaultChainId } from 'src/constants/chains'
import { useGetMemberPublicKeysQuery } from 'src/generated/graphql'
import useFunctionCall from 'src/libraries/hooks/useFunctionCall'
import { useMultiChainQuery } from 'src/libraries/hooks/useMultiChainQuery'
import logger from 'src/libraries/logger'
import { uploadToIPFS } from 'src/libraries/utils/ipfs'
import {
	getKeyForApplication,
	getSecureChannelFromPublicKey,
} from 'src/libraries/utils/pii'
import { PIIForCommentType } from 'src/libraries/utils/types'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { GrantsProgramContext, WebwalletContext } from 'src/pages/_app'
import { DashboardContext } from 'src/screens/dashboard/Context'

interface Props {
  setStep: (step: number | undefined) => void
  setTransactionHash: (hash: string) => void
}

function useAddComment({ setStep, setTransactionHash }: Props) {
	const { role } = useContext(GrantsProgramContext)!
	const { scwAddress, webwallet } = useContext(WebwalletContext)!
	const { proposals, selectedProposals } = useContext(DashboardContext)!

	const proposal = useMemo(() => {
		return proposals.find((p) => selectedProposals.has(p.id))
	}, [proposals, selectedProposals])

	const chainId = useMemo(() => {
		return (getSupportedChainIdFromWorkspace(proposal?.grant?.workspace) ?? defaultChainId)
	}, [proposal?.grant?.workspace])

	const { call: commentCall, isBiconomyInitialised } = useFunctionCall({
		chainId,
		contractName: 'communication',
		setTransactionHash,
		setTransactionStep: setStep,
	})

	const { call: updateCall } = useFunctionCall({
		chainId,
		contractName: 'applications',
		setTransactionHash,
		setTransactionStep: setStep,
	})

	const { fetchMore: fetchMorePublicKeys } = useMultiChainQuery({
		useQuery: useGetMemberPublicKeysQuery,
		options: {},
		chains: [
			getSupportedChainIdFromWorkspace(proposal?.grant?.workspace) ??
        defaultChainId,
		],
	})

	const fetchPublicKeys = useCallback(async() => {
		if(!proposal?.grant?.workspace?.id || !proposal?.id) {
			return []
		}

		const results = await fetchMorePublicKeys({
			workspaceId: proposal?.grant?.workspace?.id,
			applicationIds: [proposal?.id],
		})

		return [
			...(results?.[0]?.workspace?.members?.map((m) => ({
				actorId: m.actorId,
				publicKey: m.publicKey,
			})) ?? []),
			{
				actorId: results?.[0]?.grantApplications?.[0]?.applicantId,
				publicKey: results?.[0]?.grantApplications?.[0]?.applicantPublicKey,
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

		const messageHash = (await uploadToIPFS(message)).hash
		let json: PIIForCommentType = {
			sender: scwAddress,
			message: messageHash,
			timestamp: Math.floor(Date.now() / 1000),
			tag,
			role,
		}

		if(isPrivate) {
			const publicKeys = await fetchPublicKeys()

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

		const commentHash = (await uploadToIPFS(JSON.stringify(json))).hash
		logger.info({ commentHash }, 'Comment Hash (Comment)')

		if(tag === 'accept' || tag === 'reject' || tag === 'resubmit') {
			const toState = tag === 'accept' ? 2 : tag === 'reject' ? 3 : 1
			const applicationUpdateHash = (
				await uploadToIPFS(
					JSON.stringify({
						feedback: commentHash,
					}),
				)
			).hash

			const methodArgs = [
				proposal.id,
				proposal.grant.workspace.id,
				toState,
				applicationUpdateHash,
			]
			logger.info({ methodArgs }, 'Method Args (Comment)')

			return await updateCall({
				method: 'updateApplicationState',
				args: methodArgs,
			})
		} else {
			const methodArgs = [
				proposal.grant.workspace.id,
				proposal.grant.id,
				proposal.id,
				isPrivate,
				commentHash,
			]
			logger.info({ methodArgs }, 'Method Args (Comment)')

			return await commentCall({ method: 'addComment', args: methodArgs })
		}
	}

	return {
		addComment,
		isBiconomyInitialised,
	}
}

export default useAddComment
