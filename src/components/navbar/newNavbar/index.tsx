import { Avatar, Box, Container, Text } from '@chakra-ui/react'
import NavbarHeader from './header'

function NewNavbar({ currentState }:{currentState:number}) {

	return (
		<div>
			<Box
				w={'100%'}
				h={'15em'}
				bg={'#1F1F33'}>
				<Box
					display='flex'
					paddingLeft={'40px'}
					paddingRight={'40px'}
					paddingTop={'16px'}>
					<img
						src='/images/new_logo.svg' />
					<div style={{ marginLeft: 'auto', padding: 10, display:'flex', flexDirection:'row' }}>
						<div>
							<Box
								as='button'
								borderRadius='sm'
								bg='#F0F0F7'
								paddingLeft={'8px'}
								paddingRight={'8px'}
								paddingTop={'6px'}
								paddingBottom={'6px'}
								display="flex"
								flexDirection={'row'}
								alignItems={'center'}>
								<img src='/new_icons/online.svg' />
								<Text
									fontWeight={'500'}
									marginLeft={'10px'}>
                                     Ethereum
								</Text>
							</Box>
						</div>
						<div>
							<Box
								as='button'
								borderRadius='sm'
								bg='#F0F0F7'
								marginLeft={10}
								paddingLeft={'8px'}
								paddingRight={'8px'}
								paddingTop={'6px'}
								paddingBottom={'6px'}
								display={'flex'}
								flexDirection='row'
								alignItems={'center'}>
								<Avatar
									size={'xs'}
									name='Kola Tioluwani'
									src='https://bit.ly/dan-abramov' />
								<Text
									fontWeight={'500'}
									marginLeft='10px'>
                                    0x71......976f
								</Text>
								<img
									src='/new_icons/chevron_down.svg'
									style={{ marginLeft: 10 }} />
							</Box>
						</div>
					</div>
				</Box>
				<div style={{ height: '60%' }}>
					<Container
						height={'100%'}
						position={'relative'}>
						<NavbarHeader currentState={currentState} />
					</Container>
				</div>
			</Box>
		</div>
	)
}

export default NewNavbar