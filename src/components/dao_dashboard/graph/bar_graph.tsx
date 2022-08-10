import React, { useEffect, useState } from 'react'
import { Flex, Text } from '@chakra-ui/react'
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
	applications: any[],
	totalApplicants: number
}) {

	const [seriesData, setSeriesData] = useState<any[]>([{
		data: []
	}])

	const [seriesOptions, setSeriesOptions] = useState<any>(barChartOptionsDashboard)

	useEffect(() => {
		console.log(applications)
		const series = applications.map((app) => (app.applications ?? 0))
		console.log(series)
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
				style: {
					fontSize: '12px',
					fontFamily: 'DM Sans,sans-serif',
				},
				onDatasetHover: {
					style: {
						fontSize: '12px',
						fontFamily: 'DM Sans,sans-serif',
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
		} as any
		options.xaxis.categories = applications.map((app, i) => {
			if(i % 7 === 0) {
				const d = new Date(app.date.getTime() + 86400000)
				return `${d.getDate()} ${months[d.getMonth()]}`
			}

			return ''
		})

		setSeriesOptions(options)

	}, [applications])

	return (

		<>
			{
				data.length === 0 ? (

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
	Applications Recieved
								</Text>

							</Flex>
							<Flex>

								<Chart
									options={barChartOptionsDashboard as any}
									series={barChartDataDashboard}
									type="line"
									width="512px"
									height="160px"
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
								alignSelf='flex-start'
								ml="25px"
								mt="5"
							>

								<Text
									fontSize='16px'
								>
                Applications Recieved
								</Text>
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
									type="bar"
									width="512px"
									height="160px"
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
