import { Text, TextProps } from '@chakra-ui/react'

function SectionHeader(props: TextProps) {
	const buildComponent = () => {
		return (
			<Text
				{...props}
				w='100%'
				variant='v2_subheading'
				fontWeight='500'
				textAlign='left'
				pb={4}
				borderBottom='1px solid #E7E4DD' />
		)
	}

	return buildComponent()
}

export default SectionHeader