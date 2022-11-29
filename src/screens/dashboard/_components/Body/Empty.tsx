import { useContext, useMemo } from 'react'
import { Button, Flex, Image, Text } from '@chakra-ui/react'
import { defaultChainId } from 'src/constants/chains'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import { copyGrantLink } from 'src/libraries/utils/copy'
import { ApiClientsContext } from 'src/pages/_app'
import { DashboardContext } from 'src/screens/dashboard/Context'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

function Empty() {
	const buildComponent = () => {
		return (
			<Flex
				w='100%'
				h='100%'
				bg='white'
				direction='column'
				align='center'
				justify='center'>
				<Text
					variant='heading3'
					fontWeight='500'>
					Your invitation for proposals is live!
				</Text>

				<Text mt={1}>
					Builders can start submitting proposals from today.
				</Text>

				<Image
					mt={8}
					src='/v2/images/empty-body.svg'
					w='329px'
					h='152px' />

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
					{workspace?.title}
					{' '}
					with a link, or use embed.
				</Text>

				<Flex mt={6}>
					<Button
						variant='primaryMedium'
						onClick={
							async() => {
								if(selectedGrant?.id) {
									const ret = await copyGrantLink(selectedGrant.id, chainId)
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

					<Button
						ml={6}
						variant='primaryMedium'
						bg='gray.3'>
						<Text
							variant='body'>
							Use embed
						</Text>
					</Button>
				</Flex>
			</Flex>
		)
	}

	const { workspace } = useContext(ApiClientsContext)!
	const { selectedGrantIndex, grants } = useContext(DashboardContext)!

	const chainId = useMemo(() => {
		return getSupportedChainIdFromWorkspace(workspace) ?? defaultChainId
	}, [workspace])

	const selectedGrant = useMemo(() => {
		if(!grants?.length || selectedGrantIndex === undefined || selectedGrantIndex >= grants?.length) {
			return
		}

		return grants[selectedGrantIndex]
	}, [selectedGrantIndex, grants])

	const toast = useCustomToast()

	return buildComponent()
}

export default Empty