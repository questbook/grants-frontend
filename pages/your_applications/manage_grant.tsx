import React, { useContext, useEffect, useState } from 'react'
import {
	Box, Button,
	Container, Flex, Image, Text, } from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import moment from 'moment'
import { useRouter } from 'next/router'
import VerifiedBadge from 'src/components/ui/verified_badge'
import { CHAIN_INFO } from 'src/constants/chainInfo'
import { SupportedChainId } from 'src/constants/chains'
import {
	useGetApplicationDetailsQuery,
	useGetFundSentForApplicationQuery,
} from 'src/generated/graphql'
import { ApplicationMilestone } from 'src/types'
import verify from 'src/utils/grantUtils'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import useApplicationMilestones from 'src/utils/queryUtil'
import Breadcrumbs from '../../src/components/ui/breadcrumbs'
import Funding from '../../src/components/your_applications/manage_grant/fundingRequestedTable'
import MilestoneTable from '../../src/components/your_applications/manage_grant/milestoneTable'
import Sidebar from '../../src/components/your_applications/manage_grant/sidebar'
import NavbarLayout from '../../src/layout/navbarLayout'
import { formatAmount } from '../../src/utils/formattingUtils'
import { getAssetInfo } from '../../src/utils/tokenUtils'
import { ApiClientsContext } from '../_app'

function getTotalFundingRecv(milestones: ApplicationMilestone[]) {
	let val = BigNumber.from(0)
	milestones.forEach((milestone) => {
		val = val.add(BigNumber.from(milestone.amountPaid))
	})
	return val
}

function getTotalFundingAsked(milestones: ApplicationMilestone[]) {
	let val = BigNumber.from(0)
	milestones.forEach((milestone) => {
		val = val.add(BigNumber.from(milestone.amount))
	})
	return val
}

function ManageGrant() {
	const { subgraphClients } = useContext(ApiClientsContext)!
	const router = useRouter()
	const [applicationData, setApplicationData] = useState<any>({
		grantTitle: '',
		applicantAddress: '',
		applicantEmail: '',
		applicationDate: '',
		grant: null,
		id: '',
	})
	const [applicationID, setApplicationID] = useState<any>('')
	const [selected, setSelected] = React.useState(0)
	const [chainId, setChainId] = useState<SupportedChainId>()

	useEffect(() => {
		if(router && router.query) {
			console.log(router.query)
			const { chainId: cId, applicationId: aId } = router.query
			setChainId(cId as unknown as SupportedChainId)
			setApplicationID(aId)
		}
	}, [router])

	const {
		data: {
			milestones, rewardAsset, fundingAsk, decimals,
		},
		refetch,
	} = useApplicationMilestones(applicationID, chainId)

	const { data: fundsDisbursed } = useGetFundSentForApplicationQuery({
		client: subgraphClients[chainId ?? SupportedChainId.RINKEBY].client,
		variables: {
			applicationId: applicationID,
		},
	})

	const [queryParams, setQueryParams] = useState<any>({
		client:
      subgraphClients[
      	chainId ?? SupportedChainId.RINKEBY
      ].client,
	})

	useEffect(() => {
		if(!applicationID) {
			return
		}

		if(!chainId) {
			return
		}

		setQueryParams({
			client:
        subgraphClients[chainId].client,
			variables: {
				applicationID,
			},
		})

	}, [chainId, applicationID])

	const { data, error, loading } = useGetApplicationDetailsQuery(queryParams)

	const [isGrantVerified, setIsGrantVerified] = useState(false)
	const [grantFunding, setGrantFunding] = useState('')
	const [fundingIcon, setFundingIcon] = useState('')
	const [assetInfo, setAssetInfo] = useState({ label: '', icon: '' })
	const [rewardToken, setRewardToken] = useState({
		label: '', icon: '', decimals: 18, address: '',
	})

	useEffect(() => {
		if(data && data.grantApplication && chainId) {
			const application = data.grantApplication
			setApplicationData({
				title: application.grant.title,
				applicantAddress: application.applicantId,
				applicantEmail: application.fields.find((field: any) => field.id.includes('applicantEmail'))?.values[0]?.value,
				applicationDate: moment
					.unix(application.createdAtS)
					.format('D MMMM YYYY'),
				grant: application.grant,
				id: application.id,
			})

			let chainInfo
			// let assetInfo;

			if(application.grant.reward.token) {
				chainInfo = {
					label: application.grant.reward.token.label,
					address: application.grant.reward.token.address,
					decimals: application.grant.reward.token.decimal,
					icon: getUrlForIPFSHash(application.grant.reward.token.iconHash),
				}
				setRewardToken(chainInfo)
				setAssetInfo({
					label: chainInfo.label,
					icon: chainInfo.icon,
				})
				setFundingIcon(chainInfo.icon)
			} else {
				chainInfo = CHAIN_INFO[chainId]
					?.supportedCurrencies[application.grant.reward.asset.toLowerCase()]
				const asset = getAssetInfo(rewardAsset, chainId)
				setAssetInfo(asset)
				// setFundingIcon(assetInfo.icon);
			}

			const [localIsGrantVerified, localFunding] = verify(
				application.grant.funding,
				chainInfo.decimals,
			)
			setGrantFunding(localFunding)
			setIsGrantVerified(localIsGrantVerified)
		}
	}, [data, error, rewardAsset, loading, chainId])

	// const assetInfo = getAssetInfo(rewardAsset, chainId);
	// const fundingIcon = assetInfo.icon;

	const tabs = [
		{
			title: milestones.length.toString(),
			subtitle: milestones.length === 1 ? 'Milestone' : 'Milestones',
		},
		{
			icon: fundingIcon,
			title: formatAmount(getTotalFundingRecv(milestones).toString(), decimals),
			subtitle: 'Funding Received',
		},
		{
			icon: fundingIcon,
			title:
        (fundingAsk ? formatAmount(fundingAsk.toString(), decimals) : null)
        || formatAmount(getTotalFundingAsked(milestones).toString(), decimals),
			subtitle: 'Funding Requested',
		},
	]

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
				<Breadcrumbs path={['My Applications', 'Manage Grant']} />
				<Text
					variant="heading"
					mt="18px">
					{applicationData.title}
					{
						isGrantVerified
            && (
            	<VerifiedBadge
            		grantAmount={grantFunding}
            		grantCurrency={assetInfo?.label}
            		lineHeight="44px" />
            )
					}
				</Text>
				<Box mt={5} />

				<Flex
					direction="row"
					w="full"
					align="center">
					{
						tabs.map((tab, index) => (
							<Button
								key={tab.title}
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
								onClick={() => (index !== tabs.length - 1 ? setSelected(index) : null)}
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

				{
					selected === 0 ? (
						<MilestoneTable
							refetch={refetch}
							milestones={milestones}
							rewardAssetId={rewardAsset}
							chainId={chainId}
							decimals={decimals}
							rewardToken={rewardToken}
						/>
					) : (
						<Funding
							fundTransfers={fundsDisbursed?.fundsTransfers || []}
							assetId={rewardAsset}
							columns={['milestoneTitle', 'date', 'from', 'action']}
							assetDecimals={decimals}
							grantId={applicationData.grant?.id}
							chainId={chainId}
							rewardToken={rewardToken}
						/>
					)
				}
			</Container>

			<Sidebar
				chainId={chainId}
				applicationData={applicationData}
				assetInfo={assetInfo} />
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
