import React, { useState } from 'react'
import { Box, Container, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import NewNavbar from 'src/components/navbar/newNavbar'
import NewForm from 'src/components/your_grants/create_new_grant/form'


function CreateNewGrant() {

	const [formData, setFormData] = useState()
	const [currentState, setCurrentState] = useState(0)

	const router = useRouter()

	return (
		<div style={{ height: '100vh', backgroundColor: '#F5F5F5' }}>
			<NewNavbar currentState={currentState} />
			<Container>
				<NewForm
					currentState={currentState}
					setCurrentState={setCurrentState}
					onSubmit={(data: any) => setFormData(data)}
					refs={[]}
					hasClicked={false} />
			</Container>
			<div style={{ position: 'absolute', bottom: 0, paddingBottom: 36, paddingLeft: 40, paddingRight:40, width: '100%' }}>
				<Box
					display={'flex'}
					flexDirection='row'>
					<Box
						as='button'
						borderRadius='sm'
						borderWidth={1}
						borderColor='#1F1F33'
						color={'#1F1F33'}
						paddingLeft={'12px'}
						paddingRight={'12px'}
						paddingTop={'6px'}
						paddingBottom={'6px'}
						marginLeft={'auto'}
						onClick={
							() => {
								if(currentState > 0) {
									setCurrentState(currentState - 1)
								} else if(currentState !== 0) {
									setCurrentState(4)
								} else if(currentState === 0) {
									// router.push('/your_grants/contribution_type/')
								}
							}
						}>
						<Text fontWeight={'500'}>
                                Back
						</Text>
					</Box>
					<Box
						as='button'
						borderRadius='sm'
						bg='#1F1F33'
						marginLeft={10}
						color='white'
						display={'flex'}
						flexDirection={'row'}
						alignItems={'center'}
						paddingLeft={'12px'}
						paddingRight={'12px'}
						paddingTop={'6px'}
						paddingBottom={'6px'}
						onClick={
							() => {
								if(currentState < 4) {
									setCurrentState(currentState + 1)
								} else {
									// router.push('/your_grants/review_new_grant')
								}
							}
						}>
						<Text fontWeight={'500'}>
                                    Continue
						</Text>
						<img
							src='/new_icons/arrow_right.svg'
							style={{ marginLeft: '10px' }} />
					</Box>
				</Box>
			</div>
		</div>
	)
}

export default CreateNewGrant