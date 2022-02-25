import {
  Box, Text,
} from '@chakra-ui/react';
import React from 'react';
import SingleLineInput from '../../../ui/forms/singleLineInput';
import { getApplicantEmailErrorText, getApplicantNameErrorText } from './errors/errorTexts';
import { ApplicantEmailError, ApplicantNameError } from './errors/errorTypes';

function ApplicantDetails({
  applicantName,
  setApplicantName,
  applicantEmail,
  setApplicantEmail,
  applicantNameError,
  setApplicantNameError,
  applicantEmailError,
  setApplicantEmailError,
  grantRequiredFields,
}: {
  applicantName: string;
  setApplicantName: (applicantName: string) => void;
  applicantEmail: string;
  setApplicantEmail: (applicantEmail: string) => void;
  applicantNameError: ApplicantNameError;
  setApplicantNameError: (applicantNameError: ApplicantNameError) => void;
  applicantEmailError: ApplicantEmailError;
  setApplicantEmailError: (applicantEmailError: ApplicantEmailError) => void;
  grantRequiredFields: string[];
}) {
  return (
    <>
      <Text fontWeight="700" fontSize="16px" lineHeight="20px" color="#8850EA">
        Applicant Details
      </Text>
      <Box mt={6} />
      <SingleLineInput
        label="Applicant Name"
        placeholder="John Doe"
        subtext="Full names are preferred."
        onChange={(e) => {
          if (applicantNameError !== ApplicantNameError.NoError) {
            setApplicantNameError(ApplicantNameError.NoError);
          }
          setApplicantName(e.target.value);
        }}
        isError={applicantNameError !== ApplicantNameError.NoError}
        errorText={getApplicantNameErrorText(applicantNameError)}
        value={applicantName}
        visible={grantRequiredFields.includes('applicantName')}
      />
      <Box mt={6} />
      <SingleLineInput
        label="Applicant Email"
        placeholder="name@sample.com"
        value={applicantEmail}
        onChange={(e) => {
          if (applicantEmailError !== ApplicantEmailError.NoError) {
            setApplicantEmailError(ApplicantEmailError.NoError);
          }
          setApplicantEmail(e.target.value);
        }}
        isError={applicantEmailError !== ApplicantEmailError.NoError}
        errorText={getApplicantEmailErrorText(applicantEmailError)}
        visible={grantRequiredFields.includes('applicantEmail')}
        type="email"
      />
    </>
  );
}

export default ApplicantDetails;
