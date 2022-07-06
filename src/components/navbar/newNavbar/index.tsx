import { Box, Container } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import AccountDetails from './AccountDetails'
import NavbarHeader from './header'
import ReviewHeader from './ReviewHeader'

function NewNavbar({ currentState }:{currentState:number}) {
	const router = useRouter()
	const pageUrl = router.pathname
	return (
		<div>
			<Box
				w={'100%'}
				h={'15em'}
				bg={'#1F1F33'}>
				<AccountDetails />
				<div style={{ height: '60%' }}>
					<Container
						height={'100%'}
						position={'relative'}>
						{
							currentState === 5 && pageUrl.includes('create_new_grant') ?
								 <ReviewHeader /> : <NavbarHeader currentState={currentState} />
						}
					</Container>
				</div>
			</Box>
		</div>
	)
}

export default NewNavbar