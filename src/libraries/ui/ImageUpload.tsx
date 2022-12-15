import { useRef } from 'react'
import { Button, Flex, FlexProps, Image } from '@chakra-ui/react'
import useCustomToast from 'src/libraries/hooks/useCustomToast'

interface Props extends FlexProps {
    imageFile: File | null
	setImageFile: (imageFile: File | null) => void
}

function ImageUpload({ imageFile, setImageFile, ...props }: Props) {
	const buildComponent = () => {
		return (
			<Flex
				{...props}
				w='72px'
				h='72px'>
				<input
					style={{ visibility: 'hidden', height: 0, width: 0 }}
					ref={ref}
					type='file'
					name='myImage'
					onChange={handleImageChange}
					accept='image/jpg, image/jpeg, image/png' />
				{
					imageFile && (
						<Image
							src={imageFile ? URL.createObjectURL(imageFile) : ''}
							onClick={() => openInput()}
							cursor='pointer'
							fit='fill'
							w='100%'
							h='100%' />
					)
				}
				{
					(!imageFile || imageFile === null) && (
						<Button
							w='100%'
							h='100%'
							bg='gray.3'
							borderRadius='2px'
							alignItems='center'
							justifyItems='center'
							onClick={() => openInput()}>
							<Image
								src='/v2/icons/image add.svg'
								boxSize='26px' />
						</Button>
					)
				}
			</Flex>
		)
	}

	const ref = useRef(null)
	const toast = useCustomToast()
	const openInput = () => {
		if(ref.current) {
			(ref.current as HTMLInputElement).click()
		}
	}

	const maxImageSize = 2

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if(event.target.files?.[0]) {
			const img = event.target.files[0]
			if(img.size / 1024 / 1024 <= maxImageSize) {
				setImageFile(img)
			} else {
				toast({
					position: 'top',
					title: `Image size exceeds ${maxImageSize} MB`,
					status: 'error',
				})
			}

			// @ts-ignore
			event.target.value = null
		}
	}

	return buildComponent()
}

export default ImageUpload