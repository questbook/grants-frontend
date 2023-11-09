import { useContext } from 'react'
import { Button, Flex, Modal, ModalCloseButton, ModalContent, ModalOverlay, Text } from '@chakra-ui/react'
import { Desktop, QrScan } from 'src/generated/icons'
import logger from 'src/libraries/logger'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { GrantsProgramContext, NotificationContext } from 'src/pages/_app'


type BaseProps = {
    isOpen: boolean
    onClose: () => void
}

type OptionalProps =
    | {
        type: 'grant'
        grantId: string
    } | {
        type: 'proposal'
        proposalId: string
    }

type Props = BaseProps & OptionalProps

function SetupNotificationModal(props: Props) {


	const buildComponent = () => {
		return (
			<Modal
				isCentered={true}
				size='lg'
				isOpen={isOpen}
				onClose={onClose}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />
					<Flex
						direction='column'
						w='100%'
						align='center'
						p={6}>
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
						{buttonItems.map(buttonItem)}
					</Flex>

				</ModalContent>
			</Modal>
		)
	}

	const buttonItem = (item: typeof buttonItems[0], index: number) => {
		return (
			<Flex
				key={index}
				w='100%'
				mt={6}
				py={4}
				px={6}
				bg='gray.200'
				justify='space-between'
				align='center'>
				<Text fontWeight='500'>
					{item.title}
				</Text>
				<Button
					bg='gray.200'
					justifyContent='flex-start'
					leftIcon={item.buttonIcon}
					mt={2}
					variant='link'
					onClick={
						() => {
							item.onButtonClick()
							onClose()
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
	}

	const { isOpen, onClose } = props

	const buttonItems = [
		{
			title: 'For MAC App',
			buttonIcon: <Desktop
				color='black.100'
				boxSize='20px' />,
			buttonText: 'Open my desktop app',
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
			const key = `${props.type === 'grant' ? 'gp' : 'app'}-${props.type === 'grant' ? props.grantId : props.proposalId}-${getSupportedChainIdFromWorkspace(grant.workspace)}`
			const payload = (Buffer.from(key).toString('base64')).replaceAll('=', '')
			return payload
		 } else if(typeof window !== 'undefined' && !grant) {
			const params = new URLSearchParams(window.location.search)
			const chainId = params.get('chainId')
			const key = `${props.type === 'grant' ? 'gp' : 'app'}-${props.type === 'grant' ? props.grantId : props.proposalId}-${chainId}`
			const payload = (Buffer.from(key).toString('base64')).replaceAll('=', '')
			logger.info({ payload }, 'Telegram payload')
			return payload
		}

		return undefined
	}

	const { grant } = useContext(GrantsProgramContext)!
	const { setQrCodeText } = useContext(NotificationContext)!
	return buildComponent()
}

export default SetupNotificationModal