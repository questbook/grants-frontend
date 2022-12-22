import { ReactElement, useCallback, useEffect, useState } from 'react'
import { Button, Divider, Flex, Image, Text } from '@chakra-ui/react'
import { logger } from 'ethers'
import { useRouter } from 'next/router'
import { GetWorkspaceGrantsProgramDetailsQuery, useGetWorkspaceGrantsProgramDetailsQuery } from 'src/generated/graphql'
import SupportedChainId from 'src/generated/SupportedChainId'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import TextViewer from 'src/libraries/ui/RichTextEditor/textViewer'
import EmbedStatsButton from 'src/screens/profile/EmbedStatsButton'
import RFPCard from 'src/screens/profile/RFPCard'
import SocialsButton from 'src/screens/profile/SocialsButton'
import SummaryCard from 'src/screens/profile/SummaryCard'
import { SummaryCardProps } from 'src/screens/profile/SummaryCard'
import { useMultiChainQuery } from 'src/screens/proposal/_hooks/useMultiChainQuery'
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
					// h='50%'
					minH='100px'
					borderRadius='4px'
					alignItems='flex-start'
					direction='column'
				>
					{/* Cover image and profile image section */}
					<Flex
						w='100%'
						direction='column'
					>
						<Image
							src={getUrlForIPFSHash(data?.grants[0].workspace.coverImageIpfsHash!)}
							fallbackSrc='/v2/images/cover-image.svg'
							w='100%'
							height='182px'
							fit='cover'
						/>
						<Image
							boxSize={32}
							src={getUrlForIPFSHash(data?.grants[0].workspace.logoIpfsHash!)}
							position='relative'
							top='-94px'
							left='20px'
							borderRadius='5px'
						/>
						{/* Socials start */}
						<Flex
							// w='100%'
							justifyContent='flex-end'
							position='relative'
							top='-134px'
							p={4}
						>
							<EmbedStatsButton />
							<SocialsButton />
						</Flex>
						{/* Socials end */}
					</Flex>
					{/* Cover and profile image section ends */}

					{/* Profile details section */}
					<Flex
						w='100%'
						direction='column'
						p={4}
						h='100%'
						position='relative'
						top='-168px'
						gap={10}
					>
						<Text
							variant='v2_heading_3'
							fontWeight='500'>
							{data?.grants[0].workspace.title!}
						</Text>
						{/* start about */}
						{
							data?.grants[0].workspace.about && (
								<Flex
									direction='column'
									gap={2}
								>
									<Text
										variant='v2_title'
										color='gray.5'>
										About
									</Text>
									{
								data?.grants[0].workspace.about!.startsWith('{') ? (<TextViewer text={data?.grants[0].workspace.about!} />) : (
									<Text>
										{data?.grants[0].workspace.about}
									</Text>
								)
									}
								</Flex>
							)
						}

						{/* end about */}

						<Flex gap={4}>
							{/* summary cards */}
							{
								summaryCardData.map((item: Partial<SummaryCardProps>, index: number) => {
									return (
										<SummaryCard
											imagePath={item.imagePath}
											text={item.text!}
											value={index === 0 ? `$${data?.grants[0].workspace.totalGrantFundingDisbursedUSD.toString()!}` : index === 1 ? data?.grants[0].workspace.numberOfApplications!.toString()! : data?.grants[0].workspace.numberOfApplicationsSelected!.toString()!}
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
					p={4}
					borderRadius='4px'
					direction='column'
					gap={4}
				>
					{ }
					{/* Menu buttons */}
					<Flex gap={2}>
						{
							MenuButtons.map((item: any, index: number) => {
								return (
									<Button
										variant='menuButton'
										key={index}
										isDisabled={index === activeMenuButton}
										onClick={
											() => {
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

					<Divider />

					{/* RFP Card */}
					{
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
					}
				</Flex>
			</Flex>
		)
	}

	const renderInviteForProposals = () => {
		return (
			<></>
		)
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
			text: `Invite for proposals (${data?.grants.length})`,
			isDisabled: true
		},
		{
			text: 'More info',
			isDisabled: false
		},
		{
			text: 'Stats',
			isDisabled: false
		},
		{
			text: 'Recent Proposals',
			isDisabled: false
		}
	]

	const router = useRouter()
	// const { onOpen, isOpen, onClose } = useDisclosure()

	const [data, setData] = useState<GetWorkspaceGrantsProgramDetailsQuery>()
	const [activeMenuButton, setActiveMenuButton] = useState(0)

	const { daoId, chainId } = router.query
	const workspaceId = daoId as string
	logger.info('workspaceId', workspaceId, chainId)

	const { fetchMore } = useMultiChainQuery({
		useQuery: useGetWorkspaceGrantsProgramDetailsQuery,
		options: {},
		chains: [chainId as unknown as SupportedChainId]
	})

	const grants = useCallback(async() => {
		const response = await fetchMore({
			workspaceId: workspaceId
		}, true)
		logger.info('response', response[0]?.grants)
		setData(response[0])
	}, [workspaceId, chainId])

	useEffect(() => {
		if(workspaceId && chainId) {
			grants()
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