import { useContext, useMemo, useState } from 'react'
import { convertToRaw } from 'draft-js'
import { ethers } from 'ethers'
import { USD_ASSET } from 'src/constants/chains'
import ApplicationRegistryAbi from 'src/contracts/abi/ApplicationRegistryAbi.json'
import useCreateMapping from 'src/libraries/hooks/useCreateMapping'
import useFunctionCall from 'src/libraries/hooks/useFunctionCall'
import logger from 'src/libraries/logger'
import { parseAmount } from 'src/libraries/utils/formatting'
import { getEventData } from 'src/libraries/utils/gasless'
import { uploadToIPFS } from 'src/libraries/utils/ipfs'
import { useEncryptPiiForApplication } from 'src/libraries/utils/pii'
import { getChainInfo } from 'src/libraries/utils/token'
import { isValidEthereumAddress } from 'src/libraries/utils/validations'
import { WebwalletContext } from 'src/pages/_app'
import { findField } from 'src/screens/proposal_form/_utils'
import { Form } from 'src/screens/proposal_form/_utils/types'
import { ProposalFormContext } from 'src/screens/proposal_form/Context'
import { GrantApplicationRequest } from 'src/types/gen'


interface Props {
	setNetworkTransactionModalStep: (step: number | undefined) => void
	setTransactionHash: (hash: string) => void
}

function useSubmitProposal({ setNetworkTransactionModalStep, setTransactionHash }: Props) {
	const { webwallet, scwAddress } = useContext(WebwalletContext)!
	const { type, grant, proposal, chainId } = useContext(ProposalFormContext)!
	const { encrypt } = useEncryptPiiForApplication(grant?.id, webwallet?.publicKey, chainId)

	const chainInfo = useMemo(() => {
		if(!grant || !chainId) {
			return
		}

		return getChainInfo(grant, chainId)
	}, [grant, chainId])

	const { call, isBiconomyInitialised } = useFunctionCall({ chainId, contractName: 'applications', setTransactionStep: setNetworkTransactionModalStep, setTransactionHash })
	const createMapping = useCreateMapping({ chainId })

	const [proposalId, setProposalId] = useState<string>()

	const submitProposal = async(form: Form) => {
		try {
			if(!grant || !webwallet || !isBiconomyInitialised || !scwAddress) {
				return
			}

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

			let builderAddressInBytes: Uint8Array | string = new Uint8Array(32)
			if(isValidEthereumAddress(fields['applicantAddress'][0]?.value)) {
				builderAddressInBytes = ethers.utils.hexZeroPad(ethers.utils.hexlify(ethers.utils.getAddress(fields['applicantAddress'][0]?.value)), 32)
			}

			// Step - 6: Call the contract function to submit the proposal
			const methodArgs = type === 'submit' ?
				[grant.id, grant.workspace.id, proposalDataHash, data.milestones.length, builderAddressInBytes] :
				[proposal?.id, proposalDataHash, data.milestones.length, builderAddressInBytes]
			logger.info({ methodArgs }, 'useSubmitProposal: (Method args)')

			const receipt = await call({ method: type === 'submit' ? 'submitApplication' : 'updateApplicationMetadata', args: methodArgs })
			logger.info({ receipt }, 'useSubmitProposal: (Response)')

			// Step - 7: If the proposal is submitted successfully, then create the mapping between the email and the scwAddress
			if(receipt) {
				const eventData = await getEventData(receipt, type === 'submit' ? 'ApplicationSubmitted' : 'ApplicationUpdated', ApplicationRegistryAbi)
				logger.info({ eventData }, 'useSubmitProposal: (Event Data)')
				if(eventData) {
					const proposalId = Number(eventData.args[0].toBigInt())
					setProposalId(`0x${proposalId.toString(16)}`)

					await createMapping({ email: findField(form, 'applicantEmail').value })
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