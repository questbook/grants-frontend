import { useContext, useMemo, useState } from 'react'
import { convertToRaw } from 'draft-js'
import { ethers } from 'ethers'
import { USD_ASSET } from 'src/constants/chains'
import { reSubmitProposalMutation, submitProposalMutation } from 'src/generated/mutation'
import { executeMutation } from 'src/graphql/apollo'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
// import useCustomToast from 'src/libraries/hooks/useCustomToast'
import { useQuery } from 'src/libraries/hooks/useQuery'
import logger from 'src/libraries/logger'
import { parseAmount } from 'src/libraries/utils/formatting'
import { uploadToIPFS } from 'src/libraries/utils/ipfs'
import { useEncryptPiiForApplication } from 'src/libraries/utils/pii'
import { getChainInfo } from 'src/libraries/utils/token'
import { isValidEthereumAddress } from 'src/libraries/utils/validations'
import { WebwalletContext } from 'src/pages/_app'
import { walletAddressCheckerQuery } from 'src/screens/proposal_form/_data/walletAddressCheckerQuery'
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
	const [isExecuting, setIsExecuting] = useState(true)
	const customToast = useCustomToast()

	const chainInfo = useMemo(() => {
		if(!grant || !chainId) {
			return
		}

		return getChainInfo(grant, chainId)
	}, [grant, chainId])

	// const { isBiconomyInitialised, isExecuting } = useFunctionCall({ chainId, contractName: 'applications', setTransactionStep: setNetworkTransactionModalStep, setTransactionHash })


	const [proposalId, setProposalId] = useState<string>()
	logger.info({ type }, 'proposalId (Event Data)')
	logger.info({ proposal }, 'proposalId (Event Data)')
	const { fetchMore: fetchIsWalletAddressUsed } = useQuery({
		query: walletAddressCheckerQuery,
	})

	const submitProposal = async(form: Form) => {
		try {
			if(!grant || !webwallet || !scwAddress) {
				return
			}


			//Check if the wallet address is used before for this grant
			const walletAddress = findField(form, 'applicantAddress').value
			// console.log(walletAddress,'ooooooooo',grant.id)
			let builderAddressInBytes: Uint8Array | string = new Uint8Array(32)

			if(isValidEthereumAddress(walletAddress)) {
				builderAddressInBytes = ethers.utils.hexZeroPad(ethers.utils.hexlify(ethers.utils.getAddress(walletAddress)), 32)
			}

			logger.info({ builderAddressInBytes }, 'useSubmitProposal: (builderAddressInBytes)')
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const result: any = await fetchIsWalletAddressUsed({ grantId:grant.id, walletAddress: scwAddress as string }, true)
			// if(result?.grantApplications.length && result?.grantApplications[0].applicantId?.toLowerCase() !== scwAddress.toLowerCase()) {
			// 	logger.info({ result }, 'useSubmitProposal: (result)')
			// }
			logger.info(result?.grantApplications?.length, 'useSubmitProposal: (result)')
			if(result?.grantApplications?.length > 2) {
				logger.info({ result }, 'length')
				customToast({
					title: 'You have exceeded the maximum number of applications for this grant',
					status: 'error',
					description: 'This wallet address has already been used for this grant'
				})
				setNetworkTransactionModalStep(undefined)
				return
			}

			logger.info({ form }, 'useSubmitProposal: (form)')

			// Step - 1: Upload the project details data to ipfs
			const detailsHash = (JSON.stringify(
				convertToRaw(form.details.getCurrentContent()),
			))
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
			const variables = {
				grant: grant.id,
				workspaceId: grant.workspace.id,
				milestoneCount: data.milestones.length,
				milestones: data.milestones,
				applicantId: scwAddress,
				applicantPublicKey: data.applicantPublicKey,
				fields: data.fields,
				pii: data.pii,
				id: proposal?.id,
				state: 'submitted',
			}

			logger.info({ variables }, 'useSubmitProposal: (variables)')
			const receipt = type === 'submit' ? await executeMutation(submitProposalMutation, variables) : await executeMutation(reSubmitProposalMutation, variables)
			logger.info({ receipt }, 'useSubmitProposal: (Response)')
			// Step - 6: Call the contract function to submit the proposal
			// const methodArgs = type === 'submit' ?
			// 	[grant.id, grant.workspace.id, proposalDataHash, data.milestones.length, builderAddressInBytes] :
			// 	[proposal?.id, proposalDataHash, data.milestones.length, builderAddressInBytes]
			// logger.info({ methodArgs }, 'useSubmitProposal: (Method args)')

			// const receipt = await call({ method: type === 'submit' ? 'submitApplication' : 'updateApplicationMetadata', args: methodArgs })
			// logger.info({ receipt }, 'useSubmitProposal: (Response)')

			// Step - 7: If the proposal is submitted successfully, then create the mapping between the email and the scwAddress
			if(receipt) {
				// const eventData = await getEventData(receipt, type === 'submit' ? 'ApplicationSubmitted' : 'ApplicationUpdated', ApplicationRegistryAbi)
				// logger.info({ eventData }, 'useSubmitProposal: (Event Data)')
				// if(eventData) {
				// 	const proposalId = Number(eventData.args[0].toBigInt())
				// 	logger.info({ proposalId }, 'proposalId (Event Data)')
				// 	setProposalId(`0x${proposalId.toString(16)}`)

				// 	await createMapping({ email: findField(form, 'applicantEmail').value })
				const proposalId = receipt[type === 'submit' ? 'createNewGrantApplication' : 'updateGrantApplication'].record._id
				 logger.info({ proposalId }, 'proposalId (Event Data)')
				 setProposalId(proposalId)
				 setIsExecuting(false)
				 setTransactionHash(proposalId)
				 localStorage.removeItem(`form-${grant?.id}`)
			} else {
				customToast({
					title: 'Error submitting proposal',
					status: 'error',
					description: 'Error submitting proposal'
				})
				setNetworkTransactionModalStep(undefined)
			}
		} catch(e) {
			logger.error(e, 'useSubmitProposal: (Error)')
			setNetworkTransactionModalStep(undefined)
		}
	}

	return {
		submitProposal, proposalId, isExecuting
	}
}

export default useSubmitProposal