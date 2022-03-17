/* eslint-disable react/no-unstable-nested-components */
// @TODO: Fix this ESLint issue
import React from 'react';
import { Box, Link, Text } from '@chakra-ui/react';
import Linkify from 'react-linkify';
import TextViewer from 'src/components/ui/forms/richTextEditor/textViewer';

function GrantDetails({
  grantSummary,
  grantDetails,
}: {
  grantSummary: string;
  grantDetails: string;
}) {
  return (
    <>
      <Text
        mt={7}
        variant="heading"
        fontSize="18px"
        lineHeight="26px"
        color="#8347E5"
      >
        About Grant
      </Text>

      <Text mt={4} variant="heading" fontSize="16px" lineHeight="24px">
        Summary
      </Text>
      <Text mt={3} fontWeight="400">
        {grantSummary}
      </Text>

      <Text mt={4} variant="heading" fontSize="16px" lineHeight="24px">
        Details
      </Text>
      <Linkify
        componentDecorator={(
          decoratedHref: string,
          decoratedText: string,
          key: number,
        ) => (
          <Link key={key} href={decoratedHref} isExternal>
            {decoratedText}
          </Link>
        )}
      >
        <Box mt={3} fontWeight="400">
          {grantDetails ? (
            <TextViewer
            // value={useMemo(() => EditorState.createWithContent(
            //   convertFromRaw(JSON.parse(grantDetails)),
            // ), [grantDetails])}
            // value={editorState}
            // onChange={setEditorState}
              grantDetails={grantDetails}
            />
          ) : null}
          {/* <div
          className="richTextContainer"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html:  }}
        /> */}
        </Box>
      </Linkify>
    </>
  );
}

export default GrantDetails;
