import {
  Flex, Text, Button, Box,
} from '@chakra-ui/react';
import { convertToRaw, EditorState } from 'draft-js';
import React, { useState } from 'react';
import RichTextEditor from 'src/components/ui/forms/richTextEditor';

interface Props {
  onSubmit: (data: any) => void;
}

function Details({ onSubmit }: Props) {
  const [details, setDetails] = useState(() => EditorState.createEmpty());
  const [detailsError, setDetailsError] = useState(false);

  const handleOnSubmit = () => {
    let error = false;
    if (!details.getCurrentContent().hasText()) {
      setDetailsError(true);
      error = true;
    }

    if (!error) {
      const detailsString = JSON.stringify(
        convertToRaw(details.getCurrentContent()),
      );
      onSubmit({ details: detailsString });
    }
  };

  return (
    <>
      <Flex py={12} direction="column">
        <Text variant="heading" fontSize="36px" lineHeight="48px">
          What&apos;s your grant about?
        </Text>

        <Box mt={12} />

        <RichTextEditor
          label="Grant Details"
          placeholder="Details about your grant - requirements, deliverables, and milestones"
          value={details}
          isError={detailsError}
          onChange={(e: EditorState) => {
            if (detailsError) {
              setDetailsError(false);
            }
            setDetails(e);
          }}
          errorText="Required"
          maxLength={-1}
        />

        <Box mt={12} />
      </Flex>
      <Flex mt="auto">
        <Button variant="primary" onClick={handleOnSubmit}>
          Continue
        </Button>

        {/* <Button h={12} minW="168px" ml="42px" onClick={() => onSubmit({})}>
          Skip
        </Button> */}
      </Flex>
    </>
  );
}

export default Details;
