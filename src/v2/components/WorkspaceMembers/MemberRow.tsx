import { Checkbox, Grid, GridItem, Tag, Td, Tr } from '@chakra-ui/react'
import { getFormattedDateFromUnixTimestampWithYear } from '../../../utils/formattingUtils'
import { capitalizeFirstLetter } from '../../../utils/generics'

type Props = {
  member: any;
}

function MemberRow({ member }: Props) {
	return (
		<Tr>
			<Td>
				<Checkbox />
			</Td>
			<Td>
				<Grid>
					<GridItem fontWeight={'bold'}>
						{member.fullName}
					</GridItem>
					<GridItem color={'#9292AF'}>
						{member.actorId}
					</GridItem>
				</Grid>
			</Td>
			<Td>
				<Tag
					bg={'#FFC403'}
					borderRadius={2}
					fontWeight={'bold'}
				>
					{capitalizeFirstLetter(member.accessLevel)}
				</Tag>
			</Td>
			<Td>
				{getFormattedDateFromUnixTimestampWithYear(member.addedAt)}
			</Td>
		</Tr>
	)
}


export default MemberRow
