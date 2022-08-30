import React from 'react'
import {
	Button, Flex, Heading, Image, Link,
	ModalBody, Text, } from '@chakra-ui/react'
import Loader from 'src/components/ui/loader'

interface Props {
  actionButtonOnClick: () => void
  onClose: () => void
  loading: boolean
}

function ConfirmationModalContent({
	actionButtonOnClick, onClose, loading,
}: Props) {
	return (
		<ModalBody>
			<Flex
				direction='column'
				justify='start'
				align='center'>
				<Image
					w='113px'
					h='113px'
					src='/illustrations/revoke_access.svg' />
				<Heading
					mt={8}
					textAlign='center'
					variant='applicationHeading'>
					Are you sure you want to revoke access for this member?
				</Heading>
				<Text
					mt={4}
					textAlign='center'
					variant='applicationText'>
					The member will no longer have access to Grants DAO.
				</Text>
				<Flex
					direction='row'
					mt={6}>
					<Text
						textAlign='left'
						variant='footer'
						fontSize='12px'>
						<Image
							display='inline-block'
							src='/ui_icons/info.svg'
							alt='pro tip'
							mb='-2px' />
						{' '}
						By pressing Revoke Access you&apos;ll have to approve this transaction in your wallet.
						{' '}
						<Link
							href='https://www.notion.so/questbook/FAQs-206fbcbf55fc482593ef6914f8e04a46'
							isExternal>
							Learn more
						</Link>
						{' '}
						<Image
							display='inline-block'
							src='/ui_icons/link.svg'
							alt='pro tip'
							mb='-1px'
							h='10px'
							w='10px'
						/>
					</Text>
				</Flex>
				<Flex
					direction='row'
					w='100%'
					justify='space-evenly'
					mt={10}
					mb={4}>
					<Button
						w='45%'
						variant='resubmit'
						color='brand.500'
						_hover={{ background: '#F5F5F5', borderColor: 'brand.500', borderWidth: '2px' }}
						onClick={onClose}>
						Cancel
					</Button>
					<Button
						w='45%'
						variant='primary'
						onClick={
							() => {
								actionButtonOnClick()
							}
						}
					>
						{loading ? <Loader /> : 'Revoke Access'}
					</Button>
				</Flex>
			</Flex>
		</ModalBody>
	)
}

export default ConfirmationModalContent
