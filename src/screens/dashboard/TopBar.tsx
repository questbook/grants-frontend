import { useContext, useMemo } from 'react'
import { Button, Flex, IconButton, Image, Text } from '@chakra-ui/react'
import { DashboardContext } from 'src/screens/dashboard/Context'

function TopBar() {
	const { selectedGrant, selectedGrantIndex, setSelectedGrantIndex, grants } = useContext(DashboardContext)!
	const isLeftArrowEnabled = useMemo(() => {
		if(!grants?.length) {
			return false
		}

		const index = grants.findIndex(grant => grant.id === selectedGrant?.id)
		return index > 0
	}, [selectedGrant, grants])

	const isRightArrowEnabled = useMemo(() => {
		if(!grants?.length) {
			return false
		}

		const index = grants.findIndex(grant => grant.id === selectedGrant?.id)
		return index < grants.length - 1
	}, [selectedGrant, grants])

	return (
		<Flex
			w='100%'
			h='64px'
			px={8}
			py={4}
			align='center'>
			<IconButton
				variant='ghost'
				aria-label='left-arrow'
				icon={<Image src={`/v2/icons/arrow left/${isLeftArrowEnabled ? 'enabled' : 'disabled'}.svg`} />}
				onClick={
					() => {
						setSelectedGrantIndex((selectedGrantIndex! - 1) % grants.length)
					}
				} />
			<IconButton
				variant='ghost'
				aria-label='right-arrow'
				icon={<Image src={`/v2/icons/arrow right/${isRightArrowEnabled ? 'enabled' : 'disabled'}.svg`} />}
				onClick={
					() => {
						setSelectedGrantIndex((selectedGrantIndex! + 1) % grants.length)
					}
				} />
			<Text
				ml={2}
				variant='subheading'
				fontWeight='500'>
				{selectedGrant?.title}
			</Text>
			<Text
				variant='body'
				fontWeight='500'
				ml={2}
				px={2}
				borderRadius='4px'
				bg={selectedGrant?.acceptingApplications ? 'accent.june' : 'accent.royal'}>
				{selectedGrant?.acceptingApplications ? 'OPEN' : 'CLOSED'}
			</Text>
			<Button
				ml={2}
				variant='link'
				color='black.1'
				leftIcon={
					<Image
						src='/v2/icons/pencil.svg'
						boxSize='16px' />
				}>
				<Text
					variant='body'
					fontWeight='500'>
					Edit
				</Text>
			</Button>
			<Button
				ml='auto'
				variant='link'
				color='black.1'
				leftIcon={
					<Image
						src='/v2/icons/share forward.svg'
						boxSize='16px' />
				}>
				<Text
					variant='body'
					fontWeight='500'>
					Share
				</Text>
			</Button>
		</Flex>
	)
}

export default TopBar