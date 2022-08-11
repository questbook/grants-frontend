import React from 'react'
import {
	Box,
	HStack } from '@chakra-ui/react'

type ApplicationsStatusProps = {
    isAcceptedActive: boolean
    isInReviewActive: boolean
    isRejectedActive: boolean
    onClickFirst : () => void
    onClickSecond: () => void
    onClickThird: () => void
    }

const ApplicationStatusBar = ({ isAcceptedActive, isInReviewActive, isRejectedActive, onClickFirst, onClickSecond, onClickThird } : ApplicationsStatusProps) => {
	return (
		<HStack
			spacing='24px'
			mt={2}>
			<Box
				as="button"
				w='128px'
				h='28px'
				font-style='normal'
				font-weight='400'
				font-size='14px'
				line-height='20px'
				textColor={isAcceptedActive ? '#FFFFFF' : '#1F1F33'}
				bg={isAcceptedActive ? '#1F1F33' : '#E0E0EC'}
				onClick={onClickFirst}>
				{' '}
										Accepted
				{' '}
			</Box>
			<Box
				as="button"
				w='128px'
				h='28px'
				font-style='normal'
				font-weight='400'
				font-size='14px'
				line-height='20px'
				textColor={isInReviewActive ? '#FFFFFF' : '#1F1F33'}
				bg={isInReviewActive ? '#1F1F33' : '#E0E0EC'}
				onClick={onClickSecond}>
				{' '}
										In Review
				{' '}
			</Box>
			<Box
				as="button"
				w='128px'
				h='28px'
				font-style='normal'
				font-weight='400'
				font-size='14px'
				line-height='20px'
				textColor={isRejectedActive ? '#FFFFFF' : '#1F1F33'}
				bg={isRejectedActive ? '#1F1F33' : '#E0E0EC'}
				onClick={onClickThird}>
				{' '}
										Rejected
				{' '}
			</Box>
		</HStack>
	)
}

export default ApplicationStatusBar