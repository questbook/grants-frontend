import { Box, Container, IconButton } from '@chakra-ui/react'
import { BackArrowThick } from 'src/v2/assets/custom chakra icons/Arrows/BackArrowThick'

const OnboardingCard = ({
	onBackClick,
	children,
}: {
  onBackClick?: () => void;
  children: React.ReactNode;
}) => (
	<Box
		h={'100%'}
		w={'100%'}
		pos={'absolute'}
		top={0}
		left={0}
		display={'flex'}
		justifyContent={'center'}
		alignItems={'center'}
	>
		<Container
			textAlign={'left'}
			bg={'white'}
			borderRadius={'lg'}
			p={8}
			maxW={'connectWallet'}
			position={'relative'}
			transition={'all 0.3s ease-in-out'}
		>

			{children}

			{
				onBackClick && (
					<IconButton
						onClick={onBackClick}
						size={'sm'}
						colorScheme={'brandv2'}
						icon={
							<BackArrowThick
								color={'white'}
								boxSize={'18.67px'} />
						}
						aria-label="Back"
						position={'absolute'}
						top={'-61px'}
						left={0}
						p={3.5}
						boxSize={'46.67px'}
						borderRadius={'3xl'}
					/>
				)
			}
		</Container>
	</Box>
)

export default OnboardingCard