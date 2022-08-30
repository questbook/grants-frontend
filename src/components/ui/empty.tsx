import React from 'react'
import { Image, Text } from '@chakra-ui/react'

interface Props {
  src: string
  imgHeight: number | string
  imgWidth: number | string
  title: string
  subtitle: string
}

function Empty({
	src, imgHeight, imgWidth, title, subtitle,
}: Props) {
	return (
		<>
			<Image
				h={imgHeight}
				w={imgWidth}
				src={src} />
			<Text
				mt='17px'
				fontFamily='Spartan, sans-serif'
				fontSize='20px'
				lineHeight='25px'
				fontWeight='700'
				textAlign='center'
			>
				{title}
			</Text>
			<Text
				mt='11px'
				fontWeight='400'
				textAlign='center'>
				{subtitle}
			</Text>
		</>
	)
}

export default Empty
