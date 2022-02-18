import {
  Container, Button, Text, Box, Center, CircularProgress,
} from '@chakra-ui/react';
import React from 'react';
import MultiLineInput from '../../../ui/forms/multiLineInput';

function Resubmit({
  onSubmit,
  hasClicked,
}: {
  onSubmit: (data: any) => void;
  hasClicked: boolean;
}) {
  const [comment, setComment] = React.useState('');
  const [commentError, setCommentError] = React.useState(false);
  return (
    <Container
      flex={1}
      display="flex"
      flexDirection="column"
      maxW="502px"
      alignItems="stretch"
      pb={8}
      px={0}
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

      {hasClicked ? <Center><CircularProgress isIndeterminate color="brand.500" size="48px" mt={10} /></Center> : (
        <Button onClick={() => onSubmit({ comment })} w="100%" mt={10} variant="primary">
          Ask to Resubmit
        </Button>
      )}
    </Container>
  );
}

export default Resubmit;
