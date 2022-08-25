import React, { useEffect } from 'react'
import { Button, Flex, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { formatMinutes } from 'src/utils/dashboardFormating'
import GrantsNameTableContent from './grantsNameTableContent'

const tableBodyFlex = [0.25, 0.40, 0.10, 0.20, 0.17]

function TableContent({ grants, funding, pending, tat }:{grants:any[], funding: any, pending: any, tat: any}) {

	const router = useRouter()

	useEffect(() => {
		console.log('data', grants)
	}, [grants])

	return (
		<>

			<Flex
				mt="15px"
				direction="column"
				w="100%"
				border="1px solid #E8E9E9"
				align="stretch"
				mb="100px"

			>

				{
					grants.map((item:any, index:any) => {
						if(!pending[item.id] || pending[item.id] === 0) {
							return
						}

						return (

							<Flex
								key={index}
								gap={3}
								w="100%"
								bg={(index + 1) % 2 === 0 ? '#F7F9F9' : '#FFFFFF'}
								px={0}
								py={5}>
								{/* <Flex> */}
								<Flex
									flex={tableBodyFlex[0]}
									align="start"
									fontWeight="400"
									fontSize="16px"
									lineHeight="24px"
									ml="20px"
								>
									<GrantsNameTableContent name={item.name} />
								</Flex>

								<Text
									flex={tableBodyFlex[1]}
									align="center"
									letterSpacing="0.5px"
								>
									{/* {item.Pendingapp} */}
									{pending[item.id] ?? 0}
								</Text>

								<Text
									flex={tableBodyFlex[2]}
									align="center"
									letterSpacing="0.5px"
									width="inherit"
								>
								$
									{funding[item.id] ?? 0}
								</Text>

								<Text
									flex={tableBodyFlex[3]}
									align="center"
									letterSpacing="0.5px"
									width="inherit"
								>
									{/* {item.responseTa} */}
									{/* {Number.isNaN(Math.floor(tat[item.id])) ? '-' : `${Math.floor(tat[item.id])} minutes`} */}
									{Number.isNaN(Math.floor(tat[item.id])) ? 'No applications reviewed' : formatMinutes(tat[item.id])}
								</Text>

								<Flex
									display="flex"
									flexDirection="column"
									alignItems="center"
									flex={tableBodyFlex[4]}
								>
									<Button
										fontWeight="500"
										background="#8850EA"
										fontSize="14px"
										lineHeight="14px"
										textAlign="center"
										borderRadius={8}
										borderColor="brand.500"
										_focus={{}}
										p={0}
										minW={0}
										w="88px"
										h="32px"
										color="white"
										onClick={
											() => router.push({
												pathname: '/v2/your_grants/view_applicants',
												query: {
													grantId: item.id
												}
											})
										}
									>
                Review
									</Button>

								</Flex>

							</Flex>
						)
					})

				}

			</Flex>
		</>

	)
}


export default TableContent