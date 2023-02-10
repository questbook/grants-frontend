import { useContext, useMemo, useState } from 'react'
import { convertToRaw } from 'draft-js'
import { APPLICATION_REGISTRY_ADDRESS } from 'src/constants/addresses'
import { USD_ASSET } from 'src/constants/chains'
import ApplicationRegistryAbi from 'src/contracts/abi/ApplicationRegistryAbi.json'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useCreateMapping from 'src/libraries/hooks/useCreateMapping'
import logger from 'src/libraries/logger'
import { useEncryptPiiForApplication } from 'src/libraries/utils/pii'
import { getChainInfo } from 'src/libraries/utils/token'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import { findField } from 'src/screens/proposal_form/_utils'
import { Form } from 'src/screens/proposal_form/_utils/types'
import { ProposalFormContext } from 'src/screens/proposal_form/Context'
import { GrantApplicationRequest } from 'src/types/gen'
import { parseAmount } from 'src/utils/formattingUtils'
import { bicoDapps, getEventData, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import { uploadToIPFS } from 'src/utils/ipfsUtils'


interface Props {
	setNetworkTransactionModalStep: (step: number | undefined) => void
	setTransactionHash: (hash: string) => void
}

function useSubmitProposal({ setNetworkTransactionModalStep, setTransactionHash }: Props) {
	const { subgraphClients } = useContext(ApiClientsContext)!
	const { webwallet } = useContext(WebwalletContext)!
	const { type, grant, proposal, chainId } = useContext(ProposalFormContext)!
	const { encrypt } = useEncryptPiiForApplication(grant?.id, webwallet?.publicKey, chainId)
	const applicationRegistryContract = useQBContract('applications', chainId)
	const { nonce } = useQuestbookAccount()
	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress, loading: biconomyLoading } = useBiconomy({
		chainId: chainId?.toString(),
	})

	const isBiconomyInitialised = useMemo(() => {
		return biconomy && biconomyWalletClient && scwAddress && !biconomyLoading && chainId && biconomy.networkId && biconomy.networkId.toString() === chainId.toString()
	}, [biconomy, biconomyWalletClient, scwAddress, biconomyLoading, chainId])

	const chainInfo = useMemo(() => {
		if(!grant || !chainId) {
			return
		}

		return getChainInfo(grant, chainId)
	}, [grant, chainId])

	const createMapping = useCreateMapping({ chainId })

	const [proposalId, setProposalId] = useState<string>()

	const submitProposal = async(form: Form) => {
		try {
			if(!grant || !webwallet || !biconomyWalletClient || typeof biconomyWalletClient === 'string' || !scwAddress) {
				return
			}

			setNetworkTransactionModalStep(0)
			logger.info({ form }, 'useSubmitProposal: (form)')

			// Step - 1: Upload the project details data to ipfs
			const detailsHash = (
				await uploadToIPFS(JSON.stringify(
					convertToRaw(form.details.getCurrentContent()),
				))
			).hash
			logger.info({ detailsHash }, 'useSubmitProposal: (detailsHash)')

			// Step - 2: Format the data
			const fields: { [key: string]: [{ value: string }] } = {}
			for(const field of form.fields) {
				fields[field.id] = [{ value: findField(form, field.id).value }]
			}

			const data: GrantApplicationRequest = {
				grantId: grant.id,
				applicantId: await webwallet.getAddress(), // The value you set here does not matter
				applicantPublicKey: webwallet.publicKey,
				fields: {
					...fields,
					fundingAsk: [],
					projectDetails: [{ value: detailsHash }],
					teamMembers: [{ value: form.members.length.toString() }],
					memberDetails: form.members.map((value) => ({
						value,
					}))
				},
				milestones: form.milestones.map((milestone) => ({
					title: milestone.title,
					amount: chainInfo?.address === USD_ASSET ? milestone.amount.toString() : parseAmount(
						milestone.amount.toString(),
						chainInfo?.address,
						chainInfo?.decimals,
					),
				})),
			}

			// Step - 3: Encrypt the PII Enabled fields
			const piiFields = form?.fields?.filter((f) => f.isPii).map((f) => f.id)
			await encrypt(data, piiFields)
			logger.info({ data, piiFields }, 'useSubmitProposal: encryptedPii')

			// TODO: Step - 4: Validate the form data
			// const validate = await validateRequest('GrantApplicationUpdate', { ...data, grantId: undefined })
			// logger.info({ validate }, 'useSubmitProposal: (validate)')
			// return

			// Step - 5: Upload the application data to ipfs
			const proposalDataHash = (await uploadToIPFS(JSON.stringify(data))).hash
			logger.info({ proposalDataHash }, 'useSubmitProposal: (proposalDataHash)')

			// Step - 6: Call the contract function to submit the proposal
			const methodArgs = type === 'submit' ?
				[grant.id, grant.workspace.id, proposalDataHash, data.milestones.length] :
				[proposal?.id, proposalDataHash, data.milestones.length]
			logger.info({ methodArgs }, 'useSubmitProposal: (Method args)')

			const response = await sendGaslessTransaction(
				biconomy,
				applicationRegistryContract,
				type === 'submit' ? 'submitApplication' : 'updateApplicationMetadata',
				methodArgs,
				APPLICATION_REGISTRY_ADDRESS[chainId],
				biconomyWalletClient,
				scwAddress,
				webwallet,
				`${chainId}`,
				bicoDapps[chainId].webHookId,
				nonce
			)
			logger.info({ response }, 'useSubmitProposal: (Response)')

			// Step - 7: If the proposal is submitted successfully, then create the mapping between the email and the scwAddress
			if(response) {
				setNetworkTransactionModalStep(1)
				const { receipt, txFee } = await getTransactionDetails(response, chainId.toString())
				setTransactionHash(receipt?.transactionHash)

				const eventData = await getEventData(receipt, type === 'submit' ? 'ApplicationSubmitted' : 'ApplicationUpdated', ApplicationRegistryAbi)
				logger.info({ eventData }, 'useSubmitProposal: (Event Data)')
				if(eventData) {
					const proposalId = Number(eventData.args[0].toBigInt())
					setProposalId(`0x${proposalId.toString(16)}`)
					logger.info({ receipt, txFee }, 'useSubmitProposal: (Receipt)')
					await subgraphClients[chainId].waitForBlock(receipt?.blockNumber)

					setNetworkTransactionModalStep(2)
					await createMapping({ email: findField(form, 'applicantEmail').value })

					setNetworkTransactionModalStep(3)
				} else {
					throw new Error('Event data not found')
				}

			} else {
				setNetworkTransactionModalStep(undefined)
			}
		} catch(e) {
			logger.error(e, 'useSubmitProposal: (Error)')
			setNetworkTransactionModalStep(undefined)
		}
	}

	return {
		submitProposal, proposalId, isBiconomyInitialised
	}
}

export default useSubmitProposal