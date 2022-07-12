import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { Box, Button, Divider, Flex, Image, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ApiClientsContext } from 'pages/_app'
import Deadline from 'src/components/ui/deadline'
import GrantShare from 'src/components/ui/grantShare'
import Modal from 'src/components/ui/modal'
import VerifiedBadge from 'src/components/ui/verified_badge'
import ChangeAccessibilityModalContent from 'src/components/your_grants/yourGrantCard/changeAccessibilityModalContent'
import { defaultChainId } from 'src/constants/chains'
import { SupportedChainId } from 'src/constants/chains'
import {
	useGetGrantDetailsQuery,
	useGetGrantsAppliedToQuery,
} from 'src/generated/graphql'
import useArchiveGrant from 'src/hooks/useArchiveGrant'
import useCustomToast from 'src/hooks/utils/useCustomToast'
import verify from 'src/utils/grantUtils'
import { getAssetInfo, getChainInfo } from 'src/utils/tokenUtils'
import { useAccount } from 'wagmi'
import GrantDetails from '../../src/components/explore_grants/about_grant/grantDetails'
import GrantRewards from '../../src/components/explore_grants/about_grant/grantRewards'
import Sidebar from '../../src/components/explore_grants/about_grant/sidebar'
import Breadcrumbs from '../../src/components/ui/breadcrumbs'
import NavbarLayout from '../../src/layout/navbarLayout'
import {
	formatAmount,
	getFieldLabelFromFieldTitle,
} from '../../src/utils/formattingUtils'
import { getUrlForIPFSHash } from '../../src/utils/ipfsUtils'

function AboutGrant() {
	const { data: accountData } = useAccount()
	const { subgraphClients, workspace } = useContext(ApiClientsContext)!

	const router = useRouter()

	const [grantData, setGrantData] = useState<any>(null)
	const [userGrants, setUserGrants] = useState<any>([])
	const [grantID, setGrantID] = useState<any>(null)
	const [title, setTitle] = useState('')
	const [deadline, setDeadline] = useState<Date>()
	const [isGrantVerified, setIsGrantVerified] = useState(false)
	const [daoId, setDaoId] = useState('')
	const [daoName, setDaoName] = useState('')
	const [daoLogo, setDaoLogo] = useState('')
	const [rewardAmount, setRewardAmount] = useState('')
	const [rewardCurrency, setRewardCurrency] = useState('')
	const [rewardCurrencyCoin, setRewardCurrencyCoin] = useState('')
	const [payoutDescription, setPayoutDescription] = useState('')
	const [grantDetails, setGrantDetails] = useState('')
	const [grantSummary, setGrantSummary] = useState('')
	const [grantRequiredFields, setGrantRequiredFields] = useState([])
	const [chainId, setChainId] = useState<SupportedChainId>()
	const [funding, setFunding] = useState('')
	const [acceptingApplications, setAcceptingApplications] = useState(true)
	const [shouldShowButton, setShouldShowButton] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [alreadyApplied, setAlreadyApplied] = useState(false)
	const [account, setAccount] = useState<any>(null)

	useEffect(() => {
		// console.log(router.query);
		if(router.query) {
			// console.log('setting chain id');
			const { chainId: cId, grantId: gId } = router.query
			setChainId(cId as unknown as SupportedChainId)
			setGrantID(gId)
		}
	}, [router.query])

	const [queryParams, setQueryParams] = useState<any>({
		client: subgraphClients[chainId ?? defaultChainId].client,
	})

	const [applicantQueryParams, setApplicantQueryParams] = useState<any>({
		client: subgraphClients[chainId ?? defaultChainId].client,
	})

	useEffect(() => {
		if(!grantID) {
			return
		}

		if(!chainId) {
			return
		}

		// console.log(chainId);
		setQueryParams({
			client: subgraphClients[chainId].client,
			variables: {
				grantID,
			},
		})
	}, [chainId, grantID])

	const { data, error, loading } = useGetGrantDetailsQuery(queryParams)

	useEffect(() => {
		// console.log('data', data);
		if(data && data.grants && data.grants.length > 0) {
			setGrantData(data.grants[0])
		}
	}, [data, error, loading])

	useEffect(() => {
		if(
			accountData &&
      accountData?.address &&
      accountData?.address?.length > 0
		) {
			setAccount(accountData.address)
		}
	}, [accountData])

	useEffect(() => {
		if(!account) {
			return
		}

		if(!chainId) {
			return
		}

		setApplicantQueryParams({
			client: subgraphClients[chainId as SupportedChainId].client,
			variables: {
				applicantID: account,
			},
		})
	}, [chainId, account, data, subgraphClients])

	const res = useGetGrantsAppliedToQuery(applicantQueryParams)

	useEffect(() => {
		if(res.data && res.data.grantApplications.length > 0) {
			setUserGrants(res.data.grantApplications)
		}
	}, [res, data])

	useEffect(() => {
		const application = userGrants.find((x: any) => x.grant.id === grantID)
		if(application) {
			setAlreadyApplied(true)
		}
	}, [userGrants, accountData, grantID])

	useEffect(() => {
		if(!chainId || !grantData) {
			return
		}

		const chainInfo = getChainInfo(grantData, chainId)

		// const chainInfo = CHAIN_INFO[chainId]
		//   ?.supportedCurrencies[grantData?.reward.asset.toLowerCase()];
		const [localIsGrantVerified, localFunding] = verify(
			grantData?.funding,
			chainInfo?.decimals
		)

		setFunding(localFunding)
		setIsGrantVerified(localIsGrantVerified)
		setDeadline(new Date(grantData?.deadline))
		setTitle(grantData?.title)
		setDaoId(grantData?.workspace?.id)
		setDaoName(grantData?.workspace?.title)
		setDaoLogo(getUrlForIPFSHash(grantData?.workspace?.logoIpfsHash))
		setRewardAmount(
			grantData?.reward?.committed
				? formatAmount(grantData?.reward?.committed, chainInfo?.decimals ?? 18)
				: ''
		)
		let supportedCurrencyObj
		if(grantData.reward.token) {
			setRewardCurrency(chainInfo.label)
			setRewardCurrencyCoin(chainInfo.icon)
		} else {
			supportedCurrencyObj = getAssetInfo(
				grantData?.reward?.asset?.toLowerCase(),
				chainId
			)
		}

		if(supportedCurrencyObj) {
			setRewardCurrency(supportedCurrencyObj?.label)
			setRewardCurrencyCoin(supportedCurrencyObj?.icon)
		}

		// console.log(grantData?.fields);

		if(
			grantData?.fields.length &&
      grantData?.fields?.some((fd: any) => fd.title === 'isMultipleMilestones')
		) {
			setPayoutDescription('Multiple')
		} else {
			setPayoutDescription('Single')
		}

		setGrantDetails(grantData?.details)
		setGrantSummary(grantData?.summary)
		setGrantRequiredFields(
			grantData?.fields
				?.map((field: any) => {
					console.log(field)
					console.log(field.title.startsWith('defaultMilestone'))
					if(field.title.startsWith('defaultMilestone')) {
						return null
					}

					if(field.title.startsWith('customField')) {
						const i = field.title.indexOf('-')
						if(i !== -1) {
							return {
								detail: field.title
									.substring(i + 1)
									.split('\\s')
									.join(' '),
							}
						}
					}

					return {
						detail: getFieldLabelFromFieldTitle(field.title) ?? 'Invalid Field',
						// detail: field.title,
					}
				})
				.filter((field: any) => field !== null)
		)

		setAcceptingApplications(grantData?.acceptingApplications)
	}, [grantData, chainId])

	useEffect(() => {
		setShouldShowButton(daoId === workspace?.id)
	}, [workspace, accountData, daoId])

	const [isAcceptingApplications, setIsAcceptingApplications] = React.useState<
    [boolean, number]
  >([acceptingApplications, 0])

	useEffect(() => {
		setIsAcceptingApplications([acceptingApplications, 0])
	}, [acceptingApplications])

	const [transactionData, txnLink, archiveGrantLoading, archiveGrantError] =
    useArchiveGrant(
    	isAcceptingApplications[0],
    	isAcceptingApplications[1],
    	grantID
    )

	const { setRefresh } = useCustomToast(txnLink)
	const buttonRef = React.useRef<HTMLButtonElement>(null)

	useEffect(() => {
		// console.log(transactionData);
		if(transactionData) {
			setRefresh(true)
			setIsModalOpen(false)
		}
	}, [transactionData])

	React.useEffect(() => {
		setIsAcceptingApplications([acceptingApplications, 0])
	}, [archiveGrantError])

	return (
		<Flex
			direction="column"
			w="100%"
			mb={8}>
			{
				!acceptingApplications && (
					<Flex
						maxW="100%"
						bg="#F3F4F4"
						direction="row"
						align="center"
						px={8}
						py={6}
						mt={6}
						border="1px solid #E8E9E9"
						borderRadius="6px"
					>
						<Image
							src="/toast/warning.svg"
							w="42px"
							h="36px" />
						<Flex
							direction="column"
							ml={6}>
							<Text
								variant="tableHeader"
								color="#414E50">
								{
									shouldShowButton && accountData?.address
										? 'Grant is archived and cannot be discovered on the Home page.'
										: 'Grant is archived and closed for new applications.'
								}
							</Text>
							<Text
								variant="tableBody"
								color="#717A7C"
								fontWeight="400"
								mt={2}>
              New applicants cannot apply to an archived grant.
							</Text>
						</Flex>
						<Box mr="auto" />
						{
							accountData?.address && shouldShowButton && (
								<Button
									ref={buttonRef}
									w={archiveGrantLoading ? buttonRef?.current?.offsetWidth : 'auto'}
									variant="primary"
									onClick={() => setIsModalOpen(true)}
								>
              Publish grant
								</Button>
							)
						}
					</Flex>
				)
			}
			<Flex
				direction="row"
				justify="center"
				w="100%">
				<Flex
					direction="column"
					w="54%">
					<Breadcrumbs path={['Explore Grants', 'About Grant']} />
					<Text
						variant="heading"
						mt="18px">
						{' '}
						{title}
						{' '}
						{
							isGrantVerified && (
								<VerifiedBadge
									grantAmount={funding}
									grantCurrency={rewardCurrency}
									lineHeight="44px"
								/>
							)
						}
					</Text>
					<Flex
						fontWeight="400"
						alignItems="center">
						<Image
							mr={3}
							mt="-3px"
							boxSize={3}
							src="/ui_icons/calendar.svg" />
						<Deadline date={deadline} />
						<Image
							mx={2}
							src="/ui_icons/green_dot.svg" />
						<Box
							as="span"
							display="inline-block"
							color="#122224"
							fontWeight="bold"
						>
							{acceptingApplications ? 'Open' : 'Closed'}
						</Box>
						<Box mx="auto" />
						<GrantShare
							chainId={chainId}
							grantID={grantID} />
					</Flex>

					<Divider mt={3} />

					<GrantRewards
						daoId={daoId}
						daoName={daoName}
						daoLogo={daoLogo}
						funding={funding}
						isGrantVerified={isGrantVerified}
						rewardAmount={rewardAmount}
						rewardCurrency={rewardCurrency}
						rewardCurrencyCoin={rewardCurrencyCoin}
						payoutDescription={payoutDescription}
						chainId={chainId}
						defaultMilestoneFields={
							grantData?.fields
								?.map((field: any) => {
								// console.log(field);
								// console.log(field.title.startsWith('defaultMilestone'));
									if(field.title.startsWith('defaultMilestone')) {
										const i = field.title.indexOf('-')
										if(i !== -1) {
											return {
												detail: field.title
													.substring(i + 1)
													.split('\\s')
													.join(' '),
											}
										}
									}

									return null
								})
								.filter((field: any) => field !== null)
						}
					/>

					<Divider mt={7} />

					<GrantDetails
						grantSummary={grantSummary}
						grantDetails={grantDetails}
					/>
				</Flex>
				<Box mr="4%" />
				<Flex
					direction="column"
					w="32%">
					<Sidebar
						chainId={chainId}
						grantID={grantData?.id}
						grantRequiredFields={grantRequiredFields}
						acceptingApplications={acceptingApplications}
						alreadyApplied={alreadyApplied}
					/>
				</Flex>
			</Flex>
			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title=""
			>
				<ChangeAccessibilityModalContent
					onClose={() => setIsModalOpen(false)}
					imagePath="/illustrations/publish_grant.svg"
					title={
						acceptingApplications
							? 'Are you sure you want to archive this grant?'
							: 'Are you sure you want to publish this grant?'
					}
					subtitle={
						acceptingApplications
							? 'The grant will no longer be visible to anyone. You will not receive any new applications for it.'
							: 'The grant will be live, and applicants can apply for this grant.'
					}
					actionButtonText={acceptingApplications ? 'Archive grant' : 'Publish grant'}
					actionButtonOnClick={
						() => {
							setIsAcceptingApplications([
								!isAcceptingApplications[0],
								isAcceptingApplications[1] + 1,
							])
						}
					}
					loading={archiveGrantLoading}
				/>
			</Modal>
		</Flex>
	)
}

AboutGrant.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

export default AboutGrant
