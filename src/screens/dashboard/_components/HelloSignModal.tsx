import { useContext, useEffect, useMemo, useState } from 'react'
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
						HelloSign Modal
					</Text>

					<Text mt={1}>
						Verify and Send Document to the Builder
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
							Builder Email:
						</Text>

						<FlushedInput
							w='100%'
							flexProps={{ w: '100%' }}

							textAlign='left'
							placeholder='Enter Builder Email'
							value={email}
							onChange={
								(e) => {
									setEmail(e.target.value)
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
							Builder Name:
						</Text>

						<FlushedInput
							w='100%'
							flexProps={{ w: '100%' }}

							textAlign='left'
							placeholder='Enter Builder Name'
							value={name}
							onChange={
								(e) => {
									setName(e.target.value)
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
							Select Document:
						</Text>
						<Select
							placeholder='Select Document'
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

					{/*

					{
						!isAPIValid && apiKey.length > 0 && (
							<Text
								textAlign='center'
								mt={2}
								fontSize='14px'
								color='red.400'
							>
								Invalid API key
							</Text>
						)
					}


					<Text
						textAlign='center'
						mt={2}
						fontSize='14px'
						color='gray.400'
						cursor='pointer'
						onClick={() => window.open('https://app.hellosign.com/home/myAccount?current_tab=api', '_blank')}
					>
						Where do I find the API key?
					</Text> */}


					<Button
						w='70%'
						mt={8}
						variant='solid'
						isLoading={loader}
						isDisabled={loader}
						onClick={
							async() => {
								setLoader(true)
								const update = await executeMutation(sendDocuSign, {
									id: grant?.workspace?.id,
									proposalId: proposal?.id,
									name: name,
									email: email,
									templateId: selectedTemplated,
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
										`Successfully sent document to ${name} at ${email}`,
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
										title: `Successfully sent document to ${name} at ${email} with template ${selectedTemplated}`,
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
	const [selectedTemplated, setSelectedTemplate] = useState('')
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
		]).then(([decryptedProposal]) => {
			logger.info(
				{ decryptedProposal },
				'(Proposal) decrypted proposal',
			)
			setDecryptedProposal({ ...proposal, ...decryptedProposal })
			setEmail(getFieldString(decryptedProposal, 'applicantEmail') as string)
			setName(getFieldString(decryptedProposal, 'applicantName') as string)
		})
	}, [proposal, decrypt])

	useEffect(() => {
		if(proposal?.helloSignId === null && grant?.workspace?.docuSign && proposal?.synapsId !== null) {
			getHelloSignTemplates().then((data) => {
				setDocuSign(data)
			})
		}
	}, [proposal])


	// const customToast = useToast()


	return buildComponent()
}

export default HelloSignModal