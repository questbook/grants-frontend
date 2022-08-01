import React, { useContext, useEffect, useState } from 'react'
import {
	Box, Divider, Drawer, DrawerContent, DrawerOverlay, Flex, Image,
	Input,	Progress,	RangeSlider,
	RangeSliderFilledTrack,
	RangeSliderThumb,	RangeSliderTrack,
	Skeleton,	Spacer, Text } from '@chakra-ui/react'
import { formatEther } from 'ethers/lib/utils'
import { ApiClientsContext } from 'pages/_app'
import { SupportedChainId } from 'src/constants/chains'
import { CHAIN_INFO } from 'src/constants/chains'
import useQBContract from 'src/hooks/contracts/useQBContract'
import useSetRubrics from 'src/hooks/useSetRubrics'
import useSubmitPublicKey from 'src/hooks/useSubmitPublicKey'
import useCustomToast from 'src/hooks/utils/useCustomToast'
import { GasStation } from 'src/v2/assets/custom chakra icons/GasStation'
import { NetworkSelectOption } from 'src/v2/components/Onboarding/SupportedNetworksData'
import { useAccount, useProvider } from 'wagmi'

function RubricDrawer({
	rubricDrawerOpen,
	setRubricDrawerOpen,
	rubrics,
	setRubrics,
	rubricEditAllowed,
	maximumPoints,
	setMaximumPoints,
	grantAddress,
	chainId,
	workspaceId,
	initialIsPrivate,
}: {
  rubricDrawerOpen: boolean;
  setRubricDrawerOpen: (rubricDrawerOpen: boolean) => void;
  rubrics: any[];
  setRubrics: (rubrics: any[]) => void;
  rubricEditAllowed: boolean;
  maximumPoints: number;
  setMaximumPoints: (maximumPoints: number) => void;
  grantAddress: string;
  chainId: SupportedChainId;
  workspaceId: string;
  initialIsPrivate: boolean;
}) {
	const [shouldEncryptReviews, setShouldEncryptReviews] = React.useState(false)
	const [gasEstimate, setGasEstimate] = React.useState<any>('')
	const [daoNetwork, setDaoNetwork] = useState<NetworkSelectOption>()

	useEffect(() => {
		if(initialIsPrivate) {
			setShouldEncryptReviews(true)
		}
	}, [initialIsPrivate])

	const [editedRubricData, setEditedRubricData] = React.useState<any>()
	const [setupStep, setSetupStep] = useState(0)

	const [pk, setPk] = React.useState<string>('*')
	const { data: accountData } = useAccount()
	const { workspace } = useContext(ApiClientsContext)!

	const {
		RenderModal,
		setHiddenModalOpen: setHiddenPkModalOpen,
		transactionData,
		publicKey: newPublicKey,
	} = useSubmitPublicKey()

	useEffect(() => {
		if(transactionData && newPublicKey && newPublicKey.publicKey) {
			console.log(newPublicKey)
			setPk(newPublicKey.publicKey)
			const rubric = {} as any

			if(rubrics.length > 0) {
				rubrics.forEach((r, index) => {
					rubric[index.toString()] = {
						title: r.name,
						details: r.description,
						maximumPoints,
					}
				})
			}

			console.log('rubric', rubric)
			setEditedRubricData({
				rubric: {
					isPrivate: shouldEncryptReviews,
					rubric,
				},
			})
		}

	}, [transactionData, newPublicKey])

	useEffect(() => {
		/// console.log(pk);
		if(!accountData?.address) {
			return
		}

		if(!workspace) {
			return
		}

		const k = workspace?.members?.find(
			(m) => m.actorId.toLowerCase() === accountData?.address?.toLowerCase(),
		)?.publicKey?.toString()
		// console.log(k);
		if(k && k.length > 0) {
			setPk(k)
		} else {
			setPk('')
		}

	}, [workspace, accountData])

	const handleOnSubmit = () => {
		let error = false
		if(rubrics.length > 0) {
			const errorCheckedRubrics = rubrics.map((rubric: any) => {
				const errorCheckedRubric = { ...rubric }
				if(rubric.name.length <= 0) {
					errorCheckedRubric.nameError = true
					error = true
				}

				if(rubric.description.length <= 0) {
					errorCheckedRubric.descriptionError = true
					error = true
				}

				return errorCheckedRubric
			})
			setRubrics(errorCheckedRubrics)
		}

		if(!error) {
			if(shouldEncryptReviews && (!pk || pk === '*')) {
				setHiddenPkModalOpen(true)
				return
			}

			const rubric = {} as any

			if(rubrics.length > 0) {
				rubrics.forEach((r, index) => {
					rubric[index.toString()] = {
						title: r.name,
						details: r.description,
						maximumPoints,
					}
				})
			}

			console.log('rubric', rubric)
			setEditedRubricData({
				rubric: {
					isPrivate: shouldEncryptReviews,
					rubric,
				},
			})
		}
	}

	const [
		data,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		transactionLink,
		loading,
	] = useSetRubrics(editedRubricData, chainId, workspaceId, grantAddress)

	const { setRefresh } = useCustomToast(transactionLink)

	useEffect(() => {
		if(data) {
			setRubricDrawerOpen(false)
			setRefresh(true)
		}
	}, [data, setRubricDrawerOpen])

	const applicationReviewContract = useQBContract('reviews', chainId)
	const provider = useProvider()
	const estimateSetRubric = async() => {
		setGasEstimate(undefined)
		try {
			const estimate = await applicationReviewContract.estimateGas.setRubrics(workspaceId, grantAddress, 'bafkreiboy5njxjyusnps6oayqg7famhocgymhaqp5p53p2kd6fhzhxqiny')
			const gasPrice = await provider.getGasPrice()
			setGasEstimate(formatEther(estimate.mul(gasPrice)))
		} catch(e) {
			console.log(e)
		}
	}

	useEffect(() => {
		if(applicationReviewContract.signer !== null && provider !== null) {
			estimateSetRubric()
		}
	}, [applicationReviewContract, provider])

	return (
		<>
			<Drawer
				isOpen={rubricDrawerOpen}
				placement="right"
				onClose={() => setRubricDrawerOpen(false)}
				size="lg"
			>
				<DrawerOverlay />
				<DrawerContent backgroundColor="#F5F5FA">

					<Flex
						direction="column"
						overflow="scroll"
						height="812px"
					>
						{/* <Flex
							mb={8}
							alignItems="center"
						>
							<Text
								color="#122224"
								fontWeight="bold"
								fontSize="24px"
								lineHeight="20px"
								mr="auto"
							>
                Scoring Rubric
							</Text>
							<Image
								src="/ui_icons/close_drawer.svg"
								cursor="pointer"
								h="20px"
								w="20px"
								onClick={() => setRubricDrawerOpen(false)}
							/>
						</Flex> */}
						<Flex
							backgroundColor="#FFFFFF"
							alignItems="flex-start"
							padding="16px">
							<Flex position="relative">
								<Image
									src="/ui_icons/drawer_top_logo.svg"
									mr="8" />
								<Image
									src="/ui_icons/drawer_top_logo_inside.svg"
									mr="8"
									position="absolute"
									top="30%"
									left="4%" />
								<Box >
									<Text
										fontWeight="500"
										fontSize="20px"
										lineHeight="24px"
										color="#1F1F33">
Setup applicant evaluation
									</Text>
									<Text
										fontWeight="400"
										fontSize="14px"
										lineHeight="20px"
										color="#7D7DA0">
Define a scoring rubric and assign reviewers.
									</Text>
								</Box>
							</Flex>
							<Spacer />
							<Image
								src="/ui_icons/close_drawer.svg"
								cursor="pointer"
								h="20px"
								w="20px"
								onClick={
									() => {
										setRubricDrawerOpen(false); setSetupStep(0)
									}
								}
							/>
						</Flex>

						<Flex
							flexDirection="column"
							alignItems="flex-start"
							mt={10}>

							<Flex>
								<Flex
									flexDirection="column"
									ml={24} >
									<Progress
										colorScheme={setupStep ? 'blackAlpha' : 'messenger'}
										value={100}
										borderRadius="100px"
										w="200px"
										h="4px" />
									<Flex>
										<Image
											src={setupStep ? '/ui_icons/setup_evaluation_black_bullet.svg' : '/ui_icons/setup_evaluation_blue_bullet.svg'}
											h="20px"
											w="20px"
										/>
										<Text
											fontWeight="500"
											fontSize="12px"
											lineHeight="16px"
											color={setupStep ? '#1F1F33' : '#4C9AFF'}>
Scoring Rubric
										</Text>
									</Flex>
								</Flex>

								<Flex
									flexDirection="column"
									ml={4}>
									<Progress
										colorScheme={setupStep ? 'messenger' : '#D2D2E3'}
										value={100}
										borderRadius="100px"
										w="200px"
										h="4px" />
									<Flex>
										<Image
											src={setupStep ? '/ui_icons/setup_evaluation_blue_bullet.svg' : '/ui_icons/setup_evaluation_transparent_bullet.svg'}
											h="20px"
											w="20px"
										/>
										<Text
											fontWeight="500"
											fontSize="12px"
											lineHeight="16px"
											color={setupStep ? '#4C9AFF' : '#AFAFCC'}>
Reviewers
										</Text>
									</Flex>
								</Flex>
							</Flex>

							<Flex
								alignItems="flex-start"
								padding="16px"
								gap="16px">
								{!setupStep && <Image src="/ui_icons/scoring_rubric_logo.svg" />}
								{setupStep > 0 && <Image src="/ui_icons/assign_reviewers_red.svg" />}
								<Box>
									<Text
										fontWeight="500"
										fontSize="16px"
										lineHeight="24px"
										color="#1F1F33">
										{setupStep ? 'Assign Reviewers' : 'Scoring Rubric'}
									</Text>
									<Text
										fontWeight="500"
										fontSize="14px"
										lineHeight="20px"
										color="#7D7DA0"

										letterSpacing="0.5px">
										<Text
											as="span"
											color="#7D7DA0"
											fontWeight="400"
											letter-spacing="0.5px">
											{' '}
											{setupStep ? 'Reviewers are auto assigned equally.' : 'Total score is the sum of quality scores.'}
											{' '}
										</Text>
										{setupStep ? 'Learn about auto assign' : 'Learn about scores'}
									</Text>
								</Box>
							</Flex>

						</Flex>
						<Flex
							direction="column"
							backgroundColor="#FFFFFF"
							ml={20}
						>
							<Text
								color="#1F1F33"
								fontWeight="500"
								fontSize="14px"
								lineHeight="20px">
								{setupStep ? 'Select the number of reviewers assigned per applicant' : 'Scoring Qualities'}
							</Text>
							{
								!setupStep && (
									<Text
										color="#7D7DA0"
										fontWeight="400"
										fontSize="12px"
										lineHeight="20px">
Define the quality, and add a description
									</Text>
								)
							}
							{
								setupStep && (
									<RangeSlider
										defaultValue={[20]}
										step={20}>
										<RangeSliderTrack>
											<RangeSliderFilledTrack
												background='linear-gradient(90deg, #0065FF 0%, #00FFA3 100%)'
											/>
										</RangeSliderTrack>
										<RangeSliderThumb
											boxSize={4}
											index={0}>
	  <Box
												width="50px"
												height="24px">
	  <Image
													src="/ui_icons/slider_thumb_blue.svg"
													width="50px"
													height="24px" />
	  </Box>
										</RangeSliderThumb>
									</RangeSlider>
								)
							}
						</Flex>
						{
							!setupStep &&
							rubrics.map((rubric, index) => (
								<>
									<Flex
										flexDirection="column"
										gap="2"
										alignItems="flex-start"
										backgroundColor="#FFFFFF"
									>
										{/* <Flex
											direction="column"
											flex={0.3327}>
											<Text
												mt="18px"
												color="#122224"
												fontWeight="bold"
												fontSize="16px"
												lineHeight="20px"
											>
                      Criteria
												{' '}
												{index + 1}
											</Text>
										</Flex> */}
										<Flex
											justifyContent="center"
											gap={2}
											margin={2}
											alignItems="center"
											backgroundColor="#FFFFFF"
											flex={0.6673}>
											<Input

												variant='flushed'
												value={rubrics[index].name}
												onChange={
													(e) => {
														const newRubrics = [...rubrics]
														newRubrics[index].name = e.target.value
														newRubrics[index].nameError = false
														setRubrics(newRubrics)
													}
												}
												placeholder="َQuality"
												borderColor={rubrics[index].nameError || rubrics[index].name.length > 30 ? 'red' : 'inherit'}
												isDisabled={!rubricEditAllowed}

											/>

										</Flex>
										<Flex
											flexDirection="row"
											width="250px">
											<Spacer />
											<Box>
												{rubrics[index].name.length}
/30
											</Box>
										</Flex>
									</Flex>
									<Flex
										flexDirection="column"
										gap="2"
										alignItems="flex-start"
										backgroundColor="#FFFFFF"
										opacity={rubricEditAllowed ? 1 : 0.4}>
										{/* <Flex
											direction="column"
											flex={0.3327}>
											<Text
												mt="18px"
												color="#122224"
												fontWeight="bold"
												fontSize="16px"
												lineHeight="20px"
											>
                      Description
											</Text>
										</Flex> */}
										<Flex
											justifyContent="center"
											gap={2}
											alignItems="center"
											backgroundColor="#FFFFFF"
											flex={0.6673}>
											<Input
												variant='flushed'
												value={rubrics[index].description}
												onChange={
													(e) => {
														const newRubrics = [...rubrics]
														newRubrics[index].description = e.target.value
														newRubrics[index].descriptionError = false

														setRubrics(newRubrics)
													}
												}
												placeholder="Description"
												borderColor={rubrics[index].descriptionError || rubrics[index].description.length > 100 ? 'red' : 'inherit'}
												isDisabled={!rubricEditAllowed}
											/>
										</Flex>
										<Flex
											flexDirection="row"
											width="250px">
											<Spacer />
											<Box>
												{rubrics[index].description.length}
/100
											</Box>
										</Flex>
									</Flex>

									{/* <Flex
										mt={2}
										gap="2"
										justifyContent="flex-end">
										<Box
											onClick={
												() => {
													if(!rubricEditAllowed) {
														return
													}

													const newRubrics = [...rubrics]
													newRubrics.splice(index, 1)
													setRubrics(newRubrics)
												}
											}
											display="flex"
											alignItems="center"
											cursor="pointer"
											opacity={rubricEditAllowed ? 1 : 0.4}
										>
											<Image
												h="16px"
												w="15px"
												src="/ui_icons/delete_red.svg"
												mr="6px"
											/>
											<Text
												fontWeight="500"
												fontSize="14px"
												color="#DF5252"
												lineHeight="20px">
                      Delete
											</Text>
										</Box>
									</Flex> */}
									<Divider mt={4} />
								</>
							))
						}

						{
							!setupStep && (
								<Flex
									mt="19px"
									gap="2"
									justifyContent="flex-start">
									<Box
										onClick={
											() => {
												if(!rubricEditAllowed) {
													return
												}

												const newRubrics = [...rubrics, {
													name: '',
													nameError: false,
													description: '',
													descriptionError: false,
												}]
												setRubrics(newRubrics)
											}
										}
										display="flex"
										alignItems="center"
										cursor="pointer"
										opacity={rubricEditAllowed ? 1 : 0.4}
									>
										<Image
											h="16.67px"
											w="16.67px"
											src="/ui_icons/plus_circle_blue.svg"
											mr="6px"
										/>
										<Text
											fontWeight="500"
											fontSize="14px"
											color="#0065FF"
											lineHeight="20px">
                  Add another quality
										</Text>
									</Box>
								</Flex>
							)
						}
						{/* <Flex
							opacity={rubricEditAllowed ? 1 : 0.4}
							direction="column"
							mt={6}>
							<Text
								fontSize="18px"
								fontWeight="700"
								lineHeight="26px"
								letterSpacing={0}
							>
                Evaluation Rating
							</Text>
							<Box
								mt={2}
								minW="399px"
								flex={0}>
								<Dropdown
									listItems={
										maximumPoints === 3 ? [{
											label: '3 point rating',
											id: '3',
										}, {
											label: '5 point rating',
											id: '5',
										}] : [{
											label: '5 point rating',
											id: '5',
										}, {
											label: '3 point rating',
											id: '3',
										}]
									}
									onChange={
										rubricEditAllowed ? ({ id }: any) => {
											setMaximumPoints(parseInt(id, 10))
										} : undefined
									}
									listItemsMinWidth="300px"
								/>
							</Box>
						</Flex>

						<Flex
							mt={8}
							gap="2"
							justifyContent="space-between">
							<Flex
								direction="column"
								flex={1}>
								<Text
									color="#122224"
									fontWeight="bold"
									fontSize="16px"
									lineHeight="20px"
								>
                  Keep applicant reviews private
								</Text>
								<Flex>
									<Text
										color="#717A7C"
										fontSize="14px"
										lineHeight="20px">
                    Private review is only visible to reviewers, DAO members.
									</Text>
								</Flex>
							</Flex>
							<Flex
								ml="auto"
								justifyContent="center"
								gap={2}
								alignItems="center">
								<Switch
									id="encrypt"
									defaultChecked={initialIsPrivate}
									onChange={
										(e) => {
											setShouldEncryptReviews(e.target.checked)
										}
									}
								/>
								<Text
									fontSize="12px"
									fontWeight="bold"
									lineHeight="16px">
									{`${shouldEncryptReviews ? 'YES' : 'NO'}`}
								</Text>
							</Flex>
						</Flex>

						<Text
							variant="footer"
							mt={8}
							mb={7}
							maxW="400">
							<Image
								display="inline-block"
								h="10px"
								w="10px"
								src="/ui_icons/info_brand.svg"
							/>
							{' '}
              By clicking Publish Grant you&apos;ll have to approve this transaction
              in your wallet.
							{' '}
							<Link
								href="https://www.notion.so/questbook/FAQs-206fbcbf55fc482593ef6914f8e04a46"
								isExternal
							>
                Learn more
							</Link>
							{' '}
							<Image
								display="inline-block"
								h="10px"
								w="10px"
								src="/ui_icons/link.svg"
							/>
						</Text>

						<Box mt={12}>
							<Button
								mt="auto"
								variant="primary"
								onClick={handleOnSubmit}>
								{
									!loading ? 'Save' : (
										<Loader />
									)
								}
							</Button>
						</Box> */}
						<Spacer />
						<Flex
							backgroundColor="#FFFFFF"
							alignItems="flex-start"
							padding="16px">
							{
								setupStep && (
									<Skeleton isLoaded={gasEstimate !== undefined}>
										<Flex
											bg={'#F0F0F7'}
											borderRadius={'base'}
											px={3}>
											<GasStation
												color={'#89A6FB'}
												boxSize={5} />
											<Text
												ml={2}
												mt={'1.5px'}
												fontSize={'xs'}>
              Network Fee -
												{' '}
												{gasEstimate}
												{' '}
												{CHAIN_INFO[chainId].nativeCurrency.symbol}
											</Text>
										</Flex>
									</Skeleton>
								)
							}
							<Spacer />

							<Flex
								alignItems="center"
								padding="6px 20px"
								w="153px"
								h="40px"
								background={setupStep ? '#1F1F33' : '#E0E0EC'}
								borderRadius="3px"
								cursor="pointer"
								onClick={
									setupStep ? () => {
										handleOnSubmit()
									} :
										() => {
											setSetupStep(1)
										}
								}
							>
								<Text
									width="113px"
									height="24px"
									fontWeight="500"
									fontSize="16px"
									lineHeight="24px"
									textAlign="center"
									color="#FFFFFF">
									{setupStep ? 'Confirm' : 'Next'}
								</Text>
							</Flex>
						</Flex>
					</Flex>
				</DrawerContent>
			</Drawer>

			<RenderModal />

		</>
	)
}

export default RubricDrawer
