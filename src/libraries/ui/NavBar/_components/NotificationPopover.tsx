import { useContext, useRef } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Button, Flex, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Text } from '@chakra-ui/react'
import { Bell, Desktop, QrScan } from 'src/generated/icons'
import logger from 'src/libraries/logger'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { GrantsProgramContext, NotificationContext } from 'src/pages/_app'

type Props =
| {
    type: 'grant'
    grantId: string
}
| {
    type: 'proposal'
    proposalId: string
}

function NotificationPopover(props: Props) {

	const isMobile = useMediaQuery({ query:'(max-width:600px)' })
	const buildComponent = () => (
		<Popover
			isLazy
			initialFocusRef={popoverRef}>
			{
				({ onClose }) => (
					<>
						<PopoverTrigger>
							<Bell
								cursor='pointer'
								boxSize='20px' />
						</PopoverTrigger>
						<PopoverContent>
							<PopoverArrow />
							<PopoverBody
								// bgSize={'sm'}
								px={4}
								py={3}>
								<Text
									variant='body'
									fontWeight='500'>
									Subscribe to notifications
								</Text>
								<Text
									mt={1}
									as='span'
									variant='body'>
									Get real time notifications for the grant program on our
									{' '}
									<Text
										as='span'
										variant='body'
										fontWeight='500'>
										Telegram
									</Text>
									{' '}
									channel.
								</Text>
								{
									popoverBodyItem.map((item, index) => {
										return isMobile && index === 1 ? null : (
											<Flex
												mt={4}
												key={index}
												direction='column'
												align='start'>
												<Text
													variant='body'
													color='gray.500'>
													{item.title}
												</Text>
												<Button
													justifyContent='flex-start'
													leftIcon={item.buttonIcon}
													mt={2}
													variant='link'
													onClick={
														() => {
															onClose()
															item.onButtonClick()
														}
													}>
													<Text
														variant='body'
														fontWeight='500'>
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
			title: isMobile ? 'For mobile App' : 'For MAC App',
			buttonIcon: isMobile ? <></> : (
				<Desktop
					color='black.100'
					boxSize='20px' />
			),
			buttonText: isMobile ? 'Open my mobile app' : 'Open my desktop app',
			onButtonClick: () => {
				const payload = getPayload()
				if(payload) {
					window.open(`https://t.me/${process.env.NOTIF_BOT_USERNAME}?start=${payload}`, '_blank')
				}
			}
		},
		{
			title: 'For mobile App',
			buttonIcon: <QrScan
				boxSize='20px' />,
			buttonText: 'Scan QR code',
			onButtonClick: () => {
				const payload = getPayload()
				if(payload) {
					setQrCodeText(`https://t.me/${process.env.NOTIF_BOT_USERNAME}?start=${payload}`)
				}
			}
		},
	]

	const getPayload = () => {
		if(grant?.workspace) {
			const key = `${props.type === 'grant' ? 'gp' : 'app'}-${props.type === 'grant' ? props.grantId : props.proposalId }-${getSupportedChainIdFromWorkspace(grant.workspace)}`
			const payload = (Buffer.from(key).toString('base64')).replaceAll('=', '')
			logger.info({ key, payload }, 'Telegram config')
			return payload
		}

		return undefined
	}

	const popoverRef = useRef<HTMLButtonElement>(null)
	const { grant } = useContext(GrantsProgramContext)!
	const { setQrCodeText } = useContext(NotificationContext)!

	return buildComponent()
}

export default NotificationPopover