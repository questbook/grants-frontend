import { useEffect, useState } from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { useSafeContext } from 'src/contexts/safeContext'
import logger from 'src/libraries/logger'

function PayWithChoose() {
	const buildComponent = () => {
		return (
			<Flex
				p={4}
				w='100%'
				borderBottom='1px solid #E7E4DD'>
				<Text
					w='20%'
					color='gray.6'>
					Pay With
				</Text>
				<Text>
					{safeTokenList ? (safeTokenList.length ? 'Fetched tokens' : 'No tokens in the safe') : 'Fetching...'}
				</Text>
			</Flex>
		)
	}

	const { safeObj } = useSafeContext()
	const [safeTokenList, setSafeTokenList] = useState<any[]>()

	useEffect(() => {
		if(!safeObj) {
			return
		}

		safeObj?.getTokenAndbalance().then(setSafeTokenList)
	}, [safeObj])

	useEffect(() => {
		logger.info({ safeTokenList }, 'Safe Token List')
	}, [safeTokenList])

	return buildComponent()
}

export default PayWithChoose