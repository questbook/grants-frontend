import {
  Flex, Text, Button, Box,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import MultiLineInput from '../../../ui/forms/multiLineInput';
import { getGrantDetailsErrorText } from './errors/errorTexts';
import { GrantDetailsError } from './errors/errorTypes';

interface Props {
  onSubmit: (data: any) => void;
}

function Details({ onSubmit }: Props) {
  const [details, setDetails] = useState('');
  const [detailsError, setDetailsError] = useState(GrantDetailsError.NoError);

  const handleOnSubmit = () => {
    let error = false;
    if (details.length <= 0) {
      setDetailsError(GrantDetailsError.NoError);
      error = true;
    }

    if (!error) {
      onSubmit({ details });
    }
  };

  return (
    <>
      <Flex py={12} direction="column">
        <Text variant="heading" fontSize="36px" lineHeight="48px">
          What&apos;s your grant about?
        </Text>

        <Box mt={12} />

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

        <Box mt={12} />

        {/* <Button onClick={() => {
          RichUtils.toggleInlineStyle(editorState, 'BOLD');
        }}
        >
          Bold

        </Button>

        <TextEditor /> */}

      </Flex>
      <Flex mt="auto">
        <Button variant="primary" onClick={handleOnSubmit}>
          Continue
        </Button>

        <Button h={12} minW="168px" ml="42px" onClick={() => onSubmit({})}>
          Skip
        </Button>
      </Flex>
    </>
  );
}

export default Details;
