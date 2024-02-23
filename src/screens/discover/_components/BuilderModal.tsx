import { useCallback, useContext, useEffect, useState } from 'react'
import { BsGithub } from 'react-icons/bs'
import { Button, Container, Flex, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import Image from 'next/image'
import { createBuilder } from 'src/generated/mutation/createBuilder'
import { executeMutation } from 'src/graphql/apollo'
import { DiscoverContext } from 'src/screens/discover/Context'
import { useGithub } from 'src/screens/discover/hooks/github'

function BuildersModal() {
	const StepIndicator = ({ step }: { step: number }) => (
		<Flex
			gap={1}
			alignSelf='stretch'
			flexDirection='column'
			width='100%'
		>
			<Text
				color='#7E7E8F'
				fontSize='14px'
				fontWeight='400'
				lineHeight='150%'
			>
				Step
				{' '}
				{step}
				{' '}
				of 2
			</Text>
			<Flex
				gap={1}
				alignSelf='stretch'
				width='100%'
			>
				<Container
					width='100%'
					className='firstStep'
					borderRadius='8px'
					bgColor={step > 0 ? '#699804' : 'gray.200'}
					height='4px'
					maxW='100%'
				/>
				<Container
					width='100%'
					borderRadius='8px'
					bgColor={step > 1 ? '#699804' : 'gray.200'}
					height='4px'
				/>
			</Flex>
		</Flex>
	)
	const buildComponent = () => {
		return (
			<Modal
				isOpen={buildersModal}
				size='xl'
				onClose={
					() => {
						setBuildersModal(false)
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
						Get recommended to Grant Managers
						<ModalCloseButton
							mt={1}
						/>
					</ModalHeader>
					<ModalBody>
						{
							submitted ? (
								<Flex
									direction='column'
									alignContent='center'
									alignItems='center'
									w='100%'
									gap='24px'
									padding='120px 10px'
									justifyContent='center'
									mx='auto'
									h='100%'>

									<Image

										src='/v2/icons/checkBox.svg'
										alt='check'
										width={64}
										height={64} />
									<Text

										color='#699804'
										textAlign='center'
										fontSize='18px'
										fontStyle='normal'
										fontWeight='700'
										lineHeight='135%'
									>
										Details Submitted
									</Text>
									<Text
										color='#7E7E8F'
										textAlign='center'
										fontSize='16px'
										fontStyle='normal'
										fontWeight='400'
										lineHeight='150%'
									>
										Thanks for these details, Questbook will recommend which grant suits best and keep you updated on all grants.
									</Text>

								</Flex>
							)
								: (
									<Flex
										direction='column'
										alignContent='center'
										w='100%'
										gap='24px'
										padding='32px 10px'
										mx='auto'
										h='100%'>
										<StepIndicator
											step={telegram.length > 0 && github.username?.length > 0 ? 2 : 1}
										/>
										<Flex
											direction='column'
										>
											<Text
												fontWeight='500'
												color='#07070C'
												fontSize='18px'
												mt={2}
											>
												Telegram
											</Text>

											<Input
												placeholder='Enter your Telegram username'
												mt={2}
												value={telegram}
												onChange={(e) => setTelegram(e.target.value)}
												borderRadius='8px'
												border='1px solid #7E7E8F'
												padding='16px'
												fontSize='16px'
												fontWeight='400'
												color='#7E7E8F'
											/>
										</Flex>
										<Flex
											direction='column'
										>
											<Text
												fontWeight='500'
												color='#07070C'
												fontSize='18px'
											>
												Github
											</Text>
											<Flex
												direction='row'
												justifyContent='stretch'
												alignItems='center'
											>
												<Text

												>
													{github.username?.length > 0 ? github.username : 'Connect your GitHub'}
												</Text>

												<Button
													ml='auto'
													bgColor='white'
													fontWeight='400'
													fontSize='16px'
													border={`1px solid ${github.username?.length > 0 ? '#699804' : '#E1DED9'}`}
													rightIcon={
														github.username?.length > 0 ? (
															<Image
																src='v2/icons/checkBox.svg'
																alt='check'
																width={16}
																height={16}
															/>
														) : <BsGithub />
													}
													onClick={
														() => {


															if(github.username?.length === 0) {
																if(telegram.length > 0) {
																	localStorage.setItem('telegram', telegram)
																}

																window.location.href = 'https://github.com/login/oauth/authorize?client_id=f4324d910496e5a88c54'
															}
														}
													}>

													{github.username?.length > 0 ? 'Connected' : 'Connect'}
												</Button>
											</Flex>
										</Flex>

										<Text
											color='#854D0E'
											fontWeight='400'
											lineHeight='130%'
											fontSize='14px'
											mt={2}
											border='1px solid #FACC15'
											padding='16px'
											borderRadius='8px'
										>

											We&apos;ll share your details with the grant managers based on your GitHub details, we&apos;ll keep you posted via telegram

										</Text>
										<Button
											mt={4}
											bgColor='#77AC06'
											_hover={{ bgColor: '#77AC06' }}
											color='white'
											isDisabled={telegram.length === 0 || github.username?.length === 0}
											borderRadius='8px'
											shadow='0px 1px 2px 0px rgba(22, 22, 22, 0.12)'
											fontSize='16px'
											fontWeight='600'
											onClick={
												async() => {
													await executeMutation(createBuilder, {
														telegram,
														github: {
															username: github.username,
															repos: github.repos,
															token: token
														}
													})
													setTelegram('')
													setToken('')
													setGithub({
														username: '',
														repos: 0
													})
													setSubmitted(true)
												}
											}
										>
											Submit
										</Button>
									</Flex>
								)
						}


					</ModalBody>
				</ModalContent>
			</Modal>
		)
	}

	const [telegram, setTelegram] = useState('')
	const [github, setGithub] = useState({
		username: '',
		repos: 0,
	})
	const [token, setToken] = useState('')
	const [submitted, setSubmitted] = useState(false)

	const getGithubData = useCallback(async(token: string) => {
		const data = await useGithub(token)
		setGithub({
			username: data.username,
			repos: data.repos
		})
		window.history.replaceState({}, document.title, window.location.pathname)
		localStorage.removeItem('telegram')
		return 'github-fetched'
	}, [token])

	useEffect(() => {
		const token = new URLSearchParams(window.location.search).get('access_token')
		const telegram = localStorage.getItem('telegram')

		if(token) {
			setTelegram(telegram || '')
			setToken(token)
			getGithubData(token)
		}
	}, [])
	const { buildersModal, setBuildersModal } = useContext(DiscoverContext)!
	return buildComponent()

}

export default BuildersModal