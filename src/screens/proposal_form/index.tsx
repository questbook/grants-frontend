import { ChangeEvent, ReactElement, useContext, useEffect, useMemo, useState } from 'react'
import { Box, Button, Container, Flex, Image, Text } from '@chakra-ui/react'
import { convertToRaw } from 'draft-js'
import { useRouter } from 'next/router'
import config from 'src/constants/config.json'
import { useSafeContext } from 'src/contexts/safeContext'
import { Alert, Doc, Twitter } from 'src/generated/icons'
import logger from 'src/libraries/logger'
import BackButton from 'src/libraries/ui/BackButton'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import NetworkTransactionFlowStepperModal from 'src/libraries/ui/NetworkTransactionFlowStepperModal'
import SetupNotificationModal from 'src/libraries/ui/SetupNotificationModal'
import { getAvatar } from 'src/libraries/utils'
import { chainNames } from 'src/libraries/utils/constants'
import { getExplorerUrlForTxHash, getRewardAmountMilestones } from 'src/libraries/utils/formatting'
import { getUrlForIPFSHash } from 'src/libraries/utils/ipfs'
import { getChainInfo } from 'src/libraries/utils/token'
import { GrantsProgramContext, SignInContext, SignInTitleContext, WebwalletContext } from 'src/pages/_app'
import Banner from 'src/screens/dashboard/Banner'
import SectionHeader from 'src/screens/proposal_form/_components/SectionHeader'
import SectionInput from 'src/screens/proposal_form/_components/SectionInput'
import SectionRichTextEditor from 'src/screens/proposal_form/_components/SectionRichTextEditor'
import SectionSelect from 'src/screens/proposal_form/_components/SectionSelect'
import SelectArray from 'src/screens/proposal_form/_components/SelectArray'
import useSubmitProposal from 'src/screens/proposal_form/_hooks/useSubmitProposal'
import { containsField, findField, findFieldBySuffix, validateEmail, validateWalletAddress } from 'src/screens/proposal_form/_utils'
import { customSteps, customStepsHeader, DEFAULT_MILESTONE, disabledGrants, disabledTonGrants, MILESTONE_INPUT_STYLE, SocialIntent, tonGrants } from 'src/screens/proposal_form/_utils/constants'
import { ProposalFormContext, ProposalFormProvider } from 'src/screens/proposal_form/Context'


function ProposalForm() {
	const buildComponent = () => {
		return isExecuting !== undefined && !isExecuting && networkTransactionModalStep === undefined ? successComponent() : (error ? errorComponent() : grant?.id === tonGrants ? customTONformComponent() : formComponent())
	}


	const successComponent = () => {
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
					<Flex
						direction='column'
						bg='accent.columbia'
						w='50%'
						h='100%'
						justify='center'
						align='start'
						pl='10%'>

						<Image
							src={grant?.workspace?.logoIpfsHash === config.defaultDAOImageHash ? getAvatar(true, grant?.workspace?.title) : getUrlForIPFSHash(grant?.workspace?.logoIpfsHash!)}
							boxSize='20rem'
						/>
						<Text
							mt={6}
							variant='heading2'
							fontWeight='500'>
							Fantastic — we have received
							your proposal.
						</Text>
					</Flex>
					<Flex
						bg='white'
						w='50%'
						h='100%'
						direction='column'
						align='start'
						justify='center'
						px='10%'>
						<Text
							fontWeight='500'
							variant='subheading'>
							Subscribe to notifications
						</Text>
						<Text mt={3}>
							Get notified on Telegram when your proposal is viewed, and reviewed
							by grant managers.
						</Text>
						<Flex
							mt={6}
							gap={6}>
							<Button
								variant='primaryLarge'
								onClick={() => setIsSetupNotificationModalOpen(true)}>
								<Text
									color='white'
									fontWeight='500'>
									Subscribe
								</Text>
							</Button>
							<Button
								variant='link'
								color='accent.azure'
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
								}>
								I&apos;ll do it later
							</Button>
						</Flex>
						<Text
							fontWeight='500'
							variant='subheading'
							fontSize='18px'
							mt={4}
						>
							 Propel Your Projects Forward with Questbook
						</Text>
						<Flex
							mt={6}
							gap={6}>
							<Button
								variant='primaryLarge'
								onClick={() => window.open(`https://twitter.com/intent/tweet?text=${SocialIntent[Math.floor(Math.random() * SocialIntent.length)]}&url=${window.location.origin}/dashboard/?grantId=${grant?.id}%26chainId=${chainId}%26proposalId=${proposalId}`, '_blank')}
								leftIcon={<Twitter />}
							>
								<Text
									color='white'
									fontWeight='500'>
									Share on Twitter
								</Text>
							</Button>
						</Flex>
						<SetupNotificationModal
							isOpen={isSetupNotificationModalOpen}
							onClose={() => setIsSetupNotificationModalOpen(false)}
							type='proposal'
							proposalId={proposalId!} />
					</Flex>
				</Flex>
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
					{
						disabledTonGrants.includes(grant?.id as string) && (
							<>
								<Box
									bgColor='gray.200'
									padding={[5, 5]}
									justifyContent='flex-start'
									maxWidth='100%'
									overscroll='auto'
									maxHeight='400px'
									mb={6}
								>


									<Text
										fontWeight='500'
										color='black.100'
										fontSize='14px'
										textAlign='center'
										mx={2}
									>
										All the grant information and proposals have moved to TON Grants page,

										<Text
											fontWeight='500'
											fontSize='14px'
											as='a'
											href={`${window.location.origin}/proposal_form/?grantId=${tonGrants}&chainId=10&newTab=true`}
											target='_blank'
											color='blue.500'
											mx={2}>
											please visit there for more info
										</Text>
									</Text>

								</Box>

							</>
						)
					}
					{
						disabledGrants?.includes(grant?.id as string) &&
						type === 'submit' &&
						(
							<Flex
								justify='center'
								mb={4}
								w='100%'
								bg='gray.200'
							>
								<Banner message='The domain is closed until further notice as the funds have been fully allocated.' />
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

	const customTONformComponent = () => {

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

						<Flex alignItems='center'>
							<Image
								src='/v2/images/tonBanner.png'
								alt='banner'
								width='100%'
								height='100%'
							/>
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
								 />
								{/* <Divider
									orientation='vertical'
									h='100%' /> */}


							</Flex>
						</Container>


						<Flex
							mt={4}

							fontWeight='800'
							lineHeight='1.5'
							color='black.100'
							gap={2}

						>
							<Alert
								mt={1}
								w='20px'
							/>


							<Text
								fontWeight='800'
								lineHeight='1.5'
								color='black.100'
								gap={2}
							>
								Disclaimer: Before submitting your application, please kindly study

								<Text
									as='a'
									mx={1}
									color='accent.azure'
									href='https://github.com/ton-society/grants-and-bounties/blob/main/grants/GRANT_PROGRAM_GUIDELINES.md'
									target='_blank'
									rel='noreferrer'
									variant='heading4'
								>
									TON Grants Program Guidelines
								</Text>


								and
								<Text
									as='a'
									mx={1}
									color='accent.azure'
									href='https://github.com/ton-society/ecosystem-map'
									target='_blank'
									rel='noreferrer'
									variant='heading4'
								>
									TON Ecosystem Map.
								</Text>
								Note that applications that do not comply with the Guidelines will be automatically rejected.
							</Text>
						</Flex>

						{/* Builder Details */}
						{
							(
								grant?.fields?.filter((field) => field.id.substring(field.id.indexOf('.') + 1).includes('Grant category')).map((field) => {
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
											type='select'
											value={findFieldBySuffix(form, modifiedId, id).value}
											onChange={
												(e) => {
													logger.info({ e, id, modifiedId, field: findFieldBySuffix(form, modifiedId, id) }, 'Select')
													onChange(e, findFieldBySuffix(form, modifiedId, id).id)
												}
											} />
									)
								}))
						}

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
							containsField(grant, 'applicantAddress') && (
								<SectionInput
									label='TON Wallet Address'
									placeholder='Wallet to receive funds on TON'
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
						{
							(
								grant?.fields?.filter((field) => field.id.substring(field.id.indexOf('.') + 1).includes('Personal Telegram Handle')).map((field) => {
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
											placeholder='@telegram_handle'
											value={findFieldBySuffix(form, modifiedId, id).value}
											onChange={
												(e) => {
													onChange(e, findFieldBySuffix(form, modifiedId, id).id)
												}
											} />
									)
								}))
						}
						{/* Project Details */}
						<SectionHeader mt={8}>
							Project Details
						</SectionHeader>
						{
							(

								grant?.fields?.filter((field) => ['Website', 'Pitch deck (if available)', 'Twitter', 'Telegram Channel', 'Telegram Bot (if available)', 'Github Link']?.
									some((title) => field.title.substring(field.title.indexOf('-') + 1).includes(title))).map((field) => {

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
								}))
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
						 (
								grant?.fields?.filter((field) => field.id.substring(field.id.indexOf('.') + 1).includes('Your idea in 1 sentence')).map((field) => {
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
								}))
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
									placeholder='What is the Problem you are solving? What is your Solution to this problem? Please provide link to your product demo or design frames, if available'
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
							(
								<>
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
														label: 'Deadline',
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
										label='Total Funding Requested'
										isDisabled
										placeholder='12000 USD'
										value={`${fundingAsk} ${chainInfo?.label}`}
									/>
								</>
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
							grant?.fields?.filter((field) => field.id.substring(field.id.indexOf('.') + 1).startsWith('customField')
							&& !['Personal Telegram Handle', 'Grant category', 'Your idea in 1 sentence', 'Website', 'Pitch deck (if available)', 'Twitter', 'Telegram Channel', 'Telegram Bot (if available)', 'Github Link']?.some((el) => field.id?.substring(field.id.indexOf('.') + 1).includes(el))
							)?.sort((a, b) => {
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

	const isDisabled = useMemo(() => {
		if(!form) {
			logger.info('Form is not initialised')
			return true
		}

		const optionalFields = ['projectDetails', 'fundingAsk', 'fundingBreakdown', 'projectGoals', 'projectLink']
		const { fields, members, details, milestones } = form
		for(const field of fields) {
			if(field.value === '' && !optionalFields.includes(field.id)) {
				logger.info({ field }, 'Field is empty')
				return true
			}
		}

		if((disabledGrants?.includes(grant?.id as string) || disabledTonGrants?.includes(grant?.id as string)) && type === 'submit') {
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