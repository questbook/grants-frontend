import { ChangeEvent, ReactElement, useContext, useEffect, useMemo, useState } from 'react'
import QRCode from 'react-qr-code'
import { Button, Container, Flex, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import { convertToRaw } from 'draft-js'
import { useRouter } from 'next/router'
import config from 'src/constants/config.json'
import countries from 'src/constants/countries.json'
import { useSafeContext } from 'src/contexts/safeContext'
import { Doc } from 'src/generated/icons'
import logger from 'src/libraries/logger'
import BackButton from 'src/libraries/ui/BackButton'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import NetworkTransactionFlowStepperModal from 'src/libraries/ui/NetworkTransactionFlowStepperModal'
import { getAvatar } from 'src/libraries/utils'
import { chainNames } from 'src/libraries/utils/constants'
import { getExplorerUrlForTxHash, getRewardAmountMilestones } from 'src/libraries/utils/formatting'
import { getUrlForIPFSHash } from 'src/libraries/utils/ipfs'
import { getChainInfo } from 'src/libraries/utils/token'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { GrantsProgramContext, SignInContext, SignInTitleContext, WebwalletContext } from 'src/pages/_app'
import SectionDropDown from 'src/screens/proposal_form/_components/SectionDropDown'
import SectionHeader from 'src/screens/proposal_form/_components/SectionHeader'
import SectionInput from 'src/screens/proposal_form/_components/SectionInput'
import SectionRichTextEditor from 'src/screens/proposal_form/_components/SectionRichTextEditor'
import SectionSelect from 'src/screens/proposal_form/_components/SectionSelect'
import SectionSelection from 'src/screens/proposal_form/_components/SectionSelection'
import useSubmitProposal from 'src/screens/proposal_form/_hooks/useSubmitProposal'
import { containsCustomField, containsField, findCustomField, findField, validateEmail, validateWalletAddress } from 'src/screens/proposal_form/_utils'
import { customSteps, customStepsHeader, disabledGrants } from 'src/screens/proposal_form/_utils/constants'
import { ProposalFormContext, ProposalFormProvider } from 'src/screens/proposal_form/Context'


function ProposalForm() {
	const buildComponent = () => {
		return isExecuting !== undefined && !isExecuting && networkTransactionModalStep === undefined ? successComponent() : (error ? errorComponent() : formComponent())
	}


	const successComponent = () => {
		const getPayload = (props: {
			type: 'grant' | 'proposal'
			proposalId: string
			grantId: string
		}) => {
			if(grant?.workspace) {
				const key = `${props.type === 'grant' ? 'gp' : 'app'}-${props.type === 'grant' ? props.grantId : props.proposalId}-${getSupportedChainIdFromWorkspace(grant.workspace)}`
				const payload = (Buffer.from(key).toString('base64')).replaceAll('=', '')
				return payload
			 } else if(typeof window !== 'undefined' && !grant) {
				const params = new URLSearchParams(window.location.search)
				const chainId = params.get('chainId')
				const key = `${props.type === 'grant' ? 'gp' : 'app'}-${props.type === 'grant' ? props.grantId : props.proposalId}-${chainId}`
				const payload = (Buffer.from(key).toString('base64')).replaceAll('=', '')
				logger.info({ payload }, 'Telegram payload')
				return payload
			}

			return undefined
		}

		return (
			<Flex
				w='100%'
				h='calc(100vh - 64px)'
				align='start'
				justify='center'>
				{formComponent()}
				<Modal
					isOpen={true}
					size='xl'
					onClose={
						async() => {
							if(isSetupNotificationModalOpen) {
								setIsSetupNotificationModalOpen(false)
							} else {
								setRole('builder')
								const ret = await router.push({
									pathname: '/dashboard',
									query: {
										grantId: grant?.id,
										chainId: chainId,
										role: 'builder',
										proposalId,
									}
								})
								if(ret) {
									router.reload()
								}
							}

						}
					}
					closeOnEsc
					isCentered
					scrollBehavior='outside'>
					<ModalOverlay />
					<ModalContent
						borderRadius='8px'
					>
						<ModalHeader
							fontSize='24px'
							fontWeight='700'
							lineHeight='32.4px'
							color='#07070C'
							alignItems='center'
						>
							{isSetupNotificationModalOpen ? 'Subscribe to notifications' : 'Proposal Confirmation'}
							<ModalCloseButton
								mt={1}
							/>
						</ModalHeader>
						<ModalBody>
							{
								isSetupNotificationModalOpen ?
									(
										<>
											<Flex
												direction='column'
												alignContent='center'
												alignItems='center'
												w='100%'
												gap='24px'
												padding='60px 10px'
												justifyContent='center'
												mx='auto'
												h='100%'>
												<QRCode
													fgColor='#4D9CD4'
													style={{ height: '320px', maxWidth: '100%', width: '320px' }}
													value={qrCodeText ?? ''} />
												<Text

													color='#699804'
													textAlign='center'
													fontSize='18px'
													fontStyle='normal'
													fontWeight='700'
													lineHeight='135%'
												>
													Scan QR code with your phone camera
												</Text>

											</Flex>
											<Button
												w='100%'
												bg='transparent'
												border='1px solid #E1DED9'
												mb={6}
												variant='primaryLarge'
												onClick={() => window.open(qrCodeText, '_blank')}
											>
												<Text
													fontWeight='500'>
													Open my desktop app
												</Text>
											</Button>
										</>
									) : (
										<>
											<Flex
												direction='column'
												alignContent='center'
												alignItems='center'
												w='100%'
												gap='24px'
												padding='60px 10px'
												justifyContent='center'
												mx='auto'
												h='100%'>

												<Image
													src={grant?.workspace?.logoIpfsHash === config.defaultDAOImageHash ? getAvatar(true, grant?.workspace?.title) : getUrlForIPFSHash(grant?.workspace?.logoIpfsHash!)}
													boxSize='80px'
												/>
												<Text

													color='#699804'
													textAlign='center'
													fontSize='18px'
													fontStyle='normal'
													fontWeight='700'
													lineHeight='135%'
												>
													Fantastic — we have received your proposal.
												</Text>
												<Text
													color='#7E7E8F'
													textAlign='center'
													fontSize='16px'
													fontStyle='normal'
													fontWeight='400'
													lineHeight='150%'
												>
													Let the world know about this by sharing through your twitter and also subscribe to the notifications to get updates regarding your proposal.
												</Text>

											</Flex>
											<Flex
												mb={6}
												gap={6}
												flexDirection='column'
											>
												{/* <Button
													w='100%'
													bg='#77AC06'
													border='1px solid #E1DED9'
													variant='primaryLarge'
													onClick={() => window.open(`https://twitter.com/intent/tweet?text=${SocialIntent[Math.floor(Math.random() * SocialIntent.length)]}&url=${window.location.origin}/dashboard/?grantId=${grant?.id}%26chainId=${chainId}%26proposalId=${proposalId}`, '_blank')}
													leftIcon={<Twitter />}
												>
													<Text
														color='white'
														fontWeight='500'>
														Share on Twitter
													</Text>
												</Button> */}
												<Button
													w='100%'
													bg='#77AC06'
													border='1px solid #E1DED9'
													variant='primaryLarge'
													onClick={
														() => {
															const payload = getPayload({ type: 'proposal', proposalId: proposalId!, grantId: grant?.id! })
															if(payload) {
																setQrCodeText(`https://t.me/${process.env.NOTIF_BOT_USERNAME}?start=${payload}`)
																setIsSetupNotificationModalOpen(true)
															}
														}
													}

												>
													<Text
														color='white'
														fontWeight='500'>
														Subscribe to notifications
													</Text>
												</Button>
												<Button
													w='100%'
													bg='transparent'
													border='1px solid #E1DED9'
													variant='primaryLarge'
													onClick={
														async() => {
															setRole('builder')
															const ret = await router.push({
																pathname: '/dashboard',
																query: {
																	grantId: grant?.id,
																	chainId: chainId,
																	role: 'builder',
																	proposalId,
																}
															}, undefined, { shallow: true })
															if(ret) {
																router.reload()
															}
														}
													}

												>
													<Text
														fontWeight='500'>
														I&apos;ll do it later
													</Text>
												</Button>


											</Flex>
										</>
									)
							}
						</ModalBody>
					</ModalContent>
				</Modal>
			</Flex>
		)
	}

	const errorComponent = () => {
		return (
			<Flex
				w='100%'
				h='calc(100vh - 64px)'
				align='start'
				justify='center'>
				<Flex
					w='90%'
					h='calc(100vh - 100px)'
					bg='white'
					boxShadow='0px 2px 4px rgba(29, 25, 25, 0.1)'
					overflowY='auto'
					my={5}>
					<Text
						fontWeight='500'
						variant='subheading'>
						{error}
					</Text>
				</Flex>
			</Flex>
		)
	}

	const formComponent = () => {
		return (
			<Flex
				w='100%'
				h='calc(100vh - 64px)'
				align='start'
				justify='center'>
				<Flex
					direction='column'
					w='90%'
					bg='white'
					boxShadow='0px 2px 4px rgba(29, 25, 25, 0.1)'
					overflowY='auto'
					my={5}
					px={6}
					py={10}>
					{
						newTab !== 'true' && (
							<Flex justify='start'>
								<BackButton />
							</Flex>
						)
					}
					<Flex
						mx='auto'
						direction='column'
						w='84%'
						h='100%'
						align='center'
					>
						<Text
							w='100%'
							textAlign='center'
							variant='heading3'
							fontWeight='500'
							borderBottom='1px solid #E7E4DD'
							pb={4}>
							Submit Proposal
						</Text>
						{/* Grant Name */}
						<Flex
							gap={2}
							alignItems='center'
							direction={['column', 'row']}
							pt={4}
						>
							<Text
								variant='heading3'
								fontWeight='500'
							>
								{grant?.title}
							</Text>
							{/* <Text
								variant={isOpen ? 'openTag' : 'closedTag'}
							>
								{isOpen}
							</Text> */}
						</Flex>

						{/* Grant Info */}
						<Container
							mt={4}
							p={4}
							// border='1px solid #E7E4DD'
							className='container'
							width='max-content'
						>
							<Flex
								direction={['column', 'row']}
								justifyContent='space-between'
								width='max-content'
								gap={2}
							>
								<Flex
									alignItems='center'
								>
									{/* <Flex gap={4}>
										<CalendarIcon />
										<Flex direction='column'>
											<Text
												variant='title'
												fontWeight='400'
												color='black.100'
											>
												Accepting proposals until
												{' '}
											</Text>
											<Text
												variant='title'
												fontWeight='500'
												color='black.100'
											>
												{extractDateFromDateTime(grant?.deadline!)}
											</Text>
										</Flex>
									</Flex> */}
								</Flex>
								{/* <Divider
									orientation='vertical'
									h='100%' /> */}
								{
									grant?.link && (
										<Flex alignItems='center'>
											<Flex gap={4}>
												<Doc />
												<Flex direction='column'>
													<Text
														variant='title'
														fontWeight='400'
													>
														Grant program details
														{' '}
													</Text>
													<Text
														variant='title'
														fontWeight='500'
														color='black.100'
														cursor='pointer'
														onClick={() => window.open(grant?.link!, '_blank')}
													>
														Read here
													</Text>
												</Flex>
											</Flex>
										</Flex>
									)
								}

							</Flex>
						</Container>

						{/* Builder Details */}
						<SectionHeader mt={8}>
							Applicant information
						</SectionHeader>
						{
							containsField(grant, 'applicantName') && (
								<SectionInput
									label='First Name'
									placeholder='Ryan'
									value={findField(form, 'applicantName').value}
									onChange={
										(e) => {
											onChange(e, 'applicantName')
										}
									} />
							)
						}
						{
							containsCustomField(grant, 'Last Name') && (
								<SectionInput
									label='Last Name'
									placeholder='Adams'
									value={findCustomField(form, 'Last Name').value}
									onChange={
										(e) => {
											onChange(e, findCustomField(form, 'Last Name').id)
										}
									} />
							)
						}
						{
							containsField(grant, 'applicantEmail') && (
								<SectionInput
									label='Email'
									placeholder='name@sample.com'
									value={findField(form, 'applicantEmail').value}
									onChange={
										(e) => {
											onChange(e, 'applicantEmail')
											validateEmail(e.target.value, (isValid) => {
												setEmailError(!isValid)
											})
										}
									}
									isInvalid={emailError}
									errorText='Invalid email address' />
							)
						}
						{
							containsCustomField(grant, 'Telegram') && (
								<SectionInput
									label='Telegram'
									placeholder='@telegram'
									value={findCustomField(form, 'Telegram').value}
									onChange={
										(e) => {
											onChange(e, findCustomField(form, 'Telegram').id)
										}
									} />
							)
						}
						{
							containsCustomField(grant, 'Discord') && (
								<SectionInput
									label='Discord ID'
									placeholder='@discord'
									value={findCustomField(form, 'Discord').value}
									onChange={
										(e) => {
											onChange(e, findCustomField(form, 'Discord').id)
										}
									} />
							)
						}
						{
							containsCustomField(grant, 'Github Username') && (
								<SectionInput
									label='Github'
									placeholder='@github'
									value={findCustomField(form, 'Github Username').value}
									onChange={
										(e) => {
											onChange(e, findCustomField(form, 'Github Username').id)
										}
									} />
							)
						}
						{
							containsCustomField(grant, 'Are you applying as an individual or on behalf of a team?') && (
								<SectionSelection
									label='Are you applying as an individual or on behalf of a team?'
									placeholder='Individual / Team'
									value={findCustomField(form, 'Are you applying as an individual or on behalf of a team?').value}
									options={['Individual', 'Team']}
									onChange={
										(e) => {
											onChange(e, findCustomField(form, 'Are you applying as an individual or on behalf of a team?').id)
										}
									} />
							)
						}
						{
							containsCustomField(grant, 'Introduce yourself, your background, and motivation') && (
								<SectionInput
									label='Introduce yourself, your background, and motivation'
									placeholder='Ryan Adams, 5 years of experience in blockchain development, passionate about DeFi and NFTs.'
									value={findCustomField(form, 'Introduce yourself, your background, and motivation').value}
									onChange={
										(e) => {
											onChange(e, findCustomField(form, 'Introduce yourself, your background, and motivation').id)
										}
									} />
							)
						}
						{
							containsCustomField(grant, 'City') && (
								<SectionInput
									label='City'
									placeholder='New York'
									value={findCustomField(form, 'City').value}
									onChange={
										(e) => {
											onChange(e, findCustomField(form, 'City').id)
										}
									} />
							)
						}
						{
							containsCustomField(grant, 'Country') && (
								<SectionDropDown
									label='Country'
									width='-moz-fit-content'
									options={countries?.map((c) => c.name)}
									placeholder='Select a Country'
									value={findCustomField(form, 'Country').value}
									onChange={
										(e) => {
											onChange(e as unknown as ChangeEvent<HTMLInputElement>, findCustomField(form, 'Country').id)
										}
									} />
							)
						}

						{
							containsField(grant, 'applicantAddress') && (
								<SectionInput
									label='Wallet Address'
									placeholder='Wallet to receive funds on Starknet'
									value={findField(form, 'applicantAddress').value}
									onChange={
										async(e) => {
											onChange(e, 'applicantAddress')
											await validateWalletAddress(e.target.value, (isValid) => {
												setWalletAddressError(!isValid)
											})
										}
									}
									isInvalid={walletAddressError}
									errorText={`Invalid address on ${chainNames?.get(safeObj?.chainId?.toString() ?? '') !== undefined ? chainNames.get(safeObj?.chainId?.toString() ?? '')?.toString() : 'EVM / Solana / TON based chain'}`} />
							)
						}

						{
							containsField(grant, 'teamMembers') && (
								<SectionSelect
									label='Team Members'
									defaultValue={1}
									min={1}
									max={10}
									value={form?.members?.length}
									onChange={
										(e) => {
											const copy = { ...form }
											const newLength = parseInt(e)
											if(newLength > copy.members.length) {
												copy.members = copy.members.concat(Array(newLength - copy.members.length).fill(''))
											} else if(newLength < copy.members.length) {
												copy.members = copy.members.slice(0, newLength)
											}

											findField(copy, 'teamMembers').value = newLength.toString()
											setForm(copy)
										}
									} />
							)
						}

						{
							containsField(grant, 'teamMembers') && form.members?.map((member, index) => {
								return (
									<SectionInput
										key={index}
										label={`Member ${index + 1}`}
										placeholder={`Bio about member ${index + 1}`}
										maxLength={300}
										value={member}
										onChange={
											(e) => {
												const copy = { ...form }
												copy.members[index] = e.target.value
												setForm(copy)
											}
										} />
								)
							})
						}

						{/* Project information */}
						<SectionHeader mt={8}>
							Project information
						</SectionHeader>
						{
							containsCustomField(grant, 'Project category') && (
								<SectionDropDown
									label='Project category'
									width='-moz-fit-content'
									options={['Defi', 'Gaming', 'Social', 'NFT', 'Other dApp', 'Tooling/ Infra']}
									placeholder='Select a category'
									value={findCustomField(form, 'Project category').value}
									onChange={
										(e) => {
											onChange(e as unknown as ChangeEvent<HTMLInputElement>, findCustomField(form, 'Project category').id)
										}
									} />
							)
						}
						{
							containsField(grant, 'projectName') && (
								<SectionInput
									label='Project Name'
									placeholder='Name of your project'
									value={findField(form, 'projectName').value}
									onChange={
										(e) => {
											onChange(e, 'projectName')
										}
									} />
							)
						}
						{
							containsCustomField(grant, 'Website') && (
								<SectionInput
									label='Website'
									placeholder='Link to your project website'
									value={findCustomField(form, 'Website').value}
									onChange={
										(e) => {
											onChange(e, findCustomField(form, 'Website').id)
										}
									} />
							)
						}
						{
							containsCustomField(grant, 'Twitter') && (
								<SectionInput
									label='Twitter'
									placeholder='@twitter'
									value={findCustomField(form, 'Twitter').value}
									onChange={
										(e) => {
											onChange(e, findCustomField(form, 'Twitter').id)
										}
									} />
							)
						}
						{
							containsCustomField(grant, 'Project repo') && (
								<SectionInput
									label='Project repo'
									placeholder='Link to your project repository'
									value={findCustomField(form, 'Project repo').value}
									onChange={
										(e) => {
											onChange(e, findCustomField(form, 'Project repo').id)
										}
									} />
							)
						}
						{
							containsCustomField(grant, 'Github of each team member') && (
								<SectionInput
									label='Github of each team member'
									placeholder='Link to Github profile of each team member'
									value={findCustomField(form, 'Github of each team member').value}
									onChange={
										(e) => {
											onChange(e, findCustomField(form, 'Github of each team member').id)
										}
									} />
							)
						}
						{
							containsCustomField(grant, 'Previous work Describe any relevant prior work your team has undertaken?') && (
								<SectionInput
									label='Previous work Describe any relevant prior work your team has undertaken?'
									placeholder='Previous work Describe any relevant prior work your team has undertaken?'
									type='textarea'
									maxLength={100}
									value={findCustomField(form, 'Previous work Describe any relevant prior work your team has undertaken?').value}
									onChange={
										(e) => {
											onChange(e, findCustomField(form, 'Previous work Describe any relevant prior work your team has undertaken?').id)
										}
									} />
							)
						}

						{/* Project details */}
						<SectionHeader mt={8}>
							Project details
						</SectionHeader>

						{
							containsField(grant, 'tldr') && (
								<SectionInput
									label='tl;dr'
									placeholder='Explain your proposal in one sentence'
									maxLength={120}
									value={findField(form, 'tldr').value}
									onChange={
										(e) => {
											onChange(e, 'tldr')
										}
									} />
							)
						}

						{
							containsField(grant, 'projectDetails') && (
								<SectionRichTextEditor
									label='Project Details'
									flexProps={{ align: 'start' }}
									editorState={form.details}
									setEditorState={
										(e) => {
											const copy = { ...form }
											copy.details = e
											setForm(copy)
										}
									} />
							)
						}

						{
							containsCustomField(grant, 'Proposed tasks and roadmap Outline how you plan to use the grant funds') && (
								<SectionInput
									label='Proposed tasks and roadmap Outline how you plan to use the grant funds'
									placeholder='Outline how you plan to use the grant funds'
									type='textarea'
									value={findCustomField(form, 'Proposed tasks and roadmap Outline how you plan to use the grant funds').value}
									maxLength={300}
									onChange={
										(e) => {
											onChange(e, findCustomField(form, 'Proposed tasks and roadmap Outline how you plan to use the grant funds').id)
										}
									} />
							)
						}
						{
							containsCustomField(grant, 'Describe what your project would look like three months after being awarded this grant') && (
								<SectionInput
									label='Describe what your project would look like three months after being awarded this grant'
									placeholder='Describe what your project would look like three months after being awarded this grant'
									type='textarea'
									maxLength={150}
									value={findCustomField(form, 'Describe what your project would look like three months after being awarded this grant').value}
									onChange={
										(e) => {
											onChange(e, findCustomField(form, 'Describe what your project would look like three months after being awarded this grant').id)
										}
									} />
							)
						}
						{
							containsCustomField(grant, 'What are your plans after the grant is completed? What kind of resources would you potentially need after this grant?') && (
								<SectionInput
									label='What are your plans after the grant is completed? What kind of resources would you potentially need after this grant?'
									placeholder='What are your plans after the grant is completed? What kind of resources would you potentially need after this grant'
									type='textarea'
									maxLength={150}
									value={findCustomField(form, 'What are your plans after the grant is completed? What kind of resources would you potentially need after this grant?').value}
									onChange={
										(e) => {
											onChange(e, findCustomField(form, 'What are your plans after the grant is completed? What kind of resources would you potentially need after this grant?').id)
										}
									} />
							)
						}

						{/* <SelectArray
							label='Milestones'
							allowMultiple={grant?.payoutType === 'milestones' || (containsField(grant, 'isMultipleMilestones') ?? false)}
							config={
								form?.milestones?.map((milestone, index) => {
									return [
										{
											...MILESTONE_INPUT_STYLE[0],
											value: milestone?.title,
											// isDisabled: index < (grant?.milestones?.length || 0),
											onChange: (e) => {
												const copy = { ...form }
												copy.milestones[index] = { ...copy.milestones[index], title: e.target.value }
												setForm(copy)
											}
										},
										{
											...MILESTONE_INPUT_STYLE[1],
											value: milestone?.amount > 0 ? milestone?.amount : '',
											onChange: (e) => {
												if(e.target.value?.includes('.')) {
													return
												} else {
													try {
														const copy = { ...form }
														copy.milestones[index] = { ...copy.milestones[index], amount: parseInt(e.target.value) }
														setForm(copy)
													} catch(e) {
														logger.error(e)
													}
												}
											}
										},
									]
								})
							}
							onAdd={
								() => {
									const copy = { ...form }
									copy.milestones.push(DEFAULT_MILESTONE)
									setForm(copy)
								}
							}
							onRemove={
								(index) => {
									const copy = { ...form }
									logger.info({ index, copy }, 'Splicing')
									copy.milestones.splice(index, 1)
									setForm(copy)
								}
							} /> */}

						{/* <SectionInput
							label='Funding Asked'
							isDisabled
							placeholder='12000 USD'
							value={`${fundingAsk} ${chainInfo?.label}`}
						/> */}

						{/* Render custom Fields */}
						<SectionHeader mt={8}>
							Additional Questions
						</SectionHeader>

						{
							containsCustomField(grant, 'Is your project open source?') && (
								<SectionSelection
									label='Is your project open source? '
									options={['Yes', 'No']}
									value={findCustomField(form, 'Is your project open source?').value}
									onChange={
										(e) => {
											onChange(e, findCustomField(form, 'Is your project open source?').id)
										}
									} />
							)
						}

						{
							containsCustomField(grant, 'Have you previously received a grant from Starknet Foundation or Starkware?') && (
								<SectionSelection
									label='Have you previously received a grant from Starknet Foundation or Starkware?'
									options={['Yes', 'No']}
									value={findCustomField(form, 'Have you previously received a grant from Starknet Foundation or Starkware?').value}
									onChange={
										(e) => {
											onChange(e, findCustomField(form, 'Have you previously received a grant from Starknet Foundation or Starkware?').id)
										}
									} />
							)
						}

						{
							containsCustomField(grant, 'If yes, what grant did you receive and what progress have you made since the last time you applied?') &&
							findCustomField(form, 'Have you previously received a grant from Starknet Foundation or Starkware?').value === 'Yes' &&
							(
								<SectionInput
									label='If yes, what grant did you receive and what progress have you made since the last time you applied?'
									placeholder='Previous grant and progress'
									value={findCustomField(form, 'If yes, what grant did you receive and what progress have you made since the last time you applied?').value}
									onChange={
										(e) => {
											onChange(e, findCustomField(form, 'If yes, what grant did you receive and what progress have you made since the last time you applied?').id)
										}
									} />
							)
						}
						{
							containsCustomField(grant, 'Have you previously participated in any Starknet hackathon, fellowship, or builder program?') && (
								<SectionSelection
									label='Have you previously participated in any Starknet hackathon, fellowship, or builder program?'
									options={['Yes', 'No']}
									value={findCustomField(form, 'Have you previously participated in any Starknet hackathon, fellowship, or builder program?').value}
									onChange={
										(e) => {
											onChange(e, findCustomField(form, 'Have you previously participated in any Starknet hackathon, fellowship, or builder program?').id)
										}
									} />
							)
						}

						{
							containsCustomField(grant, 'If yes, please note which programs you participated in and when') &&
							findCustomField(form, 'Have you previously participated in any Starknet hackathon, fellowship, or builder program?').value === 'Yes' &&
							(
								<SectionInput
									label='If yes, please note which programs you participated in and when'
									placeholder='Programs participated in'
									value={findCustomField(form, 'If yes, please note which programs you participated in and when').value}
									onChange={
										(e) => {
											onChange(e, findCustomField(form, 'If yes, please note which programs you participated in and when').id)
										}
									} />
							)
						}
						{
							containsCustomField(grant, 'Have you applied for or received funding from other crypto projects or ecosystems?') && (
								<SectionSelection
									label='Have you applied for or received funding from other crypto projects or ecosystems?'
									options={['Yes', 'No']}
									value={findCustomField(form, 'Have you applied for or received funding from other crypto projects or ecosystems?').value}
									onChange={
										(e) => {
											onChange(e, findCustomField(form, 'Have you applied for or received funding from other crypto projects or ecosystems?').id)
										}
									} />
							)
						}

						{
							containsCustomField(grant, 'If yes, where else did you get funding from?') &&
							findCustomField(form, 'Have you applied for or received funding from other crypto projects or ecosystems?').value === 'Yes' &&
							(
								<SectionInput
									label='If yes, where else did you get funding from?'
									placeholder='Funding sources'
									value={findCustomField(form, 'If yes, where else did you get funding from?').value}
									onChange={
										(e) => {
											onChange(e, findCustomField(form, 'If yes, where else did you get funding from?').id)
										}
									} />
							)
						}

						{/* {
							grant?.fields?.filter((field) => field.id.substring(field.id.indexOf('.') + 1).startsWith('customField'))?.sort((a, b) => {
								const aId = a.id.substring(a.id.indexOf('.customField') + 12)?.split('-')[0]
								const bId = b.id.substring(b.id.indexOf('.customField') + 12)?.split('-')[0]
								return parseInt(aId) - parseInt(bId)
							}).map((field) => {
								const id = field.id.substring(field.id.indexOf('.') + 1)
								const modifiedId = id.substring(id.indexOf('-') + 1)
								const title = field.title.substring(field.title.indexOf('-') + 1)
									.split('\\s')
									.join(' ')

								// console.log('hasan', { id, field: findFieldBySuffix(form, modifiedId, id)})

								return (
									<SectionInput
										key={field.id}
										label={title}
										value={findFieldBySuffix(form, modifiedId, id).value}
										onChange={
											(e) => {
												onChange(e, findFieldBySuffix(form, modifiedId, id).id)
											}
										} />
								)
							})
						} */}

						{/* Builder Details */}
						<SectionHeader mt={8}>
							Questions to determine status within the ecosystem
						</SectionHeader>

						{
							containsCustomField(grant, 'How did you hear about the Seed Grants Program?') && (
								<SectionDropDown
									label='How did you hear about the Seed Grants Program?'
									width='-moz-fit-content'
									placeholder='Select an option'
									options={['Starknet Blog', 'Starknet Community Event', 'Starknet Website', 'Social Media', 'Other team/ project in the ecosystem', 'Other']}
									value={findCustomField(form, 'How did you hear about the Seed Grants Program?').value}
									onChange={
										(e) => {
											onChange(e as unknown as ChangeEvent<HTMLInputElement>, findCustomField(form, 'How did you hear about the Seed Grants Program?').id)
										}
									} />
							)
						}
						{
							containsCustomField(grant, 'Which team project helped you hear about this program?') &&
								findCustomField(form, 'How did you hear about the Seed Grants Program?').value?.includes('Other') &&
								(
									<SectionInput
										label='Which team project helped you hear about this program?'
										placeholder='Please specify the team project/ source'
										value={findCustomField(form, 'Which team project helped you hear about this program').value}
										onChange={
											(e) => {
												onChange(e, findCustomField(form, 'Which team project helped you hear about this program?').id)
											}
										} />
								)
						}
						{
							containsCustomField(grant, 'Did anyone recommend that you submit an application to the Seed Grants Program?') && (
								<SectionSelection
									label='Did anyone recommend that you submit an application to the Seed Grants  Program? '
									options={['Yes', 'No']}
									value={findCustomField(form, 'Did anyone recommend that you submit an application to the Seed Grants Program?').value}
									onChange={
										(e) => {
											onChange(e, findCustomField(form, 'Did anyone recommend that you submit an application to the Seed Grants Program?').id)
										}
									} />
							)
						}

						{
							containsCustomField(grant, 'Please include the person’s name and details of their referral') &&
							findCustomField(form, 'Did anyone recommend that you submit an application to the Seed Grants Program?').value === 'Yes' &&
							(
								<SectionInput
									label='Please include the person’s name and details of their referral'
									placeholder='Please include the person’s name and details of their referral'
									value={findCustomField(form, 'Please include the person’s name and details of their referral').value}
									onChange={
										(e) => {
											onChange(e, findCustomField(form, 'Please include the person’s name and details of their referral').id)
										}
									} />
							)
						}

						{
							containsCustomField(grant, 'Is there anything else you’d like to share?') && (
								<SectionInput
									label='Is there anything else you’d like to share?'
									placeholder='Anything else you’d like to share'
									value={findCustomField(form, 'Is there anything else you’d like to share?').value}
									onChange={
										(e) => {
											onChange(e, findCustomField(form, 'Is there anything else you’d like to share?').id)
										}
									} />
							)
						}


						<Button
							mt={10}
							ml='auto'
							variant='primaryLarge'
							isLoading={webwallet ? !scwAddress : false}
							loadingText='Loading your wallet'
							isDisabled={isDisabled}
							onClick={
								(e) => {
									e.preventDefault()
									if(!webwallet) {
										setSignIn(true)
										return
									} else {
										setNetworkTransactionModalStep(0)
										submitProposal(form)
									}
								}
							}>
							<Text
								color='white'
								fontWeight='500'>
								{type === 'submit' ? 'Submit' : 'Resubmit'}
								{' '}
								Proposal
							</Text>
						</Button>
					</Flex>
				</Flex>
				<NetworkTransactionFlowStepperModal
					isOpen={networkTransactionModalStep !== undefined}
					currentStepIndex={networkTransactionModalStep || 0}
					viewTxnLink={getExplorerUrlForTxHash(chainId, transactionHash)}
					customSteps={customSteps}
					customStepsHeader={customStepsHeader}
					onClose={
						() => {
							setNetworkTransactionModalStep(undefined)
						}
					} />
			</Flex>
		)
	}

	const { setRole } = useContext(GrantsProgramContext)!
	const { type, grant, chainId, form, setForm, error } = useContext(ProposalFormContext)!
	const { setSignInTitle } = useContext(SignInTitleContext)!
	const { safeObj } = useSafeContext()!
	const { setSignIn } = useContext(SignInContext)!
	const { scwAddress, webwallet } = useContext(WebwalletContext)!
	const [qrCodeText, setQrCodeText] = useState<string>('')


	const router = useRouter()
	const { newTab } = router.query

	const [networkTransactionModalStep, setNetworkTransactionModalStep] = useState<number>()
	const [transactionHash, setTransactionHash] = useState<string>('')
	const { submitProposal, proposalId, isExecuting } = useSubmitProposal({ setNetworkTransactionModalStep, setTransactionHash })
	const [emailError, setEmailError] = useState<boolean>(false)
	const [walletAddressError, setWalletAddressError] = useState<boolean>(false)

	const [isSetupNotificationModalOpen, setIsSetupNotificationModalOpen] = useState<boolean>(false)

	useEffect(() => {
		setSignInTitle('submitProposal')
	}, [])

	const chainInfo = useMemo(() => {
		if(!grant || !chainId) {
			return
		}

		return getChainInfo(grant, chainId)
	}, [grant, chainId])

	const fundingAsk = useMemo(() => {
		const val = getRewardAmountMilestones(chainInfo?.decimals ?? 0, { milestones: form.milestones.map((m) => ({ ...m, amount: m.amount ? m.amount.toString() : '0' })) })
		return val
	}, [form])

	logger.info({ fundingAsk }, 'funding ask')

	const isDisabled = useMemo(() => {
		if(!form) {
			logger.info('Form is not initialised')
			return true
		}

		logger.info({ form }, 'Checking if form is disabled')

		const optionalFields = ['projectDetails', 'fundingAsk', 'fundingBreakdown', 'projectGoals', 'projectLink']
		const optionalFielsConditions = ['If yes,', 'Please include', 'Which team project helped you hear about this program?']
		const { fields, members, details, milestones } = form
		logger.info({ fields, members, details, milestones }, 'Checking fields')
		for(const field of fields) {
			// f.id.substring(f.id.indexOf('.') + 1).includes(field)
			if(field.value === '' && !optionalFields.includes(field.id) && !optionalFielsConditions.some((condition) => field.id?.substring(field.id.indexOf('.') + 1).includes(condition))) {
				logger.info({ field }, 'Field is empty')
				return true
			}
		}

		if(disabledGrants?.includes(grant?.id as string) && type === 'submit') {
			logger.info('Grant is disabled')
			return true
		}

		for(const member of members) {
			if(member === '') {
				logger.info({ member }, 'Member is empty')
				return true
			}
		}

		if(!convertToRaw(details.getCurrentContent()).blocks[0]) {
			logger.info('Details is empty')
			return true
		}

		// for(const milestone of milestones) {
		// 	if(milestone.title === '' || !milestone.amount) {
		// 		logger.info({ index: milestone.index }, 'Milestone is empty')
		// 		return true
		// 	}
		// }

		if(emailError || walletAddressError) {
			return true
		}

		return false
	}, [form])

	const onChange = (e: ChangeEvent<HTMLInputElement>, id: string) => {
		const copy = { ...form }
		findField(copy, id).value = e.target.value
		setForm(copy)
	}

	return buildComponent()
}

ProposalForm.getLayout = (page: ReactElement) => {
	return (
		<NavbarLayout
			openSignIn={true}>
			<ProposalFormProvider>
				{page}
			</ProposalFormProvider>
		</NavbarLayout>
	)
}

export default ProposalForm