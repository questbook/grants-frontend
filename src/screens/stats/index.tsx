import { ReactElement } from 'react'
import { BsArrowLeft } from 'react-icons/bs'
import { Button, Flex, Image, Text } from '@chakra-ui/react'
import router from 'next/router'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import StatsCard from 'src/screens/stats/_component/StatsCard'

function Stats() {
	return (
		<>
			<Flex
				h='calc(100vh - 64px)'
				width='100vw'
				direction='column'
				justifyContent='flex-start'
				px={8}
				// py={4}
				gap={4}
			>
				<Button
					className='backBtn'
					variant='linkV2'
					// bgColor='gray.1'
					leftIcon={<BsArrowLeft strokeWidth={1} />}
					width='fit-content'
					onClick={() => router.back()}>
					Back
				</Button>
				<Flex
					gap={2}
					p={2}>
					<Image
						boxSize={6}
						src='/v2/icons/pie-chart-line.svg'
					/>
					<Text
						variant='v2_subheading'
						fontWeight='500'>
						Stats
					</Text>
				</Flex>

				{/* Stats body */}
				<Flex
					h='80%'
					mt={4}
				>
					<Flex
						direction='column'
						gap={8}
						width='30%'
						// justifyContent='space-between'
					>
						<StatsCard cardTitle='Proposals' />
						<StatsCard cardTitle='TAT' />
						<StatsCard cardTitle='Total Amount Disbursed' />
					</Flex>
				</Flex>
			</Flex>
		</>
	)
}

Stats.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout
			renderSidebar={false}
			navbarConfig={{ showDomains: true, showLogo: false, showOpenDashboard: true, showAddMembers: true, bg: 'gray.1', }}
		>

			{page}

		</NavbarLayout>
	)
}


export default Stats