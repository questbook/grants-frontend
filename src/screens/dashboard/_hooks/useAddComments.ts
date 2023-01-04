import { useCallback, useContext, useMemo } from 'react'
import { convertToRaw, EditorState } from 'draft-js'
import useFunctionCall from 'src/libraries/hooks/useFunctionCall'
import logger from 'src/libraries/logger'
import { usePiiForComment } from 'src/libraries/utils/pii'
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

		return p
	}, [proposals, selectedProposals])

	const encrypt = useMemo(() => {
		const ret = []
		for(const proposalData of selectedProposalsData) {
			const { encrypt } = usePiiForComment(
				workspace?.id,
				proposalData.id,
				webwallet?.publicKey,
				chainId,
			)
			ret.push(encrypt)
		}

		return ret
	}, [selectedProposalsData])

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

			const commentHashes = []
			for(let i = 0; i < selectedProposalsData.length; i++) {
				const encryptedData = role !== 'community' ? encrypt[i](json) : json

				const commentHash = (await uploadToIPFS(JSON.stringify(encryptedData)))
					.hash
				commentHashes.push(commentHash)
				logger.info({ commentHash }, 'Comment Hash (Comment)')
			}

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
