import React, { useState } from 'react'
import {
	Box,
	Flex, Image, Link, ModalBody, Text, } from '@chakra-ui/react'
import copy from 'copy-to-clipboard'
import Modal from 'src/components/ui/modal'
import useMailTo from 'src/hooks/utils/useMailTo'

function MailTo({ applicantEmail }: { applicantEmail: string }) {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [copied, setCopied] = useState(false)
	const { defaultLink, gmailLink, yahooLink } = useMailTo(
		applicantEmail,
		`Hi <Applicant Name>,%0D
Thanks for applying to <Grant Title > grant.%0D
As a next step, we would like to schedule a call with you and your team. Here’s my Calendly link : <Link> Feel free to choose any open slot to schedule an intro. call with us. Look forward to speaking with you. %0D%0D
Best,%0D
<Name>`,
		'Request for a Meeting',
		undefined,
		'questbook.app@gmail.com',
	)
	return (
		<>
			{
				defaultLink ? (
					<Link
						isExternal
						href={defaultLink}>
						<Image
							display='inline-block'
							src='/ui_icons/brand/email.svg'
							alt='mail to'
							mb='-2px'
							ml='4px'
						/>
					</Link>
				) : (
					<Image
						display='inline-block'
						src='/ui_icons/brand/email.svg'
						alt='mail to'
						mb='-2px'
						ml='4px'
						cursor='pointer'
						onClick={() => setIsModalOpen(true)}
					/>
				)
			}

			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title='Choose your email service'
				modalWidth='527px'
			>
				<ModalBody px={8}>
					<Text>
						Send a document, or interview link to applicant inbox.
					</Text>
					<Box my={8} />

					<Flex
						alignItems='center'
						justifyContent='space-evenly'>
						<Link
							isExternal
							href={gmailLink}>
							<Image
								src='/illustrations/gmail.svg'
							/>
						</Link>
						<Link
							isExternal
							href={yahooLink}>
							<Image
								src='/illustrations/yahoo.svg'
							/>
						</Link>
					</Flex>

					<Box my={8} />
					<Flex justifyContent='center'>
						<Image
							display='inline-block'
							src='/ui_icons/brand/email.svg'
							alt='mail to'
							mb='0px'
							mr='6px'
						/>
						<Link onClick={() => copy(applicantEmail) && setCopied(true)}>
							{copied ? 'Copied!' : 'Copy email address'}
						</Link>
					</Flex>

					<Box my={8} />
				</ModalBody>
			</Modal>
		</>
	)
}

export default MailTo
