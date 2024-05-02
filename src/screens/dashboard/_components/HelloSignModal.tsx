import { useContext, useEffect, useMemo, useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import {
	Button,
	Flex,
	Modal,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
	Select,
	Text,
	useToast,
} from '@chakra-ui/react'
import { logger } from 'ethers'
import { defaultChainId } from 'src/constants/chains'
import { sendDocuSign } from 'src/generated/mutation/sendDocuSign'
import { executeMutation } from 'src/graphql/apollo'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import {
	getFieldString,
} from 'src/libraries/utils/formatting'
import { useEncryptPiiForApplication } from 'src/libraries/utils/pii'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { GrantsProgramContext } from 'src/pages/_app'
import useAddComment from 'src/screens/dashboard/_hooks/useAddComment'
import GetDocuSignTemplates from 'src/screens/dashboard/_hooks/useDocuSign'
import { ProposalType } from 'src/screens/dashboard/_utils/types'
import { DashboardContext } from 'src/screens/dashboard/Context'

interface Props {
	isOpen: boolean
	onClose: () => void
}

function HelloSignModal({
	isOpen,
	onClose,
}: Props) {
	const buildComponent = () => {
		return (
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size='xl'
				isCentered>
				<ModalOverlay />
				<ModalContent
					flexDirection='column'
					w='100%'
					gap={1}
					alignItems='center'
					p={8}
				>
					<ModalCloseButton />

					<Text fontWeight='500'>
						Send Agreement to Builder
					</Text>

					<Text mt={1}>
						Verify and Send Agreement to the Builder
					</Text>

					<Flex
						w='100%'
						direction='column'
						justifyContent='space-between'
						mt={8}
					>
						<Text

							textAlign='left'
							fontWeight='500'
						>
							Enter Agreement Title:
						</Text>

						<FlushedInput
							w='100%'
							flexProps={{ w: '100%' }}

							textAlign='left'
							placeholder='Enter Agreement Title'
							value={agreementTitle}
							onChange={
								(e) => {
									setAgreementTitle(e.target.value)
								}
							}
						/>
					</Flex>

					<Flex
						w='100%'
						direction='column'
						justifyContent='space-between'
						mt={8}
					>
						<Text

							textAlign='left'
							fontWeight='500'
						>
							Select Agreement Template:
						</Text>
						<Select
							placeholder='Select Agreement Template'
							mt={2}
							w='100%'
							value={selectedTemplated}
							onChange={
								(e) => {
									setSelectedTemplate(e.target.value)
								}
							}
						>
							{
								docuSign?.length > 0 && docuSign?.map((doc: {
									template_id: string
									title: string
								}, index) => (
									<option
										key={index}
										value={doc.template_id}>
										{doc.title}
									</option>
								))
							}
						</Select>
					</Flex>


					<Text
						textAlign='center'
						mt={2}
						fontSize='14px'
						color='gray.400'
						cursor='pointer'
						onClick={() => window.open('https://app.hellosign.com/home/createReusableDocs', '_blank')}
					>
						Where can I create/edit a template?
					</Text>

					{
						signers?.map((signer, index) => (
							<>
								<Button
									fontWeight='500'
									mt={8}
									p={2}
									bg={signer.isHidden ? '' : 'gray.200'}
									justifyContent='space-between'
									w='100%'
									rightIcon={signer.isHidden ? <ChevronDownIcon /> : <ChevronUpIcon />}
									onClick={
										() => {
											const newSigners = [...signers]
											newSigners[index].isHidden = !newSigners[index].isHidden
											setSigners(newSigners)
										}
									}
								>
									{' '}
									{signer.role}
									{' '}
									Details
								</Button>
								{
									signer?.isHidden ? <></> : (
										<>
											<Flex
												w='100%'
												direction='column'
												justifyContent='space-between'
												mt={8}
											>
												<Text

													textAlign='left'
													fontWeight='500'
												>
													{signer.role}
													{' '}
													Email:
												</Text>

												<FlushedInput
													w='100%'
													flexProps={{ w: '100%' }}

													textAlign='left'
													placeholder={`Enter ${signer.role} Email`}
													value={signer?.email}
													onChange={
														(e) => {
															const newSigners = [...signers]
															newSigners[index].email = e.target.value
															setSigners(newSigners)
														}
													}
												/>
											</Flex>
											<Flex
												w='100%'
												direction='column'
												justifyContent='space-between'
												mt={8}
											>
												<Text

													textAlign='left'
													fontWeight='500'
												>
													{signer.role}
													{' '}
													Name:
												</Text>

												<FlushedInput
													w='100%'
													flexProps={{ w: '100%' }}

													textAlign='left'
													placeholder={`Enter ${signer.role} Name`}
													value={signer?.name}
													onChange={
														(e) => {
															const newSigners = [...signers]
															newSigners[index].name = e.target.value
															setSigners(newSigners)
														}
													}
												/>
											</Flex>
										</>
									)
								}
							</>
						))
					}


					<Button
						w='70%'
						mt={8}
						variant='solid'
						isLoading={loader}
						isDisabled={loader || !email || !name || !selectedTemplated || !agreementTitle || isDisabled}
						onClick={
							async() => {
								setLoader(true)
								const update = await executeMutation(sendDocuSign, {
									id: grant?.workspace?.id,
									proposalId: proposal?.id,
									email: signers,
									templateId: selectedTemplated,
									templateName: agreementTitle,
								})
								if(!update?.sendDocuSign.recordId) {
									await toast({
										title: 'Error sending document to builder',
										status: 'error',
										duration: 5000,
									})
									return
								} else {
									const ret = await addComment(
										'Successfully sent document to the contract administrator. Please expect to receive the grant for signing within five business days.',
										true,
										'helloSign',
									)
									if(ret) {
										await refreshComments(true)
										await refreshProposals(true)
										setLoader(false)
										onClose()
									}

									await toast({
										title: 'Successfully sent document to the contract administrator.',
										status: 'success',
										duration: 5000,
									})
								}

							}
						}
					>
						Send Document to Builder
					</Button>


				</ModalContent>

			</Modal>
		)
	}


	const {
		proposals,
		selectedProposals,
		refreshComments,
		refreshProposals,
	} = useContext(DashboardContext)!

	const toast = useToast()
	const { getHelloSignTemplates } = GetDocuSignTemplates()
	const {
		grant
	} = useContext(GrantsProgramContext)!

	const [email, setEmail] = useState('')
	const [name, setName] = useState('')
	const [docuSign, setDocuSign] = useState([])
	const [agreementTitle, setAgreementTitle] = useState('')
	const [selectedTemplated, setSelectedTemplate] = useState('')
	const [signers, setSigners] = useState<{
		name: string
		email: string
		role: string
		isHidden?: boolean
	}[]>([])
	const [, setStep] = useState<number>()
	const [, setTransactionHash] = useState('')
	const [loader, setLoader] = useState(false)
	const { addComment } = useAddComment({
		setStep,
		setTransactionHash,
	})

	const proposal = useMemo(() => {
		return proposals.find((p) => selectedProposals.has(p.id))
	}, [proposals, selectedProposals])

	const [, setDecryptedProposal] = useState<
		ProposalType | undefined
	>(proposal)
	const chainId = useMemo(() => {
		return getSupportedChainIdFromWorkspace(grant?.workspace) ?? defaultChainId
	}, [grant])

	const { decrypt } = useEncryptPiiForApplication(
		proposal?.grant?.id,
		proposal?.applicantPublicKey,
		chainId,
	)

	logger.info({ docuSign }, 'HelloSign Modal')

	useEffect(() => {
		if(!proposal) {
			return
		}

		Promise.all([
			decrypt(proposal),
		]).then(async([decryptedProposal]) => {
			logger.info(
				{ decryptedProposal },
				'(Proposal) decrypted proposal',
			)
			setDecryptedProposal({ ...proposal, ...decryptedProposal })
			setEmail(getFieldString(decryptedProposal, 'applicantEmail') as string)
			setName(getFieldString(decryptedProposal, 'applicantName') as string)
			setAgreementTitle(getFieldString(decryptedProposal, 'projectName') as string + '-' + grant?.title as string + ' Grant Agreement')
			if(selectedTemplated !== '' && selectedTemplated !== null && docuSign.length > 0) {
				await docuSign?.filter((doc: {
					template_id: string
					signer_roles: [
						{
							name: string
						},
					]
				}) => doc.template_id === selectedTemplated).map((doc: {
					template_id: string
					signer_roles: [
						{
							name: string
						},
					]
				}) => {
					setSigners(doc.signer_roles?.map((signer: {
						name: string
						}) => ({
						role: signer.name,
						name: signer?.name === 'Grant recipient' ? getFieldString(decryptedProposal, 'applicantName') as string : '',
						email: signer?.name === 'Grant recipient' ? getFieldString(decryptedProposal, 'applicantEmail') as string : '',
						isHidden: false,
					})))


				})
			}
		})
	}, [proposal, decrypt, selectedTemplated, docuSign])

	logger.info({ signers }, 'HelloSign Modal')

	useEffect(() => {
		if(proposal?.helloSignId === null && grant?.workspace?.docuSign && proposal?.synapsId !== null) {
			getHelloSignTemplates().then((data) => {
				setDocuSign(data)
			})
		}
	}, [proposal])

	const isDisabled = useMemo(() => {
		logger.info({ signers }, 'HelloSign Modal')
		for(const signer of signers) {
			if(signer.email.length === 0 || signer.name.length === 0) {
				return true
			}
		}
	}, [signers, selectedTemplated])


	// const customToast = useToast()


	return buildComponent()
}

export default HelloSignModal