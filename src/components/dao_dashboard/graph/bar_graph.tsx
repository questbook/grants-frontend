import React from 'react'
import { Flex, Text } from '@chakra-ui/react'
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })


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
	  categories: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	  show: true,
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
			columnWidth: '20px',
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

function BarGraph() {


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
	Application recieved
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
                Application recieved
								</Text>
								<Text
									fontSize='lg'
									fontWeight='700'
								>
											58,000
									<Text
										as='span'
										color='green.400'
										ml="8px"
										fontSize="14px"
										fontWeight='400'
									>
                     +5%
									</Text>
								</Text>
							</Flex>
							<Flex>

								<Chart
									options={barChartOptionsDashboard as any}
									series={barChartDataDashboard}
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
