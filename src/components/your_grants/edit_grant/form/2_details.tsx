import {
  Flex,
} from '@chakra-ui/react';
import { EditorState } from 'draft-js';
import React from 'react';
import RichTextEditor from 'src/components/ui/forms/richTextEditor';

function Details({
  details,
  setDetails,
  detailsError,
  setDetailsError,
}: {
  details: EditorState;
  setDetails: (details: EditorState) => void;
  detailsError: boolean;
  setDetailsError: (detailsError: boolean) => void;
}) {
  return (
    <Flex direction="column">
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

    </Flex>
  );
}

export default Details;
