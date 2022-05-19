import React, { useEffect } from 'react';
import {
  Box, Text,
} from '@chakra-ui/react';
import SingleLineInput from 'src/components/ui/forms/singleLineInput';
import Tooltip from '../../../ui/tooltip';

function CustomFields({
  customFields,
  setCustomFields,
  readOnly,
}: {
  customFields: any[];
  setCustomFields: (customFields: any[]) => void;
  readOnly?: boolean;
}) {
  useEffect(() => {
    console.log('customFields', customFields);
  }, [customFields]);
  return (
    <>
      <Text fontWeight="700" fontSize="16px" lineHeight="20px" color="#8850EA">
        Other Information
        <Tooltip
          icon="/ui_icons/tooltip_questionmark_brand.svg"
          label="Additional details for the application form"
          placement="bottom-start"
        />
      </Text>

      <Box mt={6} />

      {customFields.map((customField, index) => {
        const i = customField.title.indexOf('-');
        const title = customField.title.substring(i + 1).split('\\s').join(' ');
        return (
          <>
            <SingleLineInput
              label={title}
              value={customField.value}
              disabled={readOnly}
              onChange={(e) => {
                const newCustomFields = [...customFields];
                newCustomFields[index].value = e.target.value;
                newCustomFields[index].isError = false;
                setCustomFields(newCustomFields);
              }}
              placeholder="Field Label"
              isError={customField.isError}
              errorText="Required"
              maxLength={30}
            />
            <Box mt={2} />
          </>
        );
      })}
    </>
  );
}

CustomFields.defaultProps = {
  readOnly: false,
};
export default CustomFields;
