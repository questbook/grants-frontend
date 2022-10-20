import { useTranslation } from 'react-i18next'
import { LinkIcon } from '@chakra-ui/icons'
import {
	Button,
	Flex, Grid, GridItem, Text
} from '@chakra-ui/react'
import FilterTable from 'src/libraries/ui/FilterTable'
import useMembers from 'src/screens/manage_dao/_hooks/useMembers'
import { TABLE_HEADERS, USER_TYPES } from 'src/screens/manage_dao/_utils/constants'
import MemberRow from 'src/screens/manage_dao/memberRow'
import InviteModal from 'src/v2/components/InviteModal'

function WorkspaceMembers() {
	const buildComponent = () => {
		return (
			<Flex
				direction='column'
				w='100%'>
				<Flex
					w='100%'
					mb={5}>
					<Text
						variant='v2_heading_3'
						fontWeight='500'>
						Members
					</Text>
					<Button
						ml='auto'
						onClick={() => setIsInviteModalOpen(true)}
						leftIcon={<LinkIcon />}
						variant='primaryV2' >
						{t('/manage_dao.create_link')}
					</Button>
				</Flex>
				<FilterTable
					tabs={
						USER_TYPES.map((type,) => {
							const filteredMembers = members.filter((member) => type.accessLevels.indexOf(member.accessLevel) !== -1).sort((a, b) => {
								if(a.accessLevel === 'owner') {
									return -1
								} else if(b.accessLevel === 'owner') {
									return 1
								} else {
									const cmp = a.accessLevel.localeCompare(b.accessLevel)
									if(cmp === 0) {
										return a.addedAt - b.addedAt
									} else {
										return cmp
									}
								}
							}
							)
							return {
								title: `${type.name} (${filteredMembers.length})`,
								element: (
									<Grid
										justifyContent='start'
										templateColumns='3fr 2fr 2fr 2fr 2fr'
										alignItems='center'
									>
										{
											TABLE_HEADERS.map((header, index) => (
												<GridItem key={index}>
													<Text
														px={4}
														py={2}
														color='#555570'
														variant='v2_body'
														fontWeight='500'
													>
														{header}
													</Text>
												</GridItem>
											))
										}


										{/* new row */}
										{
											filteredMembers.map((member, index) => (
												<MemberRow
													key={index}
													member={member}
												/>
											))
										}
									</Grid>
								)
							}
						})
					}
					tabIndex={selectedUserTypeIdx}
					onChange={setSelectedUserTypeIdx}
				/>
				<InviteModal
					isOpen={isInviteModalOpen}
					onClose={() => setIsInviteModalOpen(false)} />
			</Flex>
		)
	}

	const { t } = useTranslation()
	const { isInviteModalOpen, setIsInviteModalOpen, selectedUserTypeIdx, setSelectedUserTypeIdx, members } = useMembers()

	return buildComponent()
}

export default WorkspaceMembers
