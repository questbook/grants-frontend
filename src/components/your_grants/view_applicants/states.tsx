import React from 'react'
import { Text } from '@chakra-ui/react'

const maxWidth = '127px'

function GrantApproved() {
	return (
		<Text
			w='100%'
			maxW={maxWidth}
			bg='#C8E9DE'
			color='#334640'
			borderRadius='24px'
			border='1px solid #69B399'
			px={3}
			py={1}
			textAlign='center'
			fontSize='12px'
			lineHeight='20px'
			fontWeight='400'
			whiteSpace='nowrap'
		>
			Grant Approved
		</Text>
	)
}

function Rejected() {
	return (
		<Text
			w='100%'
			maxW={maxWidth}
			bg='#EBCCDD'
			color='#7B4646'
			borderRadius='24px'
			border='1px solid #EE7979'
			px={3}
			py={1}
			textAlign='center'
			fontSize='12px'
			lineHeight='20px'
			fontWeight='400'
		>
			Rejected
		</Text>
	)
}

function PendingReview() {
	return (
		<Text
			w='100%'
			maxW={maxWidth}
			bg='#FFF0B8'
			color='#46251D'
			borderRadius='24px'
			border='1px solid #EFC094'
			px={3}
			py={1}
			textAlign='center'
			fontSize='12px'
			lineHeight='20px'
			fontWeight='400'
			whiteSpace='nowrap'
		>
			Pending Review
		</Text>
	)
}

function ResubmissionRequested() {
	return (
		<Text
			w='100%'
			maxW={maxWidth}
			bg='#BBDEFF'
			color='#3E4969'
			borderRadius='24px'
			border='1px solid #88BDEE'
			px={3}
			py={1}
			textAlign='center'
			fontSize='12px'
			lineHeight='20px'
			fontWeight='400'
			whiteSpace='nowrap'
		>
			Awaiting Resubmit
		</Text>
	)
}

function GrantComplete() {
	return (
		<Text
			w='100%'
			maxW={maxWidth}
			bg='#C8E9DE'
			color='#334640'
			borderRadius='24px'
			border='1px solid #69B399'
			px={3}
			py={1}
			textAlign='center'
			fontSize='12px'
			lineHeight='20px'
			fontWeight='400'
			whiteSpace='nowrap'
		>
			Closed
		</Text>
	)
}

function AssignedToReview() {
	return (
		<Text
			w='100%'
			maxW={maxWidth}
			variant='outline'
			bg='rgba(149, 128, 255, 0.1)'
			color='brand.500'
			borderRadius='24px'
			border='1px solid #69B399'
			borderColor='brand.500'
			px={2}
			py={1}
			textAlign='center'
			fontSize='12px'
			lineHeight='20px'
			fontWeight='400'
			whiteSpace='nowrap'
		>
			Assigned to Review
		</Text>
	)
}

function ReviewDone() {
	return (
		<Text
			w='100%'
			maxW={maxWidth}
			bg='#C8E9DE'
			color='#334640'
			borderRadius='24px'
			border='1px solid #69B399'
			px={3}
			py={1}
			textAlign='center'
			fontSize='12px'
			lineHeight='20px'
			fontWeight='400'
			whiteSpace='nowrap'
		>
			Review Done
		</Text>
	)
}

export {
	GrantApproved, Rejected, PendingReview, ResubmissionRequested, GrantComplete,
	AssignedToReview, ReviewDone,
}
