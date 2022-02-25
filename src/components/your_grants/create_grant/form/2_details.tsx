import {
  Flex,
} from '@chakra-ui/react';
import React from 'react';
import MultiLineInput from '../../../ui/forms/multiLineInput';
import { getGrantDetailsErrorText } from './errors/errorTexts';
import { GrantDetailsError } from './errors/errorTypes';

function Details({
  details,
  setDetails,
  detailsError,
  setDetailsError,
}: {
  details: string;
  setDetails: (details: string) => void;
  detailsError: GrantDetailsError;
  setDetailsError: (detailsError: GrantDetailsError) => void;
}) {
  return (
    <Flex direction="column">
      <MultiLineInput
        label="Grant Details"
        placeholder="Details about your grant - requirements, deliverables, and milestones"
        value={details}
        isError={detailsError !== GrantDetailsError.NoError}
        onChange={(e) => {
          if (detailsError !== GrantDetailsError.NoError) {
            setDetailsError(GrantDetailsError.NoError);
          }
          setDetails(e.target.value);
        }}
        errorText={getGrantDetailsErrorText(detailsError)}
        maxLength={-1}
      />

    </Flex>
  );
}

export default Details;
