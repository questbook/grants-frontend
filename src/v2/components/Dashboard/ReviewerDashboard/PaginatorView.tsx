import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { Box, Button, Flex } from '@chakra-ui/react'

type Props = {
  onPageChange: (page: number) => void
  currentPage: number
  hasMoreData: boolean
};

function PaginatorView({ currentPage, onPageChange, hasMoreData }: Props) {
	return (
		<Box
			boxShadow='lg'
			borderRadius={7.5}
			bg='white'>
			<Flex
				alignItems='center'>
				<Button
					bg='inherit'
					disabled={currentPage === 0}
					onClick={() => onPageChange(currentPage - 1)}
				>
					<ChevronLeftIcon />
				</Button>
				<Box w={2.5} />
				{currentPage + 1}
				<Box w={2.5} />
				<Button
					bg='inherit'
					disabled={!hasMoreData}
					onClick={() => onPageChange(currentPage + 1)}
				>
					<ChevronRightIcon />
				</Button>
			</Flex>
		</Box>
	)
}

export default PaginatorView