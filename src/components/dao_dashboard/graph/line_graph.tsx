import React, { useEffect, useState } from 'react'
import { Box, Button, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react'
import dynamic from 'next/dynamic'


const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']


const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })
const data: number | never[] = []
const lineChartDataProfile2 = [
	{
	  name: 'Mobile apps',
	  data: [0, 0, 0, 0, 0, 0, 0, 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	}
]


const lineChartOptionsProfile2 = {
	chart: {
	  toolbar: {
			show: false,
	  },
	  redrawOnParentResize: true
	},
	tooltip: {
	  theme: 'dark',
	},
	dataLabels: {
	  enabled: false,
	},
	stroke: {
	  curve: 'smooth',
	},
	xaxis: {
		show: true,
	  // categories: [
		// 	'21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20' ],
		categories: [],
	  labels: {
			show: true,
			style: {
		  colors: '#AAAAAA',
		  fontSize: '12px',
			},
	  },
	  axisBorder: {
			show: false,
	  },
	  axisTicks: {
			show: false,
	  },
	},
	yaxis: {
	  show: false,
	  labels: {
			style: {
		  colors: '#c8cfca',
		  fontSize: '12px',
			},
	  },
	},
	legend: {
	  show: false,
	},
	grid: {
	  show: false,
	},
	// fill: {
	//   type: 'gradient',
	//   gradient: {
	// 		shade: 'dark',
	// 		type: 'vertical',
	// 		shadeIntensity: 0,
	// 		gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
	// 		inverseColors: true,
	// 		opacityFrom: 0.8,
	// 		opacityTo: 0,
	// 		stops: [],
	//   },
	//   colors: ['#582CFF'],
	// },
	colors: ['#582CFF'],
}

function LineGraph({
	app_count,
	title,
	fundings,
	totalFunding,
}:{
	app_count:string,
	title: string,
	fundings: any[],
	totalFunding: number,
}) {

	const [seriesData, setSeriesData] = useState<any[]>([{
		data: []
	}])

	const [seriesOptions, setSeriesOptions] = useState<any>(lineChartOptionsProfile2)

	const [currentMonth, setCurrentMonth] = useState(1)

	useEffect(() => {

		console.log(fundings)
		const series = fundings.slice(-30 * currentMonth, -30 * (currentMonth - 1) === 0 ? fundings.length : -30 * (currentMonth - 1)).map((app) => (app.funding))
		console.log(series)
		setSeriesData([{
			name: 'Funds transfered',
			data: series
		}])

		const options = {
			chart: {
				toolbar: {
					show: false,
				},
				redrawOnParentResize: true
			},
			tooltip: {
				// style: {
				// 	fontSize: '12px',
				// 	fontFamily: 'DM Sans,sans-serif',
				// },
				// onDatasetHover: {
				// 	style: {
				// 		fontSize: '12px',
				// 		fontFamily: 'DM Sans,sans-serif',
				// 	},
				// },
				// theme: 'dark',
				custom: ({ series, seriesIndex, dataPointIndex, w }: {series: any, seriesIndex: any, dataPointIndex: any, w: any}) => {
					const d = new Date(fundings[dataPointIndex].date.getTime() + 86400000)
					return (
						`<div class='barhover'>
							<span style='color: #373737; font-weight: 700'>${d.getDate()}</span> ${months[d.getMonth()]}
							<br />
							<span style='color: #373737; font-weight: 700'>$${series[seriesIndex][dataPointIndex]}</span> Disbursed
						</div>`
					)
				}
			},
			dataLabels: {
				enabled: false,
			},
			stroke: {
				curve: 'smooth',
			},
			xaxis: {
				show: true,
				// categories: [
				// 	'21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20' ],
				categories: [],
				labels: {
					show: true,
					rotate: 0,
					style: {
						colors: '#AAAAAA',
						fontSize: '12px',
					},
				},
				axisBorder: {
					show: false,
				},
				axisTicks: {
					show: false,
				},
			},
			yaxis: {
				show: false,
				labels: {
					style: {
						colors: '#c8cfca',
						fontSize: '12px',
					},
				},
			},
			legend: {
				show: false,
			},
			grid: {
				show: false,
			},
			// fill: {
			//   type: 'gradient',
			//   gradient: {
			// 		shade: 'dark',
			// 		type: 'vertical',
			// 		shadeIntensity: 0,
			// 		gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
			// 		inverseColors: true,
			// 		opacityFrom: 0.8,
			// 		opacityTo: 0,
			// 		stops: [],
			//   },
			//   colors: ['#582CFF'],
			// },
			colors: ['#582CFF'],
		} as any
		options.xaxis.categories = fundings.slice(-30 * currentMonth, -30 * (currentMonth - 1) === 0 ? fundings.length : -30 * (currentMonth - 1)).map((app, i) => {
			if(i % 7 === 0) {
				const d = new Date(app.date.getTime() + 86400000)
				return `${d.getDate()} ${months[d.getMonth()]}`
			}

			return ''
		})

		setSeriesOptions(options)

	}, [fundings, currentMonth])


	return (

		<>

			{
				data === 0 ? (

					<>

						<Flex
							width="512px"
							height="250px"
							borderRadius="8px"
							background="#FFFFFF"
							boxShadow="0px 0px 8px rgba(18, 34, 36, 0.15)"
							flexDirection="column"

							 >
							<Flex
								direction='column'
								alignSelf='flex-start'
								ml="25px"
								mt="5"
							>

								<Text
									fontSize='16px'
								>
                Total Funds Disbursed
								</Text>

							</Flex>
							<Flex >

								<Chart
									options={lineChartOptionsProfile2 as any}
									series={lineChartDataProfile2}
									type="line"
									width="512px"
									height="160px"
									ml="20px"
								 />

							</Flex>
						</Flex>

					</>

				) : (

					<>

						<Flex
							width="512px"
							height="250px"
							borderRadius="8px"
							background="#FFFFFF"
							boxShadow="0px 0px 8px rgba(18, 34, 36, 0.15)"
							flexDirection="column"

				 >
							<Flex
								direction='column'
								// alignSelf='flex-start'
								mx="25px"
								mt="5"
							>

								<Flex w={'100%'}>
									<Text
										mr='auto'
										fontSize='16px'
									>
	Total Funds Disbursed
									</Text>

									<Menu
										placement="bottom"
									// align="right"
									>
										<Box
											width="169px"
											height="32px"
											borderRadius="8px"
											border="1px solid #AAAAAA"
											alignItems="center"
											justifyContent={'center'}
											display={'flex'}
										>
											<MenuButton
												as={Button}
												aria-label="View More Options"
												// mt="-28px"
												// pl="16px"
												variant="link"
												textDecoration="none"
												_focus={{}}
												leftIcon={<Image src="/ui_icons/calender-dao.svg" />}
												color="#373737"
												rightIcon={<Image src="/ui_icons/dropdown_arrow.svg" />}
												fontSize="14px"
												fontWeight="500"
												w="fit-content"
												mx="auto"
											>
          							{months[new Date((new Date()).getTime() + 86400000 * 30 * (12 - currentMonth + 1)).getMonth()]}
											</MenuButton>
										</Box>
										<MenuList
											minW="164px"
											maxH='120px'
											overflow='scroll'
											p={0}>
											{
												Array(12).fill(0).map((_, i) => {
													const t = new Date()
													const d = new Date(t.getTime() + 86400000 * 30 * (12 - i))
													return (
														<MenuItem
															onClick={() => setCurrentMonth(t.getMonth() - d.getMonth() + 1)}
															key={`bar-graph-${i}`}>
															<Text
																fontSize="14px"
																fontWeight="400"
																lineHeight="20px"
																color="#122224"
															>
																{months[d.getMonth()]}
															</Text>
														</MenuItem>
													)
												})
											}

										</MenuList>
									</Menu>

								</Flex>
								<Text
									fontSize='lg'
									fontWeight='700'
								>
								$
									{totalFunding}
									{/* <Text
										as='span'
										color='green.400'
										ml="8px"
										fontSize="14px"
										fontWeight='400'>
		 +52%
									</Text> */}
								</Text>
							</Flex>
							<Flex >

								<Chart
									options={seriesOptions as any}
									series={seriesData}
									type="line"
									width="512px"
									height="160px"
									ml="20px"
					 />

							</Flex>
						</Flex>

					</>


				)

			}
		</>


	)

}

export default LineGraph
