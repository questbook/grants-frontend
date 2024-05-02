import { useContext, useMemo } from 'react'
import { defaultChainId } from 'src/constants/chains'
import { addBatchCommentsMutation, batchGrantApplicationUpdateMutation } from 'src/generated/mutation'
import { executeMutation } from 'src/graphql/apollo'
import { useQuery } from 'src/libraries/hooks/useQuery'
import logger from 'src/libraries/logger'
import { getKeyForApplication, getSecureChannelFromPublicKey } from 'src/libraries/utils/pii'
import { PIIForCommentType } from 'src/libraries/utils/types'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { GrantsProgramContext, WebwalletContext } from 'src/pages/_app'
import { getMemberPublicKeysQuery } from 'src/screens/dashboard/_data/getMemberPublicKeysQuery'
import { ProposalType } from 'src/screens/dashboard/_utils/types'
import { DashboardContext } from 'src/screens/dashboard/Context'

interface Props {
  setStep: (step: number | undefined) => void
  setTransactionHash: (hash: string) => void
}

function useAddComments({ setStep, setTransactionHash }: Props) {
	const { scwAddress, webwallet } = useContext(WebwalletContext)!
	const { grant, role } = useContext(GrantsProgramContext)!
	const { proposals, selectedProposals } = useContext(DashboardContext)!

	const selectedProposalsData = useMemo(() => {
		if(!proposals || !selectedProposals) {
			return []
		}

		const p: ProposalType[] = []
		for(let i = 0; i < proposals.length; i++) {
			if(selectedProposals.has(proposals[i].id)) {
				p.push(proposals[i])
			}
		}

		p.sort((a, b) => parseInt(a.id, 16) - parseInt(b.id, 16))
		return p
	}, [proposals, selectedProposals])

	const chainId = useMemo(() => {
		return getSupportedChainIdFromWorkspace(grant?.workspace) ?? defaultChainId
	}, [grant])
	logger.info({ chainId }, 'Chain ID (Comment)')

	const { fetchMore: fetchMorePublicKeys } = useQuery({
		query: getMemberPublicKeysQuery
	})


	const fetchPublicKeys = async(proposal: ProposalType) => {
		logger.info({ proposal }, 'Proposal (COMMENT ENCRYPT)')
		if(!proposal?.grant?.workspace?.id || !proposal?.id) {
			return []
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const results: any = await fetchMorePublicKeys({
			workspaceId: proposal?.grant?.workspace?.id,
			applicationIds: [proposal?.id],
		})

		logger.info({ results }, 'Results (COMMENT ENCRYPT)')

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
	}

	const addComments =
		async(message: string, isPrivate: boolean, tag?: string) => {
			if(!grant?.workspace?.id ||
        !grant?.id ||
        !selectedProposalsData.length || !webwallet
			) {
				return
			}

			const messageHash = message
			const json: PIIForCommentType = {
				sender: scwAddress,
				message: messageHash,
				timestamp: Math.floor(Date.now() / 1000),
				tag,
				role,
			}
			setStep(0)
			// eslint-disable-next-line prefer-const
			let commentHashes: object[] = []

			if(isPrivate) {
				for(const proposal of selectedProposalsData) {
					const publicKeys = await fetchPublicKeys(proposal)
					logger.info({ id: proposal.id, publicKeys }, 'Public Keys (COMMENT ENCRYPT)')

					const piiMap: {[actorId: string]: string} = {}
					for(const { actorId, publicKey } of publicKeys) {
						if(!publicKey || !actorId) {
							continue
						}

						const channel = await getSecureChannelFromPublicKey(webwallet, publicKey, getKeyForApplication(proposal.id))
						const encryptedData = await channel.encrypt(JSON.stringify(json))
						logger.info({ actorId, privateKey: webwallet.privateKey, publicKey, extraInfo: getKeyForApplication(proposal.id), data: json, answer: encryptedData }, 'Encrypted Data (COMMENT ENCRYPT)')
						piiMap[actorId] = encryptedData
					}

					logger.info({ id: proposal.id, piiMap }, 'PII Map (COMMENT ENCRYPT)')
					const modifiedJson = { pii: piiMap }
					logger.info({ id: proposal.id, json: modifiedJson }, 'JSON (Comment)')

					const hash = modifiedJson
					commentHashes.push(hash)
				}
			} else {
				const hash = json
				commentHashes.push(hash)
			}

			logger.info({ commentHashes }, 'Comment Hashes')

			if(tag === 'accept' || tag === 'reject' || tag === 'resubmit' || tag === 'review' || tag === 'cancelled') {
				const toState = tag === 'accept' ? 'approved' : tag === 'reject' ? 'rejected' : tag === 'review' ? 'review' : tag === 'cancelled' ? 'cancelled' : 'resubmit'
				const applicationUpdateHash = commentHashes[0]

				const methodArgs = {
					id: selectedProposalsData.map((proposal) => proposal.id),
					grant: grant.id,
					workspaceId: grant.workspace.id,
					applicantId: selectedProposalsData.map((proposal) => proposal.applicantId),
					state: selectedProposalsData.map(() => toState),
					feedback: selectedProposalsData.map(() => applicationUpdateHash),
				}
				logger.info({ methodArgs }, 'Method Args (Comment)')
				setTransactionHash('')
				return await executeMutation(batchGrantApplicationUpdateMutation, methodArgs)
			} else {
				logger.info({ selectedProposalsData }, 'Selected Proposals Data')
				const methodArgs = {
					workspace: grant.workspace.id,
					grant: grant.id,
					application: selectedProposalsData.map((proposal) => proposal.id),
					isPrivate,
					comments: selectedProposalsData.map(() => commentHashes[0]),
				}
				logger.info({ methodArgs }, 'Method Args (Comment)')
				setTransactionHash('')
				return await executeMutation(addBatchCommentsMutation, methodArgs)
			}
		}


	return {
		addComments,
	}
}

export default useAddComments