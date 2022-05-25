import React from 'react'
import {
	Box, Button, Flex, Image,
	ModalBody, Text, } from '@chakra-ui/react'
import { WorkspaceUpdateRequest } from '@questbook/service-validator-client'
import useEncryption from 'src/hooks/utils/useEncryption'
import Loader from './loader'
import Modal from './modal'

interface Props {
  hiddenModalOpen: boolean;
  setHiddenModalOpen: (hiddenModalOpen: boolean) => void;
  setPublicKey: React.Dispatch<React.SetStateAction<WorkspaceUpdateRequest>>;
  loading: boolean;
}

function SubmitPublicKeyModal({
	hiddenModalOpen,
	setHiddenModalOpen,
	setPublicKey,
	loading,
}: Props) {
	const { getPublicEncryptionKey } = useEncryption()
	return (
		<Modal
			isOpen={hiddenModalOpen}
			onClose={() => setHiddenModalOpen(false)}
			title="Public key request"
			modalWidth={566}
		>
			<ModalBody px={10}>
				<Flex direction="column">
					<Flex mt="36px">
						<Text
							fontWeight="bold"
							fontSize="18px">
              How does this work?
						</Text>
					</Flex>
					<Flex
						mt="28px"
						alignItems="center">
						<Box
							bg="#8850EA"
							color="#fff"
							h={10}
							w={10}
							display="flex"
							alignItems="center"
							justifyContent="center"
							borderRadius="50%"
							mr="19px"
							flexShrink={[0]}
						>
              1
						</Box>
						<Text>
              Once you give access to your public key, you will be able to view
              the applicant personal info (email, and about team).
						</Text>
					</Flex>
					<Flex
						alignItems="center"
						mt="35px">
						<Box
							bg="#8850EA"
							color="#fff"
							h={10}
							w={10}
							display="flex"
							alignItems="center"
							justifyContent="center"
							borderRadius="50%"
							mr="19px"
							flexShrink={[0]}
						>
              2
						</Box>
						<Text>
After clicking “Continue”  open your wallet and click ‘Provide’.
						</Text>
					</Flex>
					<Flex
						alignItems="center"
						mt="35px"
						mb="40px">
						<Box
							bg="#8850EA"
							color="#fff"
							h={10}
							w={10}
							display="flex"
							alignItems="center"
							justifyContent="center"
							borderRadius="50%"
							mr="19px"
							flexShrink={[0]}
						>
              3
						</Box>
						<Text>
Click “Confirm” to confirm the transaction.
						</Text>
					</Flex>
					<Text
						mt={8}
						variant="footer"
						fontSize="14px"
						fontWeight="medium"
						lineHeight="20px">
						<Image
							display="inline-block"
							src="/ui_icons/info.svg"
							alt="pro tip"
							mb="-2px"
						/>
						{' '}
            By pressing Continue you&apos;ll have to approve this transaction in your wallet.
					</Text>
					<Button
						mb={10}
						mt={8}
						variant="primary"
						onClick={
							async() => setPublicKey({
								publicKey: (await getPublicEncryptionKey()) || '',
							})
						}
					>
						{loading ? <Loader /> : 'Continue'}
					</Button>
				</Flex>
			</ModalBody>
		</Modal>
	)
}

export default SubmitPublicKeyModal
