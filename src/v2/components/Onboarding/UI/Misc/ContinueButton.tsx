import { ReactElement } from 'react'
import { Button } from '@chakra-ui/react'
import { ArrowRightFilled } from '../../../../assets/custom chakra icons/Arrows/ArrowRightFilled'

const ContinueButton = ({
	onClick,
	disabled,
	props,
	content,
}: {
  onClick: () => void,
  disabled: boolean,
  props?: any
	content?: ReactElement
}) => (
	<Button
		colorScheme={'brandv2'}
		borderRadius={'base'}
		py={3.5}
		px={7}
		zIndex={100}
		variant={'primaryV2'}
		_disabled={
			{
				color: 'white',
			}
		}
		{...props}
		disabled={disabled}
		onClick={onClick}
	>
		{
			content ? content : (
				<>
					Continue
					<ArrowRightFilled
						ml={3}
						boxSize={'13.33px'} />
				</>
			)
		}
	</Button>
)

export default ContinueButton