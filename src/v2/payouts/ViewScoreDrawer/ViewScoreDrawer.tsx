import { useState } from 'react'
import { Box, Button, Container, Drawer, DrawerContent, DrawerOverlay, Flex, Text } from '@chakra-ui/react'
import { CancelCircleFilled } from 'src/v2/assets/custom chakra icons/CancelCircleFilled'
import { SetupEvaluation } from 'src/v2/assets/custom chakra icons/SetupEvaluation'
// import AssignReviewers from './AssignReviewers'
import RubricsView from 'src/v2/payouts/ViewScoreDrawer/RubricsView'

const ViewScoreDrawer = ({
	isOpen,
	onClose,
	score,
	reviewer,
}: {
  isOpen: boolean
  onClose: () => void
  score?: {
		items?: {rating?: number, comment?: string, rubric: {title: string}}[]
		createdAtS: number
	}
	reviewer?: { id: string, name: string }
}) => {
	// The will be required while implementing edit rubrics
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
			<DrawerOverlay maxH='100vh' />
			<DrawerContent
				minW={528}
				// h="min(90vh, 560px)"
				overflowY='auto'
				borderRadius='4px'>
				<Container
					px={6}
					py={4}
					display='flex'
					flexDirection='column'
					minH='100vh'
				 >


					<Flex
						direction='row'
						align='center'>
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
								Score & comments
							</Text>
							<Text
								fontSize='14px'
								lineHeight='20px'
								fontWeight='400'
								mt={1}
								color='#7D7DA0'
							>
								Total score based on rubric, and comments by the reviewer.
							</Text>
						</Flex>

						<CancelCircleFilled
							mb='auto'
							color='#7D7DA0'
							h={6}
							w={6}
							onClick={
								() => {
									setStep(0)
									onClose()
								}
							}
							cursor='pointer'
						/>
					</Flex>

					<Flex
						my={4}
						mx='-24px'
						bg='#F0F0F7'
						h='1px'
					/>

					<Flex
						maxH='calc(100vh - 32px)'
						overflowY='scroll'
						direction='column'>


						<Box mt={4} />

						{/* {
							step === 0 ? (
								<RubricsView rubrics={grantData?.grants.length > 0 ? grantData.grants[0]?.rubric?.items : undefined} />
							) : <></>
						} */}

						{
							step === 0 ? (
								<RubricsView
									reviewer={reviewer}
									rubrics={score} />
							) : <></>
						}
					</Flex>

					<Flex
						mt='auto'
						bg='#F0F0F7'
						h='1px'
						mx='-24px'
					/>

					<Flex
						mt={4}
						direction='row'
						align='center'>

						<Button
							mr='auto'
							colorScheme='brandv2'
							// disabled={step === 0 ? milestoneId === undefined || amount === undefined : step === 1}
							onClick={
								() => {
									if(step === 0) {
										// setStep(1)
										onClose()
									}

									if(step === 2) {
										onClose()
									}
								}
							}>
							{step === 0 ? 'Ok' : 'Save'}
						</Button>

					</Flex>


				</Container>
			</DrawerContent>
		</Drawer>
	)
}

export default ViewScoreDrawer
