import { useContext, useMemo } from 'react'
import { useGetMemberPublicKeysQuery } from 'src/generated/graphql'
import { useMultiChainQuery } from 'src/hooks/useMultiChainQuery'
import useFunctionCall from 'src/libraries/hooks/useFunctionCall'
import logger from 'src/libraries/logger'
import { getKeyForApplication, getSecureChannelFromPublicKey } from 'src/libraries/utils/pii'
import { PIIForCommentType } from 'src/libraries/utils/types'
import { ApiClientsContext, GrantsProgramContext, WebwalletContext } from 'src/pages/_app'
import useProposalTags from 'src/screens/dashboard/_hooks/useQuickReplies'
import { ProposalType } from 'src/screens/dashboard/_utils/types'
import { DashboardContext } from 'src/screens/dashboard/Context'
import { uploadToIPFS } from 'src/utils/ipfsUtils'

interface Props {
  setStep: (step: number | undefined) => void
  setTransactionHash: (hash: string) => void
}

function useAddComments({ setStep, setTransactionHash }: Props) {
	const { workspace, chainId } = useContext(ApiClientsContext)!
	const { scwAddress, webwallet } = useContext(WebwalletContext)!
	const { grant, role } = useContext(GrantsProgramContext)!
	const { proposals, selectedProposals } = useContext(DashboardContext)!

	const { proposalTags } = useProposalTags({ proposals: proposals.filter(p => selectedProposals.has(p.id)) })

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

	const { call, isBiconomyInitialised } = useFunctionCall({
		chainId,
		contractName: 'communication',
		setTransactionHash,
		setTransactionStep: setStep,
	})

	const { fetchMore: fetchMorePublicKeys } = useMultiChainQuery({
		useQuery: useGetMemberPublicKeysQuery,
		options: {},
		chains: [chainId],
	})

	const fetchPublicKeys = async(proposal: ProposalType) => {
		logger.info({ proposal }, 'Proposal (COMMENT ENCRYPT)')
		if(!proposal?.grant?.workspace?.id || !proposal?.id) {
			return []
		}

		const results = await fetchMorePublicKeys({
			workspaceId: proposal.grant.workspace?.id,
			applicationIds: [proposal.id],
		}, true)

		logger.info({ results }, 'Results (COMMENT ENCRYPT)')

		return [...(results?.[0]?.workspace?.members?.map(m => ({ actorId: m.actorId, publicKey: m.publicKey })) ?? []), { actorId: results?.[0]?.grantApplications?.[0]?.applicantId, publicKey: results?.[0]?.grantApplications?.[0]?.applicantPublicKey }].filter(k => k.publicKey)
	}

	const addComments =
		async(message: string, tags: number[], isPrivate: boolean) => {
			if(
				!workspace?.id ||
        !grant?.id ||
        !selectedProposalsData.length || !webwallet
			) {
				return
			}

			const messageHash = (await uploadToIPFS(message)).hash
			const json: PIIForCommentType = {
				sender: scwAddress,
				message: messageHash,
				timestamp: Math.floor(Date.now() / 1000),
				tags: proposalTags
					?.filter((_, index) => tags.includes(index))
					.map((reply) => reply.id),
				role,
			}

			const commentHashes: string[] = []

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

					const hash = (await uploadToIPFS(JSON.stringify(modifiedJson))).hash
					commentHashes.push(hash)
				}
			} else {
				const hash = (await uploadToIPFS(JSON.stringify(json))).hash
				commentHashes.push(...proposals.map(() => hash))
			}

			logger.info({ commentHashes }, 'Comment Hashes')

			const methodArgs = [
				workspace.id,
				grant.id,
				selectedProposalsData.map((proposal) => proposal.id),
				isPrivate,
				commentHashes,
			]
			logger.info({ methodArgs }, 'Method Args (Comment)')

			return await call({ method: 'addComments', args: methodArgs })
		}


	return {
		addComments,
		isBiconomyInitialised,
	}
}

export default useAddComments
