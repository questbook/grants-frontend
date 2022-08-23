import { Box, Flex, Text } from '@chakra-ui/react'
import { Applicants } from '../assets/custom chakra icons/Your Grants/Applicants'
import { Funds } from '../assets/custom chakra icons/Your Grants/Funds'
import { Reviews } from '../assets/custom chakra icons/Your Grants/Reviews'

const StatsBanner = ({
	applicants,
	reviews,
	totalReviews,
	funds,
}: {
  applicants: number;
  reviews: number;
  totalReviews: number;
  funds: number;
}) => {
	return (
		<Flex
			bg={'white'}
			h="96px"
			borderRadius="4px"
			boxShadow="inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7"
			py={6}
			px={0}
			color={'#7D7DA0'}
		>
			<Applicants
				ml={'24px'}
				h={5} />
			<Flex
				flex={1}
				ml={5}
				direction="column">
				<Text
					fontSize="20px"
					lineHeight="24px"
					fontWeight="500"
					color="#1F1F33"
				>
					{applicants}
				</Text>
				<Text
					fontSize="14px"
					lineHeight="20px"
					fontWeight="400">
          Applicants
				</Text>
			</Flex>

			<Box
				borderLeft="1px solid #E0E0EC"
				h="100%" />

			<Reviews
				ml={'24px'}
				h={'19px'}
				w="17px" />
			<Flex
				flex={1}
				ml={5}
				direction="column">
				<Text
					fontSize="20px"
					lineHeight="24px"
					fontWeight="500"
					color="#1F1F33"
				>
					{reviews}
					{' '}
/
					{' '}
					{totalReviews}
				</Text>
				<Text
					fontSize="14px"
					lineHeight="20px"
					fontWeight="400">
          Reviews
				</Text>
			</Flex>

			<Box
				borderLeft="1px solid #E0E0EC"
				h="100%" />

			<Funds
				ml={'24px'}
				w="20px"
				h="18px" />
			<Flex
				flex={1}
				ml={5}
				direction="column">
				<Text
					fontSize="20px"
					lineHeight="24px"
					fontWeight="500"
					color="#1F1F33"
				>
					{funds}
					{' '}
USD
				</Text>
				<Text
					fontSize="14px"
					lineHeight="20px"
					fontWeight="400">
          Disbursed
				</Text>
			</Flex>
		</Flex>
	)
}

export default StatsBanner
