import React from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Grid, Heading, Text } from '@chakra-ui/react'
import { getAverageTime } from 'src/utils/calculatingUtils'

interface Props {
  disbursed: Array<number>
  applicants: Array<number>
  winners: Array<number>
  fundTimes: Array<number>
  applicationTime: Array<number>
}

function DaoData({ disbursed, applicants, winners, fundTimes, applicationTime }: Props) {
	const { t } = useTranslation()
	return (
		<Grid
			gap='1rem'
			gridTemplateColumns={{ base: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }}
			w={
				{
					base: '100%',
					sm: '85%',
					lg: '70%',
				}
			}>
			<Flex direction='column'>
				<Heading
					color='#122224'
					fontSize='1.2rem'
					lineHeight='1.5rem'
				>
					$
					{disbursed}
				</Heading>
				<Text
					fontSize='14px'
					lineHeight='24px'
					fontWeight='400'
					color='#AAAAAA'
					width='150px'
				>
					{t('/profile.grants_disbursed')}
				</Text>
			</Flex>

			<Flex direction='column'>
				<Heading
					color='#122224'
					fontSize='1.2rem'
					lineHeight='1.5rem'>
					{applicants}
				</Heading>
				<Text
					fontSize='0.875rem'
					lineHeight='24px'
					fontWeight='400'
					color='#AAAAAA'
				>
					{t('/profile.proposals')}
				</Text>
			</Flex>

			<Flex direction='column'>
				<Heading
					color='#122224'
					fontSize='1.2rem'
					lineHeight='1.5rem'>
					{winners}
				</Heading>
				<Text
					fontSize='0.875rem'
					lineHeight='24px'
					fontWeight='400'
					color='#AAAAAA'
				>
					{t('/profile.accepted')}
				</Text>
			</Flex>

			<Flex
				direction='column'
				display={{ base: 'none' }}>
				<Heading
					color='#122224'
					fontSize='1.2rem'
					lineHeight='1.5rem'>
					{applicationTime.length !== 0 ? getAverageTime(applicationTime, fundTimes) : '--'}
				</Heading>
				<Text
					fontSize='0.875rem'
					lineHeight='24px'
					fontWeight='400'
					color='#AAAAAA'
				>
					Time to release funds
				</Text>
			</Flex>
		</Grid>
	)
}

export default DaoData
