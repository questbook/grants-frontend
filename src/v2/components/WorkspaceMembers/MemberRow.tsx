import React from 'react'
import { Box, Checkbox, Flex, Grid, GridItem, Image, Tag, Td, Tr } from '@chakra-ui/react'
import { WorkspaceMember, WorkspaceMemberAccessLevel } from 'src/generated/graphql'
import getAvatar from 'src/utils/avatarUtils'
import { getFormattedDateFromUnixTimestampWithYear } from 'src/utils/formattingUtils'
import { capitalizeFirstLetter } from 'src/utils/generics'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'

type Props = {
	member: Partial<WorkspaceMember>
}

function MemberRow({ member }: Props) {
	return (
		<Tr>
			<Td>
				<Checkbox disabled />
			</Td>
			<Td>
				<Flex direction='row'>
					<>
						<Image
							src={member.profilePictureIpfsHash?
								getUrlForIPFSHash(member.profilePictureIpfsHash):
								getAvatar(false, member.actorId)}
							borderRadius='50%'
							boxSize='40px'
						/>
						<Box w={2} />
					</>
					<Grid>
						<GridItem fontWeight='bold'>
							{member.fullName}
						</GridItem>
						<GridItem color='#9292AF'>
							{member.actorId}
						</GridItem>
					</Grid>
				</Flex>
			</Td>
			<Td>
				<Tag
					bg='#FFC403'
					borderRadius={2}
					fontWeight='bold'
				>
					{
						capitalizeFirstLetter(member.accessLevel! === WorkspaceMemberAccessLevel.Owner
							? WorkspaceMemberAccessLevel.Admin : member.accessLevel!)
					}
				</Tag>
			</Td>
			<Td>
				{getFormattedDateFromUnixTimestampWithYear(member.addedAt)}
			</Td>
		</Tr>
	)
}


export default MemberRow
