import { useCallback, useContext, useMemo } from 'react'
import { convertToRaw, EditorState } from 'draft-js'
import useFunctionCall from 'src/libraries/hooks/useFunctionCall'
import logger from 'src/libraries/logger'
import { usePiiForComment } from 'src/libraries/utils/pii'
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

	const { encrypt, decrypt } = usePiiForComment(
		workspace?.id,
		selectedProposalsData?.map((proposal) => proposal.id),
		webwallet?.publicKey,
		chainId,
	)

	const { call, isBiconomyInitialised } = useFunctionCall({
		chainId,
		contractName: 'communication',
		setTransactionHash,
		setTransactionStep: setStep,
	})

	const addComments = useCallback(
		async(message: EditorState, tags: number[]) => {
			if(
				!workspace?.id ||
        !selectedGrant?.id ||
        !selectedProposalsData.length
			) {
				return
			}

			const messageHash = (
				await uploadToIPFS(
					JSON.stringify(convertToRaw(message.getCurrentContent())),
				)
			).hash
			const json = {
				sender: scwAddress,
				message: messageHash,
				timestamp: Math.floor(Date.now() / 1000),
				tags: quickReplies[role]
					?.filter((_, index) => tags.includes(index))
					.map((reply) => reply.id),
				role,
			}

			const map: {[appId: string]: PIIForCommentType} = {}
			for(let i = 0; i < selectedProposalsData.length; i++) {
				map[selectedProposalsData[i].id] = json
			}

			logger.info({ map }, 'Map (Comment)')

			const encryptedData = role !== 'community' ? await encrypt(map) : map

			logger.info({ encryptedData }, 'Encrypted Data (Comment)')

			for(const proposal of selectedProposalsData) {
				const formatData = []
				for(const id in encryptedData[proposal.id]['pii']) {
					formatData.push({ id, data: encryptedData[proposal.id]['pii']![id] })
				}

				logger.info({ proposal: proposal.id }, 'Proposal (Comment)')
				logger.info({ formatData }, 'Format Data (Comment)')

				const decryptedData = await decrypt({ commentsEncryptedData: formatData }, proposal.id)
				logger.info({ decryptedData }, 'Decrypted Data (Comment)')
			}

			const commentHashes: string[] = []
			for(const proposal of selectedProposalsData) {
				const hash = (await uploadToIPFS(JSON.stringify(encryptedData[proposal.id]))).hash
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

			await call({ method: 'addComments', args: methodArgs })
		},
		[
			workspace,
			selectedGrant,
			selectedProposalsData,
			quickReplies,
			scwAddress,
			chainId,
			role,
		],
	)

	return {
		addComments: useMemo(
			() => addComments,
			[
				workspace,
				selectedGrant,
				selectedProposalsData,
				quickReplies,
				scwAddress,
				chainId,
				role,
			],
		),
		isBiconomyInitialised,
	}
}

export default useAddComments
