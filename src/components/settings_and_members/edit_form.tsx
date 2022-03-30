import {
  Box, Button, Flex, Text, Image, Link, useToast, ToastId,
} from '@chakra-ui/react';
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import config from 'src/constants/config';
import useUpdateWorkspace from 'src/hooks/useUpdateWorkspace';
import { WorkspaceUpdateRequest } from '@questbook/service-validator-client';
import { SettingsForm, Workspace } from 'src/types';
import { generateWorkspaceUpdateRequest, workspaceDataToSettingsForm } from 'src/utils/settingsUtils';
import CoverUpload from '../ui/forms/coverUpload';
import ImageUpload from '../ui/forms/imageUpload';
import MultiLineInput from '../ui/forms/multiLineInput';
import SingleLineInput from '../ui/forms/singleLineInput';
import Loader from '../ui/loader';
import InfoToast from '../ui/infoToast';

type EditFormProps = {
  workspaceData: Workspace | undefined
};

type EditErrors = { [K in keyof SettingsForm]?: { error: string } };

function EditForm({ workspaceData }: EditFormProps) {
  const toast = useToast();

  const [editedFormData, setEditedFormData] = useState<SettingsForm>();
  const [editData, setEditData] = useState<WorkspaceUpdateRequest>();
  const [editError, setEditError] = useState<EditErrors>({ });

  const [txnData, txnLink, loading] = useUpdateWorkspace(editData);

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
