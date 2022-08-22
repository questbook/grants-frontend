import React, {
	useContext, useEffect, useMemo, useState,
} from 'react'
import {
	Box,
	Button,
	Container,
	Flex,
	Image,
	Link,
	ModalBody,
	Text,
	Tooltip,
} from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import { useRouter } from 'next/router'
import { ApiClientsContext } from 'pages/_app'
import Breadcrumbs from 'src/components/ui/breadcrumbs'
import CopyIcon from 'src/components/ui/copy_icon'
import Heading from 'src/components/ui/heading'
import Modal from 'src/components/ui/modal'
import ModalContent from 'src/components/your_grants/manage_grant/modals/modalContentGrantComplete'
import SendFundModalContent from 'src/components/your_grants/manage_grant/modals/sendFundModalContent'
import Sidebar from 'src/components/your_grants/manage_grant/sidebar'
import Funding from 'src/components/your_grants/manage_grant/tables/funding'
import Milestones from 'src/components/your_grants/manage_grant/tables/milestones'
import { defaultChainId } from 'src/constants/chains'
import config from 'src/constants/config.json'
import {
	GetApplicationDetailsQuery,
	useGetApplicationDetailsQuery,
	useGetFundSentForApplicationQuery,
} from 'src/generated/graphql'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useApplicationEncryption from 'src/hooks/useApplicationEncryption'
import useCompleteApplication from 'src/hooks/useCompleteApplication'
import useCustomToast from 'src/hooks/utils/useCustomToast'
import NavbarLayout from 'src/layout/navbarLayout'
import { ApplicationMilestone } from 'src/types'
import {
	formatAmount,
	getFormattedDateFromUnixTimestampWithYear,
} from 'src/utils/formattingUtils'
import useApplicationMilestones from 'src/utils/queryUtil'
import { getAssetInfo } from 'src/utils/tokenUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

function getTotalFundingRecv(milestones: ApplicationMilestone[]) {
	let val = BigNumber.from(0)
	milestones.forEach((milestone) => {
		val = val.add(milestone.amountPaid)
	})
	return val
}

function getTotalFundingAsked(milestones: ApplicationMilestone[]) {
	let val = BigNumber.from(0)
	milestones.forEach((milestone) => {
		val = val.add(milestone.amount)
	})
	return val
}

function ManageGrant() {
	const { decryptApplicationPII } = useApplicationEncryption()
	const path = ['My Grants', 'View Application', 'Manage']

	const [selected, setSelected] = React.useState(0)
	const [isGrantCompleteModelOpen, setIsGrantCompleteModalOpen] = React.useState(false)
	const [isSendFundModalOpen, setIsSendFundModalOpen] = useState(false)
	const [isAdmin, setIsAdmin] = React.useState<boolean>(false)

	const [applicationID, setApplicationID] = useState<any>()
	const router = useRouter()
	const { subgraphClients, workspace } = useContext(ApiClientsContext)!
	const { data: accountData, nonce } = useQuestbookAccount()

	const {
		data: {
			milestones, rewardAsset, rewardToken, fundingAsk, decimals,
		},
		refetch: refetchMilestones,
	} = useApplicationMilestones(applicationID)

	useEffect(() => {
		console.log(decimals)
	}, [decimals])

	useEffect(() => {
		console.log('milestones', milestones)
	}, [milestones])

	const {
		data: appDetailsResult,
		refetch: refetchApplicationDetails,
	} = useGetApplicationDetailsQuery({
		client:
        subgraphClients[
        	getSupportedChainIdFromWorkspace(workspace)
            || defaultChainId
        ].client,
		variables: {
			applicationID,
		},
	})

	const { data: fundsDisbursed } = useGetFundSentForApplicationQuery({
		client:
      subgraphClients[
      	getSupportedChainIdFromWorkspace(workspace)
          || defaultChainId
      ].client,
		variables: {
			applicationId: applicationID,
		},
	})

	// console.log('Funds Disbursed', fundsDisbursed);

	const [applicationData, setApplicationData] = useState<GetApplicationDetailsQuery['grantApplication']>(null)
	const applicantEmail = useMemo(
		() => applicationData?.fields.find(
			(field) => field.id.includes('applicantEmail'),
		)?.values[0]?.value,
		[applicationData],
	)

	useEffect(() => {
		if(appDetailsResult && appDetailsResult.grantApplication) {
			setApplicationData(appDetailsResult.grantApplication)
		}
	}, [appDetailsResult])

	const [hiddenModalOpen, setHiddenModalOpen] = useState(false)
	const showHiddenData = async() => {
		if(applicationData) {
			setHiddenModalOpen(true)
			const decryptedApplicationData = await decryptApplicationPII(applicationData)
			if(decryptedApplicationData) {
				setApplicationData(decryptedApplicationData)
			}
		}
	}

	let assetInfo

	if(rewardToken) {
		assetInfo = rewardToken
	} else {
		assetInfo = getAssetInfo(rewardAsset, getSupportedChainIdFromWorkspace(workspace))
	}

	const fundingIcon = assetInfo.icon

	useEffect(() => {
		setApplicationID(router?.query?.applicationId || '')
		refetchApplicationDetails()
	}, [router, accountData, refetchApplicationDetails])

	const tabs = [
		{
			title: milestones.length.toString(),
			subtitle: milestones.length === 1 ? 'Milestone' : 'Milestones',
			content: (
				<Milestones
					refetch={refetchMilestones}
					milestones={milestones}
					rewardAssetId={rewardAsset}
					decimals={decimals}
					sendFundOpen={() => setIsSendFundModalOpen(true)}
					chainId={getSupportedChainIdFromWorkspace(workspace)}
					rewardToken={rewardToken}
				/>
			),
		},
		{
			icon: fundingIcon,
			title: formatAmount(getTotalFundingRecv(
        milestones as unknown as ApplicationMilestone[],
			).toString(), decimals),
			subtitle: 'Funding Sent',
			content: (
				<Funding
					fundTransfers={fundsDisbursed?.fundsTransfers || []}
					assetId={rewardAsset}
					columns={['milestoneTitle', 'date', 'from', 'action']}
					assetDecimals={decimals}
					grantId={applicationData?.grant?.id || ''}
					type="funding_sent"
					chainId={getSupportedChainIdFromWorkspace(workspace)}
					rewardToken={rewardToken}
				/>
			),
		},
		{
			icon: fundingIcon,
			title:
        (fundingAsk ? formatAmount(fundingAsk.toString(), decimals) : null)
        || formatAmount(getTotalFundingAsked(
          milestones as unknown as ApplicationMilestone[],
        ).toString(), decimals),
			subtitle: 'Funding Requested',
			content: undefined, // <Funding fundTransfers={fundsDisbursed} assetId={rewardAsset} />,
		},
	]

	const [update, setUpdate] = useState<any>()
	const [txn, txnLink, loading] = useCompleteApplication(update, applicationData?.id)

	const { setRefresh } = useCustomToast(txnLink, 6000)
	useEffect(() => {
		if(txn) {
			setUpdate(undefined)
			setIsGrantCompleteModalOpen(false)
			setRefresh(true)
		}

	}, [txn])

	const markApplicationComplete = async(comment: string) => {
		setUpdate({
			text: comment,
		})
	}

	useEffect(() => {
		if(workspace && workspace.members
      && workspace.members.length > 0 && accountData && accountData.address) {
			const tempMember = workspace.members.find(
				(m) => m.actorId.toLowerCase() === accountData?.address?.toLowerCase(),
			)
			setIsAdmin(tempMember?.accessLevel === 'admin' || tempMember?.accessLevel === 'owner')
		}
	}, [accountData, workspace])

	function renderModal() {
		return (
			<Modal
				isOpen={hiddenModalOpen}
				onClose={() => setHiddenModalOpen(false)}
				title="View Details with your Wallet"
				modalWidth={566}
			>
				<ModalBody px={10}>
					<Flex direction="column">
						<Flex mt="36px">
							<Text
								fontWeight="bold"
								fontSize="18px">
                How does this work?
							</Text>
						</Flex>
						<Flex
							mt="28px"
							alignItems="center">
							<Box
								bg="#8850EA"
								color="#fff"
								h={10}
								w={10}
								display="flex"
								alignItems="center"
								justifyContent="center"
								borderRadius="50%"
								mr="19px"
							>
                1
							</Box>
							<Text>
Open your wallet
							</Text>
						</Flex>
						<Flex
							alignItems="center"
							mt="35px"
							mb="40px">
							<Box
								bg="#8850EA"
								color="#fff"
								h={10}
								w={10}
								display="flex"
								alignItems="center"
								justifyContent="center"
								borderRadius="50%"
								mr="19px"
							>
                2
							</Box>
							<Text>
Click on ‘Decrypt’ to view the details.
							</Text>
						</Flex>

						<Button
							mb={10}
							variant="primary"
							onClick={() => setHiddenModalOpen(false)}>
              ok
						</Button>
					</Flex>
				</ModalBody>
			</Modal>
		)
	}

	return (
		<Container
			maxW="100%"
			display="flex"
			px="70px">
			<Container
				flex={1}
				display="flex"
				flexDirection="column"
				maxW="834px"
				alignItems="stretch"
				pb={8}
				px={10}
			>
				<Breadcrumbs
					path={path}
					id={applicationData?.id} />
				<Heading
					mt="12px"
					title={applicationData?.grant?.title || ''}
					dontRenderDivider
				/>
				<Flex
					mt="3px"
					direction="row"
					justify="start"
					align="baseline">
					<Text
						key="address"
						variant="applicationText">
            By
						{' '}
						<Tooltip label={applicationData?.applicantId}>
							<Box
								as="span"
								fontWeight="700"
								display="inline-block">
								{`${applicationData?.applicantId?.substring(0, 6)}...`}
							</Box>
						</Tooltip>
						<Flex
							display="inline-block"
							ml={2}>
							<CopyIcon text={applicationData?.applicantId!} />
						</Flex>
					</Text>
					<Box mr={6} />
					<Text
						key="mail_text"
						fontWeight="400">
						<Image
							display="inline-block"
							alt="mail_icon"
							src="/ui_icons/mail_icon.svg"
							mr={2}
						/>
						{
							applicantEmail || (
								<Text
									display="inline"
									variant="applicationHeading"
									lineHeight="32px"
									onClick={showHiddenData}
									cursor="pointer">
              Hidden
									{' '}
									<Text
										color="#6200EE"
										display="inline">
View
									</Text>
								</Text>
							)
						}
					</Text>
					<Box mr={6} />
					<Text
						key="date_text"
						fontWeight="400">
						<Image
							alt="date_icon"
							display="inline-block"
							src="/ui_icons/date_icon.svg"
							mr={2}
						/>
						{
							getFormattedDateFromUnixTimestampWithYear(
								applicationData?.createdAtS,
							)
						}
					</Text>
					<Box mr={6} />
					<Link
						key="link"
						variant="link"
						fontSize="14px"
						lineHeight="24px"
						fontWeight="500"
						fontStyle="normal"
						color="#414E50"
						href={`/your_grants/view_applicants/applicant_form/?applicationId=${applicationData?.id}`}
						isExternal
					>
            View Application
						{' '}
						<Image
							display="inline-block"
							h={3}
							w={3}
							src="/ui_icons/link.svg"
						/>
					</Link>
				</Flex>

				{
					applicationData?.state === 'completed' && (
						<Text
							variant="applicationText"
							color="#717A7C"
							mt={6}>
            Grant marked as complete on
							{' '}
							<Text
								variant="applicationText"
								display="inline-block">
								{
									getFormattedDateFromUnixTimestampWithYear(
										applicationData?.updatedAtS,
									)
								}
							</Text>
						</Text>
					)
				}

				<Flex
					mt="29px"
					direction="row"
					w="full"
					align="center">
					{
						tabs.map((tab, index) => (
							<Button
							// eslint-disable-next-line react/no-array-index-key
								key={`tab-${tab.title}-${index}`}
								variant="ghost"
								h="110px"
								w="full"
								_hover={
									{
										background: '#F5F5F5',
									}
								}
								background={
									index !== selected
										? 'linear-gradient(180deg, #FFFFFF 0%, #F3F4F4 100%)'
										: 'white'
								}
								_focus={{}}
								borderRadius={index !== selected ? 0 : '8px 8px 0px 0px'}
								borderRightWidth={
									(index !== tabs.length - 1 && index + 1 !== selected)
                || index === selected
										? '2px'
										: '0px'
								}
								borderLeftWidth={index !== selected ? 0 : '2px'}
								borderTopWidth={index !== selected ? 0 : '2px'}
								borderBottomWidth={index !== selected ? '2px' : 0}
								borderBottomRightRadius="-2px"
								onClick={
									() => {
										if(tabs[index].content) {
											setSelected(index)
										}
									}
								}
							>
								<Flex
									direction="column"
									justify="center"
									align="center"
									w="100%">
									<Flex
										direction="row"
										justify="center"
										align="center">
										{
											tab.icon && (
												<Image
													h="26px"
													w="26px"
													src={tab.icon}
													alt={tab.icon} />
											)
										}
										<Box mx={1} />
										<Text
											fontWeight="700"
											fontSize="26px"
											lineHeight="40px">
											{tab.title}
										</Text>
									</Flex>
									<Text
										variant="applicationText"
										color="#717A7C">
										{tab.subtitle}
									</Text>
								</Flex>
							</Button>
						))
					}
				</Flex>

				{tabs[selected].content}

				<Flex
					direction="row"
					justify="center"
					mt={8}>
					{
						applicationData?.state !== 'completed' && selected === 0 && (
							<Button
								variant="primary"
								onClick={() => setIsGrantCompleteModalOpen(true)}
							>
              Mark Application as closed
							</Button>
						)
					}
				</Flex>
			</Container>
			{
				applicationData?.state !== 'completed' && isAdmin && (
					<Sidebar
						milestones={milestones}
						assetInfo={assetInfo}
						grant={applicationData?.grant}
						applicationId={applicationID}
						applicantId={applicationData?.applicantId!}
						workspaceId={workspace?.id!}
						decimals={decimals}
					/>
				)
			}

			<Modal
				isOpen={isGrantCompleteModelOpen}
				onClose={() => setIsGrantCompleteModalOpen(false)}
				title="Mark Application as closed"
				modalWidth={512}
			>
				<ModalContent
					hasClicked={loading}
					onClose={(details: any) => markApplicationComplete(details)}
				/>
			</Modal>

			{
				applicationData && applicationData.grant && (
					<Modal
						isOpen={isSendFundModalOpen}
						onClose={() => setIsSendFundModalOpen(false)}
						title="Send Funds"
						rightIcon={
							(
								<Button
									_focus={{}}
									variant="link"
									color="#AA82F0"
									leftIcon={<Image src="/sidebar/discord_icon.svg" />}
									onClick={() => window.open(config.supportLink)}
								>
              Support 24*7
								</Button>
							)
						}
					>
						<SendFundModalContent
							isOpen={isSendFundModalOpen}
							milestones={milestones}
							rewardAsset={
								{
									address: applicationData.grant.reward.asset,
									committed: BigNumber.from(applicationData.grant.reward.committed),
									label: assetInfo?.label,
									icon: assetInfo?.icon,
								}
							}
							contractFunding={applicationData.grant.funding}
							onClose={() => setIsSendFundModalOpen(false)}
							grantId={applicationData.grant.id}
							applicantId={applicationData?.applicantId}
							applicationId={applicationID}
						/>
					</Modal>
				)
			}

			{renderModal()}
		</Container>
	)
}

ManageGrant.getLayout = function(page: React.ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

export default ManageGrant
