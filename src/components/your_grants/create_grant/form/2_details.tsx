import {
  Flex,
} from '@chakra-ui/react';
import React from 'react';
import MultiLineInput from '../../../ui/forms/multiLineInput';

function Details({
  details,
  setDetails,
  detailsError,
  setDetailsError,
}: {
  details: string;
  setDetails: (details: string) => void;
  detailsError: boolean;
  setDetailsError: (detailsError: boolean) => void;
}) {
  return (
    <Flex direction="column">
      <MultiLineInput
        label="Grant Details"
        placeholder="Details about your grant - requirements, deliverables, and milestones"
        value={details}
        isError={detailsError}
        onChange={(e) => {
          if (detailsError) {
            setDetailsError(false);
          }
          setDetails(e.target.value);
        }}
        errorText="Required"
        maxLength={300}
      />

    </Flex>
  );
}

export default Details;
