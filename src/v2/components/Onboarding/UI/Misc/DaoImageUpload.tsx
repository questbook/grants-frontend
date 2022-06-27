import { useRef } from 'react'
import { Box, Button, IconButton, Image, ToastId, useToast } from '@chakra-ui/react'
import ErrorToast from 'src/components/ui/toasts/errorToast'
import { Cancel } from 'src/v2/assets/custom chakra icons/Cancel'
import { ImageUploadIcon } from 'src/v2/assets/custom chakra icons/ImageUploadIcon'
import { Organization } from 'src/v2/assets/custom chakra icons/Organization'

const DaoImageUpload = ({
	daoImageFile,
	setDaoImageFile
}: {
  daoImageFile: File | null
	setDaoImageFile: (daoImageFile: File | null) => void
}) => {
	const maxImageSize = 2

	const ref = useRef(null)
	const openInput = () => {
		if(ref.current) {
			(ref.current as HTMLInputElement).click()
		}
	}

	const toast = useToast()
	const toastRef = useRef<ToastId>()

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if(event.target.files && event.target.files[0]) {
			const img = event.target.files[0]
			if(img.size / 1024 / 1024 <= maxImageSize) {
				setDaoImageFile(img)
			} else {
				toastRef.current = toast({
					position: 'top',
					render: () => ErrorToast({
						content: `Image size exceeds ${maxImageSize} MB`,
						close: () => {
							if(toastRef.current) {
								toast.close(toastRef.current)
							}
						},
					}),
				})
			}

			// @ts-ignore
			event.target.value = null
		}
	}

	return (
		<Box pos={'relative'}>
			<input
				style={{ visibility: 'hidden', height: 0, width: 0 }}
				ref={ref}
				type="file"
				name="myImage"
				onChange={handleImageChange}
				accept="image/jpg, image/jpeg, image/png" />
			<Button
				bg={'#C2E7DA'}
				boxSize={'72px'}
				overflow={'hidden'}
				onClick={() => openInput()}
				boxShadow={'0px 2px 0px #1f1f331a !important'}
			>
				{
					daoImageFile ? (
						<Image
							objectFit="cover"
							src={URL.createObjectURL(daoImageFile)}
							w="100%"
							h="100%"
							minH={'72px'}
							minW={'72px'}
						/>
					) : (

						<Organization
							color={'#389373'}
							boxSize={8} />
					)
				}
			</Button>
			<IconButton
				bg={'white'}
				icon={daoImageFile ? <Cancel boxSize={3} /> : <ImageUploadIcon />}
				aria-label={'upload dao icon image'}
				boxShadow={'0px 2px 4px #1f1f331a !important'}
				boxSize={'30px'}
				borderRadius={'30px'}
				minW={0}
				minH={0}
				pos={'absolute'}
				bottom={'-15px'}
				left={'calc(50% - 15px)'}
				zIndex={1}
				onClick={
					() => {
						if(daoImageFile) {
							setDaoImageFile(null)
						} else {
							openInput()
						}
					}
				}
			/>
		</Box>
	)
}

export default DaoImageUpload