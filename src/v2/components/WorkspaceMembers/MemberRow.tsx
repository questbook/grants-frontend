import React from 'react'
import { Box, Checkbox, Circle, Flex, Grid, GridItem, Image, Tag, Td, Tr } from '@chakra-ui/react'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import { WorkspaceMember, WorkspaceMemberAccessLevel } from '../../../generated/graphql'
import { getFormattedDateFromUnixTimestampWithYear } from '../../../utils/formattingUtils'
import { capitalizeFirstLetter } from '../../../utils/generics'

type Props = {
	member: Partial<WorkspaceMember>;
}

function MemberRow({ member }: Props) {
	return (
		<Tr>
			<Td>
				<Checkbox disabled />
			</Td>
			<Td>
				<Flex direction={'row'}>
					{
						<>
							{
								member.profilePictureIpfsHash ? (
									<Image
										src={getUrlForIPFSHash(member.profilePictureIpfsHash)}
										borderRadius={'50%'}
										boxSize='40px'
									/>
								) : (
									<Circle
										bg={'grey'}
										size='40px'
									/>
								)
							}
							<Box w={2} />
						</>
					}
					<Grid>
						<GridItem fontWeight={'bold'}>
							{member.fullName}
						</GridItem>
						<GridItem color={'#9292AF'}>
							{member.actorId}
						</GridItem>
					</Grid>
				</Flex>
			</Td>
			<Td>
				<Tag
					bg={'#FFC403'}
					borderRadius={2}
					fontWeight={'bold'}
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
