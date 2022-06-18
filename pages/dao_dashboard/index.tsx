import React, {
	ReactElement,
} from 'react'
import { Box, Button, Container, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Spacer, Text } from '@chakra-ui/react'
import NavbarLayout from '../../src/layout/navbarLayout'


function DaoDashboard() {

	return (

		<>
			<Container
				maxW="100%"
				display="flex"
				px="70px"
				mb="300px"
				background="#E5E5E5"
			>
				<Container
					flex={1}
					display="flex"
					flexDirection="column"
					maxW="1116px"
					alignItems="stretch"
					pb={8}
					px={10}
					pos="relative"
				 >
					<Flex
						direction="row"
						mt={5}
						align="center">
						<Text
							variant="heading"
							mr="14">
						DAO Stats
						</Text>
						<Spacer />

						<Menu
							placement="bottom"
							align="right"
						>
							<Box
								width="169px"
								height="32px"
								borderRadius="8px"
								border="1px solid #AAAAAA"
								align="center"
							>
								<MenuButton
									as={Button}
									mt="1"
									aria-label="View More Options"
									// mt="-28px"
									// pl="16px"
									variant="link"
									textDecoration="none"
									_focus={{}}
									leftIcon={<Image src="/ui_icons/calender-dao.svg" />}
									color="#373737"
									rightIcon={<Image src="/ui_icons/dropdown_arrow.svg" />}
									fontSize="16px"
									fontWeight="500"
									w="fit-content"
									mx="auto"
								>
          Last Month
								</MenuButton>
							</Box>
							<MenuList
								minW="164px"
								p={0}>
								<MenuItem>
									<Text
										fontSize="14px"
										fontWeight="400"
										lineHeight="20px"
										color="#122224"
									 >
										Last 3 Month
									</Text>
								</MenuItem>

								<MenuItem>
									<Text
										fontSize="14px"
										fontWeight="400"
										lineHeight="20px"
										color="#122224"
									 >
										Last 3 Month
									</Text>
								</MenuItem>
								<MenuItem>
									<Text
										fontSize="14px"
										fontWeight="400"
										lineHeight="20px"
										color="#122224"
									 >
										Last 3 Month
									</Text>
								</MenuItem>

							</MenuList>
						</Menu>
					</Flex>


					<Flex
						mt="5"
						width="1040px"
						height="84px"
						background="#FFFFFF"
						box-shadow="0px 0px 8px rgba(18, 34, 36, 0.08)"
						border-radius="8px"
						display="flex"

					 >


						<Flex
							margin="5"
							display="flex"
							gap="60px"
						>



							<Flex
								display="flex"
								flexDirection="column"
								alignItems="flex-start"
							>

								<Flex>
									<Text
										fontWeight={700}
										fontSize="20px"
										lineHeight="24px"
									>
                             6,347
									</Text>
									<Text
										fontWeight="400"
										fontSize="14px"
										lineHeight="24px"
										color="#00AD84"
										ml="10px"
									>
									+40%
									</Text>
								</Flex>

								<Text
				 fontSize="16px"
				 color="#AAAAAA"
				 fontWeight="400"
				 lineHeight="24px"
				 >
Total Applicants
								</Text>

							</Flex>


							<Flex
								display="flex"
								flexDirection="column"
								alignItems="flex-start"
							>

								<Flex>
									<Text
										fontWeight={700}
										fontSize="20px"
										lineHeight="24px"
									>
                             2,636
									</Text>
									<Text
										fontWeight="400"
										fontSize="14px"
										lineHeight="24px"
										color="#EE7979"
										ml="10px"

									>
									-4%
									</Text>
								</Flex>

								<Text
				 fontSize="16px"
				 color="#AAAAAA"
				 fontWeight="400"
				 lineHeight="24px"
				 >
Unique Applicants
								</Text>

							</Flex>

							<Flex
								display="flex"
								flexDirection="column"
								alignItems="flex-start"
							>

								<Flex>
									<Text
										fontWeight={700}
										fontSize="20px"
										lineHeight="24px"
									>
                             3,800
									</Text>
									<Text
										fontWeight="400"
										fontSize="14px"
										lineHeight="24px"
										color="#00AD84"
										ml="10px"

									>
									+7%
									</Text>
								</Flex>

								<Text
				 fontSize="16px"
				 color="#AAAAAA"
				 fontWeight="400"
				 lineHeight="24px"
				 >
Repeats Applicants
								</Text>

							</Flex>

						</Flex>


					</Flex>

					<Flex mt="5px">


					</Flex>


				</Container>
			</Container>

		</>


	)

}

DaoDashboard.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

export default DaoDashboard