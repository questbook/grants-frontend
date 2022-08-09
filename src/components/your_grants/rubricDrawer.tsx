import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
	Drawer,
	DrawerContent,
	DrawerOverlay,
	Flex,
	Spacer,
} from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import { SupportedChainId } from 'src/constants/chains'
import { defaultChainId } from 'src/constants/chains'
import {
	useGetWorkspaceMembersByWorkspaceIdQuery,
	WorkspaceMember,
	WorkspaceMemberAccessLevel,
} from 'src/generated/graphql'
import useSubmitPublicKey from 'src/hooks/useSubmitPublicKey'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import { NetworkSelectOption } from 'src/v2/components/Onboarding/SupportedNetworksData'
import { supportedNetworks } from 'src/v2/components/Onboarding/SupportedNetworksData'
import NumOfReviewersSlider from 'src/v2/components/View_applicants/RubricDrawer/DrawerBodyElements/NumOfReviewersSlider'
import ProgressBar from 'src/v2/components/View_applicants/RubricDrawer/DrawerBodyElements/ProgressBar'
import ReviewersSlectionMenu from 'src/v2/components/View_applicants/RubricDrawer/DrawerBodyElements/ReviewersSelectionMenu'
import RubricsInput from 'src/v2/components/View_applicants/RubricDrawer/DrawerBodyElements/RubricsInput'
import StepDescription from 'src/v2/components/View_applicants/RubricDrawer/DrawerBodyElements/StepDescription'
import DrawerFooter from 'src/v2/components/View_applicants/RubricDrawer/DrawerFooter'
import DrawerHeader from 'src/v2/components/View_applicants/RubricDrawer/DrawerHeader'
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
	const [maxReviewers, setMaxReviewers] = useState<number>(5)

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
	const [checkedItems, setCheckedItems] = useState<boolean[]>([])
	const allChecked = checkedItems.every(Boolean)
	const [filter, setFilter] = useState<string>('')

	const [daoMembers, setDaoMembers] = useState<Partial<WorkspaceMember>[]>()

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

						<DrawerHeader
							onClose={
								() => {
									setRubricDrawerOpen(false)
									setSetupStep(false)
								}
							}
						/>

						<Flex
							flexDirection="column"
							alignItems="flex-start"
							mt={10}
							ml={7}
							maxW="100%"
						>
							<ProgressBar setupStep={setupStep} />
							<StepDescription setupStep={setupStep} />
						</Flex>

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

							{setupStep && <NumOfReviewersSlider maxReviewers={maxReviewers} />}

							{
								!setupStep && (
									<RubricsInput
										rubricEditAllowed={rubricEditAllowed}
										rubrics={rubrics}
										setRubrics={setRubrics}
										setupStep={setupStep} />
								)
							}
						</Flex>


						{
							setupStep && (
								<ReviewersSlectionMenu
									allChecked={allChecked}
									filter={filter}
									setFilter={setFilter}
									daoMembers={daoMembers}
									setCheckedItems={setCheckedItems}
									setSelectedMembersCount={setSelectedMembersCount}
									selectedMembersCount={selectedMembersCount}
									membersCount={membersCount}
									checkedItems={checkedItems}

								/>
							)
						}
						<Spacer />

						<DrawerFooter
							setupStep={setupStep}
							onClick={
								setupStep
									? () => {
										handleOnSubmit()
									}
									: () => {
										setSetupStep(true)
									}
							} />
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
