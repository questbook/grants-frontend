import { useState } from 'react'
import { Box, Button, Container, Drawer, DrawerContent, DrawerOverlay, Flex, Text } from '@chakra-ui/react'
import { CancelCircleFilled } from 'src/v2/assets/custom chakra icons/CancelCircleFilled'
import { FishEye } from 'src/v2/assets/custom chakra icons/FishEye'
import { SetupEvaluation } from 'src/v2/assets/custom chakra icons/SetupEvaluation'
import AssignReviewers from './AssignReviewers'
import RubricsForm from './RubricsForm'

const SetupEvaluationDrawer = ({
	isOpen,
	onClose,
	onComplete,
}: {
  isOpen: boolean;
  onClose: () => void;
	onComplete: () => void;
}) => {

	const [step, setStep] = useState(0)

	return (
		<Drawer
			placement='right'
			isOpen={isOpen}
			onClose={
				() => {
					onClose()
				}
			}
			closeOnOverlayClick={false}
		>
			<DrawerOverlay maxH="100vh" />
			<DrawerContent
				minW={528}
				// h="min(90vh, 560px)"
				overflowY="auto"
				borderRadius="4px">
				<Container
					px={6}
					py={4}
					display='flex'
					flexDirection={'column'}
					minH='100vh'
				 >


					<Flex
						direction="row"
						align="center">
						<Flex
							bg='#D1D7F4'
							h='48px'
							w='48px'
							borderRadius='2px'
							alignItems='center'
							justifyContent='center'
						>
							<SetupEvaluation
								color='#036AFF'
								h='28px'
								w='28px' />
						</Flex>

						<Flex
							ml={2}
							mr='auto'
							flexDirection='column'>
							<Text
								fontSize='20px'
								lineHeight='24px'
								fontWeight='500'
							>
							Setup applicant evaluation
							</Text>
							<Text
								fontSize='14px'
								lineHeight='20px'
								fontWeight='400'
								mt={1}
								color='#7D7DA0'
							>
							Define a scoring rubric and assign reviewers.
							</Text>
						</Flex>

						<CancelCircleFilled
							mb='auto'
							color='#7D7DA0'
							h={6}
							w={6}
							onClick={
								() => {
									onClose()
								}
							}
							cursor='pointer'
						/>
					</Flex>

					<Flex
						my={4}
						mx={'-24px'}
						bg='#F0F0F7'
						h={'1px'}
					/>

					<Flex
						maxH={'calc(100vh - 32px)'}
						overflowY={'scroll'}
						direction={'column'}>
						<Flex>
							<Flex
								flex={1}
								direction={'column'}
							>
								<Box
									bg={step === 0 ? '#785EF0' : '#E0E0EC'}
									borderRadius='20px'
									height={1}
								/>

								<Flex
									mt={2}
									color={step === 0 ? '#785EF0' : '#E0E0EC'}>
									{
										step === 0 ? (
											<FishEye
												h={'14px'}
												w={'14px'} />
										) : (
											<Box
												border='1px solid #E0E0EC'
												borderRadius='20px'
												height={'14px'}
												width={'14px'}
											/>
										)
									}
									<Text
										fontSize='12px'
										lineHeight='16px'
										fontWeight='500'
										ml={1}
										color={step === 0 ? '#785EF0' : '#1F1F33'}
									>
										Scoring rubric
									</Text>
								</Flex>
							</Flex>
							<Box w={1} />
							<Flex
								flex={1}
								direction={'column'}
							>
								<Box
									bg={step === 1 || step === 2 ? '#785EF0' : '#E0E0EC'}
									borderRadius='20px'
									height={1}
								/>

								<Flex
									mt={2}
									color={step === 1 || step === 2 ? '#785EF0' : '#E0E0EC'}>
									{
										step === 1 || step === 2 ? (
											<FishEye
												h={'14px'}
												w={'14px'} />
										) : (
											<Box
												border='1px solid #E0E0EC'
												borderRadius='20px'
												height={'14px'}
												width={'14px'}
											/>
										)
									}
									<Text
										fontSize='12px'
										lineHeight='16px'
										fontWeight='500'
										ml={1}
										color={step === 1 || step === 2 ? '#785EF0' : '#1F1F33'}
									>
										Assign reviewers
									</Text>
								</Flex>
							</Flex>
						</Flex>

						<Box mt={6} />

						{
							step === 0 ? (
								<RubricsForm />
							) : <AssignReviewers />
						}
					</Flex>

					<Flex
						mt={'auto'}
						bg='#F0F0F7'
						h={'1px'}
						mx={'-24px'}
					/>

					<Flex
						mt={4}
						direction="row"
						align="center">

						<Button
							ml='auto'
							colorScheme={'brandv2'}
							// disabled={step === 0 ? milestoneId === undefined || amount === undefined : step === 1}
							onClick={
								() => {
									if(step === 0) {
										setStep(1)
									}

									if(step === 2) {
										onComplete()
									}
								}
							}>
							{step === 0 ? 'Continue' : 'Initiate Transaction'}
						</Button>

					</Flex>


				</Container>
			</DrawerContent>
		</Drawer>
	)
}

export default SetupEvaluationDrawer