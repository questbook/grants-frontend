import { Box, Circle, HStack, Text, VStack } from '@chakra-ui/react'
import { CheckCircle } from '../assets/custom chakra icons/CheckCircle'

export type ControlBarProps = {
	currentIndex: number
	points: { id: string, label: string }[]
}

export default function ControlBar({ points, currentIndex }: ControlBarProps) {
	return (
		<HStack
			width='100%'
			alignItems='stretch'
			justifyContent='stretch'
			spacing='2'>
			{
				points.map(({ id, label }, idx) => {
					const isStepDone = currentIndex > idx
					const colorScheme = currentIndex === idx
						? 'primary'
						: (
							isStepDone
								? 'black'
								: 'v2LightGrey'
						)
					return (
						<VStack
							align='start'
							w='100%'
							key={id}
							spacing='1'>
							<Box
								w='100%'
								h='1'
								backgroundColor={colorScheme}
								borderRadius='base' />
							<HStack align='center'>
								{
									isStepDone
										? (
											<CheckCircle />
										)
										: (
											<Circle
												size='3.5'
												bg={colorScheme}>
												<Circle
													bg='white'
													size={currentIndex === idx ? '1.5' : '3'} />
											</Circle>
										)
								}
								<Text
									fontWeight='bold'
									fontSize='sm'
									color={colorScheme}>
									{label}
								</Text>
							</HStack>
						</VStack>
					)
				})
			}
		</HStack>
	)
}