import { WorkspaceUpdateRequest } from '@questbook/service-validator-client'
import { ContentState, convertFromRaw, convertToRaw, EditorState } from 'draft-js'
import { PartnersProps, SettingsForm, Workspace } from 'src/types'
import { getUrlForIPFSHash, uploadToIPFS } from 'src/utils/ipfsUtils'

export const workspaceDataToSettingsForm = (
	workspaceData: Workspace | undefined,
): SettingsForm | undefined => {
	if(!workspaceData) {
		return undefined
	}

	/// finds & returns the value of a social media contact from the workspace socials list
	const getSocial = (name: string) => workspaceData.socials.find((s) => s.name === name)?.value

	const twitterHandle = getSocial('twitter')
	const discordHandle = getSocial('discord')
	const telegramChannel = getSocial('telegram')

	const aboutStr = workspaceData?.about
	let about: EditorState
	// if it's a JSON
	// assume it's an EditorState
	if(aboutStr?.startsWith('{')) {
		const data = JSON.parse(aboutStr)
		about = EditorState.createWithContent(convertFromRaw(data))
	} else {
		// otherwise just add plaintext
		about = EditorState.createWithContent(ContentState.createFromText(aboutStr || ''))
	}

	return {
		name: workspaceData.title,
		about,
		bio: workspaceData.bio,
		image: getUrlForIPFSHash(workspaceData?.logoIpfsHash),
		supportedNetwork: workspaceData.supportedNetworks[0],
		partners: workspaceData.partners,
		coverImage: getUrlForIPFSHash(workspaceData.coverImageIpfsHash || ''),
		twitterHandle,
		discordHandle,
		telegramChannel,
	}
}

/**
 * Given the old data, and the new data -- return a diff of the changes
 * If there are no changes, return an empty object
 * @param newForm
 * @param oldForm
 * @returns
 */
export const generateWorkspaceUpdateRequest = async(
	newForm: SettingsForm,
	oldForm: SettingsForm,
) => {
	const req: WorkspaceUpdateRequest = {}

	const applySimpleKeyUpdate = (key: keyof SettingsForm, wKey: keyof WorkspaceUpdateRequest) => {
		// @ts-ignore
		if(newForm[key] !== oldForm[key]) {
			req[wKey] = newForm[key] as any
		}
	}

	applySimpleKeyUpdate('name', 'title')
	applySimpleKeyUpdate('about', 'about')
	applySimpleKeyUpdate('bio', 'bio')

	if(newForm.image !== oldForm.image && newForm.image) {
		req.logoIpfsHash = (await uploadToIPFS(newForm.image!)).hash
	}

	const newAbout = JSON.stringify(convertToRaw(newForm.about.getCurrentContent()))
	const oldAbout = JSON.stringify(convertToRaw(oldForm.about.getCurrentContent()))
	if(oldAbout !== newAbout) {
		req.about = newAbout
	}

	if(newForm.coverImage !== oldForm.coverImage && newForm.coverImage) {
		req.coverImageIpfsHash = (await uploadToIPFS(newForm.coverImage!)).hash
	}

	if(newForm.partners) {
		// if any partner is changed
		let changedPartners = false
		const oldPartnersMap: { [_: string]: PartnersProps | undefined } = { }
		for(const partner of oldForm.partners || []) {
			oldPartnersMap[partner.name] = partner
		}

		for(const newPartner of newForm.partners || []) {
			const oldPartner = oldPartnersMap[newPartner.name]
			if(
				oldPartner?.name !== newPartner.name
				|| oldPartner?.industry !== newPartner.industry
				|| oldPartner?.website !== newPartner.website
				|| oldPartner?.partnerImageHash !== newPartner.partnerImageHash
			) {
				changedPartners = true
			}

			if(oldPartner?.partnerImageHash !== newPartner.partnerImageHash) {
				newPartner.partnerImageHash = (await uploadToIPFS(newPartner?.partnerImageHash!)).hash
			}

			// delete to mark as processed
			delete oldPartnersMap[newPartner.name]
		}

		// if some keys are left
		// means that a partner was removed
		if(Object.keys(oldPartnersMap).length) {
			changedPartners = true
		}

		// partners have changed
		if(changedPartners) {
			req.partners = newForm.partners!.map(p => ({ ...p, website: p.website || '', partnerImageHash: p.partnerImageHash || '' }))
		}
	}

	if(
		newForm.twitterHandle !== oldForm.twitterHandle
    	|| newForm.discordHandle !== oldForm.discordHandle
    	|| newForm.telegramChannel !== oldForm.telegramChannel
	) {
		req.socials = [
			{ name: 'twitter', value: newForm.twitterHandle! },
			{ name: 'discord', value: newForm.twitterHandle || '' },
			{ name: 'telegram', value: newForm.twitterHandle || '' },
		]
	}

	return req
}
