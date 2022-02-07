import React from 'react';
import { Text } from '@chakra-ui/react';

function GrantDetails({
  grantSummary,
  grantDetails,
}: {
  grantSummary: string;
  grantDetails: string;
}) {
  return (
    <>
      <Text mt={7} variant="heading" fontSize="18px" lineHeight="26px">
        Grant Details
      </Text>

      <Text mt={1} variant="heading" fontSize="16px" lineHeight="24px">
        Summary
      </Text>
      <Text mt={3} fontWeight="400">
        {grantSummary}
      </Text>

      <Text mt={3} variant="heading" fontSize="16px" lineHeight="24px">
        Details
      </Text>
      <Text mt={3} fontWeight="400">
        <div
          className="richTextContainer"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: grantDetails }}
        />
      </Text>
    </>
  );
}

export default GrantDetails;
