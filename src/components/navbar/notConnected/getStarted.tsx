import React from 'react'
import { Button, Text } from '@chakra-ui/react'

function GetStarted({
	onGetStartedClick
}: {
	onGetStartedClick: () => void
}) {
	/* this button style is not required anywhere in design */
	return (
		<>
			<Button
				mr={5}
				h={12}
				transition="all 1s ease"
				_active={
					{
						background:
          'linear-gradient(96.85deg, #5222A7 -21.73%, #00B6CE 110.75%)',
					}
				}
				_hover={
					{
						background:
          'linear-gradient(96.85deg, #8E4EFF -21.73%, #4BEAFF 110.75%)',
					}
				}
				_disabled={
					{
						background: 'linear-gradient(96.85deg, #E0E6E7 -21.73%, #C4C4C4 110.75%)',
					}
				}
				background="linear-gradient(96.85deg, #6F25F1 -21.73%, #00E1FF 110.75%)"
				px={6}
				py={3}
				onClick={onGetStartedClick}
			>
				<Text
					fontFamily="DM Sans"
					color="white"
					fontWeight="bold">
        Get Started
				</Text>
			</Button>
		</>
	)
}

export default GetStarted
