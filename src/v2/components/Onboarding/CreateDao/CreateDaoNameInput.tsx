import { useEffect, useState } from 'react'
import { Box, Flex, Heading, Input, Text } from '@chakra-ui/react'
import { ForwardArrow } from 'src/v2/assets/custom chakra icons/Arrows/ForwardArrow'
import { IdeaBulb } from 'src/v2/assets/custom chakra icons/IdeaBulb'
import ContinueButton from 'src/v2/components/Onboarding/UI/Misc/ContinueButton'

const CreateDaoNameInput = ({
	daoName,
	onSubmit,
}: {
	daoName: string | undefined
  onSubmit: (name: string) => void
}) => {
	const [newDaoName, setNewDaoName] = useState('')
	const [newDaoNameIsError, setNewDaoNameIsError] = useState(false)
	const [newDaoInputIsFocused, setNewDaoInputIsFocused] = useState(false)

	useEffect(() => {
		if(daoName && !newDaoName) {
			setNewDaoName(daoName)
		}
	}, [daoName])

	const errorConditions = [{
		description: 'Numbers, spaces, and letters are allowed',
		errorFunction: (string: string) => !/^[a-zA-Z0-9 ]*$/.test(string.trim()),
	}, {
		description: 'Minimum 5 characters',
		errorFunction: (string: string) => string && string.length < 5,
	}, {
		description: 'Ex: Ethereum DAO, Polygon DAO.',
		errorFunction: (string: string) => false,
	}]

	useEffect(() => {
		if(!newDaoName || newDaoName.length <= 0) {
			setNewDaoNameIsError(false)
			return
		}

		setNewDaoNameIsError(
			errorConditions.some(condition => condition.errorFunction(newDaoName))
		)

		// // console.log(errorConditions.some(condition => condition.errorFunction(newDaoName)))
	}, [newDaoName])
	return (
		<>
			<Text color='brandText'>
				Let’s begin the adventure.
			</Text>
			<Heading variant='small'>
				What would you like to call your DAO?
			</Heading>

			<Flex
				mt={6}
				alignItems='flex-start'>
				<Flex
					direction='column'
					mt={2}>
					<ForwardArrow
						color='blue.500'
						w='16px'
						h='15.56px' />
				</Flex>
				<Flex
					flex={1}
					direction='column'
					ml={4}>
					<Input
						variant='brandFlushed'
						placeholder='DAO Name'
						_placeholder={
							{
								color: 'blue.100',
								fontWeight: '500'
							}
						}
						fontWeight='500'
						value={newDaoName}
						onChange={(e) => setNewDaoName(e.target.value)}
						errorBorderColor='red'
						isInvalid={!newDaoInputIsFocused && newDaoNameIsError}
						onFocus={() => setNewDaoInputIsFocused(true)}
						onBlur={() => setNewDaoInputIsFocused(false)}
					/>

					<Flex
						alignItems='center'
						mt={6}>
						<IdeaBulb color='yellow' />
						<Text
							ml={1}
							fontWeight='500'>
							Tips
						</Text>
					</Flex>

					{
						errorConditions.map((condition, index) => (
							<Flex
								key={`daocreate-error-${index}`}
								letterSpacing='0.5px'
								color={!newDaoInputIsFocused && condition.errorFunction(newDaoName) ? 'red' : '#1F1F33'}
								fontSize='sm'
							>
								<Box ml={1} />
								•
								<Box ml={2} />
								{condition.description}
							</Flex>
						))
					}
				</Flex>
			</Flex>

			<Flex
				mt={2}
				justifyContent='flex-end'>
				<ContinueButton
					disabled={!newDaoName || newDaoNameIsError}
					onClick={() => onSubmit(newDaoName)}
				/>
			</Flex>
		</>
	)
}

export default CreateDaoNameInput