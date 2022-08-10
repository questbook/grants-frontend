import React, { useEffect, useState } from 'react'
import { Flex, Text } from '@chakra-ui/react'
import dynamic from 'next/dynamic'

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

	useEffect(() => {

		console.log(fundings)
		const series = fundings.map((app) => (app.funding))
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
		} as any
		options.xaxis.categories = fundings.map((app) => (app.date.getDate() + 1))

		setSeriesOptions(options)

	}, [fundings])


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
								alignSelf='flex-start'
								ml="25px"
								mt="5"
							>

								<Text
									fontSize='16px'
								>
	Total Funds Disbursed
								</Text>
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
