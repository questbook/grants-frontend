import { useContext } from 'react'
import { Flex, Skeleton, SkeletonText } from '@chakra-ui/react'
import { DashboardContext } from 'src/screens/dashboard/Context'

function ThreeColumnSkeleton() {
	const buildComponent = () => {
		return (
			<Flex
				direction='column'
				w='100vw'
				h='calc(100vh - 64px)'
				justify='space-between'>
				<Flex
					w='100%'
					h='64px'
					justify='center'
					align='center'>
					<SkeletonText
						w='98%'
						h='32px' />
				</Flex>
				<Flex
					direction='row'
					justify='space-between'
					w='100%'
					h='calc(100vh - 128px)'>
					<Flex
						direction='column'
						w='25%'
						bg='white'
						h='100%'>
						{loadingComponent()}
					</Flex>
					<Flex
						direction='column'
						w='48%'
						bg='white'
						h='100%'>
						{loadingComponent()}
					</Flex>
					<Flex
						direction='column'
						w='25%'
						bg='white'
						h='100%'>
						{loadingComponent()}
					</Flex>
				</Flex>
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

	const { isLoading } = useContext(DashboardContext)!

	return buildComponent()
}

export default ThreeColumnSkeleton