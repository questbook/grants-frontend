import { Flex, Box } from '@chakra-ui/react';
import React from 'react';
import MultiLineInput from '../../../ui/forms/multiLineInput';
import SingleLineInput from '../../../ui/forms/singleLineInput';
import { getGrantSummaryErrorText, getGrantTitleErrorText } from './errors/errorTexts';
import { GrantSummaryError, GrantTitleError } from './errors/errorTypes';

function Title({
  title,
  setTitle,
  summary,
  setSummary,
  titleError,
  setTitleError,
  summaryError,
  setSummaryError,
  maxDescriptionLength,
}: {
  title: string;
  setTitle: (title: string) => void;
  summary: string;
  setSummary: (summary: string) => void;
  titleError: GrantTitleError;
  setTitleError: (titleError: GrantTitleError) => void;
  summaryError: GrantSummaryError;
  setSummaryError: (summaryError: GrantSummaryError) => void;
  maxDescriptionLength: number;
}) {
  return (
    <Flex direction="column" w="100%">
      <SingleLineInput
        label="Grant Title"
        value={title}
        onChange={(e) => {
          if (titleError !== GrantTitleError.NoError) {
            setTitleError(GrantTitleError.NoError);
          }
          setTitle(e.target.value);
        }}
        isError={titleError !== GrantTitleError.NoError}
        errorText={getGrantTitleErrorText(titleError)}
        placeholder="Decentralized batching contract"
        subtext="Letters, spaces, and numbers are allowed."
      />

      <Box mt={8} />

      <MultiLineInput
        label="Grant Summary"
        placeholder="A tool, script or tutorial to set up monitoring for miner GPU, CPU, & memory."
        value={summary}
        onChange={(e) => {
          if (summaryError !== GrantSummaryError.NoError) {
            setSummaryError(GrantSummaryError.NoError);
          }
          setSummary(e.target.value);
        }}
        maxLength={maxDescriptionLength}
        isError={summaryError !== GrantSummaryError.NoError}
        errorText={getGrantSummaryErrorText(summaryError)}
      />
    </Flex>
  );
}

export default Title;
