import React from 'react'
import { Flex, ResponsiveValue, Text } from '@chakra-ui/react'


const TableHeader = [
	'Name',
	'Pending applications',
	'$ Disbursed',
	'Response TAT',
	'Action'
]


const tableHeadersAlign = [
	'start',
	'center',
	'center',
	'center',
	'center',
]


const tableHeadersflex = [0.20, 0.40, 0.10, 0.20, 0.17]

function Header() {


	return (
		<>
			<Flex
				w='100%'
				py={0}
				mt='4'
				align='center'
				justify='strech'


			>

				{
                         		TableHeader.map((header: any, index: any) => (

						<Text
							whiteSpace='nowrap'
							key={header}
							fontWeight='700'
							fontSize='16px'
							lineHeight='24px'
							textAlign={tableHeadersAlign[index] as ResponsiveValue<'left' | 'center'>}
							flex={tableHeadersflex[index]}
							ml='20px'


						>
		{header}
 </Text>

					))

				}
			</Flex>

		</>

	)


}


export default Header