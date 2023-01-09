import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Code, Divider, Flex, Heading, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useClipboard, useDisclosure } from '@chakra-ui/react'
import { logger } from 'ethers'
import { t } from 'i18next'
import { useRouter } from 'next/router'
import { defaultChainId } from 'src/constants/chains'
import { GetAllProposalsForAGrantProgramQuery, GetWorkspaceDetailsQuery, GetWorkspaceGrantsProgramDetailsQuery, useGetAllProposalsForAGrantProgramQuery, useGetWorkspaceDetailsQuery, useGetWorkspaceGrantsProgramDetailsQuery } from 'src/generated/graphql'
import SupportedChainId from 'src/generated/SupportedChainId'
import { useMultiChainQuery } from 'src/libraries/hooks/useMultiChainQuery'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import TextViewer from 'src/libraries/ui/RichTextEditor/textViewer'
import EmbedStatsButton from 'src/screens/profile/EmbedStatsButton'
// import RecentProposalCard from 'src/screens/profile/RecentProposalCard'
import RFPCard from 'src/screens/profile/RFPCard'
import SocialsButton from 'src/screens/profile/SocialsButton'
import SummaryCard from 'src/screens/profile/SummaryCard'
import { SummaryCardProps } from 'src/screens/profile/SummaryCard'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'


function Profile() {

	const buildComponent = () => {
		return (
			<Flex
				direction='column'
				w='100vw'
				h='calc(100vh - 64px)'
				align='center'
				py={6}>
				<Flex
					w='63%'
					bg='white'
					boxShadow='0px 2px 4px rgba(29, 25, 25, 0.1)'
					minH='max-content'
					borderRadius='4px'
					alignItems='flex-start'
					direction='column'
					position='relative'
				>
					{/* Cover image and profile image section */}
					<Flex
						w='100%'
						direction='column'
					>
						<Image
							src={getUrlForIPFSHash(workspaceData?.workspace?.coverImageIpfsHash!)}
							fallbackSrc='/v2/images/cover-image.svg'
							w='100%'
							height='182px'
							fit='cover'
						/>
						<Image
							boxSize={32}
							src={getUrlForIPFSHash(workspaceData?.workspace?.logoIpfsHash!)}
							position='absolute'
							top='94px'
							left='20px'
							borderRadius='5px'
						/>
						{/* Socials start */}
						<Flex
							// w='100%'
							justifyContent='flex-end'
							alignItems='baseline'
							position='relative'
							// top='134px'
							gap={2}
							p={4}
						>

							<EmbedStatsButton onClick={() => onOpen()} />
							{
								data?.grants.length !== 0 ?	data?.grants[0].workspace.socials.map((social, i) => {
									return (
										<SocialsButton
											key={i}
											name={social.name!}
											value={social.value} />
									)
								}) : <></>
							}
						</Flex>
						{/* Socials end */}
					</Flex>
					{/* Cover and profile image section ends */}

					{/* Profile details section */}
					<Flex
						w='100%'
						direction='column'
						px={6}
						h='100%'
						position='relative'
						top='-20px'
						gap={6}
					>
						<Text
							variant='v2_heading_3'
							fontWeight='500'>
							{workspaceData?.workspace?.title!}
						</Text>
						{/* start about */}
						{
							workspaceData?.workspace?.about && (
								<Flex
									direction='column'
									gap={2}
								>
									<Text
										variant='v2_title'
										color='gray.5'>
										About
									</Text>
									<Text>
										{data?.grants[0].workspace.bio}
									</Text>
								</Flex>
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
											variant='v2_heading_3'
											fontSize='1.25rem'
											lineHeight='1.5rem'
											color='#1F1F33'
										>
											{t('/profile.embed_stats')}
										</Heading>
										<Text
											variant='v2_body'
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

						{/* end about */}

						<Flex gap={4}>
							{/* summary cards */}
							{
								summaryCardData.map((item: Partial<SummaryCardProps>, index: number) => {
									const totalGrantFundingDisbursed = workspaceData?.workspace?.totalGrantFundingDisbursedUSD.toString()!
									const numberOfProposals = workspaceData?.workspace?.numberOfApplications.toString()!
									const totalProposalsSelected = workspaceData?.workspace?.numberOfApplicationsSelected.toString()!
									return (
										<SummaryCard
											imagePath={item.imagePath}
											text={item.text!}
											value={index === 0 ? `$${totalGrantFundingDisbursed}` : index === 1 ? numberOfProposals : totalProposalsSelected}
											key={index}
										/>
									)
								})
							}
						</Flex>
					</Flex>
				</Flex>
				<Flex
					mt={6}
					w='63%'
					bg='white'
					boxShadow='0px 2px 4px rgba(29, 25, 25, 0.1)'
					h='max-content'
					p={6}
					borderRadius='4px'
					direction='column'
					gap={4}
				>
					{ }
					{/* Menu buttons */}
					<Flex gap={2}>
						{
							MenuButtons.map((item, index) => {
								return (
									<Button
										variant='menuButton'
										key={index}
										isDisabled={index === activeMenuButton}
										onClick={
											() => {
												logger.info('Menu button clicked', { index })
												setActiveMenuButton(index)
											}
										}
									>
										{index === 0 ? `Invite for proposals (${data?.grants.length})` : item.text}
									</Button>
								)
							})

						}

					</Flex>

					<Divider p={1} />

					<Flex
						direction='column'
						gap={4}
						pt={4}
					>
						{activeMenuButton === 0 && (renderInviteForProposals())}
						{/* {activeMenuButton === 1 && (renderRecentProposals())} */}
						{activeMenuButton === 1 && (renderMoreInfo())}
					</Flex>

					{/* RFP Card */}
					{/* {
						data?.grants.map((rfp: GetWorkspaceGrantsProgramDetailsQuery['grants'][0]) => {
							return (
								<RFPCard
									RFPTitle={rfp.title}
									amountPaid='$1000'
									startDate={rfp.startDate!}
									endDate={rfp.deadline!}
									numberOfProposals={rfp.applications.length}
									acceptingApplications={rfp.acceptingApplications}
									grantProgramId={rfp.id}
									chainId={chainId as unknown as SupportedChainId}
									key={rfp.id} />
							)
						})
					} */}
				</Flex>
			</Flex>
		)
	}

	const renderInviteForProposals = () => {
		return data?.grants.map((rfp: GetWorkspaceGrantsProgramDetailsQuery['grants'][0]) => {
			const fundTransfers = rfp.fundTransfers.filter(transfer => transfer.status === 'executed').map(t => parseInt(t.amount))
			let amountPaid: number = 0
			if(fundTransfers.length) {
				amountPaid = fundTransfers.reduce((prev, currValue) => prev + currValue)
			}

			return (
				<RFPCard
					RFPTitle={rfp.title}
					amountPaid={amountPaid.toString()}
					startDate={rfp.startDate!}
					endDate={rfp.deadline!}
					numberOfProposals={rfp.applications.length}
					acceptingApplications={rfp.acceptingApplications}
					grantProgramId={rfp.id}
					chainId={chainId as unknown as SupportedChainId}
					key={rfp.id} />
			)
		})
	}

	const renderMoreInfo = () => {
		logger.info('data', data?.grants[0].workspace.about)
		return (
			<Text>
				{data?.grants[0].workspace.about ?? 'YOO'}
			</Text>
		)
	}


	// Recent proposals tab will be displayed in community view

	// const renderRecentProposals = () => {
	// 	// return data?.grants[]
	// 	return proposalData?.map((proposal, i) => {
	// 		const applicantName = getFieldString(proposal, 'applicantName')
	// 		const proposalTitle = getFieldString(proposal, 'projectName')
	// 		const tldr = getFieldString(proposal, 'tldr')
	// 		const updatedAt = moment.unix(proposal.updatedAtS).format('DD MMM YYYY')
	// 		return (
	// 			<RecentProposalCard
	// 				proposalTitle={proposalTitle}
	// 				tldr={tldr}
	// 				applicantName={applicantName}
	// 				updatedAt={updatedAt}
	// 				key={i}
	// 			/>
	// 		)
	// 	})
	// }


	const closeModal = () => {
		onClose()
		setCodeActive(false)
	}


	// const grantsProgramDetails = () => {}

	const summaryCardData: Partial<SummaryCardProps>[] = [{
		text: 'paid out',
		imagePath: '/v2/icons/money-dollar-box-line.svg',
	},
	{
		text: 'proposals',
		imagePath: '/v2/icons/proposal-box.svg',
	},
	{
		text: 'accepted',
		imagePath: '/v2/icons/medal.svg',
	}]

	const MenuButtons = [
		{
			// text: `Invite for proposals (${data?.grants.length})`,
			isDisabled: true
		},
		// {
		// 	text: 'Recent Proposals',
		// 	isDisabled: false
		// },
		{
			text: 'More info',
			isDisabled: false
		},
		{
			text: 'Stats',
			isDisabled: false
		}
	]


	const router = useRouter()
	const { onOpen, isOpen, onClose } = useDisclosure()

	const [data, setData] = useState<GetWorkspaceGrantsProgramDetailsQuery>()
	const [workspaceData, setWorkspaceData] = useState<GetWorkspaceDetailsQuery>()
	const [, setProposalData] = useState<GetAllProposalsForAGrantProgramQuery['grantApplications']>()
	const [activeMenuButton, setActiveMenuButton] = useState(0)
	const [codeActive, setCodeActive] = useState(false)

	const { daoId, chainId: _chainId } = router.query

	const workspaceId = daoId as string

	const chainId = useMemo(() => {
		try {
			return typeof _chainId === 'string' ? parseInt(_chainId) : -1
		} catch(e) {
			return -1
		}
	}, [_chainId])

	const value = `<embed src="https://beta.questbook.app/embed/?daoId=${workspaceId}&chainId=${chainId}" type="text/html" width="700" height="700" />`
	const { hasCopied, onCopy } = useClipboard(value)

	const { fetchMore } = useMultiChainQuery({
		useQuery: useGetWorkspaceGrantsProgramDetailsQuery,
		options: {},
		chains: [chainId === -1 ? defaultChainId : chainId]
	})

	const { fetchMore: fetchMoreProposals } = useMultiChainQuery({
		useQuery: useGetAllProposalsForAGrantProgramQuery,
		options: {},
		chains: [chainId === -1 ? defaultChainId : chainId]
	})

	const { fetchMore: fetchMoreWorkspaceDetails } = useMultiChainQuery({
		useQuery: useGetWorkspaceDetailsQuery,
		options: {},
		chains: [chainId === -1 ? defaultChainId : chainId]
	})

	const workspace = useCallback(async() => {
		const response = await fetchMoreWorkspaceDetails({
			workspaceID: workspaceId
		}, true)
		logger.info('response', response[0]?.workspace)
		setWorkspaceData(response[0])
	}, [workspaceId, chainId])

	const grants = useCallback(async() => {
		const response = await fetchMore({
			workspaceId: workspaceId
		}, true)
		logger.info('response', response[0]?.grants)
		setData(response[0])
	}, [workspaceId, chainId])

	const proposals = useCallback(async() => {
		const response = await fetchMoreProposals({
			workspaceId: workspaceId
		}, true)
		logger.info('response', response[0]?.grantApplications)
		setProposalData(response[0]?.grantApplications)
	}, [workspaceId, chainId])

	useEffect(() => {
		logger.info('grantProgramData', data?.grants[0].workspace)
	}, [data?.grants[0]?.workspace])

	useEffect(() => {
		if(workspaceId && chainId) {
			workspace()
			grants()
			proposals()
		}
	}, [workspaceId, chainId])

	return buildComponent()
}

Profile.getLayout = (page: ReactElement) => {
	return (
		<NavbarLayout renderSidebar={false}>
			{page}
		</NavbarLayout>
	)
}

export default Profile