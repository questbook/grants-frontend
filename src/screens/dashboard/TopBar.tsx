// import { useContext, useMemo, useRef } from 'react'
// import { Button, Flex, IconButton, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Text } from '@chakra-ui/react'
// import { logger } from 'ethers'
// import router from 'next/router'
// import { ArrowLeft, ArrowRight, Copy, Embed, Pencil, ShareForward } from 'src/generated/icons'
// import useCustomToast from 'src/libraries/hooks/useCustomToast'
// import { copyGrantLink } from 'src/libraries/utils/copy'
// import { ApiClientsContext } from 'src/contexts/ApiClientsContext'
// import { DashboardContext } from 'src/screens/dashboard/Context'

// function TopBar() {
// 	const buildComponent = () => {
// 		return (
// 			<Flex
// 				w='100%'
// 				h='64px'
// 				px={8}
// 				py={4}
// 				align='center'>
// 				{
// 					grants.length > 1 && (
// 						<IconButton
// 							disabled={!isLeftArrowEnabled}
// 							variant='ghost'
// 							aria-label='left-arrow'
// 							icon={<ArrowLeft color={isLeftArrowEnabled ? 'black.1' : 'gray.3'} />}
// 							onClick={
// 								() => {
// 									if(isLeftArrowEnabled) {
// 										setSelectedGrantIndex((selectedGrantIndex! - 1) % grants.length)
// 									}
// 								}
// 							} />
// 					)
// 				}
// 				{
// 					grants.length > 1 && (
// 						<IconButton
// 							disabled={!isRightArrowEnabled}
// 							variant='ghost'
// 							aria-label='right-arrow'
// 							icon={<ArrowRight color={isRightArrowEnabled ? 'black.1' : 'gray.3'} />}
// 							onClick={
// 								() => {
// 									if(isRightArrowEnabled) {
// 										setSelectedGrantIndex((selectedGrantIndex! + 1) % grants.length)
// 									}
// 								}
// 							} />
// 					)
// 				}
// 				<Text
// 					ml={2}
// 					variant='v2_subheading'
// 					fontWeight='500'>
// 					{selectedGrant?.title}
// 				</Text>
// 				<Text
// 					variant='v2_body'
// 					fontWeight='500'
// 					ml={2}
// 					px={2}
// 					borderRadius='4px'
// 					bg={selectedGrant?.acceptingApplications ? 'accent.june' : 'accent.royal'}>
// 					{selectedGrant?.acceptingApplications ? 'OPEN' : 'CLOSED'}
// 				</Text>
// 				{
// 					(proposals.length === 0 && selectedGrant?.acceptingApplications) && (
// 						<Button
// 							ml={2}
// 							bg='gray.1'
// 							variant='link'
// 							color='black.1'
// 							onClick={
// 								() => {
// 									router.push(
// 										{
// 											pathname: '/request_proposal/',
// 											query: {
// 												grantId: selectedGrant?.id,
// 												workspaceId: workspace?.id
// 											},
// 										})

// 								}
// 							}
// 							leftIcon={<Pencil boxSize='16px' />}>

// 							<Text
// 								variant='v2_body'
// 								fontWeight='500'>
// 								Edit
// 							</Text>

// 						</Button>
// 					)
// 				}
// 				{sharePopover()}
// 			</Flex>
// 		)
// 	}

// 	const popoverRef = useRef<HTMLButtonElement>(null)
// 	const { chainId, workspace } = useContext(ApiClientsContext)!
// 	const { selectedGrant, selectedGrantIndex, setSelectedGrantIndex, grants, proposals } = useContext(DashboardContext)!

// 	const isLeftArrowEnabled = useMemo(() => {
// 		if(!grants?.length || selectedGrantIndex === undefined || !selectedGrant?.id) {
// 			logger.info({ cond1: grants?.length, cond2: selectedGrantIndex }, '(Left arrow) Conditions not met')
// 			return false
// 		}

// 		const index = grants.findIndex(grant => grant.id.indexOf(selectedGrant.id) !== -1)
// 		logger.info({ index, id: selectedGrant?.id, grants }, '(Left arrow) Index')
// 		return index > 0
// 	}, [grants, selectedGrant])

// 	const isRightArrowEnabled = useMemo(() => {
// 		if(!grants?.length || selectedGrantIndex === undefined || !selectedGrant?.id) {
// 			logger.info({ cond1: grants?.length, cond2: selectedGrantIndex }, '(Right arrow) Conditions not met')
// 			return false
// 		}

// 		const index = grants.findIndex(grant => grant.id.indexOf(selectedGrant.id) !== -1)
// 		logger.info({ index, id: selectedGrant?.id, grants }, '(Right arrow) Index')
// 		return index >= 0 && index < grants.length - 1
// 	}, [grants, selectedGrant])

// 	const toast = useCustomToast()

// 	return buildComponent()
// }

// export default TopBar

export default {}