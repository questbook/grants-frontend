import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
	Box,
	Checkbox,
	CheckboxGroup,
	Divider,
	Drawer,
	DrawerContent,
	DrawerOverlay,
	Flex,
	Image,
	Input,
	Progress,
	RangeSlider,
	RangeSliderFilledTrack,
	RangeSliderMark,
	RangeSliderThumb,
	RangeSliderTrack,
	Spacer,
	Text,
	VStack,
} from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import { SupportedChainId } from 'src/constants/chains'
import { defaultChainId } from 'src/constants/chains'
import {
	useGetWorkspaceMembersByWorkspaceIdQuery,
	WorkspaceMember,
	WorkspaceMemberAccessLevel,
} from 'src/generated/graphql'
import useQBContract from 'src/hooks/contracts/useQBContract'
import useSubmitPublicKey from 'src/hooks/useSubmitPublicKey'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import NetworkFeeEstimateView from 'src/v2/components/NetworkFeeEstimateView'
import { NetworkSelectOption } from 'src/v2/components/Onboarding/SupportedNetworksData'
import { supportedNetworks } from 'src/v2/components/Onboarding/SupportedNetworksData'
import { useAccount } from 'wagmi'
import SetRubricsModal from './setRubricsModal'

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
	const [daoNetwork, setDaoNetwork] = useState<NetworkSelectOption>()

	// @TODO: change this value to whatever it should be.
	const [maxReviewrs, setMaxReviewrs] = useState<number>(5)

	useEffect(() => {
		if(initialIsPrivate) {
			setShouldEncryptReviews(true)
		}
	}, [initialIsPrivate])

	const [editedRubricData, setEditedRubricData] = React.useState<any>()
	const [setupStep, setSetupStep] = useState(false)
	const [isSetRubricsModalOpen, setIsSetRubricsModalOpen] = useState(false)
	const [membersCount, setMembersCount] = useState<number>(0)
	const [selctedMembers, setSelectedMembers] =
    useState<Partial<WorkspaceMember>[]>()
	const [selectedMembersCount, setSelectedMembersCount] = useState<number>(0)
	const [filter, setFilter] = useState<string>('')
	const [daoMembers, setDaoMembers] = useState<Partial<WorkspaceMember>[]>()
	const [checkedItems, setCheckedItems] = React.useState<boolean[]>([])
	const allChecked = checkedItems.every(Boolean)
	const [pk, setPk] = React.useState<string>('*')
	const { data: accountData } = useAccount()
	const { subgraphClients, workspace } = useContext(ApiClientsContext)!
	const [membersQueryParams, setMembersQueryParams] = useState<any>({
		client:
      subgraphClients[
      	getSupportedChainIdFromWorkspace(workspace) ?? defaultChainId
      ].client,
	})

	const {
		RenderModal,
		setHiddenModalOpen: setHiddenPkModalOpen,
		transactionData,
		publicKey: newPublicKey,
	} = useSubmitPublicKey()

	const wrapperSetIsSetRubricsModalOpen = useCallback(
		(val) => {
			setIsSetRubricsModalOpen(val)
		},
		[setIsSetRubricsModalOpen]
	)

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

		const network = supportedNetworks.find((x) => x.id === chainId)
		setDaoNetwork(network)

		const k = workspace?.members
			?.find(
				(m) => m.actorId.toLowerCase() === accountData?.address?.toLowerCase()
			)
			?.publicKey?.toString()
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

		setRubricDrawerOpen(false)
		setIsSetRubricsModalOpen(true)
	}

	const applicationReviewContract = useQBContract('reviews', chainId)

	const getSetRubricsGasEstimate = useCallback(() => {
		return applicationReviewContract.estimateGas.setRubrics(
			// random hash -- just to estimate gas
			workspaceId,
			grantAddress,
			'bafkreiboy5njxjyusnps6oayqg7famhocgymhaqp5p53p2kd6fhzhxqiny'
		)
	}, [applicationReviewContract])

	useEffect(() => {
		if(!workspace) {
			return
		}

		setMembersQueryParams({
			client:
        subgraphClients[getSupportedChainIdFromWorkspace(workspace)!].client,
			variables: {
				workspaceId: workspace!.id,
				accessLevelsIn: [WorkspaceMemberAccessLevel['Owner']],
			},
		})
	}, [workspace])

	const {
		data: members,
		error: membersError,
		loading: membersLoading,
	} = useGetWorkspaceMembersByWorkspaceIdQuery(membersQueryParams)

	useEffect(() => {
		console.log(members, membersError, membersLoading)
		if(members) {
			setMembersCount(members.workspaceMembers.length)
			const filteredMembers: Partial<WorkspaceMember>[] = []
			members.workspaceMembers.forEach((m, index) => {
				if(m.fullName?.startsWith(filter) || m.accessLevel === 'owner') {
					filteredMembers.push(m)
				}
			})
			setDaoMembers(members.workspaceMembers)
		}
	}, [members, membersError, membersLoading, filter])

	useEffect(() => {
		if(daoMembers) {
			setCheckedItems(Array(daoMembers.length).fill(false))
		}
	}, [daoMembers])
	return (
		<>
			<Drawer
				isOpen={rubricDrawerOpen}
				placement="right"
				onClose={
					() => {
						setRubricDrawerOpen(false)
						setSetupStep(false)
					}
				}
				size="sm"
			>
				<DrawerOverlay />
				<DrawerContent backgroundColor="#F5F5FA">
					<Flex
						direction="column"
						overflow="scroll"
						height="930px"
						width="452px"
					>
						<Flex
							backgroundColor="#FFFFFF"
							alignItems="flex-start"
							padding="16px"
							boxShadow="0px 1px 1px rgba(31, 31, 51, 0.2), 0px 0px 1px rgba(31, 31, 51, 0.25);"
						>
							<Flex position="relative">
								<Image
									src="/ui_icons/drawer_top_logo.svg"
									mr="8" />
								<Image
									src="/ui_icons/drawer_top_logo_inside.svg"
									mr="8"
									position="absolute"
									top="30%"
									left="4%"
								/>
								<Box>
									<Text
										fontWeight="500"
										fontSize="20px"
										lineHeight="24px"
										color="#1F1F33"
									>
                    Setup applicant evaluation
									</Text>
									<Text
										fontWeight="400"
										fontSize="14px"
										lineHeight="20px"
										color="#7D7DA0"
									>
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
										setRubricDrawerOpen(false)
										setSetupStep(false)
									}
								}
							/>
						</Flex>

						<Flex
							flexDirection="column"
							alignItems="flex-start"
							mt={10}
							ml={7}
							maxW="100%"
						>
							<Flex
								// maxW='100%'
								w="90%"
							>
								<Flex
									flexDirection="column"
									// ml={24}
									w="50%"
									gap={2}
								>
									<Progress
										colorScheme={setupStep ? 'blackAlpha' : 'messenger'}
										value={100}
										borderRadius="100px"
										w="100%"
										h="4px"
									/>
									<Flex gap={1}>
										<Image
											src={
												setupStep
													? '/ui_icons/setup_evaluation_black_bullet.svg'
													: '/ui_icons/setup_evaluation_blue_bullet.svg'
											}
											h="20px"
											w="20px"
										/>
										<Text
											fontWeight="500"
											fontSize="12px"
											lineHeight="16px"
											color={setupStep ? '#1F1F33' : '#4C9AFF'}
										>
                      Scoring Rubric
										</Text>
									</Flex>
								</Flex>

								<Flex
									flexDirection="column"
									ml={4}
									gap={2}
									w="50%">
									<Progress
										colorScheme={setupStep ? 'messenger' : '#D2D2E3'}
										value={100}
										borderRadius="100px"
										w="100%"
										h="4px"
									/>
									<Flex gap={1}>
										<Image
											src={
												setupStep
													? '/ui_icons/setup_evaluation_blue_bullet.svg'
													: '/ui_icons/setup_evaluation_transparent_bullet.svg'
											}
											h="20px"
											w="20px"
										/>
										<Text
											fontWeight="500"
											fontSize="12px"
											lineHeight="16px"
											color={setupStep ? '#4C9AFF' : '#AFAFCC'}
										>
                      Reviewers
										</Text>
									</Flex>
								</Flex>
							</Flex>

							<Flex
								alignItems="flex-start"
								padding="16px"
								gap="16px"
								pl={0}>
								{
									!setupStep && (
										<Image
											mt={4}
											src="/ui_icons/scoring_rubric_logo.svg" />
									)
								}
								{
									setupStep && (
										<Image
											mt={4}
											src="/ui_icons/assign_reviewers_red.svg" />
									)
								}
								<Box>
									<Text
										fontWeight="500"
										fontSize="16px"
										lineHeight="24px"
										color="#1F1F33"
									>
										{setupStep ? 'Assign Reviewers' : 'Scoring Rubric'}
									</Text>
									<Text
										fontWeight="500"
										fontSize="14px"
										lineHeight="20px"
										color="#7D7DA0"
										letterSpacing="0.5px"
									>
										<Text
											as="span"
											color="#7D7DA0"
											fontWeight="400"
											letterSpacing="0.5px"
											lineHeight={2}
										>
											{' '}
											{
												setupStep
													? 'Reviewers are auto assigned equally.'
													: 'Total score is the sum of quality scores.'
											}
											{' '}
										</Text>
										{
											setupStep
												? 'Learn about auto assign'
												: 'Learn about scores'
										}
									</Text>
								</Box>
							</Flex>
						</Flex>

						{
							!setupStep && (
								<Flex
									flexDirection="column"
									alignItems="flex-start"
									mt={5}
									ml={7}
									maxW="100%">
									<Text
										color="#1F1F33"
										fontWeight="500"
										fontSize="14px"
										lineHeight="20px"
									>
                 Scoring Qualities
									</Text>
									<Text
										color="#7D7DA0"
										fontWeight="400"
										fontSize="12px"
										lineHeight="20px"
									>
                  Define the quality, and add a description
									</Text>
								</Flex>
							)
						}

						<Flex
							direction="column"
							backgroundColor={setupStep ? '#FFFFFF' : '#F5F5FA' }
							alignItems="left"
							ml={7}
							mr="auto"
							p={4}
							pb={7}
							w="404px"
							borderRadius="2px"
						>
							{
								setupStep && (
									<Text
										color="#1F1F33"
										fontWeight="500"
										fontSize="14px"
										lineHeight="20px"
										mb={2}
									>
								 Select the number of reviewers assigned per applicant

									</Text>
								)
							}

							{
								setupStep && (
									<RangeSlider
										defaultValue={[2]}
										// step={20}
										min={1}
										max={maxReviewrs}
										size="lg"
									>
										{
											[...Array(maxReviewrs)].map((_, index) => (
												<RangeSliderMark
													key={index}
													value={index + 1}
													mt="2"
													ml="-1"
													fontWeight={500}
													fontSize="12px"
													lineHeight="12px"
													color="#7D7DA0"
												>
													{index + 1}
												</RangeSliderMark>
											))
										}

										<RangeSliderTrack>
											<RangeSliderFilledTrack background="linear-gradient(90deg, #0065FF 0%, #00FFA3 100%)" />
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
													height="24px"
												/>
											</Box>
										</RangeSliderThumb>
									</RangeSlider>
								)
							}

							{
								!setupStep &&
                rubrics.map((_rubric, index) => (
                	<Flex
                		key={index}
                		flexDirection="column"
                		mt={2}
                		backgroundColor="#FFFFFF"
                		ml={-4}
                		mr="auto"
                		alignItems="flex-start"
                		w="90%" >
                		<Flex
                			flexDirection="column"
                			gap="2"
                			alignItems="flex-start"
                			w="90%"
                		>
                			<Flex
                				gap={2}
                				margin={2}
                				flex={0.6673}
                				w="100%">
                				<Input
                					variant="flushed"
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
                					borderColor={
                						rubrics[index].nameError ||
                            rubrics[index].name.length > 30
                							? 'red'
                							: 'inherit'
                					}
                					isDisabled={!rubricEditAllowed}
                				/>
                				<Flex
                					mt={2}
                					gap="2"
                					justifyContent="flex-start">
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
                					</Box>
                				</Flex>
                			</Flex>
                			<Flex
                				flexDirection="row"
                				width="100%">
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
                			opacity={rubricEditAllowed ? 1 : 0.4}
                			w="90%"
                		>
                			<Flex
                				gap={2}
                				margin={2}
                				flex={0.6673}
                				w="100%">
                				<Input
                					variant="flushed"
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
                					borderColor={
                						rubrics[index].descriptionError ||
                            rubrics[index].description.length > 100
                							? 'red'
                							: 'inherit'
                					}
                					isDisabled={!rubricEditAllowed}
                				/>
                			</Flex>
                			<Flex
                				flexDirection="row"
                				width="100%">
                				<Spacer />
                				<Box>
                					{rubrics[index].description.length}
                          /100
                				</Box>
                			</Flex>
                		</Flex>
                		<Divider mt={4} />
                	</Flex>
                ))
							}
						</Flex>
						{
							!setupStep && (
								<Flex
									ml={10}
									mt="20px"
									gap="2"
									justifyContent="flex-start">
									<Box
										onClick={
											() => {
												if(!rubricEditAllowed) {
													return
												}

												const newRubrics = [
													...rubrics,
													{
														name: '',
														nameError: false,
														description: '',
														descriptionError: false,
													},
												]
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
											lineHeight="20px"
										>
                    Add another quality
										</Text>
									</Box>
								</Flex>
							)
						}

						{
							setupStep && (
								<Flex
									direction="column"
									backgroundColor="#FFFFFF"
									mt={10}
									ml="auto"
									mr="auto"
									alignItems="left"
									alignContent="left"
									p={4}
									pb={7}
									w="90%"
									borderRadius="2px"
								>
									<Text
										fontWeight="500"
										fontSize="14px"
										lineHeight="16px"
										color="#1F1F33"
									>
										{' '}
                  Select Reviewers
										{' '}
									</Text>
									<Flex
										backgroundColor="#F0F0F7"
										padding="6 12"
										borderRadius="2 px"
										mt={2}>
										<Image
											w="13.54"
											h="13.54"
											src="/ui_icons/search_icon.svg"
											mt="auto"
											mb="auto"
											ml="8.33%"
										/>
										<Input
											value={filter}
											onChange={(e) => setFilter(e.target.value)}
											placeholder="Search by name"
											size="sm"
											border="none"
										/>
									</Flex>
									<Flex
										w="90%"
										direction="row"
										mt={2}
									>
										<Checkbox
											isChecked={allChecked}
											onChange={
												(e) => {
													if(daoMembers?.length) {
														setCheckedItems(
															Array(daoMembers?.length).fill(e.target.checked)
														)
														e.target.checked ?
															setSelectedMembersCount(daoMembers?.length)
															: setSelectedMembersCount(0)
													}
												}
											}
										>
											<Text
												fontWeight="400"
												fontSize="14px"
												lineHeight="20px"
												color="#555570"
											>
												{' '}
                      Select all
												{' '}
											</Text>
										</Checkbox>
										<Spacer />
										<Text
											fontWeight="500"
											fontSize="10px"
											lineHeight="12px"
											color="#7D7DA0"
										>
											{' '}
											{selectedMembersCount}
											{' '}
/
											{membersCount}
											{' '}
										</Text>
										<Text
											fontWeight="400"
											fontSize="10px"
											lineHeight="12px"
											color="#7D7DA0"
											ml={1}
										>
											{' '}
                    DAO members Selected
										</Text>
									</Flex>
									<CheckboxGroup
										colorScheme="blue"
										defaultValue={[0]}
									>
										<VStack
											alignItems="left"
											mt={2}
											spacing={2}>
											{
												daoMembers &&
                      daoMembers!.map(
                      	(member: Partial<WorkspaceMember>, index) => (
                      		<Checkbox
                      			key={member.actorId}
                      			value={index}
                      			isChecked={checkedItems[index]}
                      			onChange={
                      				(e) => {
                      				e.target.checked
                      					? setSelectedMembersCount((val) => val + 1)
                      					: setSelectedMembersCount((val) => val - 1)
                      					const tempArr: boolean[] = Array(
                      					daoMembers.length
                      				).fill(false)
                      					tempArr[index] = e.target.checked
                      					setCheckedItems(tempArr)
                      				}
                      			}
                      		>
                      			<Flex>
                      				<Image
                      					w="38px"
                      					h="38px"
                      					borderRadius="22.1667px"
                      					src="/ui_icons/generic_dao_member.svg"
                      				/>
                      				<Flex direction="column">
                      					<Text
                      						fontWeight="500"
                      						fontSize="16px"
                      						lineHeight="24px"
                      						color="#1F1F33"
                      					>
                      						{
                      							member.accessLevel === 'owner'
                      							? 'Owner'
                      							: member.fullName
                      						}
                      					</Text>
                      					<Text
                      						fontWeight="400"
                      						fontSize="12px"
                      						lineHeight="14px"
                      						color="#7D7DA0"
                      					>
                      						{
                      							member.actorId?.slice(0, 3) +
                                    '......' +
                                    member.actorId?.slice(38, 42)
                      						}
                      					</Text>
                      				</Flex>
                      			</Flex>
                      		</Checkbox>
                      	)
                      )
											}
										</VStack>
									</CheckboxGroup>
								</Flex>
							)
						}
						<Spacer />
						<Flex
							backgroundColor="#FFFFFF"
							alignItems="flex-start"
							padding="16px"
							boxShadow="0px 1px 1px rgba(31, 31, 51, 0.2), 0px 0px 1px rgba(31, 31, 51, 0.25);"
						>
							{
								setupStep && (
									<NetworkFeeEstimateView
										getEstimate={getSetRubricsGasEstimate}
										chainId={chainId}
									/>
								)
							}
							<Spacer />

							<Flex
								alignItems="center"
								padding="6px 20px"
								w="153px"
								h="40px"
								background={!!setupStep ? '#1F1F33' : '#E0E0EC'}
								borderRadius="3px"
								cursor="pointer"
								onClick={
									setupStep
										? () => {
											handleOnSubmit()
										}
										: () => {
											setSetupStep(true)
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
									color="#FFFFFF"
								>
									{setupStep ? 'Confirm' : 'Next'}
								</Text>
							</Flex>
						</Flex>
					</Flex>
				</DrawerContent>
			</Drawer>

			<RenderModal />
			{
				isSetRubricsModalOpen && (
					<SetRubricsModal
						isOpen={isSetRubricsModalOpen}
						setIsOpen={wrapperSetIsSetRubricsModalOpen}
						onClose={() => {}}
						rubrics={editedRubricData}
						chainId={chainId}
						workspaceId={workspaceId}
						grantAddress={grantAddress}
						daoName={workspace?.title}
						daoNetwork={daoNetwork}
						daoImageFile={null}
						steps={
							[
								'Open your wallet',
								'Confirm Transaction',
								'Waiting for transaction to complete',
								'Wait for indexing to complete',
								'Applicant evaluation setup on-chain',
							]
						}
					/>
				)
			}
		</>
	)
}

export default RubricDrawer
