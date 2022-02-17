import {
  Box, Text,
} from '@chakra-ui/react';
import React from 'react';
import MultiLineInput from '../../../ui/forms/multiLineInput';
import SingleLineInput from '../../../ui/forms/singleLineInput';
import Tooltip from '../../../ui/tooltip';

function AboutTeam({
  teamMembers,
  setTeamMembers,
  teamMembersError,
  setTeamMembersError,

  membersDescription,
  setMembersDescription,

  grantRequiredFields,
}: {
  teamMembers: number | null;
  setTeamMembers: (teamMembers: number | null) => void;
  teamMembersError: boolean;
  setTeamMembersError: (teamMembersError: boolean) => void;

  membersDescription: { description: string, isError: boolean }[];
  setMembersDescription: (membersDescription: { description: string, isError: boolean }[]) => void;
  grantRequiredFields: string[];
}) {
  return (

    <Box display={grantRequiredFields.includes('teamMembers') || grantRequiredFields.includes('memberDetails') ? '' : 'none'}>
      <Text fontWeight="700" fontSize="16px" lineHeight="20px" color="#8850EA">
        About Team
        <Tooltip
          icon="/ui_icons/tooltip_questionmark_brand.svg"
          label="team"
        />
      </Text>

      <Box mt={6} />
      <SingleLineInput
        label="Team Members"
        placeholder="Number of team members"
        value={teamMembers === null ? undefined : teamMembers}
        onChange={(e) => {
          if (teamMembersError) {
            setTeamMembersError(false);
          }
          const value = parseInt(e.target.value, 10);
          if (!Number.isNaN(value)) {
            setTeamMembers(value);
            setMembersDescription(Array(value).fill({ description: '', isError: false }));
          } else {
            setTeamMembers(null);
          }
        }}
        isError={teamMembersError}
        errorText="Required"
        visible={grantRequiredFields.includes('teamMembers')}
      />

      <Box mt="43px" />
      <Text
        fontWeight="700"
        fontSize="16px"
        lineHeight="20px"
        color="#8850EA"
        display={grantRequiredFields.includes(
          'memberDetails',
        ) ? '' : 'none'}
      >
        Details
        <Tooltip
          icon="/ui_icons/tooltip_questionmark_brand.svg"
          label="details"
        />
      </Text>

      <Box mt={3} />

      {
        membersDescription.map(({ description, isError }, index) => (
          <MultiLineInput
            placeholder="Write about team member - education, work experience with portfolio link, and side projects."
            label={`Member ${index + 1}`}
            maxLength={300}
            value={description}
            onChange={(e) => {
              const newMembersDescription = [...membersDescription];

              const member = { ...membersDescription[index] };
              if (member.isError) {
                member.isError = false;
              }
              member.description = e.target.value;
              newMembersDescription[index] = member;

              setMembersDescription(newMembersDescription);
            }}
            isError={isError}
            errorText="Required"
            visible={grantRequiredFields.includes('memberDetails')}
          />
        ))
      }
    </Box>
  );
}

export default AboutTeam;
