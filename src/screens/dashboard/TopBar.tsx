import { useContext, useMemo, useRef } from 'react'
import { Button, Flex, IconButton, Image, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Text } from '@chakra-ui/react'
import { logger } from 'ethers'
import router from 'next/router'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import { copyGrantLink } from 'src/libraries/utils/copy'
import { ApiClientsContext } from 'src/pages/_app'
import { DashboardContext } from 'src/screens/dashboard/Context'

function TopBar() {
	const buildComponent = () => {
		return (
			<Flex
				w='100%'
				h='64px'
				px={8}
				py={4}
				align='center'>
				<IconButton
					disabled={!isLeftArrowEnabled}
					variant='ghost'
					aria-label='left-arrow'
					icon={<Image src={`/v2/icons/arrow left/${isLeftArrowEnabled ? 'enabled' : 'disabled'}.svg`} />}
					onClick={
						() => {
							if(isLeftArrowEnabled) {
								setSelectedGrantIndex((selectedGrantIndex! - 1) % grants.length)
							}
						}
					} />
				<IconButton
					disabled={!isRightArrowEnabled}
					variant='ghost'
					aria-label='right-arrow'
					icon={<Image src={`/v2/icons/arrow right/${isRightArrowEnabled ? 'enabled' : 'disabled'}.svg`} />}
					onClick={
						() => {
							if(isRightArrowEnabled) {
								setSelectedGrantIndex((selectedGrantIndex! + 1) % grants.length)
							}
						}
					} />
				<Text
					ml={2}
					variant='v2_subheading'
					fontWeight='500'>
					{selectedGrant?.title}
				</Text>
				<Text
					variant='v2_body'
					fontWeight='500'
					ml={2}
					px={2}
					borderRadius='4px'
					bg={selectedGrant?.acceptingApplications ? 'accent.june' : 'accent.royal'}>
					{selectedGrant?.acceptingApplications ? 'OPEN' : 'CLOSED'}
				</Text>
				<Button
					ml={2}
					bg='gray.1'
					variant='link'
					color='black.1'
					onClick={
						() => {
							router.push(
								{
									pathname: '/request_proposal/',
									query: {
										grantId: selectedGrant?.id,
										workspaceId: workspace?.id
									},
								})

						}
					}
					leftIcon={
						<Image
							src='/v2/icons/pencil.svg'
							boxSize='16px' />
					}>
					<Text
						variant='v2_body'
						fontWeight='500'>
						Edit
					</Text>
				</Button>
				{sharePopover()}
			</Flex>
		)
	}

	const sharePopover = () => {
		return (
			<Popover
				isLazy
				initialFocusRef={popoverRef}>
				{
					({ onClose }) => (
						<>
							<PopoverTrigger>
								{sharePopoverButton()}
							</PopoverTrigger>
							<PopoverContent>
								<PopoverArrow />
								<PopoverBody
									maxH='40vh'>
									{
										popoverBodyItem.map((item, index) => {
											return (
												<Flex
													py={3}
													px={4}
													key={index}
													direction='column'
													align='start'>
													<Text
														variant='v2_body'
														fontWeight='500'>
														{item.title}
													</Text>
													<Text
														variant='v2_body'
														mt={1}>
														{item.description}
													</Text>
													<Button
														justifyContent='flex-start'
														leftIcon={
															<Image
																src={item.buttonIcon}
																boxSize='20px' />
														}
														mt={4}
														variant='link'
														onClick={
															() => {
																onClose()
																item.onButtonClick()
															}
														}>
														<Text
															variant='v2_body'
															color='accent.azure'>
															{item.buttonText}
														</Text>
													</Button>
												</Flex>
											)
										})
									}
								</PopoverBody>
							</PopoverContent>
						</>
					)
				}
			</Popover>
		)
	}

	const popoverBodyItem = [
		{
			title: 'Share',
			description: 'Attract builders with a link, or embed your stats on any website.',
			buttonIcon: '/v2/icons/copy/azure.svg',
			buttonText: 'Copy Link',
			onButtonClick: async() => {
				if(selectedGrant?.id) {
					const ret = await copyGrantLink(selectedGrant.id, chainId)
					logger.info('copyGrantLink', ret)
					toast({
						title: ret ? 'Copied!' : 'Failed to copy',
						status: ret ? 'success' : 'error',
						duration: 3000,
					})
				}
			}
		},
		{
			title: 'Embed',
			description: 'Add your stats and link to any website with embed.',
			buttonIcon: '/v2/icons/embed.svg',
			buttonText: 'Embed code',
			onButtonClick: () => {}
		}
	]

	const sharePopoverButton = () => {
		return (
			<Button
				ml='auto'
				bg='gray.1'
				variant='link'
				color='black.1'
				leftIcon={
					<Image
						src='/v2/icons/share forward.svg'
						boxSize='16px' />
				}>
				<Text
					variant='v2_body'
					fontWeight='500'>
					Share
				</Text>
			</Button>
		)
	}

	const popoverRef = useRef<HTMLButtonElement>(null)
	const { chainId, workspace } = useContext(ApiClientsContext)!
	const { selectedGrant, selectedGrantIndex, setSelectedGrantIndex, grants } = useContext(DashboardContext)!

	const isLeftArrowEnabled = useMemo(() => {
		if(!grants?.length || selectedGrantIndex === undefined || !selectedGrant?.id) {
			logger.info({ cond1: grants?.length, cond2: selectedGrantIndex }, '(Left arrow) Conditions not met')
			return false
		}

		const index = grants.findIndex(grant => grant.id.indexOf(selectedGrant.id) !== -1)
		logger.info({ index, id: selectedGrant?.id, grants }, '(Left arrow) Index')
		return index > 0
	}, [grants, selectedGrant])

	const isRightArrowEnabled = useMemo(() => {
		if(!grants?.length || selectedGrantIndex === undefined || !selectedGrant?.id) {
			logger.info({ cond1: grants?.length, cond2: selectedGrantIndex }, '(Right arrow) Conditions not met')
			return false
		}

		const index = grants.findIndex(grant => grant.id.indexOf(selectedGrant.id) !== -1)
		logger.info({ index, id: selectedGrant?.id, grants }, '(Right arrow) Index')
		return index >= 0 && index < grants.length - 1
	}, [grants, selectedGrant])

	const toast = useCustomToast()

	return buildComponent()
}

export default TopBar