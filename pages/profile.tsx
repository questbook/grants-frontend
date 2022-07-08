// UI Components
import React, { useEffect, useState } from 'react'
import {
	Box,
	Button,
	Divider,
	Flex,
	Heading,
	IconButton,
	Image,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Stack,
	Text,
	useDisclosure
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import DaoAbout from 'src/components/profile/dao_about'
import DaoData from 'src/components/profile/dao_data'
import BrowseGrantCard from 'src/components/profile/grantCard'
import SeeMore from 'src/components/profile/see_more'
import { SupportedChainId } from 'src/constants/chains'
import { CHAIN_INFO } from 'src/constants/chains'
import { useGetAllGrantsForADaoQuery, useGetDaoDetailsQuery, useGetFundSentDisburseQuery } from 'src/generated/graphql'
// APP LAYOUT & STATE
import NavbarLayout from 'src/layout/navbarLayout'
// CONSTANTS AND TYPES
import { DAOWorkspace } from 'src/types'
import { calculateUSDValue } from 'src/utils/calculatingUtils'
import { formatAmount } from 'src/utils/formattingUtils'
import verify from 'src/utils/grantUtils'
// UTILS AND TOOLS
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils'
import { useAccount } from 'wagmi'
import { ApiClientsContext } from './_app'

function Profile() {
	const router = useRouter()
	const { onOpen, isOpen, onClose } = useDisclosure()

	const { subgraphClients } = React.useContext(ApiClientsContext)!
	const { data: accountData } = useAccount()

	// const [data, setData] = React.useState();
	const [workspaceData, setWorkspaceData] = React.useState<DAOWorkspace>()
	const [chainID, setChainId] = React.useState<SupportedChainId>()
	const [daoID, setDaoId] = React.useState<string>()
	const [grantsApplicants, setGrantsApplicants] = React.useState<any>([])
	const [grantsDisbursed, setGrantsDisbursed] = React.useState<any>([])
	const [grantWinners, setGrantWinners] = React.useState<any>([])
	const [fundingTime, setFundingTime] = React.useState<any>([])
	const [applicationTime, setApplicationTime] = React.useState<any>([])

	//Tab section
	const tabs = ['Browse Grants', 'About']
	const [selected, setSelected] = useState(0)
	const switchTab = (to: number) => {
		setSelected(to)
	}

	useEffect(() => {
		if(router && router.query) {
			const { chainId: cId, daoId: dId } = router.query
			setChainId((cId as unknown) as SupportedChainId)
			setDaoId(dId?.toString())
		}
	}, [router])

	const [queryParams, setQueryParams] = useState<any>({
		client: subgraphClients[chainID ?? SupportedChainId.RINKEBY].client,
	})

	useEffect(() => {
		if(!daoID) {
			return
		}

		if(!chainID) {
			return
		}

		setQueryParams({
			client: subgraphClients[chainID].client,
			variables: {
				workspaceID: daoID,
				daoID,
			},
		})

	}, [chainID, daoID])

	const { data, error, loading } = useGetDaoDetailsQuery(queryParams)

	useEffect(() => {
		if(data) {
			setWorkspaceData(data?.workspace!)
		}
	}, [data, error, loading])

	const { data: grantsData } = useGetAllGrantsForADaoQuery({
		client:
      subgraphClients[
      	getSupportedChainIdFromSupportedNetwork(workspaceData?.supportedNetworks[0]!) ?? SupportedChainId.RINKEBY
      ].client,
		variables: {
			workspaceId: workspaceData?.id ?? '',
			acceptingApplications: true,
		},
	})

	const { data: fundsData } = useGetFundSentDisburseQuery({
		client:
      subgraphClients[
      	getSupportedChainIdFromSupportedNetwork(workspaceData?.supportedNetworks[0]!) ?? SupportedChainId.RINKEBY
      ].client
	})

	useEffect(() => {
		if(grantsData && grantsData.grants.length >= 1 && grantsApplicants.length === 0) {
			grantsData.grants.forEach((grant) => {
				setGrantsApplicants((array: any) => [...array, grant.numberOfApplications])
			})
		}
	}, [grantsData, grantsApplicants])

	useEffect(() => {
		if(fundsData && fundsData.fundsTransfers.length !== 7 && fundingTime.length === 0) {
			fundsData.fundsTransfers.forEach((created) => {
				setFundingTime((array: any) => [...array, created.createdAtS])
			})
		}
	}, [fundsData, fundingTime])

	useEffect(() => {
		if(grantsData && grantsData.grants.length >= 1) {
			grantsData.grants.forEach((grant) => {
				grant.applications.filter((app) => {
					app.state === 'approved' && setApplicationTime((array: any) => [...array, app.updatedAtS])
				})
			})
		}
	}, [grantsData])

	useEffect(() => {
		if(grantsData && grantsData.grants.length >= 1 && grantWinners.length === 0) {
			grantsData.grants.forEach((grant) => {
				grant.applications.forEach(
					(app: any) => app.state === 'approved' &&
            setGrantWinners((winners: any) => [...winners, app])
				)
			})
		}
	}, [grantsData, grantWinners])

	useEffect(() => {
		if(grantsData && grantsDisbursed.length === 0) {
			grantsData.grants.forEach((grant) => {
				const chainId = getSupportedChainIdFromSupportedNetwork(
					grant.workspace.supportedNetworks[0]
				)

				const tokenInfo =
            CHAIN_INFO[chainId]?.supportedCurrencies[
            	grant.reward.asset.toLowerCase()
            ]

				const tokenValue = formatAmount(
					grant.funding,
					tokenInfo?.decimals ?? 18
				)

				if(tokenInfo !== undefined && tokenValue !== '0') {
					calculateUSDValue(tokenValue, tokenInfo.pair!).then((promise) => {
						setGrantsDisbursed((array: any) => [...array, promise])
					})
				}
			}
			)
		}
	}, [grantsData, grantsDisbursed])

	return (
		<Flex
			direction="column"
			w={
				{
					base: '100%',
					sm: '70%',
					lg: '52%',
				}
			}
			mx="auto"
			mb="1rem"
			borderX="1px solid #E8E9E9"
			borderBottom="1px solid #E8E9E9"
		>
			<Stack w="full">
				<Flex
					bg={workspaceData?.coverImageIpfsHash ? 'white' : 'brand.500'}
					h="210px"
					w="fill"
				>
					{
						workspaceData?.coverImageIpfsHash && (
							<Image
								fit="contain"
								alignSelf="flex-end"
								justifySelf="flex-end"
								src={getUrlForIPFSHash(workspaceData?.coverImageIpfsHash)}
							/>
						)
					}
				</Flex>

				<Flex
					direction="column"
					m="auto"
					w="100%">
					<Flex
						direction="row"
						w="100%"
						align="end"
						mt="-3.5rem"
						px="1.5rem"
						gap="1rem"
					>
						<Image
							src={getUrlForIPFSHash(workspaceData?.logoIpfsHash!)}
							w="120px"
							h="120px"
							borderRadius="12px"
						/>

						<Flex
							direction="column"
							align="start">
							<Text
								variant="heading"
								fontWeight="700"
								fontSize="1.8rem">
								{workspaceData?.title}
							</Text>
							{
								chainID && (
									<Text
										variant="applicationText"
										fontWeight="400"
										fontSize="1rem"
										color="#717A7C"
									>
										{CHAIN_INFO[chainID].name}
									</Text>
								)
							}
						</Flex>

						<Box mr="auto" />

						<Flex
							direction="row"
							alignSelf="start"
							justify="right"
							mt="3.5rem"
							gap="0.5rem"
						>
							{
								workspaceData?.socials.map((social, index) => (
									<IconButton
										key={index}
										aria-label={social.name}
										// as={Button}
										zIndex={10}
										border="1px solid #E8E9E9"
										borderRadius="10px"
										icon={
											<Image
												boxSize="1rem"
												src={`/ui_icons/profile_${social.name}.svg`}
											/>
										}
										bg="white"
										boxSize="2.5rem"
										onClick={
											() => {
												window.open(social.value, '_blank')
											}
										}
									/>
								))
							}
						</Flex>
					</Flex>

					<Stack px="1.5rem">
						{workspaceData?.bio && <SeeMore text={workspaceData?.bio} />}
					</Stack>

					<Stack
						px="1.5rem"
						pb="2rem"
						pt="1rem"
						direction="row"
						justifyContent="space-between"
					>
						<DaoData
							disbursed={grantsDisbursed}
							winners={grantWinners}
							applicants={grantsApplicants}
							grants={grantsData}
							fundTimes={fundingTime}
							applicationTime={applicationTime}
						/>
						<Button
							p="4px 8px"
							border="1px solid #E8E9E9"
							bg="none"
							h="2rem"
							w="fit-content"
							alignSelf="end"
							fontSize="0.875rem"
							lineHeight="2rem"
							color="#373737"
							onClick={() => onOpen()}
						>
							{'</>'}
							{' '}
Embed profile stats
						</Button>
					</Stack>

					<Divider />
					<Stack
						px="1.5rem"
						py="1rem"
						direction="row"
						gap="1rem">
						{
							tabs.map((tab, index) => (
								<Button
									key={index}
									variant="link"
									ml={index === 0 ? 0 : 12}
									_hover={
										{
											color: 'black',
										}
									}
									_focus={{}}
									fontWeight="700"
									fontStyle="normal"
									fontSize="28px"
									lineHeight="44px"
									letterSpacing={-1}
									borderRadius={0}
									color={index === selected ? '#122224' : '#A0A7A7'}
									onClick={() => switchTab(index)}
								>
									{tab}
									{' '}
									{tab === 'Browse Grants' && `(${grantsData?.grants.length})`}
								</Button>
							))
						}
					</Stack>

					<Divider />
				</Flex>
			</Stack>

			{
				// eslint-disable-next-line no-nested-ternary
				selected === 0 ? (
					<>
						{
							grantsData &&
              grantsData.grants.length > 0 &&
              grantsData.grants.map((grant) => {
              	const chainId = getSupportedChainIdFromSupportedNetwork(
              		grant.workspace.supportedNetworks[0]
              	)
              	const chainInfo =
                  CHAIN_INFO[chainId]?.supportedCurrencies[
                  	grant.reward.asset.toLowerCase()
                  ]
              	const [isGrantVerified, funding] = verify(
              		grant.funding,
              		chainInfo?.decimals
              	)
              	return (
              		<BrowseGrantCard
              			daoID={grant.workspace.id}
              			key={grant.id}
              			daoName={grant.workspace.title}
              			isDaoVerified={false}
              			createdAt={grant.createdAtS}
              			grantTitle={grant.title}
              			grantDesc={grant.summary}
              			numOfApplicants={grant.numberOfApplications}
              			endTimestamp={new Date(grant.deadline!).getTime()}
              			grantAmount={
              				formatAmount(
              					grant.reward.committed,
              					chainInfo?.decimals ?? 18,
              					false,
              					true
              				)
              			}
              			disbursedAmount={
              				formatAmount(
              					grant.funding,
              					chainInfo?.decimals ?? 18
              				)
              			}
              			grantCurrency={chainInfo?.label ?? 'LOL'}
              			grantCurrencyIcon={chainInfo?.icon ?? '/images/dummy/Ethereum Icon.svg'}
              			grantCurrencyPair={chainInfo?.pair || null}
              			chainId={chainId}
              			isGrantVerified={isGrantVerified}
              			funding={funding}
              			onClick={
              				() => {
              					if(!(accountData && accountData.address)) {
              						router.push({
              							pathname: '/connect_wallet',
              							query: {
              								flow: '/',
              								grantId: grant.id,
              								chainId,
              							},
              						})
              						return
              					}

              				router.push({
              						pathname: '/explore_grants/about_grant',
              						query: {
              							grantId: grant.id,
              							chainId,
              						},
              					})
              				}
              			}
              			onTitleClick={
              				() => {
              					router.push({
              						pathname: '/explore_grants/about_grant',
              						query: {
              							grantId: grant.id,
              							chainId,
              						},
              					})
              				}
              			}
              		/>
              	)
              })
						}
					</>
				) : (
				// eslint-disable-next-line no-nested-ternary
					selected === 1 && (
						<DaoAbout
							daoAbout={workspaceData?.about}
							daoPartners={workspaceData?.partners}
						/>
					)
				)
			}

			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size="xl">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						p="16px"
						borderBottom="1px solid #E8E9E9">
						<ModalCloseButton />
						<Flex
							direction="column"
							gap="0.5rem">
							<Heading
								fontFamily="DM Sans"
								fontStyle="normal"
								fontWeight="500"
								fontSize="1.25rem"
								lineHeight="1.5rem"
								color="#1F1F33"
							>
							Embed profile stats
							</Heading>
							<Text
								fontFamily="DM Sans"
								fontStyle="normal"
								fontWeight="400"
								fontSize="0.875rem"
								lineHeight="1.25rem"
								color="#7D7DA0"
							>
						Use embed codes for your profile. They are easy to embed on any website and are a great way to get applicants for your DAO.
							</Text>
						</Flex>
					</ModalHeader >
					<ModalBody>
						<embed src="" />
					</ModalBody>
					<ModalFooter />
				</ModalContent>
			</Modal>
		</Flex>
	)
}

Profile.getLayout = function(page: React.ReactElement) {
	return (
		<NavbarLayout renderGetStarted>
			{page}
		</NavbarLayout>
	)
}

export default Profile
