import { useState } from 'react'
import { Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text } from '@chakra-ui/react'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import MilestoneChoose from 'src/screens/dashboard/_components/FundBuilder/MilestoneChoose'
import PayFromChoose from 'src/screens/dashboard/_components/FundBuilder/PayFromChoose'
import PayWithChoose from 'src/screens/dashboard/_components/FundBuilder/PayWithChoose'
import ToChoose from 'src/screens/dashboard/_components/FundBuilder/ToChoose'

interface Props {
	isOpen: boolean
	onClose: () => void
}

function FundBuilderModal({ isOpen, onClose }: Props) {
	const buildComponent = () => {
		return (
			<Modal
				isOpen={isOpen}
				size='2xl'
				onClose={onClose}
				isCentered
				scrollBehavior='outside'>
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />
					<ModalBody>
						<Flex
							p={6}
							direction='column'
							align='center'
							w='100%'>
							<Text fontWeight='500'>
								Fund Builders
							</Text>
							<Flex
								mt={7}
								w='100%'
								justify='center'
								align='start'>
								<Text>
									$
								</Text>
								<FlushedInput
									borderBottom='2px solid'
									textPadding={1}
									type='number'
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
									placeholder='0' />
							</Flex>
							<Flex
								mt={6}
								w='100%'
								direction='column'
								border='1px solid #E7E4DD'>
								<PayFromChoose />
								<PayWithChoose />
								<ToChoose />
								<MilestoneChoose />
							</Flex>
						</Flex>

					</ModalBody>
				</ModalContent>
			</Modal>
		)
	}

	const [amount, setAmount] = useState<string>('0')

	return buildComponent()
}

export default FundBuilderModal