import { useRef } from 'react'
import { Button, Flex, FlexProps, Image } from '@chakra-ui/react'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'

interface Props extends FlexProps {
    imageFile: {file: File | null, hash?: string}
	setImageFile: (imageFile: {file: File | null, hash?: string}) => void
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
					!(!imageFile || (imageFile?.file === null && !imageFile?.hash)) && (
						<Image
							src={imageFile?.file ? URL.createObjectURL(imageFile?.file) : imageFile?.hash ? getUrlForIPFSHash(imageFile?.hash) : ''}
							onClick={() => openInput()}
							cursor='pointer'
							fit='fill'
							w='100%'
							h='100%' />
					)
				}
				{
					(!imageFile || (imageFile?.file === null && !imageFile?.hash)) && (
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
				const copy = { ...imageFile }
				copy.file = img
				setImageFile(copy)
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