import {
	Checkbox,
	CheckboxGroup,
	Flex,
	Image,
	Input,
	Spacer,
	Text,
	VStack,
} from '@chakra-ui/react'
import { WorkspaceMember } from 'src/generated/graphql'

type ReviewersSlectionMenuProps = {
    allChecked:boolean
    filter:string
    setFilter: React.Dispatch<React.SetStateAction<string>>
    daoMembers: Partial<WorkspaceMember>[] | undefined
    setCheckedItems: React.Dispatch<React.SetStateAction<boolean[]>>
    setSelectedMembersCount:React.Dispatch<React.SetStateAction<number>>
    selectedMembersCount:number
    membersCount:number
    checkedItems: boolean[]
}

export const ReviewersSlectionMenu = ({ allChecked,
	filter,
	setFilter,
	daoMembers,
	setCheckedItems,
	setSelectedMembersCount,
	selectedMembersCount,
	membersCount,
	checkedItems
} :ReviewersSlectionMenuProps) => {
	return (
		<Flex
			direction="column"
			backgroundColor="#FFFFFF"
			mt={10}
			ml="auto"
			mr="auto"
			alignItems="left"
			alignContent="left"
			p={4}
			pb={7}
			w="90%"
			borderRadius="2px"
		>
			<Text
				fontWeight="500"
				fontSize="14px"
				lineHeight="16px"
				color="#1F1F33"
			>
				{' '}
                  Select Reviewers
				{' '}
			</Text>
			<Flex
				backgroundColor="#F0F0F7"
				padding="6 12"
				borderRadius="2 px"
				mt={2}>
				<Image
					w="13.54"
					h="13.54"
					src="/ui_icons/search_icon.svg"
					mt="auto"
					mb="auto"
					ml="8.33%"
				/>
				<Input
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					placeholder="Search by name"
					size="sm"
					border="none"
				/>
			</Flex>
			<Flex
				w="90%"
				direction="row"
				mt={2}
			>
				<Checkbox
					isChecked={allChecked}
					onChange={
						(e) => {
							if(daoMembers?.length) {
								setCheckedItems(
									Array(daoMembers?.length).fill(e.target.checked)
								)
								e.target.checked ?
									setSelectedMembersCount(daoMembers?.length)
									: setSelectedMembersCount(0)
							}
						}
					}
				>
					<Text
						fontWeight="400"
						fontSize="14px"
						lineHeight="20px"
						color="#555570"
					>
						{' '}
                      Select all
						{' '}
					</Text>
				</Checkbox>
				<Spacer />
				<Text
					fontWeight="500"
					fontSize="10px"
					lineHeight="12px"
					color="#7D7DA0"
				>
					{' '}
					{selectedMembersCount}
					{' '}
/
					{membersCount}
					{' '}
				</Text>
				<Text
					fontWeight="400"
					fontSize="10px"
					lineHeight="12px"
					color="#7D7DA0"
					ml={1}
				>
					{' '}
                    DAO members Selected
				</Text>
			</Flex>
			<CheckboxGroup
				colorScheme="blue"
				defaultValue={[0]}
			>
				<VStack
					alignItems="left"
					mt={2}
					spacing={2}>
					{
						daoMembers &&
                      daoMembers!.map(
                      	(member: Partial<WorkspaceMember>, index) => (
                      		<Checkbox
                      			key={member.actorId}
                      			isChecked={checkedItems[index]}
                      			onChange={
                      				(e) => {
                      				e.target.checked
                      					? setSelectedMembersCount((val) => val + 1)
                      					: setSelectedMembersCount((val) => val - 1)
                      					const tempArr: boolean[] = []
                      					tempArr.push(...checkedItems)
                      					tempArr[index] = e.target.checked
                      					setCheckedItems(tempArr)
                      				}
                      			}
                      		>
                      			<Flex>
                      				<Image
                      					w="38px"
                      					h="38px"
                      					borderRadius="22.1667px"
                      					src="/ui_icons/generic_dao_member.svg"
                      				/>
                      				<Flex direction="column">
                      					<Text
                      						fontWeight="500"
                      						fontSize="16px"
                      						lineHeight="24px"
                      						color="#1F1F33"
                      					>
                      						{
                      							member.accessLevel === 'owner'
                      							? 'Owner'
                      							: member.fullName
                      						}
                      					</Text>
                      					<Text
                      						fontWeight="400"
                      						fontSize="12px"
                      						lineHeight="14px"
                      						color="#7D7DA0"
                      					>
                      						{
                      							member.actorId?.slice(0, 3) +
                                    '......' +
                                    member.actorId?.slice(38, 42)
                      						}
                      					</Text>
                      				</Flex>
                      			</Flex>
                      		</Checkbox>
                      	)
                      )
					}
				</VStack>
			</CheckboxGroup>
		</Flex>
	)
}

export default ReviewersSlectionMenu