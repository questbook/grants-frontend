import { ChangeEvent, ReactElement, useContext, useEffect, useMemo, useState } from 'react'
import QRCode from 'react-qr-code'
import { Alert, AlertIcon, AlertTitle, Button, Center, Checkbox, Container, Divider, Flex, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner, Text, VStack } from '@chakra-ui/react'
import { convertToRaw } from 'draft-js'
import { useRouter } from 'next/router'
import config from 'src/constants/config.json'
import { useSafeContext } from 'src/contexts/safeContext'
import { Doc, Twitter } from 'src/generated/icons'
import logger from 'src/libraries/logger'
import BackButton from 'src/libraries/ui/BackButton'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import NetworkTransactionFlowStepperModal from 'src/libraries/ui/NetworkTransactionFlowStepperModal'
import { getAvatar } from 'src/libraries/utils'
import { AmplitudeContext } from 'src/libraries/utils/amplitude'
import { chainNames } from 'src/libraries/utils/constants'
import { getExplorerUrlForTxHash, getRewardAmountMilestones } from 'src/libraries/utils/formatting'
import { getUrlForIPFSHash } from 'src/libraries/utils/ipfs'
import { getChainInfo } from 'src/libraries/utils/token'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { GrantsProgramContext, SignInContext, SignInTitleContext, WebwalletContext } from 'src/pages/_app'
import SectionDropDown from 'src/screens/proposal_form/_components/SectionDropDown'
import SectionHeader from 'src/screens/proposal_form/_components/SectionHeader'
import SectionInput from 'src/screens/proposal_form/_components/SectionInput'
import SectionRadioButton from 'src/screens/proposal_form/_components/SectionRadioButton'
import SectionRichTextEditor from 'src/screens/proposal_form/_components/SectionRichTextEditor'
import SectionSelect from 'src/screens/proposal_form/_components/SectionSelect'
import SelectArray from 'src/screens/proposal_form/_components/SelectArray'
import useSubmitProposal from 'src/screens/proposal_form/_hooks/useSubmitProposal'
import { containsCustomField, containsField, findCustomField, findField, findFieldBySuffix, validateEmail, validateWalletAddress } from 'src/screens/proposal_form/_utils'
import { customSteps, customStepsHeader, DEFAULT_MILESTONE, disabledGrants, MILESTONE_INPUT_STYLE, SocialIntent, stylus } from 'src/screens/proposal_form/_utils/constants'
import { ProposalFormContext, ProposalFormProvider } from 'src/screens/proposal_form/Context'


function ProposalForm() {
	const [isLoading, setIsLoading] = useState(true)

	const LoadingComponent = () => {
		return (
			<Center
				h='calc(100vh - 64px)'
				w='100%'>
				<VStack spacing={4}>
					<Spinner
						thickness='4px'
						speed='0.65s'
						emptyColor='gray.200'
						color='blue.500'
						size='xl'
					/>
					<Text
						color='gray.600'
						fontSize='lg'>
						Loading proposal form...
					</Text>
				</VStack>
			</Center>
		)
	}

	const buildComponent = () => {
		if(isLoading) {
			return <LoadingComponent />
		}

		return isExecuting !== undefined && !isExecuting && networkTransactionModalStep === undefined ? successComponent() : (error ? errorComponent() : grant?.id === stylus[0] ? customStylusComponent() : formComponent())
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
												onClick={
													() => {
														trackAmplitudeEvent('telegram_notifications', {
															programName: grant?.title,
															telegramId: telegram ?? '',
															isSignedIn: scwAddress ? 'true' : 'false'
														})
														window.open(qrCodeText, '_blank')
													}
												}
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
												<Button
													w='100%'
													bg='#77AC06'
													border='1px solid #E1DED9'
													variant='primaryLarge'
													onClick={
														() => {
															trackAmplitudeEvent('Social_Shares', {
																programName: grant?.title,
																telegramId: telegram ?? '',
															})
															window.open(`https://twitter.com/intent/tweet?text=${SocialIntent[Math.floor(Math.random() * SocialIntent.length)]}&url=${window.location.origin}/dashboard/?grantId=${grant?.id}%26chainId=${chainId}%26proposalId=${proposalId}`, '_blank')
														}
													}
													leftIcon={<Twitter />}
												>
													<Text
														color='white'
														fontWeight='500'>
														Share on Twitter
													</Text>
												</Button>
												<Button
													w='100%'
													bg='transparent'
													border='1px solid #E1DED9'
													variant='primaryLarge'
													onClick={
														() => {
															trackAmplitudeEvent('Social_Shares', {
																programName: grant?.title,
															})
															const payload = getPayload({ type: 'proposal', proposalId: proposalId!, grantId: grant?.id! })
															if(payload) {
																setQrCodeText(`https://t.me/${process.env.NOTIF_BOT_USERNAME}?start=${payload}`)
																setIsSetupNotificationModalOpen(true)
															}
														}
													}

												>
													<Text
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
															})
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
						{
							type === 'submit' && (
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
									<Text
										variant={grant?.acceptingApplications ? 'openTag' : 'closedTag'}
									>
										{grant?.acceptingApplications ? 'Open' : 'Closed'}
									</Text>
								</Flex>
							)
						}
						{
							!grant?.acceptingApplications && type === 'submit' && (
								<Alert
									status='warning'
									variant='subtle'
									borderRadius='md'
									mb={4}
									mt={4}
									maxW='450px'>
									<AlertIcon />
									<AlertTitle fontSize='sm'>
										This grant is not accepting applications at this time
									</AlertTitle>
								</Alert>
							)
						}
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
								<Divider
									orientation='vertical'
									h='100%' />

								{/* Documentation link card */}
								{
									grant?.link && (
										<Flex
											alignItems='center'
											p={5}
											flexDirection='column'
											bg='white'
											transition='all 0.2s ease-in-out'
											onClick={() => window.open(grant?.link!, '_blank')}
											role='button'
											aria-label='View Program RFP'>

											<Doc
												boxSize='12'
												color='gray.600'
												mb={2}
											/>

											<Flex
												direction='column'
												align='center'
												gap={1}>
												<Text
													variant='title'
													fontSize='md'
													fontWeight='600'
													color='gray.800'>
													Grant Program Details
												</Text>
												<Text
													variant='body'
													fontSize='sm'
													color='blue.600'>
													Click to view program RFP
												</Text>
											</Flex>

										</Flex>
									)
								}

							</Flex>
						</Container>

						{/* Builder Details */}
						<SectionHeader mt={8}>
							Builder details
						</SectionHeader>
						{
							containsField(grant, 'applicantName') && (
								<SectionInput
									label='Full Name'
									placeholder='Ryan Adams'
									value={findField(form, 'applicantName').value}
									onChange={
										(e) => {
											onChange(e, 'applicantName')
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
							containsField(grant, 'applicantTelegram') && (
								<SectionInput
									label='Telegram'
									placeholder='@username'
									value={findField(form, 'applicantTelegram').value}
									onChange={
										(e) => {
											setTelegram(e.target.value)
											onChange(e, 'applicantTelegram')
										}
									}
								/>
							)
						}
						{
							/* Optinal Telegram Field (if it is not included in the form field) */
							type === 'submit' &&
							grant?.fields?.filter((field) => field.id.substring(field.id.indexOf('.') + 1)?.toLowerCase().includes('telegram')
								|| field.id.substring(field.id.indexOf('.') + 1)?.toLowerCase().includes('tg')
							).length === 0 && (
								<SectionInput
									label='Telegram'
									placeholder='@username'
									value={telegram}
									onChange={
										(e) => {
											setTelegram(e.target.value)
										}
									} />
							)
						}
						{
							containsField(grant, 'applicantTwitter') && (
								<SectionInput
									label='Twitter'
									placeholder='@twitterHandle'
									value={findField(form, 'applicantTwitter').value}
									onChange={
										(e) => {
											setTwitter(e.target.value)
											onChange(e, 'applicantTwitter')
										}
									}
								/>
							)
						}
						{
							/* Optinal Telegram Field (if it is not included in the form field) */
							type === 'submit' &&
							grant?.fields?.filter((field) => field.id.substring(field.id.indexOf('.') + 1)?.toLowerCase().includes('twitter')).length === 0 && (
								<SectionInput
									label='Twitter'
									placeholder='@twitterHandle'
									value={twitter}
									onChange={
										(e) => {
											setTwitter(e.target.value)
										}
									} />
							)
						}
						{
							containsField(grant, 'applicantAddress') && (
								<SectionInput
									label='Wallet Address'
									placeholder='Wallet to receive funds on EVM based chain / Solana / TON'
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

						{/* Proposal Details */}
						<SectionHeader mt={8}>
							Proposal
						</SectionHeader>
						{
							containsField(grant, 'projectName') && (
								<SectionInput
									label='Title'
									placeholder='Name of your proposal'
									maxLength={80}
									value={findField(form, 'projectName').value}
									onChange={
										(e) => {
											onChange(e, 'projectName')
										}
									} />
							)
						}
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
									label='Details'
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

						<SelectArray
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
							} />

						<SectionInput
							label='Funding Asked'
							isDisabled
							placeholder='12000 USD'
							value={`${fundingAsk} ${chainInfo?.label}`}
						/>

						{/* Render custom Fields */}
						{
							containsField(grant, 'customField0') && (
								<SectionHeader mt={8}>
									Other information
								</SectionHeader>
							)
						}

						{
							grant?.fields?.filter((field) => field.id.substring(field.id.indexOf('.') + 1).startsWith('customField')).map((field) => {
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
						}
						{
							/* Optinal Referral Field (if it is not included in the form field) */
							type === 'submit' &&
							grant?.fields?.filter((field) => field.id.substring(field.id.indexOf('.') + 1)?.toLowerCase().includes('referral')
							).length === 0 && (
								<SectionRadioButton
									label='How did you find out about this program?'
									placeholder='Select an option'
									value={referral?.type}
									options={['Questbook Twitter', 'Website', 'Someone referred me', 'Other']}
									onChange={
										(e) => {
											setReferral({ type: e.target.value, value: '' })
										}
									}
								/>
							)
						}
						{
							['Someone referred me', 'Website', 'Other']?.includes(referral?.type) && (
								<SectionInput
									label={referral?.type === 'Website' ? 'Which website?' : referral?.type === 'Other' ? 'Please specify' : 'Who referred you?'}
									placeholder=''
									value={referral?.value}
									onChange={
										(e) => {
											setReferral({ ...referral, value: e.target.value })
										}
									} />
							)
						}
						{
							type === 'submit' && (
								<Flex
									w='100%'
									mt={8}
								>
									<Flex
										direction='column'
										w='100%'>
										<Flex
											w='100%'
											direction={['column', 'column', 'row']}
											align={['flex-start', 'flex-start', 'center']}
											gap={[2, 2, 8]}>
											<Flex
												direction='column'
												w={['100%', '100%', 'calc(30% - 32px)']}>
												<Text
													mb={[1, 1, 0]}
													variant='subheading'
													fontWeight='500'
													textAlign={['left', 'left', 'right']}
													color='gray.700'>
													Stay Updated
												</Text>
												<Text
													fontSize='sm'
													color='gray.500'
													textAlign={['left', 'left', 'right']}>
													Get the latest updates about grants
												</Text>
											</Flex>
											<Checkbox
												isChecked={newsletter === 'Yes'}
												onChange={
													(e) => {
														setNewsLetter(e.target.checked ? 'Yes' : 'No')
													}
												}
												size='lg'
												colorScheme='blue'
												aria-label='Subscribe to Questbook Newsletter'
												_hover={{ cursor: 'pointer' }}
											>
												<Text
													fontSize='sm'
													color='gray.700'>
													Subscribe to Questbook Newsletter
												</Text>
											</Checkbox>
										</Flex>
									</Flex>
								</Flex>
							)
						}


						<Button
							mt={10}
							ml='auto'
							variant='primaryLarge'
							isDisabled={isDisabled}
							isLoading={webwallet ? !scwAddress : false}
							loadingText='Loading your wallet'
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

	const customStylusComponent = () => {
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
							<Text
								variant={grant?.acceptingApplications ? 'openTag' : 'closedTag'}
							>
								{grant?.acceptingApplications ? 'Open' : 'Closed'}
							</Text>

						</Flex>
						{
							!grant?.acceptingApplications && (
								<Alert
									status='warning'
									variant='subtle'
									borderRadius='md'
									mb={4}
									mt={4}
									maxW='450px'>
									<AlertIcon />
									<AlertTitle fontSize='sm'>
										This grant is not accepting applications at this time
									</AlertTitle>
								</Alert>
							)
						}
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
								<Divider
									orientation='vertical'
									h='100%' />

								{/* Documentation link card */}
								{
									grant?.link && (
										<Flex
											alignItems='center'
											p={5}
											flexDirection='column'
											bg='white'
											transition='all 0.2s ease-in-out'
											onClick={() => window.open(grant?.link!, '_blank')}
											role='button'
											aria-label='View Program RFP'>

											<Doc
												boxSize='12'
												color='gray.600'
												mb={2}
											/>

											<Flex
												direction='column'
												align='center'
												gap={1}>
												<Text
													variant='title'
													fontSize='md'
													fontWeight='600'
													color='gray.800'>
													Grant Program Details
												</Text>
												<Text
													variant='body'
													fontSize='sm'
													color='blue.600'>
													Click to view program RFP
												</Text>
											</Flex>

										</Flex>
									)
								}

							</Flex>
						</Container>

						{/* Builder Details */}
						<SectionHeader mt={8}>
							Applicant Information
						</SectionHeader>
						{
							containsField(grant, 'applicantName') && (
								<SectionInput
									label='Full Name'
									placeholder='Ryan Adams'
									value={findField(form, 'applicantName').value}
									onChange={
										(e) => {
											onChange(e, 'applicantName')
										}
									} />
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
						{
							containsCustomField(grant, 'Project Links') && (
								<SectionInput
									label='Project Links'
									value={findCustomField(form, 'Project Links').value}
									placeholder='Website, GitHub, social media, MVP, etc.'
									onChange={
										(e) => {
											onChange(e as unknown as ChangeEvent<HTMLInputElement>, findCustomField(form, 'Project Links').id)
										}
									} />
							)
						}

						<SectionHeader mt={8}>
							Contact Information
						</SectionHeader>
						{
							containsCustomField(grant, 'Point of Contact') && (
								<SectionInput
									label='Point of Contact'
									value={findCustomField(form, 'Point of Contact').value}
									placeholder='individual name'
									onChange={
										(e) => {
											onChange(e as unknown as ChangeEvent<HTMLInputElement>, findCustomField(form, 'Point of Contact').id)
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
							containsField(grant, 'applicantTelegram') && (
								<SectionInput
									label='Telegram'
									placeholder='@username'
									value={findField(form, 'applicantTelegram').value}
									onChange={
										(e) => {
											setTelegram(e.target.value)
											onChange(e, 'applicantTelegram')
										}
									}
								/>
							)
						}
						{
							containsField(grant, 'applicantTwitter') && (
								<SectionInput
									label='Twitter'
									placeholder='@twitterHandle'
									value={findField(form, 'applicantTwitter').value}
									onChange={
										(e) => {
											setTwitter(e.target.value)
											onChange(e, 'applicantTwitter')
										}
									}
								/>
							)
						}

						{
							containsCustomField(grant, 'Discord') && (
								<SectionInput
									label='Discord'
									value={findCustomField(form, 'Discord').value}
									placeholder='@discordHandle'
									onChange={
										(e) => {
											onChange(e as unknown as ChangeEvent<HTMLInputElement>, findCustomField(form, 'Discord').id)
										}
									} />
							)
						}


						{
							containsCustomField(grant, 'KYC/KYB Acknowledgment') && (
								<SectionRadioButton
									label='KYC/KYB Acknowledgment'
									options={['Yes', 'No']}
									value={findCustomField(form, 'KYC/KYB Acknowledgment').value}
									onChange={
										(e) => {
											onChange(e as unknown as ChangeEvent<HTMLInputElement>, findCustomField(form, 'KYC/KYB Acknowledgment').id)
										}
									} />
							)
						}
						{
							containsCustomField(grant, 'Track') && (
								<SectionDropDown
									label='Track'
									width='-moz-fit-content'
									options={['Select Track', 'Open Application', 'RFP']}
									value={findCustomField(form, 'Track').value}
									onChange={
										(e) => {
											onChange(e as unknown as ChangeEvent<HTMLInputElement>, findCustomField(form, 'Track').id)
										}
									} />
							)
						}
						{
							findCustomField(form, 'Track').value === 'RFP' && (
								<SectionInput
									label='RFP Category'
									value={findCustomField(form, 'RFP Category').value}
									placeholder='Category'
									onChange={
										(e) => {
											onChange(e as unknown as ChangeEvent<HTMLInputElement>, findCustomField(form, 'RFP Category').id)
										}
									} />
							)
						}

						{/* Proposal Details */}
						<SectionHeader mt={8}>
							Grant Information
						</SectionHeader>
						{
							containsField(grant, 'projectName') && (
								<SectionInput
									label='Title'
									placeholder='Name of your Project'
									maxLength={80}
									value={findField(form, 'projectName').value}
									onChange={
										(e) => {
											onChange(e, 'projectName')
										}
									} />
							)
						}
						{
							containsField(grant, 'tldr') && (
								<SectionInput
									label='tl;dr'
									placeholder='Explain your Project in one sentence'
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
							containsCustomField(grant, 'Requested Grant Size') && (
								<SectionInput
									label='Requested Grant Size'
									value={findCustomField(form, 'Requested Grant Size').value}
									placeholder='Amount'
									onChange={
										(e) => {
											onChange(e as unknown as ChangeEvent<HTMLInputElement>, findCustomField(form, 'Requested Grant Size').id)
										}
									} />
							)
						}
						{
							containsField(grant, 'projectDetails') && (
								<SectionRichTextEditor
									label='Details'
									flexProps={{ align: 'start' }}
									editorState={form.details}
									placeholder='Category/Idea: Describe in detail the idea/project for which you are applying for a grant and how it will utilize Stylus. [1000 characters max]'
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
							containsCustomField(grant, 'Innovation & Novelty: Highlight what unique aspect or innovation your project brings to Arbitrum') && (
								<SectionInput
									label='Innovation & Novelty: Highlight what unique aspect or innovation your project brings to Arbitrum'
									type='textarea'
									value={findCustomField(form, 'Innovation & Novelty: Highlight what unique aspect or innovation your project brings to Arbitrum').value}
									placeholder='Highlight what unique aspect or innovation your project brings to Arbitrum'
									maxLength={1000}
									onChange={
										(e) => {
											onChange(e as unknown as ChangeEvent<HTMLInputElement>, findCustomField(form, 'Innovation & Novelty: Highlight what unique aspect or innovation your project brings to Arbitrum').id)
										}
									} />
							)
						}
						{
							containsCustomField(grant, 'What users and pain points in the market does this project solve for? Who is your intended target audience?') && (
								<SectionInput
									label='What users and pain points in the market does this project solve for? Who is your intended target audience?'
									type='textarea'
									value={findCustomField(form, 'What users and pain points in the market does this project solve for? Who is your intended target audience?').value}
									placeholder='What users and pain points in the market does this project solve for? Who is your intended target audience?'
									maxLength={1000}
									onChange={
										(e) => {
											onChange(e as unknown as ChangeEvent<HTMLInputElement>, findCustomField(form, 'What users and pain points in the market does this project solve for? Who is your intended target audience?').id)
										}
									} />
							)
						}
						{
							containsCustomField(grant, 'Funding Breakdown & Spending Plan') && (
								<SectionInput
									label='Funding Breakdown & Spending Plan'
									type='textarea'
									value={findCustomField(form, 'Funding Breakdown & Spending Plan').value}
									placeholder='Outline how the requested funds will be allocated'
									maxLength={2000}
									onChange={
										(e) => {
											onChange(e as unknown as ChangeEvent<HTMLInputElement>, findCustomField(form, 'Funding Breakdown & Spending Plan').id)
										}
									} />
							)
						}

						{
							containsField(grant, 'applicantAddress') && (
								<SectionInput
									label='Funding Address'
									placeholder='Enter the address where grant funds will be sent'
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

						<SectionHeader mt={8}>
							Team & Product Information
						</SectionHeader>

						{
							containsCustomField(grant, 'Team Experience') && (
								<SectionInput
									label='Team Experience'
									type='textarea'
									value={findCustomField(form, 'Team Experience').value}
									placeholder='Describe relevant technical experience as it would apply to Stylus and your proposed project. Include links for validation'
									maxLength={1000}
									onChange={
										(e) => {
											onChange(e as unknown as ChangeEvent<HTMLInputElement>, findCustomField(form, 'Team Experience').id)
										}
									} />
							)
						}
						{
							containsCustomField(grant, 'Has the current team already onboarded the key personnel required to complete the tasks or project for which they are applying for the grant?') && (
								<SectionRadioButton
									label='Has the current team already onboarded the key personnel required to complete the tasks or project for which they are applying for the grant?'
									options={['Yes', 'No']}
									value={findCustomField(form, 'Has the current team already onboarded the key personnel required to complete the tasks or project for which they are applying for the grant?').value}
									onChange={
										(e) => {
											onChange(e as unknown as ChangeEvent<HTMLInputElement>, findCustomField(form, 'Has the current team already onboarded the key personnel required to complete the tasks or project for which they are applying for the grant?').id)
										}
									}
								/>
							)
						}

						{
							containsCustomField(grant, 'Project Stage') && (
								<SectionInput
									label='Project Stage'
									type='textarea'
									value={findCustomField(form, 'Project Stage').value}
									placeholder='In which stage is the idea/project currently at (Ideation, Testnet, MVP, In-production)'
									maxLength={300}
									onChange={
										(e) => {
											onChange(e as unknown as ChangeEvent<HTMLInputElement>, findCustomField(form, 'Project Stage').id)
										}
									} />
							)
						}

						{
							containsCustomField(grant, 'Deployment Date') && (
								<SectionInput
									label='(If applicable) Deployment Date'
									type='textarea'
									value={findCustomField(form, 'Deployment Date').value}
									placeholder='Has your project been deployed on Arbitrum One, an Orbit chain, or Arbitrum Nova already? If so, what date was your first deployment? If not deployed on an Aribturm related chain, where and when was your project first deployed?'
									maxLength={500}
									onChange={
										(e) => {
											onChange(e as unknown as ChangeEvent<HTMLInputElement>, findCustomField(form, 'Deployment Date').id)
										}
									} />
							)
						}

						{
							containsCustomField(grant, 'Previous Performance') && (
								<SectionInput
									label='(If applicable) Previous Performance'
									type='textarea'
									value={findCustomField(form, 'Previous Performance').value}
									placeholder=' Provide a list of dashboards that point to relevant data metrics such as transaction volume, TVL, daily active wallets, etc'
									maxLength={500}
									onChange={
										(e) => {
											onChange(e as unknown as ChangeEvent<HTMLInputElement>, findCustomField(form, 'Previous Performance').id)
										}
									} />
							)
						}
						{
							containsCustomField(grant, 'Have you previously received a grant from the Arbitrum DAO, Foundation, any Arbitrum ecosystem related program, or another blockchain ecosystem?') && (
								<SectionInput
									label='Have you previously received a grant from the Arbitrum DAO, Foundation, any Arbitrum ecosystem related program, or another blockchain ecosystem?'
									type='textarea'
									value={findCustomField(form, 'Have you previously received a grant from the Arbitrum DAO, Foundation, any Arbitrum ecosystem related program, or another blockchain ecosystem?').value}
									placeholder='If yes, please provide a brief description, relevant results/learnings, and links for reference'
									maxLength={750}
									onChange={
										(e) => {
											onChange(e as unknown as ChangeEvent<HTMLInputElement>, findCustomField(form, 'Have you previously received a grant from the Arbitrum DAO, Foundation, any Arbitrum ecosystem related program, or another blockchain ecosystem?').id)
										}
									} />
							)
						}

						{
							containsCustomField(grant, 'Comparable Projects') && (
								<SectionInput
									label='Comparable Projects'
									type='textarea'
									value={findCustomField(form, 'Comparable Projects').value}
									placeholder='Do you have comparable projects/protocols within the Arbitrum ecosystem or other blockchains?'
									maxLength={500}
									onChange={
										(e) => {
											onChange(e as unknown as ChangeEvent<HTMLInputElement>, findCustomField(form, 'Comparable Projects').id)
										}
									} />
							)
						}

						{
							containsCustomField(grant, 'Ecosystem Growth Potential') && (
								<SectionInput
									label='Ecosystem Growth Potential'
									type='textarea'
									value={findCustomField(form, 'Ecosystem Growth Potential').value}
									placeholder='Describe how this project will attract or support new users, projects, or protocols to Arbitrum'
									maxLength={750}
									onChange={
										(e) => {
											onChange(e as unknown as ChangeEvent<HTMLInputElement>, findCustomField(form, 'Ecosystem Growth Potential').id)
										}
									} />
							)
						}
						{
							containsCustomField(grant, 'How do you plan on implementing your project & have you done some due diligence on the feasibility of your idea with respect to the tools/frameworks currently available?') && (
								<SectionInput
									label='How do you plan on implementing your project & have you done some due diligence on the feasibility of your idea with respect to the tools/frameworks currently available?'
									type='textarea'
									value={findCustomField(form, 'How do you plan on implementing your project & have you done some due diligence on the feasibility of your idea with respect to the tools/frameworks currently available?').value}
									placeholder='Please reference tools/frameworks you plan to use in implementing your project. Does not have to be an exhaustive list, but please include the most relevant'
									maxLength={750}
									onChange={
										(e) => {
											onChange(e as unknown as ChangeEvent<HTMLInputElement>, findCustomField(form, 'How do you plan on implementing your project & have you done some due diligence on the feasibility of your idea with respect to the tools/frameworks currently available?').id)
										}
									} />
							)
						}


						{/* Proposal Details */}
						<SectionHeader mt={8}>
							Milestones
						</SectionHeader>

						<SelectArray
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
											...MILESTONE_INPUT_STYLE[2],
											value: milestone?.details,
											type: 'textarea',
											placeholder: 'KPIs & Requirements',
											// isDisabled: index < (grant?.milestones?.length || 0),
											onChange: (e) => {
												const copy = { ...form }
												copy.milestones[index] = { ...copy.milestones[index], details: e.target.value }
												setForm(copy)
											}
										},
										{
											...MILESTONE_INPUT_STYLE[3],
											value: milestone?.deadline,
											type: 'date',
											label: 'Target Date',
											// isDisabled: index < (grant?.milestones?.length || 0),
											onChange: (e) => {
												const copy = { ...form }
												copy.milestones[index] = { ...copy.milestones[index], deadline: e.target.value }
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
							} />

						<SectionInput
							label='Funding Asked'
							isDisabled
							placeholder='12000 ARB'
							value={`${fundingAsk} ${chainInfo?.label}`}
						/>
						<Alert
							status='info'
							variant='left-accent'
							mt={8}
							mb={4}>
							<AlertIcon />
							<Text fontSize='sm'>
								Note: Applicants requesting greater than 500k ARB may be sent to the Arbitrum DAO directly
							</Text>
						</Alert>

						{
							containsCustomField(grant, 'How will you ensure the long-term sustainability of your project after the end of the program?') && (
								<SectionInput
									label='How will you ensure the long-term sustainability of your project after the end of the program?'
									type='textarea'
									placeholder='Consider what your team’s roadmap might look like after the last milestone is achieved. It is recommended to include the potential risks your team foresees and how your team can mitigate them.'
									maxLength={1500}
									value={findCustomField(form, 'How will you ensure the long-term sustainability of your project after the end of the program?').value}
									onChange={
										(e) => {
											onChange(e as unknown as ChangeEvent<HTMLInputElement>, findCustomField(form, 'How will you ensure the long-term sustainability of your project after the end of the program?').id)
										}
									} />
							)
						}
						{
							containsCustomField(grant, 'Do you acknowledge that, from the moment in which the grant is approved, you have up to 1 year to KYC/KYB and complete the deliverable specified in this grant?') && (
								<SectionRadioButton
									label='Do you acknowledge that, from the moment in which the grant is approved, you have up to 1 year to KYC/KYB and complete the deliverable specified in this grant?'
									options={['Yes', 'No']}
									value={findCustomField(form, 'Do you acknowledge that, from the moment in which the grant is approved, you have up to 1 year to KYC/KYB and complete the deliverable specified in this grant?').value}
									onChange={
										(e) => {
											onChange(e as unknown as ChangeEvent<HTMLInputElement>, findCustomField(form, 'Do you acknowledge that, from the moment in which the grant is approved, you have up to 1 year to KYC/KYB and complete the deliverable specified in this grant?').id)
										}
									} />
							)
						}


						{/* Render custom Fields */}
						{
							containsField(grant, 'customField0') && (
								<SectionHeader mt={8}>
									Other information
								</SectionHeader>
							)
						}
						{
							/* Optional Referral Field (if it is not included in the form field) */
							type === 'submit' &&
							grant?.fields?.filter((field) => field.id.substring(field.id.indexOf('.') + 1)?.toLowerCase().includes('referral')
							).length === 0 && (
								<SectionDropDown
									label='How did you find out about this program?'
									width='-moz-fit-content'
									options={['Arbitrum Twitter', 'Stylus Sprint Blog Post', 'Questbook Twitter', 'Website', 'Someone referred me', 'Other']}
									value={referral?.type}
									onChange={
										(e) => {
											setReferral({ type: e.target.value, value: '' })
										}
									} />
							)
						}
						{
							['Someone referred me', 'Website', 'Other']?.includes(referral?.type) && (
								<SectionInput
									label={referral?.type === 'Website' ? 'Which website?' : referral?.type === 'Other' ? 'Please specify' : 'Who referred you?'}
									placeholder=''
									value={referral?.value}
									onChange={
										(e) => {
											setReferral({ ...referral, value: e.target.value })
										}
									} />
							)
						}
						{
							type === 'submit' && (
								<Flex
									w='100%'
									mt={8}
								>
									<Flex
										direction='column'
										w='100%'>
										<Flex
											w='100%'
											direction={['column', 'column', 'row']}
											align={['flex-start', 'flex-start', 'center']}
											gap={[2, 2, 8]}>
											<Flex
												direction='column'
												w={['100%', '100%', 'calc(30% - 32px)']}>
												<Text
													mb={[1, 1, 0]}
													variant='subheading'
													fontWeight='500'
													textAlign={['left', 'left', 'right']}
													color='gray.700'>
													Stay Updated
												</Text>
												<Text
													fontSize='sm'
													color='gray.500'
													textAlign={['left', 'left', 'right']}>
													Get the latest updates about grants
												</Text>
											</Flex>
											<Checkbox
												isChecked={newsletter === 'Yes'}
												onChange={
													(e) => {
														setNewsLetter(e.target.checked ? 'Yes' : 'No')
													}
												}
												size='lg'
												colorScheme='blue'
												aria-label='Subscribe to Questbook Newsletter'
												_hover={{ cursor: 'pointer' }}
											>
												<Text
													fontSize='sm'
													color='gray.700'>
													Subscribe to Questbook Newsletter
												</Text>
											</Checkbox>
										</Flex>
									</Flex>
								</Flex>
							)
						}

						<Alert
							mt={10}
							status='info'
							variant='subtle'
						>
							<AlertIcon />
							<Text
								fontSize='sm'
								color='black'
							>
								{'Please ensure that all fields are filled correctly before submitting the proposal. All the fields are mandatory. Please fill them with \'N/A\' or \'-\' if not applicable.'}
							</Text>
						</Alert>


						<Button
							mt={10}
							ml='auto'
							variant='primaryLarge'
							isDisabled={isDisabled}
							isLoading={webwallet ? !scwAddress : false}
							loadingText='Loading your wallet'
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
	const { type, grant, chainId, form, setForm, error, telegram, setTelegram, twitter, setTwitter, referral, setReferral, newsletter, setNewsLetter } = useContext(ProposalFormContext)!
	const { setSignInTitle } = useContext(SignInTitleContext)!
	const { safeObj } = useSafeContext()!
	const { setSignIn } = useContext(SignInContext)!
	const { scwAddress, webwallet } = useContext(WebwalletContext)!
	const { trackAmplitudeEvent } = useContext(AmplitudeContext)!
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

	useEffect(() => {
		if(form && grant) {
			setIsLoading(false)
		}
	}, [form, grant])

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

	const isDisabled = useMemo(() => {
		if(!form) {
			logger.info('Form is not initialised')
			return true
		}

		if(!grant?.acceptingApplications && type === 'submit') {
			logger.info('Grant is not accepting applications')
			return true
		}

		const optionalFields = ['projectDetails', 'fundingAsk', 'fundingBreakdown', 'projectGoals', 'projectLink']
		const { fields, members, details, milestones } = form
		for(const field of fields) {
			if(field.id?.includes('RFP Category') && field.value === '') {
				continue
			}

			if(field.value === '' && !optionalFields.includes(field.id)) {
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

		for(const milestone of milestones) {
			if(milestone.title === '' || !milestone.amount) {
				logger.info({ index: milestone.index }, 'Milestone is empty')
				return true
			}
		}

		if(emailError || walletAddressError) {
			return true
		}

		return
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