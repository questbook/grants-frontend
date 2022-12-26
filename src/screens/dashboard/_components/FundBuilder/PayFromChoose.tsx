import { useState } from 'react'
import { Button, Flex, Image, Text } from '@chakra-ui/react'
import { SupportedPayouts } from '@questbook/supported-safes'
import { PlaceholderProps, Select, SelectComponentsConfig } from 'chakra-react-select'
import { useSafeContext } from 'src/contexts/safeContext'
import Dropdown from 'src/screens/dashboard/_components/FundBuilder/Dropdown'
// import { formatAddress } from 'src/utils/formattingUtils'

function PayFromChoose({ selectedMode, setSelectedMode }) {


	const buildComponent = () => {
		return (
			<Flex
				p={4}
				w='100%'
				borderBottom='1px solid #E7E4DD'
				alignItems='center'>
				<Text
					w='20%'
					color='gray.6'>
					Pay From
				</Text>
				<Flex alignItems='center'>

					<Image
						src={selectedMode.logo}
						boxSize='16px' />
					<Text
						ml={2}
						variant='v2_body'
					>
						{selectedMode.value}
					</Text>

				</Flex>
			</Flex>
		)
	}

	return buildComponent()
}

export default PayFromChoose