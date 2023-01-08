import { useContext, useMemo } from 'react'
import { convertToRaw, EditorState } from 'draft-js'
import { useGetMemberPublicKeysQuery } from 'src/generated/graphql'
import { useMultiChainQuery } from 'src/hooks/useMultiChainQuery'
import useFunctionCall from 'src/libraries/hooks/useFunctionCall'
import logger from 'src/libraries/logger'
import { getKeyForApplication, getSecureChannelFromPublicKey } from 'src/libraries/utils/pii'
import { PIIForCommentType } from 'src/libraries/utils/types'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import useQuickReplies from 'src/screens/dashboard/_hooks/useQuickReplies'
import { ProposalType } from 'src/screens/dashboard/_utils/types'
import { DashboardContext } from 'src/screens/dashboard/Context'
import { uploadToIPFS } from 'src/utils/ipfsUtils'

interface Props {
  setStep: (step: number | undefined) => void
  setTransactionHash: (hash: string) => void
}

function useAddComments({ setStep, setTransactionHash }: Props) {
	const { role, workspace, chainId } = useContext(ApiClientsContext)!
	const { scwAddress, webwallet } = useContext(WebwalletContext)!
	const { proposals, selectedProposals, selectedGrant } =
    useContext(DashboardContext)!

	const { quickReplies } = useQuickReplies()

	const selectedProposalsData = useMemo(() => {
		if(!proposals || !selectedProposals) {
			return []
		}

		const p: ProposalType[] = []
		for(let i = 0; i < proposals.length; i++) {
			if(selectedProposals[i]) {
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
		async(message: EditorState, tags: number[]) => {
			if(
				!workspace?.id ||
        !selectedGrant?.id ||
        !selectedProposalsData.length || !webwallet
			) {
				return
			}

			const messageHash = (
				await uploadToIPFS(
					JSON.stringify(convertToRaw(message.getCurrentContent())),
				)
			).hash
			const json: PIIForCommentType = {
				sender: scwAddress,
				message: messageHash,
				timestamp: Math.floor(Date.now() / 1000),
				tags: quickReplies[role]
					?.filter((_, index) => tags.includes(index))
					.map((reply) => reply.id),
				role,
			}

			const commentHashes: string[] = []
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

			logger.info({ commentHashes }, 'Comment Hashes')

			const methodArgs = [
				workspace.id,
				selectedGrant.id,
				selectedProposalsData.map((proposal) => proposal.id),
				role !== 'community',
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
