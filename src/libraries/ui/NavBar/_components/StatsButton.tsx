import { Button, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { PieChart } from 'src/generated/icons'
import logger from 'src/libraries/logger'

function StatsButton() {
	const buildComponent = () => {
		return (
			<Button
				variant='ghost'
				leftIcon={<PieChart boxSize='16px' />}
				onClick={onClick}>
				<Text
					variant='v2_body'
					fontWeight='500'>
					View Stats
				</Text>
			</Button>
		)
	}

	const router = useRouter()
	const onClick = async() => {
		const ret = await router.push({
			pathname: '/dashboard',
		})
		logger.info({ ret }, 'Dashboard pushed')
	}

	return buildComponent()
}

export default StatsButton