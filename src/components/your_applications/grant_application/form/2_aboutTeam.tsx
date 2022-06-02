import React, { Dispatch, SetStateAction } from 'react'
import {
	Box, Text,
} from '@chakra-ui/react'
import MySelect from 'src/components/ui/forms/select'
import MultiLineInput from '../../../ui/forms/multiLineInput'
import Tooltip from '../../../ui/tooltip'

function AboutTeam({
	teamMembers,
	setTeamMembers,
	teamMembersError,
	setTeamMembersError,

	membersDescription,
	setMembersDescription,

	readOnly,
	grantRequiredFields,
}: {

  teamMembers: number | null;
  setTeamMembers: Dispatch< SetStateAction<number>>;
  teamMembersError: boolean;
  setTeamMembersError: (teamMembersError: boolean) => void;

  membersDescription: { description: string, isError: boolean }[];
  setMembersDescription: (membersDescription: { description: string, isError: boolean }[]) => void;

  readOnly?: boolean;
  grantRequiredFields: string[];
}) {
	return (
		<Box display={grantRequiredFields.includes('teamMembers') || grantRequiredFields.includes('memberDetails') ? '' : 'none'}>
			<Text
				fontWeight="700"
				fontSize="16px"
				lineHeight="20px"
				color="#8850EA">
        About Team
				<Tooltip
					icon="/ui_icons/tooltip_questionmark_brand.svg"
					label="Write about the team members working on the project."
					placement="bottom-start"
				/>
			</Text>

			<Box mt={6} />
			{
				grantRequiredFields.includes('teamMembers') && (
					<MySelect
						value={teamMembers === null ? undefined : teamMembers}
						onChange={
							(e) => {
								if(teamMembersError) {
									setTeamMembersError(false)
								}

								const value = parseInt(e.target.value, 10)
								setTeamMembers(value)
								setMembersDescription(Array(value).fill({ description: '', isError: false }))
							}
						}
						label="Team Members"
						disabled={readOnly}
						options={Array.from(Array(11).keys()).slice(1)}
					/>
				)
			}

			<Box mt="43px" />
			<Text
				fontWeight="700"
				fontSize="16px"
				lineHeight="20px"
				color="#8850EA"
				display={
					grantRequiredFields.includes(
						'memberDetails',
					) ? '' : 'none'
				}
			>
        Details
				{/* <Tooltip
          icon="/ui_icons/tooltip_questionmark_brand.svg"
          label="details"
        /> */}
			</Text>

			<Box mt={3} />

			{
				!!membersDescription?.length ? (
					membersDescription.map(({ description, isError }, index) => (
						<MultiLineInput
							key={index}
							placeholder="Write about team member - education, work experience with portfolio link, and side projects."
							label={`Member ${index + 1}`}
							maxLength={300}
							value={description}
							onChange={
								(e) => {
									const newMembersDescription = [...membersDescription]

									const member = { ...membersDescription[index] }
									if(member.isError) {
										member.isError = false
									}

									member.description = e.target.value
									newMembersDescription[index] = member

									setMembersDescription(newMembersDescription)
								}
							}
							isError={isError}
							errorText="Required"
							disabled={readOnly}
							visible={grantRequiredFields.includes('memberDetails')}
						/>
					))) : (
					grantRequiredFields.includes('memberDetails') && teamMembers && (
						[...Array(teamMembers)].map((_, index) => (
							<MultiLineInput
								key={index}
								placeholder="Write about team member - education, work experience with portfolio link, and side projects."
								label={`Member ${index + 1}`}
								maxLength={300}
								value=""
								onChange={
									(e) => {
										const newMembersDescription = [...membersDescription]

										const member = { ...membersDescription[index] }
										if(member.isError) {
											member.isError = false
										}

										member.description = e.target.value
										newMembersDescription[index] = member

										setMembersDescription(newMembersDescription)
									}
								}
								isError={false}
								errorText="Required"
								disabled={readOnly}
								visible={grantRequiredFields.includes('memberDetails')}
							/>
						))
					)
				)
			}

		</Box>
	)
}

AboutTeam.defaultProps = {
	readOnly: false,
}
export default AboutTeam
