import {
  Flex, Button, Box, Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import MultiLineInput from '../../../ui/forms/multiLineInput';
import SingleLineInput from '../../../ui/forms/singleLineInput';

interface Props {
  onSubmit: (data: any) => void;
}

function Title({ onSubmit }: Props) {
  const maxDescriptionLength = 300;
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');

  const [titleError, setTitleError] = useState(false);
  const [summaryError, setSummaryError] = useState(false);

  const handleOnSubmit = () => {
    let error = false;
    if (title.length <= 0) {
      setTitleError(true);
      error = true;
    }
    if (summary.length <= 0) {
      setSummaryError(true);
      error = true;
    }

    if (!error) {
      onSubmit({ title, summary });
    }
  };

  return (
    <>
      <Flex py={12} direction="column" w="100%">

        <Text variant="heading" fontSize="36px" lineHeight="48px">
          What&apos;s your grant about?
        </Text>

        <Box mt={12} />

        <SingleLineInput
          label="Grant Title"
          value={title}
          onChange={(e) => {
            setTitleError(false);
            setTitle(e.target.value);
          }}
          placeholder="Decentralized batching contract"
          subtext="Letters, spaces, and numbers are allowed."
          isError={titleError}
          errorText="Required"
        />

        <Box mt={12} />

        <MultiLineInput
          label="Grant Summary"
          placeholder="A tool, script or tutorial to set up monitoring for miner GPU, CPU, & memory."
          value={summary}
          onChange={(e) => {
            setSummaryError(false);
            if (e.target.value.length <= maxDescriptionLength) {
              setSummary(e.target.value);
            }
          }}
          maxLength={maxDescriptionLength}
          isError={summaryError}
          errorText="Required"
        />

      </Flex>
      <Button
        mt="auto"
        variant="primary"
        onClick={handleOnSubmit}
      >
        Continue
      </Button>
    </>
  );
}

export default Title;
