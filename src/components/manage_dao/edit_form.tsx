import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  Box,
  Button,
  Flex,
  Image,
  Link,
  Switch,
  Text,
  useToast,
  ToastId,
} from '@chakra-ui/react';
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils';
import { CHAIN_INFO } from 'src/constants/chains';
import config from 'src/constants/config';
import useUpdateWorkspace from 'src/hooks/useUpdateWorkspace';
import { WorkspaceUpdateRequest } from '@questbook/service-validator-client';
import { SettingsForm, Workspace, PartnersProps } from 'src/types';
import { generateWorkspaceUpdateRequest, workspaceDataToSettingsForm } from 'src/utils/settingsUtils';
import CoverUpload from '../ui/forms/coverUpload';
import ImageUpload from '../ui/forms/imageUpload';
import MultiLineInput from '../ui/forms/multiLineInput';
import SingleLineInput from '../ui/forms/singleLineInput';
import Loader from '../ui/loader';
import InfoToast from '../ui/toasts/infoToast';

type EditFormProps = {
  workspaceData: Workspace | undefined
};

type EditErrors = { [K in keyof SettingsForm]?: { error: string } };

function EditForm({ workspaceData }: EditFormProps) {
  const toast = useToast();

const [editedFormData, setEditedFormData] = useState<SettingsForm>();
const [editData, setEditData] = useState<WorkspaceUpdateRequest>();
const [editError, setEditError] = useState<EditErrors>({ });

const [partnersRequired, setPartnersRequired] = React.useState(false);
const [partners, setPartners] = React.useState<any>([
  {
    name: '',
    industry: '',
    website: '',
    image: ''
  },
]);
const [partnersImageFile, setPartnerImageFile] = React.useState<
  Array<File | null>
>([null]);


const handlePartnerImageChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  index: number
) => {
  if (event.target.files && event.target.files[0]) {
    const img = event.target.files[0];
    setPartnerImageFile((partnerImages) => [...partnerImages, img]);

    setPartners((partner: any) => [...partner, partners[index].image = URL.createObjectURL(img)]);
  }
};

  const [txnData, txnLink, loading] = useUpdateWorkspace(editData as any);

  const supportedNetwork = useMemo(() => {
    if (editedFormData) {
      const supportedChainId = getSupportedChainIdFromSupportedNetwork(
        editedFormData!.supportedNetwork,
      );
      const networkName = supportedChainId ? CHAIN_INFO[supportedChainId].name : 'Unsupported Network';

      return networkName;
    }

    return undefined;
  }, [editedFormData]);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const toastRef = useRef<ToastId>();

  const showInfoToast = (text: string) => {
    toastRef.current = toast({
      position: 'top',
      render: () => (
        <InfoToast
          link={text}
          close={() => {
            if (toastRef.current) {
              toast.close(toastRef.current);
            }
          }}
        />
      ),
    });
  };

  const updateEditError = (key: keyof SettingsForm, error: string | undefined) => (
    setEditError((err) => ({ ...err, [key]: error ? { error } : undefined }))
  );

  const updateFormData = (update: Partial<SettingsForm>) => {
    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (const key in update) {
      updateEditError(key as any, undefined);
    }

    if (editedFormData) {
      setEditedFormData((current) => ({ ...current!, ...update }));
    }
  };

  const hasError = (key: keyof SettingsForm) => !!editError[key];

  const handleImageChange = (
    key: 'image' | 'coverImage',
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files[0]) {
      const img = event.target.files[0];
      updateFormData({ [key]: URL.createObjectURL(img).toString() });
    }
  };

  const handleSubmit = async () => {
    if (!editedFormData?.name?.length) {
      return updateEditError('name', 'Please enter a name');
    }
    if (!editedFormData?.about?.length) {
      return updateEditError('about', 'Please enter about');
    }

    const data = await generateWorkspaceUpdateRequest(
      editedFormData,
      workspaceDataToSettingsForm(workspaceData)!,
    );

    if (!Object.keys(data).length) {
      toast({
        position: 'bottom-right',
        title: 'No Changes to Save!',
        status: 'info',
        isClosable: true,
        duration: 3000,
      });
      return undefined;
    }

    return setEditData(data);
  };

  useEffect(() => {
    setEditedFormData(workspaceDataToSettingsForm(workspaceData));
  }, [workspaceData]);

  useEffect(() => {
    if (txnData) {
      showInfoToast(txnLink);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast, txnData]);

  return (
    <>
      <Flex w="100%" mt={8} alignItems="flex-start">
        <SingleLineInput
          label="Grants DAO Name"
          placeholder="Nouns DAO"
          subtext="Letters, spaces, and numbers are allowed."
          value={editedFormData?.name}
          onChange={(e) => updateFormData({ name: e.target.value })}
          isError={hasError('name')}
        />
        <Box ml={9} />
        <ImageUpload
          image={editedFormData?.image || config.defaultDAOImagePath}
          isError={false}
          onChange={(e) => handleImageChange('image', e)}
          label="Add a logo"
        />
      </Flex>
      <Flex w="100%" mt={1}>
        <MultiLineInput
          label="About your Grants DAO"
          placeholder="Sample"
          value={editedFormData?.about}
          onChange={(e) => updateFormData({ about: e.target.value })}
          isError={hasError('about')}
          maxLength={500}
          subtext={null}
        />
      </Flex>
      <Flex w="100%" mt={1}>
        <SingleLineInput
          label="Network"
          placeholder="Network"
          value={supportedNetwork}
          onChange={() => {}}
          isError={false}
          disabled
        />
      </Flex>
      <Flex mt={4} gap="2" justifyContent="space-between">
        <Flex direction="column">
          <Text
            fontSize="18px"
            fontWeight="700"
            lineHeight="26px"
            letterSpacing={0}
          >
            Want to showcase your grant program partners?
          </Text>
          <Flex>
            <Text color="#717A7C" fontSize="14px" lineHeight="20px">
              You can add their names, logo, and a link to their site.
            </Text>
          </Flex>
        </Flex>
        <Flex justifyContent="center" gap={2} alignItems="center">
          <Switch
            id="encrypt"
            isChecked={partnersRequired}
            onChange={(e: any) => {
              setPartnersRequired(e.target.checked);
              const newPartners = partners.map((partner: any) => ({
                ...partner,
                nameError: false,
              }));
              setPartners(newPartners as PartnersProps);
            }}
          />
          <Text fontSize="12px" fontWeight="bold" lineHeight="16px">
            {`${partnersRequired ? 'YES' : 'NO'}`}
          </Text>
        </Flex>
      </Flex>

      {partners.map((partner: any, index: any) => (
        <Box w="43rem">
          <Flex
            mt={4}
            gap="2"
            alignItems="flex-start"
            direction="column"
            opacity={partnersRequired ? 1 : 0.4}
            justifyContent="space-between"
          >
            <Flex
            justifyContent="space-between"
            w="35rem">
              <Text
                mt="18px"
                color="#122224"
                fontWeight="bold"
                fontSize="16px"
                lineHeight="20px"
              >
                Name
              </Text>
              <Flex
                onClick={
                  () => {
                    if(!partnersRequired) {
                      return
                    }

                    const newPartners = [...partners]
                    newPartners.splice(index, 1)
                    setPartners(newPartners as PartnersProps)
                  }
                }
                alignItems="center"
                alignSelf="center"
                cursor="pointer"
                opacity={partnersRequired ? 1 : 0.4}
                gap="0.25rem"
                >
                  <Image
                    h="0.875rem"
                    w="0.875rem"
                    src="/ui_icons/delete_red.svg"
                  />
                  <Text
                    fontWeight="500"
                    fontSize="14px"
                    color="#DF5252"
                    lineHeight="20px">
                  Delete
                  </Text>
              </Flex>
            </Flex>
            <Flex
              justifyContent="center"
              w="full"
              gap="1rem"
              position="relative"
              alignItems="flex-start"
            >
              <SingleLineInput
                value={partners[index].name}
                onChange={(e) => {
                  const newPartners = [...partners];
                  newPartners[index].name = e.target.value;
                  setPartners(newPartners as PartnersProps);
                }}
                placeholder="e.g. Partner DAO"
                errorText="Required"
                disabled={!partnersRequired}
              />
              <Box
              mt="-2.2rem"
              mb="-10rem">
                <ImageUpload
                  image={partners[index].image as any}
                  isError={false}
                  onChange={(e) => handlePartnerImageChange(e, index)}
                  label="Partner logo"
                />
              </Box>
            </Flex>
          </Flex>

          <Flex
            w="35rem"
            gap="2"
            alignItems="flex-start"
            direction="column"
            opacity={partnersRequired ? 1 : 0.4}
          >
            <Flex flex={0.3327}>
              <Text
                mt="18px"
                color="#122224"
                fontWeight="bold"
                fontSize="16px"
                lineHeight="20px"
              >
                Industry
              </Text>
            </Flex>
            <Flex
              justifyContent="center"
              gap={2}
              alignItems="center"
              w="100%"
              flex={0.6673}
            >
              <SingleLineInput
                value={partners[index].industry}
                onChange={(e) => {
                  const newPartners = [...partners];
                  newPartners[index].industry = e.target.value;
                  setPartners(newPartners as any);
                }}
                placeholder="e.g. Security"
                errorText="Required"
                disabled={!partnersRequired}
              />
            </Flex>
          </Flex>

          <Flex
            w="35rem"
            gap="2"
            alignItems="flex-start"
            direction="column"
            opacity={partnersRequired ? 1 : 0.4}
          >
            <Flex flex={0.3327}>
              <Text
                mt="18px"
                color="#122224"
                fontWeight="bold"
                fontSize="16px"
                lineHeight="20px"
              >
                Website
              </Text>
            </Flex>
            <Flex
              justifyContent="center"
              gap={2}
              alignItems="center"
              w="full"
              flex={0.6673}
            >
              <SingleLineInput
                value={partners[index].website}
                onChange={(e) => {
                  const newPartners = [...partners];
                  newPartners[index].website = e.target.value;
                  setPartners(newPartners as PartnersProps);
                }}
                placeholder="e.g. www.example.com"
                errorText="Required"
                disabled={!partnersRequired}
              />
            </Flex>
          </Flex>
        </Box>
      ))}

      <Flex mt="19px" gap="2" justifyContent="flex-start">
        <Box
          onClick={() => {
            if (!partnersRequired) {
              return;
            }

            const newPartners = [
              ...partners,
              {
                name: '',
                industry: '',
                website: '',
              },
            ];
            setPartners(newPartners as PartnersProps);
          }}
          display="flex"
          alignItems="center"
          cursor="pointer"
          opacity={partnersRequired ? 1 : 0.4}
        >
          <Image h="16px" w="15px" src="/ui_icons/plus_circle.svg" mr="6px" />
          <Text
            fontWeight="500"
            fontSize="14px"
            color="#8850EA"
            lineHeight="20px"
          >
            Add another service partner
          </Text>
        </Box>
      </Flex>

      <Flex w="100%" mt={10}>
        <CoverUpload
          image={editedFormData?.coverImage || ''}
          isError={false}
          onChange={(e) => handleImageChange('coverImage', e)}
          subtext="Upload a cover"
        />
      </Flex>
      <Flex w="100%" mt={8} alignItems="flex-start">
        <SingleLineInput
          label="Twitter Profile Link"
          placeholder="https://twitter.com/questbookapp"
          subtext=""
          value={editedFormData?.twitterHandle}
          onChange={(e) => updateFormData({ twitterHandle: e.target.value })}
          isError={hasError('twitterHandle')}
        />
      </Flex>
      <Flex w="100%" mt={8} alignItems="flex-start">
        <SingleLineInput
          label="Discord Server Link"
          placeholder="https://discord.gg/questbook"
          subtext=""
          value={editedFormData?.discordHandle}
          onChange={(e) => updateFormData({ discordHandle: e.target.value })}
          isError={hasError('discordHandle')}
        />
      </Flex>
      <Flex w="100%" mt={8} alignItems="flex-start">
        <SingleLineInput
          label="Telegram Channel"
          placeholder="https://t.me/questbook"
          subtext=""
          value={editedFormData?.telegramChannel}
          onChange={(e) => updateFormData({ telegramChannel: e.target.value })}
          isError={hasError('telegramChannel')}
        />
      </Flex>
      <Flex direction="row" mt={4}>
        <Text textAlign="left" variant="footer" fontSize="12px">
          <Image display="inline-block" src="/ui_icons/info.svg" alt="pro tip" mb="-2px" />
          {' '}
          By pressing the button Save Changes below
          you&apos;ll have to approve this transaction in your wallet.
          {' '}
          <Link href="https://www.notion.so/questbook/FAQs-206fbcbf55fc482593ef6914f8e04a46" isExternal>Learn more</Link>
          {' '}
          <Image
            display="inline-block"
            src="/ui_icons/link.svg"
            alt="pro tip"
            mb="-1px"
            h="10px"
            w="10px"
          />
        </Text>
      </Flex>

      <Flex direction="row" justify="start" mt={4}>
        <Button ref={buttonRef} w={loading ? buttonRef.current?.offsetWidth : 'auto'} variant="primary" onClick={loading ? () => {} : handleSubmit} py={loading ? 2 : 0}>
          {loading ? <Loader /> : 'Save changes'}
        </Button>
      </Flex>
    </>
  );
}

export default EditForm;
