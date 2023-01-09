import { useCallback, useContext, useMemo } from 'react'
import { defaultChainId } from 'src/constants/chains'
import { useGetMemberPublicKeysQuery } from 'src/generated/graphql'
import useFunctionCall from 'src/libraries/hooks/useFunctionCall'
import { useMultiChainQuery } from 'src/libraries/hooks/useMultiChainQuery'
import logger from 'src/libraries/logger'
import {
	getKeyForApplication,
	getSecureChannelFromPublicKey,
} from 'src/libraries/utils/pii'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import useProposalTags from 'src/screens/dashboard/_hooks/useQuickReplies'
import { DashboardContext } from 'src/screens/dashboard/Context'
import { PIIForCommentType } from 'src/types'
import { uploadToIPFS } from 'src/utils/ipfsUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

interface Props {
  setStep: (step: number | undefined) => void
  setTransactionHash: (hash: string) => void
}

function useAddComment({ setStep, setTransactionHash }: Props) {
	const { role } = useContext(ApiClientsContext)!
	const { scwAddress, webwallet } = useContext(WebwalletContext)!
	const { proposals, selectedProposals } = useContext(DashboardContext)!

	const { proposalTags } = useProposalTags()

	const proposal = useMemo(() => {
		const index = selectedProposals.indexOf(true)

		if(index !== -1) {
			return proposals[index]
		}
	}, [proposals, selectedProposals])

	const chainId = useMemo(() => {
		return (
			getSupportedChainIdFromWorkspace(proposal?.grant?.workspace) ??
      defaultChainId
		)
	}, [proposal?.grant?.workspace])

	const { call, isBiconomyInitialised } = useFunctionCall({
		chainId,
		contractName: 'communication',
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

	const addComment = async(message: string, tags: number[]) => {
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
			tags: proposalTags
				?.filter((_, index) => tags.includes(index))
				.map((reply) => reply.id),
			role,
		}

		if(role !== 'community') {
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

		const methodArgs = [
			proposal.grant.workspace.id,
			proposal.grant.id,
			proposal.id,
			role !== 'community',
			commentHash,
		]
		logger.info({ methodArgs }, 'Method Args (Comment)')

		return await call({ method: 'addComment', args: methodArgs })
	}

	return {
		addComment,
		isBiconomyInitialised,
	}
}

export default useAddComment
