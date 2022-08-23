import React from 'react'
import {
	Button,
	Flex,
	Grid,
	Image,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Text
} from '@chakra-ui/react'

interface Props {
	grantAmount: string;
	grantCurrency: string;
	disbursedAmount?: string;
	lineHeight: string | number;
	marginBottom?: string | number;
}

function VerifiedBadge({
	grantAmount, grantCurrency, disbursedAmount, lineHeight, marginBottom,
}: Props) {
	return (
		<Popover trigger="hover">
			<PopoverTrigger>
				<Image
					h="1rem"
					w="1rem"
					display="inline-block"
					src="/ui_icons/verified_badge.svg"
					ml={1}
					mb={marginBottom}
					lineHeight={lineHeight}
				/>
			</PopoverTrigger>
			<PopoverContent
				bg="white"
				borderRadius="8px"
				maxW="210px">
				<Flex
					direction="column"
					align="start">
					<Grid
						gridTemplateAreas="
						'icon text link'
						"
						justifyContent="space-between"
						borderBottom="1px solid #E8E9E9"
						w="full"
						p={4}
					>
						<Image
							h="1rem"
							w="1rem"
							display="inline-block"
							src="/ui_icons/verified_badge.svg"
							ml={1}
							mr={2}
							lineHeight={lineHeight}
							gridArea="icon"
						/>
						<Text
							fontWeight="700"
							fontStyle="normal"
							fontSize="14px"
							lineHeight="16px"
							gridArea="text"
						>
							Verified Grant
						</Text>
						<Button
							variant="link"
							onClick={
								() => {
									window.open('https://questbook.notion.site/What-does-a-Verified-Grant-Mean-0e83ed1f3f4e4fe4ae994a19a75cf413/')
								}
							}
							gridArea="link"
							justifySelf="start"
							paddingBlock={0}
						>
							<Image
								h="0.75rem"
								w="0.75rem"
								src="/ui_icons/link.svg"
								lineHeight={lineHeight}
							/>
						</Button>
					</Grid>

					<Grid
						gridTemplateColumns="2fr 1fr"
						justifyContent="space-between"
						px={4}
						pt={4}
						w="full"
					>
						<Text
							color="#373737"
							fontWeight="400"
							fontStyle="normal"
							fontSize="0.75rem"
							lineHeight="1rem"
						>
							Funds deposited
						</Text>
						<Text
							color="#373737"
							fontWeight="700"
							fontStyle="normal"
							fontSize="0.75rem"
							lineHeight="1rem"
							justifySelf="end"
						>
							{grantAmount}
							{' '}
							{grantCurrency}
						</Text>
					</Grid>
					<Grid
						gridTemplateColumns="2fr 1fr"
						justifyContent="space-between"
						p={4}
						w="full"
					>
						<Text
							color="#373737"
							fontWeight="400"
							fontStyle="normal"
							fontSize="0.75rem"
							lineHeight="1rem"
						>
							Funds sent to winners
						</Text>
						<Text
							color="#373737"
							fontWeight="700"
							fontStyle="normal"
							fontSize="0.75rem"
							lineHeight="1rem"
							justifySelf="end"
						>
							{disbursedAmount}
							{' '}
							{grantCurrency}
						</Text>
					</Grid>
				</Flex>
			</PopoverContent>
		</Popover>
	)
}

VerifiedBadge.defaultProps = {
	marginBottom: 0,
}

export default VerifiedBadge
