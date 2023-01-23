import { Box, Flex, Image, Text } from '@chakra-ui/react'

// interface ActionCardProps {
//     role: string
//     email: string
//     address: string
//     name: string
//     pfp: string
//     // isOwner: boolean
// }

function ActionCard() {

	return (
		<Box
			border='1px solid #E7E4DD'
			p={4}
		>
			<Flex gap={2}>
				<Flex
				>
					<Image
						boxSize={8}
						src='/v2/icons/realms.svg'
					/>
					<Image
						boxSize={8}
						ml='-18px'
						src='/v2/icons/safe.svg'
					/>
					<Image
						boxSize={8}
						ml='-18px'
						src='/v2/icons/celo.svg'
					/>
				</Flex>

				<Flex
					direction='column'
					gap={2}
				>
					<Text
						variant='v2_title'
						fontWeight='500'
						cursor='pointer'
					>
						Link your multisig
					</Text>
					<Text
						variant='v2_subtitle'
					>
						Link your multisig to fund builders on Questbook
					</Text>
				</Flex>
			</Flex>
		</Box>
	)
}

export default ActionCard