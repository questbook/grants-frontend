import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const data = [2]
const barChartDataDashboard = [
	{
	  name: 'Sales',
	  data: [330, 250, 110, 300, 490, 350, 270, 130, 425],
	},
]

const barChartOptionsDashboard = {
	chart: {
	  toolbar: {
			show: false,
	  },
	},
	tooltip: {
	  style: {
			fontSize: '12px',
			fontFamily: 'Plus Jakarta Display',
	  },
	  onDatasetHover: {
			style: {
		  fontSize: '12px',
		  fontFamily: 'Plus Jakarta Display',
			},
	  },
	  theme: 'dark',
	},
	xaxis: {
	  categories: [],
	  show: true,
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
	},
	grid: {
	  show: false,
	},
	fill: {
	  colors: '#BD96E3',
	},
	dataLabels: {
	  enabled: false,
	},
	plotOptions: {
	  bar: {
			borderRadius: 2,
			columnWidth: '32px',
	  },
	},
	responsive: [
	  {
			breakpoint: 768,
			options: {
		  plotOptions: {
					bar: {
			  borderRadius: 0,
					},
		  },
			},
	  },
	],
}

function BarGraph({
	applications,
	totalApplicants,
}: {
	applications: any[]
	totalApplicants: number
}) {

	const [seriesData, setSeriesData] = useState<any[]>([{
		data: []
	}])

	const [seriesOptions, setSeriesOptions] = useState<any>(barChartOptionsDashboard)

	const [currentMonth, setCurrentMonth] = useState(1)

	const { t } = useTranslation()

	useEffect(() => {
		// console.log(applications)
		const series = applications.slice(-30 * currentMonth, -30 * (currentMonth - 1) === 0 ? applications.length : -30 * (currentMonth - 1)).map((app) => (app.applications ?? 0))
		// console.log(series)
		setSeriesData([{
			name: 'Applications',
			data: series
		}])

		const options = {
			chart: {
				toolbar: {
					show: false,
				},
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
				custom: ({ series, seriesIndex, dataPointIndex }: {series: any, seriesIndex: any, dataPointIndex: any}) => {
					const d = new Date(applications[dataPointIndex].date.getTime() + 86400000)
					return (
						`<div class='barhover'>
							<span style='color: #373737; font-weight: 700'>${d.getDate()}</span> ${months[d.getMonth()]}
							<br />
							<span style='color: #373737; font-weight: 700'>${series[seriesIndex][dataPointIndex]}</span> Applicants
						</div>`
					)
				}
			},
			xaxis: {
				categories: [],
				show: true,
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
			},
			grid: {
				show: false,
			},
			fill: {
				colors: '#BD96E3',
			},
			dataLabels: {
				enabled: false,
			},
			plotOptions: {
				bar: {
					borderRadius: 2,
					columnWidth: '32px',
				},
			},
			responsive: [
				{
					breakpoint: 768,
					options: {
						plotOptions: {
							bar: {
								borderRadius: 0,
							},
						},
					},
				},
			]
		} as any
		options.xaxis.categories = applications.slice(-30 * currentMonth, -30 * (currentMonth - 1) === 0 ? applications.length : -30 * (currentMonth - 1)).map((app, i) => {
			if(i % 7 === 0) {
				const d = new Date(app.date.getTime() + 86400000)
				return `${d.getDate()} ${months[d.getMonth()]}`
			}

			return ''
		})

		setSeriesOptions(options)

	}, [applications, currentMonth])

	return (

		<>
			{
				data.length === 0 ? (

					<>
						<Flex
							width='512px'
							height='250px'
							borderRadius='8px'
							background='#FFFFFF'
							boxShadow='0px 0px 8px rgba(18, 34, 36, 0.15)'
							flexDirection='column'

				 >
							<Flex
								direction='column'
								alignSelf='flex-start'
								ml='25px'
								mt='5'
							>

								<Text
									fontSize='16px'
								>
									{t('/dashboard.proposals_received')}
								</Text>

							</Flex>
							<Flex>

								<Chart
									options={barChartOptionsDashboard as any}
									series={barChartDataDashboard}
									type='line'
									width='512px'
									height='160px'
					 />
							</Flex>
						</Flex>
					</>
				) : (
					<>
						<Flex
							width='512px'
							height='250px'
							borderRadius='8px'
							background='#FFFFFF'
							boxShadow='0px 0px 8px rgba(18, 34, 36, 0.15)'
							flexDirection='column'

							 >
							<Flex
								direction='column'
								// alignSelf='flex-start'
								mx='25px'
								mt='5'
							>

								<Flex w='100%'>
									<Text
										fontSize='16px'
										mr='auto'
									>
										{t('/dashboard.proposals_received')}
									</Text>
									<Menu
										placement='bottom'
										// align="right"
									>
										<Box
											width='169px'
											height='32px'
											borderRadius='8px'
											border='1px solid #AAAAAA'
											alignItems='center'
											justifyContent='center'
											display='flex'
										>
											<MenuButton
												as={Button}
												aria-label='View More Options'
												// mt="-28px"
												// pl="16px"
												variant='link'
												textDecoration='none'
												_focus={{}}
												leftIcon={<Image src='/ui_icons/calender-dao.svg' />}
												color='#373737'
												rightIcon={<Image src='/ui_icons/dropdown_arrow.svg' />}
												fontSize='14px'
												fontWeight='500'
												w='fit-content'
												mx='auto'
											>
												{months[new Date((new Date()).getTime() + 86400000 * 30 * (12 - currentMonth + 1)).getMonth()]}
											</MenuButton>
										</Box>
										<MenuList
											minW='164px'
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
																fontSize='14px'
																fontWeight='400'
																lineHeight='20px'
																color='#122224'
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
									{totalApplicants}
									{/* <Text
										as='span'
										color='green.400'
										ml="8px"
										fontSize="14px"
										fontWeight='400'
									>
                     +5%
									</Text> */}
								</Text>
							</Flex>
							<Flex>

								<Chart
									options={seriesOptions as any}
									series={seriesData}
									type='bar'
									width='512px'
									height='160px'
								 />
							</Flex>
						</Flex>
					</>
				)
			}
		</>


	)

}

export default BarGraph
