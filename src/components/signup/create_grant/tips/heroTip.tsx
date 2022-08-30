import React from 'react'
import {
	Box,
	Flex, Image, Text, } from '@chakra-ui/react'

function HeroTip() {
	return (
		<Flex
			w='35%'
			bgColor='#7FDAEC'
			pl={12}
			direction='column'
			justify='center'
			align='start'>
			<Image
				src='/illustrations/first_grant.svg'
				boxSize='128px' />
			<Box mb={5} />
			<Text
				color='#122224'
				fontWeight='700'
				fontSize='72px'
				lineHeight='72px'
				letterSpacing='-1.5px'
			>
				Lets create your first grant.
			</Text>
			<Box mb={10} />
			<Text
				color='#2E6672'
				fontWeight='bold'
				fontSize='16px'>
				Tell us more about your grant so we can help you get the best
				applicants.
			</Text>
		</Flex>
	)
}

export default HeroTip
