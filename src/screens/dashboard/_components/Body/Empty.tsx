import { useContext, useState } from 'react'
import { Button, Flex, Text } from '@chakra-ui/react'
import { defaultChainId } from 'src/constants/chains'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import SetupNotificationModal from 'src/libraries/ui/SetupNotificationModal'
import { copyGrantLink } from 'src/libraries/utils/copy'
import { getSupportedChainIdFromSupportedNetwork, getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { GrantsProgramContext } from 'src/pages/_app'

function Empty() {
	const buildComponent = () => {
		return (
			<Flex
				w='100%'
				h='100%'
				bg='white'
				direction='column'
				boxShadow='0px 2px 4px rgba(29, 25, 25, 0.1)'
				align='center'
				justify='center'>
				<Text
					variant='heading3'
					fontWeight='500'>
					{role === 'admin' ? 'Your invitation for proposals is live!' : grant?.id === '661e3ca0f056dd981db4e4a5' ? 'This is a Private Grant' : 'Be the first to submit a proposal'}

				</Text>

				{
					role === 'admin' ? (
						<>
							<Text mt={1}>
								Builders can start submitting proposals from today.
							</Text>

							<Text
								mt={6}
								fontWeight='500'>
								Share with builders
							</Text>
							<Text
								mt={1}
								variant='body'>
								Attract builders to
								{' '}
								{grant?.workspace?.title}
								{' '}
								with a link.
							</Text>
						</>
					) : grant?.link ? (
						<>
							<Text variant='body'>
								Read more about the grant
								<Text
									variant='body'
									display='inline-block'
									fontWeight={500}
									marginLeft={1}
									cursor='pointer'
									onClick={
										() => {
											if(grant.link !== null) {
												window.open(grant.link, '_blank')
											}
										}
									}
								>
									here
								</Text>
							</Text>

						</>

					) : null
				}

				{
					role === 'admin' ? (
						<Button
							variant='primaryMedium'
							mt={6}
							onClick={
								async() => {
									if(grant?.id) {
										const ret = await copyGrantLink(grant.id, getSupportedChainIdFromWorkspace(grant.workspace) ?? defaultChainId)
										toast({
											title: ret ? 'Copied!' : 'Failed to copy',
											status: ret ? 'success' : 'error',
											duration: 3000,
										})
									}
								}
							}>
							<Text
								variant='body'
								color='white'>
								Copy Link
							</Text>
						</Button>
					)
						: (
							<Button
								variant='primaryMedium'
								mt={6}
								onClick={
									() => {
										const href = window.location.href.split('/')
										const protocol = href[0]
										const domain = href[2]
										const chainId = getSupportedChainIdFromSupportedNetwork(grant?.workspace.supportedNetworks[0])

										const URL = `${protocol}//${domain}/proposal_form/?grantId=${grant?.id}&chainId=${chainId}&newTab=true`

										window.open(URL, '_blank')
									}
								}>
								<Text
									variant='body'
									fontWeight='500'
									color='white'>
									Submit proposal
								</Text>
							</Button>
						)
				}

				{
					role === 'admin' && (
						<Flex
							mt={10}
							direction='column'
							align='center'
							px='10%'>
							<Text fontWeight='500'>
								Subscribe to notifications
							</Text>
							<Text
								mt={1}
								textAlign='center'
								variant='body'>
								Get notified on Telegram when builders submit new proposals , reviewers submit
								reviews, and other updates from builders and community.
							</Text>
							<Button
								variant='primaryMedium'
								bg='gray.300'
								mt={6}
								onClick={() => setIsSetupNotificationModalOpen(true)}>
								<Text
									variant='body'
									fontWeight='500'>
									Subscribe
								</Text>
							</Button>
						</Flex>
					)
				}

				<SetupNotificationModal
					isOpen={isSetupNotificationModalOpen}
					onClose={() => setIsSetupNotificationModalOpen(false)}
					type='grant'
					grantId={grant?.id!} />
			</Flex>
		)
	}

	const { grant, role } = useContext(GrantsProgramContext)!
	const [isSetupNotificationModalOpen, setIsSetupNotificationModalOpen] = useState<boolean>(false)

	const toast = useCustomToast()

	return buildComponent()
}

export default Empty