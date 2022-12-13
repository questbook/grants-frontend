import { Button, Image } from '@chakra-ui/react'

interface Props {
    onClick: () => void
}

function ImageUpload({ onClick }: Props) {
	const buildComponent = () => {
		return (
			<Button
				w='72px'
				h='72px'
				bg='gray.3'
				borderRadius='2px'
				alignItems='center'
				justifyItems='center'
				onClick={onClick}>
				<Image
					src='/v2/icons/image add.svg'
					boxSize='26px' />
			</Button>
		)
	}

	return buildComponent()
}

export default ImageUpload