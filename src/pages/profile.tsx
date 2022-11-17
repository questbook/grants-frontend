// UI Components
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
	Box,
	Button,
	Code,
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
	useClipboard,
	useDisclosure,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import DaoAbout from 'src/components/profile/dao_about'
import DaoData from 'src/components/profile/dao_data'
import BrowseGrantCard from 'src/components/profile/grantCard'
import SeeMore from 'src/components/profile/see_more'
import { defaultChainId, SupportedChainId } from 'src/constants/chains'
import { CHAIN_INFO } from 'src/constants/chains'
import config from 'src/constants/config.json'
import { useGetDaoDetailsQuery, useGetFundsAndProfileDataQuery } from 'src/generated/graphql'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
// APP LAYOUT & STATE
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import { ApiClientsContext } from 'src/pages/_app'
// CONSTANTS AND TYPES
import type { DAOWorkspace } from 'src/types'
import getAvatar from 'src/utils/avatarUtils'
import { formatAmount } from 'src/utils/formattingUtils'
import verify from 'src/utils/grantUtils'
// UTILS AND TOOLS
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import logger from 'src/utils/logger'
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils'

function Profile() {
	const router = useRouter()
	const { onOpen, isOpen, onClose } = useDisclosure()

	const { subgraphClients } = React.useContext(ApiClientsContext)!
	// const { data: accountData, nonce } = useQuestbookAccount()

	const [workspaceData, setWorkspaceData] = React.useState<DAOWorkspace>()
	const [chainID, setChainId] = React.useState<SupportedChainId>()
	const [daoID, setDaoId] = React.useState<string>()
	const [fundingTime, setFundingTime] = React.useState<any>([])
	const [applicationTime, setApplicationTime] = React.useState<any>([])
	const { network, switchNetwork } = useNetwork()

	const { t } = useTranslation()

	//Tab section
	const tabs = [t('/profile.browse'), t('/profile.more_info')]
	const [selected, setSelected] = useState(0)
	const switchTab = (to: number) => {
		setSelected(to)
	}


	useEffect(() => {
		if(router?.query) {
			const { chainId: cId, daoId: dId } = router.query
			setChainId((cId as unknown) as SupportedChainId)
			setDaoId(dId?.toString())
			logger.info('SWITCH NETWORK (profile.tsx 1): ', (cId as unknown) as SupportedChainId)
			switchNetwork((cId as unknown) as SupportedChainId)
		}
	}, [router, network])

	const [queryParams, setQueryParams] = useState<any>({
		client: subgraphClients[chainID || defaultChainId].client,
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
			// console.log('data', data)
			setWorkspaceData(data?.workspace!)
		}
	}, [data, error, loading])

	const { data: allDaoData } = useGetFundsAndProfileDataQuery({
		client:
			subgraphClients[
				getSupportedChainIdFromSupportedNetwork(workspaceData?.supportedNetworks[0]!) || defaultChainId
			].client,
		variables: {
			workspaceId: workspaceData?.id || '',
			acceptingApplications: true,
		},
	})

	useEffect(() => {
		if(allDaoData && fundingTime.length === 0) {
			allDaoData.fundsTransfers.forEach((created) => {
				setFundingTime((array: any) => [...array, created.createdAtS])
			})
		}
	}, [allDaoData, fundingTime])

	useEffect(() => {
		if(allDaoData && allDaoData.grants.length >= 1) {
			allDaoData.grants.forEach((grant) => {
				grant.applications.filter((app) => {
					app.state === 'approved' && setApplicationTime((array: any) => [...array, app.updatedAtS])
				})
			})
		}
	}, [allDaoData])

	const value = `<embed src="https://www.questbook.app/embed/?daoId=${daoID}&chainId=${chainID}" type="text/html" width="700" height="700" />`
	const { hasCopied, onCopy } = useClipboard(value)
	const [codeActive, setCodeActive] = useState(false)
	const closeModal = () => {
		onClose()
		setCodeActive(false)
	}

	return (
		<Flex
			direction='column'
			mx='auto'
			mb='1rem'
			pb='1rem'
			maxW='75%'
			borderX='1px solid #E8E9E9'
		// borderBottom="1px solid #E8E9E9"
		>
			<Stack w='full'>
				<Flex
					bg={workspaceData?.coverImageIpfsHash ? 'white' : 'brand.500'}
					h={{ base: '125px', md: '210px' }}
					w='fill'
				>
					{
						workspaceData?.coverImageIpfsHash && (
							<Image
								fit='contain'
								alignSelf='flex-end'
								justifySelf='flex-end'
								src={
									workspaceData?.coverImageIpfsHash === config.defaultDAOImageHash ?
										getAvatar(true, workspaceData?.title!) :
										getUrlForIPFSHash(workspaceData?.coverImageIpfsHash)
								}
							/>
						)
					}
				</Flex>

				<Flex
					direction='column'
					m='auto'
					w='100%'>
					<Flex
						direction='row'
						w='100%'
						align='end'
						mt='-3.5rem'
						px='1.5rem'
						gap='1rem'
					>
						<Image
							src={workspaceData?.logoIpfsHash! === config.defaultDAOImageHash ? getAvatar(true, workspaceData?.title) : getUrlForIPFSHash(workspaceData?.logoIpfsHash!)}
							w='120px'
							h='120px'
							borderRadius='12px'
						/>


						<Box mr='auto' />


						<Flex
							direction='row'
							alignSelf='start'
							justify='right'
							mt='3.5rem'
							gap='0.5rem'
						>
							{
								workspaceData?.socials.map((social, index) => (
									<IconButton
										key={index}
										aria-label={social.name}
										// as={Button}
										zIndex={10}
										border='1px solid #E8E9E9'
										borderRadius='10px'
										icon={
											<Image
												boxSize='1rem'
												src={`/ui_icons/profile_${social.name}.svg`}
											/>
										}
										bg='white'
										boxSize='2.5rem'
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
					<Flex
						pl='25px'
						direction='column'
						align='start'>
						<Text
							variant='heading'
							fontWeight='700'
							fontSize='20px'>
							{workspaceData?.title}
						</Text>
						{/* {
							chainID && (
								<Text
									variant='applicationText'
									fontWeight='400'
									fontSize='1rem'
									color='#717A7C'
									lineHeight='10px'
								>
									{CHAIN_INFO[chainID].name}
								</Text>
							)
						} */}
					</Flex>

					<Stack px='1.5rem'>
						{workspaceData?.bio && <SeeMore text={workspaceData?.bio} />}
					</Stack>

					<Stack
						px='1.5rem'
						pb={{ base: '16px', md: '2rem' }}
						pt='1rem'
						direction='row'
						justifyContent='space-between'
					>
						<DaoData
							disbursed={data?.workspace?.totalGrantFundingDisbursedUSD ?? 0}
							winners={data?.workspace?.numberOfApplicationsSelected ?? 0}
							applicants={data?.workspace?.numberOfApplications ?? 0}
							fundTimes={fundingTime}
							applicationTime={applicationTime}
						/>
						<Button
							px='8px'
							border='1px solid #E8E9E9'
							bg='none'
							h='2rem'
							w='fit-content'
							alignSelf='end'
							fontSize='0.875rem'
							lineHeight='2rem'
							color='#373737'
							onClick={() => onOpen()}
							display={{ base: 'none', md: 'block' }}
						>
							{'</>'}
							{' '}
							{t('/profile.embed_stats')}
						</Button>
					</Stack>

					<Divider />
					<Stack
						px={{ base: '16px', md: '1.5rem' }}
						py={{ base: '12px', md: '1rem' }}
						direction='row'
						gap='1rem'>
						{
							tabs.map((tab, index) => (
								<Button
									key={index}
									variant='link'
									ml={index === 0 ? 0 : 12}
									_hover={
										{
											color: 'black',
										}
									}
									_focus={{}}
									fontWeight='700'
									fontStyle='normal'
									fontSize={{ base: '16px', md: '28px' }}
									// lineHeight="44px"
									letterSpacing={-1}
									borderRadius={0}
									color={index === selected ? '#122224' : '#A0A7A7'}
									onClick={() => switchTab(index)}
								>
									{tab}
									{' '}
									{tab === t('/profile.browse') && `(${allDaoData?.grants.length})`}
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
							allDaoData &&
							allDaoData.grants.length > 0 &&
							allDaoData.grants.map((grant) => {
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
										key={grant.id}
										isDaoVerified={false}
										createdAt={grant.createdAtS}
										grantTitle={grant.title}
										grantDesc={grant.summary}
										numOfApplicants={grant.numberOfApplications}
										endTimestamp={new Date(grant.deadline!).getTime()}
										grantAmount={
											formatAmount(
												grant.reward.committed,
												chainInfo?.decimals,
												false,
												true
											)
										}
										disbursedAmount={
											formatAmount(
												grant.funding,
												chainInfo?.decimals
											)
										}
										grantCurrency={chainInfo?.label || 'LOL'}
										grantCurrencyIcon={chainInfo?.icon || '/images/dummy/Ethereum Icon.svg'}
										grantCurrencyPair={chainInfo?.pair || null}
										isGrantVerified={isGrantVerified}
										funding={funding}
										onClick={
											() => {
												// if(!(accountData && accountData.address)) {
												// 	router.push({
												// 		pathname: '/connect_wallet',
												// 		query: {
												// 			flow: '/',
												// 			grantId: grant.id,
												// 			chainId,
												// 		},
												// 	})
												// 	return
												// }

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
				onClose={() => closeModal()}
				size='3xl'
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						p='16px'
						borderBottom='1px solid #E8E9E9'>
						<ModalCloseButton />
						<Flex
							direction='column'
							gap='0.5rem'>
							<Heading
								fontFamily='DM Sans'
								fontStyle='normal'
								fontWeight='500'
								fontSize='1.25rem'
								lineHeight='1.5rem'
								color='#1F1F33'
							>
								{t('/profile.embed_stats')}
							</Heading>
							<Text
								fontFamily='DM Sans'
								fontStyle='normal'
								fontWeight='400'
								fontSize='0.875rem'
								lineHeight='1.25rem'
								color='#7D7DA0'
							>
								Use embed codes for your profile. They are easy to embed on any website and are a great way to get applicants for your DAO.
							</Text>
						</Flex>
					</ModalHeader >
					<ModalBody
						gap='1rem'
						m='auto'
					>
						{
							!codeActive ? (
								<Image
									src='/images/embed_sample.png'
									height='360' />
							) : (
								<Code
									w='98%'
									p='1rem'
									// eslint-disable-next-line react/no-children-prop
									children={value}
								/>
							)
						}
					</ModalBody>
					<ModalFooter
						borderTop='1px solid #E8E9E9'
						justifyContent='center'
					>
						<Button
							onClick={() => !codeActive ? setCodeActive(true) : onCopy()}
							color='#FFFFFF'
							bg='#1F1F33'
							p='1rem'
							_hover={{ bg: '#1F1F33', color: '#FFFFFF' }}
							_focus={{ bg: '#1F1F33', color: '#FFFFFF' }}
							_active={{ bg: '#1F1F33', color: '#FFFFFF' }}
							w='90%'
							borderRadius='0.5rem'
							justifySelf='center'
						>
							{!codeActive ? 'Get embed code' : hasCopied ? 'Copied' : 'Copy'}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Flex>
	)
}

Profile.getLayout = function(page: React.ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

export default Profile
