import React, { useRef } from 'react'
import {
	Box,
	Button, Flex, Image, Text,
} from '@chakra-ui/react'

interface ImageUploadProps {
  label?: string
  image: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  isError: boolean
}

const defaultProps = {
	label: 'Upload',
}

function ImageUpload({
	label, image, onChange, isError,
}: ImageUploadProps) {
	const ref = useRef(null)

	const openInput = () => {
		if(ref.current) {
			(ref.current as HTMLInputElement).click()
		}
	}

	return (
		<Flex
			direction='column'
			align='center'>
			<Text
				lineHeight='20px'
				fontWeight='bold'
				width='max-content'>
				{label}
			</Text>
			<Flex
				mt={2}
				bg='white'
				w='72px'
				h='72px'
				display='inline-block'
				borderRadius='4px'
				border={isError ? '3px dashed #EE7979' : '2px dashed #717A7C'}
				padding='5px'
				pos='relative'
			>
				<Button
					p={0}
					onClick={() => openInput()}
					h='100%'
					w='100%'
					flex={1}>
					<Image
						objectFit='cover'
						src={image}
						w='100%'
						h='100%' />
				</Button>

				<input
					style={{ visibility: 'hidden' }}
					ref={ref}
					type='file'
					name='myImage'
					onChange={onChange}
					accept='image/jpg, image/jpeg, image/png' />

				<Box
					position='absolute'
					right={-15}
					bottom={-15}
					bg='white'
					borderRadius={50}
					alignItems='center'
					justifyContent='center'
					padding='2px'
					overflow='hidden'
					cursor='pointer'
					display='flex'
					onClick={() => openInput()}
				>
					<Image
						h='30px'
						w='30px'
						src='/ui_icons/upload.svg' />
				</Box>
			</Flex>
			{/* {subtext && subtext?.length && !image && !image?.length && (
        <Text
          fontSize="12px"
          color="#8850EA"
          fontWeight="500"
          lineHeight="20px"
          mt={1}
        >
          {subtext}
        </Text>
      )} */}
			<Text
				fontSize='12px'
				color='#A0A7A7'
				fontWeight='500'
				lineHeight='24px'
				mt={1}
				cursor='pointer'
				onClick={() => openInput()}
				zIndex={1}
			>
				Change
			</Text>
		</Flex>
	)
}

ImageUpload.defaultProps = defaultProps
export default ImageUpload
