import React from 'react'
import { Flex, Text } from '@chakra-ui/react'
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })
const data: number | never[] = []
const lineChartDataProfile2 = [
	{
	  name: 'Mobile apps',
	  data: [100, 250, 300, 220, 500, 250, 300, 230, 300, 350, 250, 400],
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
	  categories: [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec',
	  ],
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

function LineGraph({ app_count, title }:{app_count:string, title: string}) {


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
                Total grants disburded
								</Text>

							</Flex>
							<Flex >

								<Chart
									options={lineChartOptionsProfile2}
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
								alignSelf='flex-start'
								ml="25px"
								mt="5"
							>

								<Text
									fontSize='16px'
								>
	Total grants disburded
								</Text>
								<Text
									fontSize='lg'
									fontWeight='700'
								>
								$580,374,737.06
									<Text
										as='span'
										color='green.400'
										ml="8px"
										fontSize="14px"
										fontWeight='400'>
		 +52%
									</Text>
								</Text>
							</Flex>
							<Flex >

								<Chart
									options={lineChartOptionsProfile2}
									series={lineChartDataProfile2}
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
