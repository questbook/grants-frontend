import {
	Box,
	Divider,
	Flex,
	Image,
	Input,
	Spacer,
	Text
} from '@chakra-ui/react'

type RubricsInputProps = {
    rubricEditAllowed: boolean
    rubrics: any[];
  setRubrics: (rubrics: any[]) => void;
  setupStep: boolean
}

const RubricsInput = ({ rubricEditAllowed, rubrics, setRubrics, setupStep } : RubricsInputProps) => {
	return (
		<>
			{
				rubrics.map((_rubric, index) => (
					<Flex
						key={index}
						flexDirection="column"
						mt={2}
						backgroundColor="#FFFFFF"
						ml={-4}
						mr="auto"
						alignItems="flex-start"
						w="90%" >
						<Flex
							flexDirection="column"
							gap="2"
							alignItems="flex-start"
							w="90%"
						>
							<Flex
								gap={2}
								margin={2}
								flex={0.6673}
								w="100%">
								<Input
									variant="flushed"
									value={rubrics[index].name}
									onChange={
										(e) => {
											const newRubrics = [...rubrics]
											newRubrics[index].name = e.target.value
											newRubrics[index].nameError = false
											setRubrics(newRubrics)
										}
									}
									placeholder="َQuality"
									borderColor={
										rubrics[index].nameError ||
                rubrics[index].name.length > 30
											? 'red'
											: 'inherit'
									}
									isDisabled={!rubricEditAllowed}
								/>
								<Flex
									mt={2}
									gap="2"
									justifyContent="flex-start">
									<Box
										onClick={
											() => {
												if(!rubricEditAllowed) {
													return
												}

												const newRubrics = [...rubrics]
												newRubrics.splice(index, 1)
												setRubrics(newRubrics)
											}
										}
										display="flex"
										alignItems="center"
										cursor="pointer"
										opacity={rubricEditAllowed ? 1 : 0.4}
									>
										<Image
											h="16px"
											w="15px"
											src="/ui_icons/delete_red.svg"
											mr="6px"
										/>
									</Box>
								</Flex>
							</Flex>
							<Flex
								flexDirection="row"
								width="100%">
								<Spacer />
								<Box>
									{rubrics[index].name.length}
              /30
								</Box>
							</Flex>
						</Flex>
						<Flex
							flexDirection="column"
							gap="2"
							alignItems="flex-start"
							opacity={rubricEditAllowed ? 1 : 0.4}
							w="90%"
						>
							<Flex
								gap={2}
								margin={2}
								flex={0.6673}
								w="100%">
								<Input
									variant="flushed"
									value={rubrics[index].description}
									onChange={
										(e) => {
											const newRubrics = [...rubrics]
											newRubrics[index].description = e.target.value
											newRubrics[index].descriptionError = false

											setRubrics(newRubrics)
										}
									}
									placeholder="Description"
									borderColor={
										rubrics[index].descriptionError ||
                rubrics[index].description.length > 100
											? 'red'
											: 'inherit'
									}
									isDisabled={!rubricEditAllowed}
								/>
							</Flex>
							<Flex
								flexDirection="row"
								width="100%">
								<Spacer />
								<Box>
									{rubrics[index].description.length}
              /100
								</Box>
							</Flex>
						</Flex>
						<Divider mt={4} />
					</Flex>

				))
			}
			{
				!setupStep && (
					<Flex
						ml={10}
						mt="20px"
						gap="2"
						justifyContent="flex-start">
						<Box
							onClick={
								() => {
									if(!rubricEditAllowed) {
										return
									}

									const newRubrics = [
										...rubrics,
										{
											name: '',
											nameError: false,
											description: '',
											descriptionError: false,
										},
									]
									setRubrics(newRubrics)
								}
							}
							display="flex"
							alignItems="center"
							cursor="pointer"
							opacity={rubricEditAllowed ? 1 : 0.4}
						>
							<Image
								h="16.67px"
								w="16.67px"
								src="/ui_icons/plus_circle_blue.svg"
								mr="6px"
							/>
							<Text
								fontWeight="500"
								fontSize="14px"
								color="#0065FF"
								lineHeight="20px"
							>
Add another quality
							</Text>
						</Box>
					</Flex>
				)


			}
		</>
	)
}

export default RubricsInput