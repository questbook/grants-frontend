import { useContext } from 'react'
import { Flex, Skeleton, SkeletonText } from '@chakra-ui/react'
import { GrantsProgramContext } from 'src/pages/_app'

function ThreeColumnSkeleton() {
	const buildComponent = () => {
		return (
			<Flex
				direction='row'
				w='100vw'
				h='calc(100vh - 64px)'
				justify='space-between'>
				{
					['25%', '48%', '25%'].map((width, index) => {
						return (
							<Flex
								key={index}
								direction='column'
								w={width}
								bg='white'
								h='100%'>
								{loadingComponent()}
							</Flex>
						)
					})
				}
			</Flex>
		)
	}

	const loadingComponent = () => {
		return (
			<Flex
				direction='column'
				align='center'
				justify='center'
				w='100%'
				h='100%'>
				<Skeleton
					isLoaded={!isLoading}
					w='60%'
					h='40%' />
				<SkeletonText
					mt={4}
					w='60%'
					h='48px' />
			</Flex>
		)
	}

	const { isLoading } = useContext(GrantsProgramContext)!

	return buildComponent()
}

export default ThreeColumnSkeleton