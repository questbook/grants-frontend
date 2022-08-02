import React from 'react'
import { Box, Checkbox, Flex, Grid, GridItem, Image, Tag, Td, Tr } from '@chakra-ui/react'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import { getFormattedDateFromUnixTimestampWithYear } from '../../../utils/formattingUtils'
import { capitalizeFirstLetter } from '../../../utils/generics'

type Props = {
  member: any;
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
										borderRadius={'50'}
										boxSize='50px'
									/>
								) : (
									<Box
										bg={'grey'}
										borderRadius={50}
										boxSize='50px'
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
