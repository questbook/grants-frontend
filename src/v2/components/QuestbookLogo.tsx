import { Image } from '@chakra-ui/react'

interface Props {
    color?: string
}

function QuestbookLogo({ color }: Props) {
	return (
		<Image
			src={`/questbooklogo-${color === 'white' ? 'white' : 'black'}.svg`}
			cursor='pointer'
			onClick={
				() => {
					// console.log('Clicked!')
				}
			} />
	)
}

export default QuestbookLogo