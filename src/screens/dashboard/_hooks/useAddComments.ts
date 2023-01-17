import { useContext, useMemo } from 'react'
import { defaultChainId } from 'src/constants/chains'
import { useGetMemberPublicKeysQuery } from 'src/generated/graphql'
import { useMultiChainQuery } from 'src/hooks/useMultiChainQuery'
import useFunctionCall from 'src/libraries/hooks/useFunctionCall'
import logger from 'src/libraries/logger'
import { getKeyForApplication, getSecureChannelFromPublicKey } from 'src/libraries/utils/pii'
import { PIIForCommentType } from 'src/libraries/utils/types'
import { GrantsProgramContext, WebwalletContext } from 'src/pages/_app'
import { ProposalType } from 'src/screens/dashboard/_utils/types'
import { DashboardContext } from 'src/screens/dashboard/Context'
import { uploadToIPFS } from 'src/utils/ipfsUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

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
		async(message: string, isPrivate: boolean, tag?: string) => {
			if(!grant?.workspace?.id ||
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
				tag,
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

			if(tag === 'accept' || tag === 'reject' || tag === 'resubmit') {
				const toState = tag === 'accept' ? 2 : tag === 'reject' ? 3 : 1
				const applicationUpdateHash = (await uploadToIPFS(JSON.stringify({
					feedback: commentHashes[0]
				}))).hash

				const methodArgs = [
					selectedProposalsData.map((proposal) => proposal.id),
					selectedProposalsData.map(() => toState),
					grant.workspace.id,
					selectedProposalsData.map(() => applicationUpdateHash),
				]
				logger.info({ methodArgs }, 'Method Args (Comment)')

				return await updateCall({ method: 'batchUpdateApplicationState', args: methodArgs })
			} else {
				const methodArgs = [
					grant.workspace.id,
					grant.id,
					selectedProposalsData.map((proposal) => proposal.id),
					isPrivate,
					commentHashes,
				]
				logger.info({ methodArgs }, 'Method Args (Comment)')

				return await commentCall({ method: 'addComments', args: methodArgs })
			}
		}


	return {
		addComments,
		isBiconomyInitialised,
	}
}

export default useAddComments
