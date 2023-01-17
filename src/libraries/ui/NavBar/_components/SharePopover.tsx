import { useContext, useRef } from 'react'
import { Button, Flex, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Text } from '@chakra-ui/react'
import { Copy, ShareForward } from 'src/generated/icons'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import logger from 'src/libraries/logger'
import { copyShareGrantLink } from 'src/libraries/utils/copy'
import { GrantsProgramContext } from 'src/pages/_app'

function SharePopover() {
	const buildComponent = () => (
		<Popover
			isLazy
			initialFocusRef={popoverRef}>
			{
				({ onClose }) => (
					<>
						<PopoverTrigger>
							<ShareForward
								cursor='pointer'
								boxSize='20px' />
						</PopoverTrigger>
						<PopoverContent>
							<PopoverArrow />
							<PopoverBody
								maxH='40vh'>
								{
									popoverBodyItem.map((item, index) => {
										return (
											<Flex
												py={1}
												px={2}
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
													leftIcon={item.buttonIcon}
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
														fontWeight='500'
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

	const popoverBodyItem = [
		{
			title: 'Share',
			description: 'Attract builders with a link',
			buttonIcon: <Copy
				color='accent.azure'
				boxSize='20px' />,
			buttonText: 'Copy Link',
			onButtonClick: async() => {
				if(grant?.id) {
					const ret = copyShareGrantLink()
					logger.info('copyGrantLink', ret)
					toast({
						title: ret ? 'Copied!' : 'Failed to copy',
						status: ret ? 'success' : 'error',
						duration: 3000,
					})
				}
			}
		},
		// {
		// 	title: 'Embed',
		// 	description: 'Add your stats and link to any website with embed.',
		// 	buttonIcon: <Embed
		// 		color='accent.azure'
		// 		boxSize='20px' />,
		// 	buttonText: 'Embed code',
		// 	onButtonClick: () => {}
		// }
	]

	const popoverRef = useRef<HTMLButtonElement>(null)
	const { grant } = useContext(GrantsProgramContext)!
	const toast = useCustomToast()

	return buildComponent()
}

export default SharePopover