import { useContext } from 'react'
import { Button, Flex, Text } from '@chakra-ui/react'
import { defaultChainId } from 'src/constants/chains'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import { copyGrantLink } from 'src/libraries/utils/copy'
import { GrantsProgramContext } from 'src/pages/_app'
import { getSupportedChainIdFromSupportedNetwork, getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

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
					variant='v2_heading_3'
					fontWeight='500'>
					{(role === 'admin' || role === 'owner') ? 'Your invitation for proposals is live!' : 'Be the first to submit a proposal'}

				</Text>

				{
					(role === 'admin' || role === 'owner') ? (
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
								variant='v2_body'>
								Attract builders to
								{' '}
								{grant?.workspace?.title}
								{' '}
								with a link.
							</Text>
						</>
					) : grant?.link ? (
						<>
							<Text variant='v2_body'>
								Read more about the grant

								<Text
									variant='v2_body'
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
					(role === 'admin' || role === 'owner') ? (
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
								variant='v2_body'
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
									variant='v2_body'
									fontWeight='500'
									color='white'>
									Submit proposal
								</Text>
							</Button>
						)
				}
			</Flex>
		)
	}

	const { grant, role } = useContext(GrantsProgramContext)!

	const toast = useCustomToast()

	return buildComponent()
}

export default Empty