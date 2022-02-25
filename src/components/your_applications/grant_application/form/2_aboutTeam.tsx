import { Box, Text } from '@chakra-ui/react';
import React, { Dispatch, SetStateAction } from 'react';
import MultiLineInput from '../../../ui/forms/multiLineInput';
import SingleLineInput from '../../../ui/forms/singleLineInput';
import Tooltip from '../../../ui/tooltip';
import { getMemberDescriptionError, getTeamMemberErrorText } from './errors/errorTexts';
import { MemberDescriptionError, TeamMemberError } from './errors/errorTypes';

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
  setTeamMembers: Dispatch<SetStateAction<number>>;
  teamMembersError: TeamMemberError;
  setTeamMembersError: (teamMembersError: TeamMemberError) => void;

  membersDescription: {
    description: string;
    isError: MemberDescriptionError;
  }[];
  setMembersDescription: (
    membersDescription: {
      description: string;
      isError: MemberDescriptionError;
    }[]
  ) => void;

  readOnly?: boolean;
  grantRequiredFields: string[];
}) {
  return (
    <Box
      display={
        grantRequiredFields.includes('teamMembers')
        || grantRequiredFields.includes('memberDetails')
          ? ''
          : 'none'
      }
    >
      <Text fontWeight="700" fontSize="16px" lineHeight="20px" color="#8850EA">
        About Team
        <Tooltip
          icon="/ui_icons/tooltip_questionmark_brand.svg"
          label="Write about the team members working on the project."
          placement="bottom-start"
        />
      </Text>

      <Box mt={6} />
      <SingleLineInput
        label="Team Members"
        placeholder="Number of team members"
        value={teamMembers === null ? undefined : teamMembers}
        onChange={(e) => {
          if (teamMembersError !== TeamMemberError.NoError) {
            setTeamMembersError(TeamMemberError.NoError);
          }
          const value = parseInt(e.target.value, 10);
          if (!Number.isNaN(value)) {
            setTeamMembers(value);
            setMembersDescription(
              Array(value).fill({ description: '', isError: false }),
            );
          } else {
            setTeamMembers(1);
          }
        }}
        isError={teamMembersError !== TeamMemberError.NoError}
        errorText={getTeamMemberErrorText(teamMembersError)}
        disabled={readOnly}
        visible={grantRequiredFields.includes('teamMembers')}
      />

      <Box mt="43px" />
      <Text
        fontWeight="700"
        fontSize="16px"
        lineHeight="20px"
        color="#8850EA"
        display={grantRequiredFields.includes('memberDetails') ? '' : 'none'}
      >
        Details
        {/* <Tooltip
          icon="/ui_icons/tooltip_questionmark_brand.svg"
          label="details"
        /> */}
      </Text>

      <Box mt={3} />

      {membersDescription.map(({ description, isError }, index) => (
        <MultiLineInput
          placeholder="Write about team member - education, work experience with portfolio link, and side projects."
          label={`Member ${index + 1}`}
          maxLength={300}
          value={description}
          onChange={(e) => {
            const newMembersDescription = [...membersDescription];

            const member = { ...membersDescription[index] };
            if (member.isError !== MemberDescriptionError.NoError) {
              member.isError = MemberDescriptionError.NoError;
            }
            member.description = e.target.value;
            newMembersDescription[index] = member;

            setMembersDescription(newMembersDescription);
          }}
          isError={isError !== MemberDescriptionError.NoError}
          errorText={getMemberDescriptionError(isError)}
          disabled={readOnly}
          visible={grantRequiredFields.includes('memberDetails')}
        />
      ))}
    </Box>
  );
}

AboutTeam.defaultProps = {
  readOnly: false,
};
export default AboutTeam;
