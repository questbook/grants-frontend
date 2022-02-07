import {
  Container, Button, Text, Box,
} from '@chakra-ui/react';
import React from 'react';
import MultiLineInput from '../../../ui/forms/multiLineInput';

function Resubmit({
  onSubmit,
}: {
  onSubmit: (data: any) => void;
}) {
  const [comment, setComment] = React.useState('');
  const [commentError, setCommentError] = React.useState(false);
  return (
    <Container
      flex={1}
      display="flex"
      flexDirection="column"
      maxW="584px"
      alignItems="stretch"
      pb={8}
      px={10}
      alignSelf="flex-start"
      ml={0}
    >
      <Text fontSize="18px" lineHeight="26px" fontWeight="700">
        Reason for Resubmission
      </Text>

      <Box mt="24px" />
      <MultiLineInput
        label="Comments"
        placeholder="Write an explanation as detailed as possible about every
        reason asking for resubmission."
        value={comment}
        onChange={(e) => {
          if (commentError) {
            setCommentError(false);
          }
          setComment(e.target.value);
        }}
        isError={commentError}
        errorText="Required"
      />

      <Button onClick={() => onSubmit({ comment })} w="100%" mt={10} variant="primary">
        Ask to Resubmit
      </Button>
    </Container>
  );
}

export default Resubmit;
