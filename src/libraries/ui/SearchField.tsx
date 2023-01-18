import { Input, InputGroup, InputGroupProps, InputLeftElement, InputProps } from '@chakra-ui/react'
import { Search } from 'src/generated/icons'

function SearchField(props: InputProps & {inputGroupProps?: InputGroupProps}) {
	const buildComponent = () => {
		return (
			<InputGroup {...props.inputGroupProps}>
				<InputLeftElement
					pointerEvents='none'
				>
					<Search
						boxSize='20px'
						color='gray.6' />
				</InputLeftElement>
				<Input {...props} />
			</InputGroup>
		)
	}

	return buildComponent()
}

export default SearchField