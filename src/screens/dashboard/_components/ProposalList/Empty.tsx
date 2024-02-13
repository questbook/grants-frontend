import { useContext } from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { GrantsProgramContext } from 'src/pages/_app'
import { disabledTonGrants, tonGrants } from 'src/screens/proposal_form/_utils/constants'

function Empty() {
	const buildComponent = () => {
		return (
			<Flex
				w='100%'
				h='100%'
				px={5}
				py={4}
				align='center'>
				{
					disabledTonGrants?.includes(grant?.id as string) && window?.innerWidth < 768 ? (
						<Text
							fontWeight='500'
							color='black.100'
							variant='heading3'
							textAlign='center'
							mx={2}
						>
							All the grant information and proposals have moved to TON Grants page,

							<Text
								fontWeight='500'
								variant='heading3'
								as='a'
								href={`${window.location.origin}/dashboard/?grantId=${tonGrants}&chainId=10`}
								target='_blank'
								color='blue.500'
								mx={2}>
								please visit there for more info
							</Text>
						</Text>
					) : (
						<Text
							my='auto'
							mx='auto'
							textAlign='center'>
							Proposals from builders show up here.
						</Text>
					)
				}

			</Flex>
		)
	}

	const { grant } = useContext(GrantsProgramContext)!
	return buildComponent()
}

export default Empty