import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
	Box,
	Button, Flex, ModalBody, Text, } from '@chakra-ui/react'
import MultiLineInput from 'src/components/ui/forms/multiLineInput'
import Loader from 'src/components/ui/loader'

interface Props {
  onClose: (details: string) => void
  hasClicked: boolean
}

function ModalContent({ onClose, hasClicked }: Props) {
	const [details, setDetails] = useState('')
	const [detailsError, setDetailsError] = useState(false)

	const { t } = useTranslation()

	return (
		<ModalBody
			maxW='521px'
			mt={8}>
			<Flex
				direction='column'
				justify='start'
				align='stretch'>
				<Text
					textAlign='center'
					variant='applicationText'>
					Add a brief summary of what was achieved in the grant,
					appreciation for the team and links to show the proof of work.
				</Text>
				<Flex
					mt={8}
					w='100%'>
					<MultiLineInput
						label='Grant Completion Summary'
						placeholder='A tool, script or tutorial to set up monitoring for miner GPU, CPU, & memory.'
						value={details}
						isError={detailsError}
						onChange={
							(e) => {
								if(detailsError) {
									setDetailsError(false)
								}

								setDetails(e.target.value)
							}
						}
						errorText='Required'
						maxLength={300}
					/>
				</Flex>
				<Button
					w='100%'
					variant='primary'
					mt={6}
					py={hasClicked ? 2 : 0}
					onClick={() => (hasClicked ? {} : onClose(details))}>
					{hasClicked ? <Loader /> : 'Mark Application as closed'}
				</Button>
				<Box mb={4} />
			</Flex>
		</ModalBody>
	)
}

export default ModalContent
