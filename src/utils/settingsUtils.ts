import { getUrlForIPFSHash, uploadToIPFS } from 'src/utils/ipfsUtils';
import { WorkspaceUpdateRequest } from '@questbook/service-validator-client';
import { Workspace, SettingsForm } from 'src/types';

export const workspaceDataToSettingsForm = (
  workspaceData: Workspace | undefined,
): SettingsForm | undefined => {
  if (!workspaceData) {
    return undefined;
  }
  /// finds & returns the value of a social media contact from the workspace socials list
  const getSocial = (name: string) => workspaceData.socials.find((s) => s.name === name)?.value;

  const twitterHandle = getSocial('twitter');
  const discordHandle = getSocial('discord');
  const telegramChannel = getSocial('telegram');

  return {
    name: workspaceData.title,
    about: workspaceData.about,
    image: getUrlForIPFSHash(workspaceData?.logoIpfsHash),
    supportedNetwork: workspaceData.supportedNetworks[0],
    coverImage: getUrlForIPFSHash(workspaceData.coverImageIpfsHash || ''),
    twitterHandle,
    discordHandle,
    telegramChannel,
  };
};

export const generateWorkspaceUpdateRequest = async (
  newForm: SettingsForm,
  oldForm: SettingsForm,
) => {
  const req: WorkspaceUpdateRequest = {};

  const applySimpleKeyUpdate = (key: keyof SettingsForm, wKey: keyof WorkspaceUpdateRequest) => {
    // @ts-ignore
    if (newForm[key] !== oldForm[key]) req[wKey] = newForm[key];
  };

  applySimpleKeyUpdate('name', 'title');
  applySimpleKeyUpdate('about', 'about');

  if (newForm.image !== oldForm.image && newForm.image) {
    req.logoIpfsHash = (await uploadToIPFS(newForm.image!)).hash;
  }
  if (newForm.coverImage !== oldForm.coverImage && newForm.coverImage) {
    req.coverImageIpfsHash = (await uploadToIPFS(newForm.coverImage!)).hash;
  }

  if (
    newForm.twitterHandle !== oldForm.twitterHandle
    || newForm.discordHandle !== oldForm.discordHandle
    || newForm.telegramChannel !== oldForm.telegramChannel
  ) {
    req.socials = [
      { name: 'twitter', value: newForm.twitterHandle! },
      { name: 'discord', value: newForm.twitterHandle || '' },
      { name: 'telegram', value: newForm.twitterHandle || '' },
    ];
  }

  return req;
};
