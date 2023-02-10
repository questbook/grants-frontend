import { useContext, useRef } from 'react'
import { Button, Flex, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Text } from '@chakra-ui/react'
import { Bell, Desktop, QrScan } from 'src/generated/icons'
import logger from 'src/libraries/logger'
import { GrantsProgramContext, NotificationContext } from 'src/pages/_app'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

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
								px={4}
								py={3}>
								<Text
									variant='v2_body'
									fontWeight='500'>
									Subscribe to notifications
								</Text>
								<Text
									mt={1}
									as='span'
									variant='v2_body'>
									Get real time notifications for the grant program on our
									{' '}
									<Text
										as='span'
										variant='v2_body'
										fontWeight='500'>
										Telegram
									</Text>
									{' '}
									channel.
								</Text>
								{
									popoverBodyItem.map((item, index) => {
										return (
											<Flex
												mt={4}
												key={index}
												direction='column'
												align='start'>
												<Text
													variant='v2_body'
													color='gray.5'>
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
														variant='v2_body'
														fontWeight='500'>
														{item.buttonText}
													</Text>
												</Button>
											</Flex>
										)
									})
								}
								<Text
									mt={4}
									variant='v2_body'
									color='gray.5'>
									Learn more about notifications
								</Text>
							</PopoverBody>
						</PopoverContent>
					</>
				)
			}
		</Popover>
	)

	const popoverBodyItem = [
		{
			title: 'For MAC App',
			buttonIcon: <Desktop
				color='black.1'
				boxSize='20px' />,
			buttonText: 'Open my desktop app',
			onButtonClick: () => {
				const payload = getPayload()
				if(payload) {
					window.open(`https://t.me/qb_beta_bot?start=${payload}`, '_blank')
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
					setQrCodeText(`https://t.me/qb_beta_bot?start=${payload}`)
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