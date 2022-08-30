import { useEffect, useRef, useState } from 'react'
import { Box, Fade, Image } from '@chakra-ui/react'

const BackgroundImageLayout = ({
	imageSrc,
	imageBackgroundColor,
	imageProps,
	isDarkQuestbookLogo,
	children,
}: {
  imageSrc: string
  imageBackgroundColor: string
  imageProps?: any
  isDarkQuestbookLogo?: boolean
  children: React.ReactNode
}) => {
	const [imageLoaded, setImageLoaded] = useState(false)
	const [imageTransitioned, setImageTransitioned] = useState(false)
	const imageRef = useRef<HTMLImageElement>(null)

	useEffect(() => {
		if(!imageLoaded && imageRef.current?.complete) {
			setImageLoaded(true)
			setTimeout(() => setImageTransitioned(true), 300)
		}
	}, [])

	return (
		<Box
			bg={imageBackgroundColor}
			h='100vh'
			w='100%'
			overflow='hidden'
			fontFamily='Neue-Haas-Grotesk-Display, sans-serif'
		>
			<Image
				ref={imageRef}
				src={imageSrc}
				height='100%'
				width='100%'
				objectFit='cover'
				onLoad={
					() => {
						setImageLoaded(true)
						setTimeout(() => setImageTransitioned(true), 300)
					}
				}
				transition='opacity 0.3s'
				{...imageLoaded ? imageProps : null}
			/>

			<Fade in={imageTransitioned}>
				<Box
					pos='absolute'
					top={0}
					left={0}
					zIndex={1}
					p={5}>
					<Image
						src={isDarkQuestbookLogo ? '/questbooklogo-black.svg' : '/questbooklogo-white.svg'}
						alt='Questbook'
						zIndex={100} />
				</Box>

				{children}
			</Fade>
		</Box>
	)
}

export default BackgroundImageLayout