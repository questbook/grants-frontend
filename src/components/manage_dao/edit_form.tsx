import React, { useEffect, useMemo, useRef, useState } from 'react'
// UI AND COMPONENTS
import {
	Box,
	Button,
	Flex,
	Grid,
	Image,
	Link,
	Switch,
	Text,
	ToastId,
	useToast,
} from '@chakra-ui/react'
import { WorkspaceUpdateRequest } from '@questbook/service-validator-client'
// CONSTANTS AND TYPES
import { CHAIN_INFO } from 'src/constants/chains'
import config from 'src/constants/config.json'
// UTILS AND TOOLS
import useUpdateWorkspace from 'src/hooks/useUpdateWorkspace'
import { PartnersProps, SettingsForm, Workspace } from 'src/types'
import { getUrlForIPFSHash, isIpfsHash } from 'src/utils/ipfsUtils'
import {
	generateWorkspaceUpdateRequest,
	workspaceDataToSettingsForm,
} from 'src/utils/settingsUtils'
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils'
import CoverUpload from '../ui/forms/coverUpload'
import ImageUpload from '../ui/forms/imageUpload'
import MultiLineInput from '../ui/forms/multiLineInput'
import RichTextEditor from '../ui/forms/richTextEditor'
import SingleLineInput from '../ui/forms/singleLineInput'
import Loader from '../ui/loader'
import ErrorToast from '../ui/toasts/errorToast'
import InfoToast from '../ui/toasts/infoToast'

type EditFormProps = {
  workspaceData: Workspace | undefined;
};

type EditErrors = { [K in keyof SettingsForm]?: { error: string } };

const MAX_IMAGE_SIZE_MB = 2

function EditForm({ workspaceData }: EditFormProps) {
	const toast = useToast()

	const [editedFormData, setEditedFormData] = useState<SettingsForm>()
	const [editData, setEditData] = useState<WorkspaceUpdateRequest>()
	const [editError, setEditError] = useState<EditErrors>({})

	const [partnersRequired, setPartnersRequired] = useState(false)
	const [partners, setPartners] = useState<PartnersProps[]>([{
		name: '',
		industry: '',
		website: ''
	}])

	const [txnData, txnLink, loading] = useUpdateWorkspace(editData as any)

	const supportedNetwork = useMemo(() => {
		if(editedFormData) {
			const supportedChainId = getSupportedChainIdFromSupportedNetwork(
        		editedFormData!.supportedNetwork
			)
			const networkName = supportedChainId
				? CHAIN_INFO[supportedChainId].name
				: 'Unsupported Network'

			return networkName
		}

		return undefined
	}, [editedFormData])

	const buttonRef = useRef<HTMLButtonElement>(null)
	const toastRef = useRef<ToastId>()

	const showInfoToast = (text: string) => {
		toastRef.current = toast({
			position: 'top',
			render: () => (
				<InfoToast
					link={text}
					close={
						() => {
							if(toastRef.current) {
								toast.close(toastRef.current)
							}
						}
					}
				/>
			),
		})
	}

	const updateEditError = (
		key: keyof SettingsForm,
		error: string | undefined
	) => setEditError((err) => ({ ...err, [key]: error ? { error } : undefined }))

	/**
	 * Update the edited form data with the newly updated key/value pair
	 * @param update the updated keys
	 */
	const updateFormData = (update: Partial<SettingsForm>) => {
		for(const key in update) {
			updateEditError(key as any, undefined)
		}

		if(editedFormData) {
			setEditedFormData((current) => ({ ...current!, ...update }))
		}
	}

	const hasError = (key: keyof SettingsForm) => !!editError[key]

	const handleImageChange = (
		key: 'image' | 'coverImage',
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		if(event.target.files && event.target.files[0]) {
			const img = event.target.files[0]
			updateFormData({ [key]: URL.createObjectURL(img) })
		}
	}

	const handlePartnerImageChange = (
		event: React.ChangeEvent<HTMLInputElement>,
		index: number
	) => {
		if(event.target.files && event.target.files[0]) {
			const img = event.target.files[0]
			if(img.size / 1024 / 1024 <= MAX_IMAGE_SIZE_MB) {
				const newPartners = [...partners!]
				newPartners[index].partnerImageHash = URL.createObjectURL(img)
				updateFormData({ partners: newPartners })
			} else {
				toastRef.current = toast({
					position: 'top',
					render: () => ErrorToast({
						content: `Image size exceeds ${MAX_IMAGE_SIZE_MB} MB`,
						close: () => {
							if(toastRef.current) {
								toast.close(toastRef.current)
							}
						},
					}),
				})
			}
		}
	}

	const handleSubmit = async() => {
		if(!editedFormData) {
			return
		}
		// if(!editedFormData?.bio?.length) {
		// 	return updateEditError('bio', 'Please enter a bio')
		// }

		// if(!editedFormData?.name?.length) {
		// 	return updateEditError('name', 'Please enter a name')
		// }

		// if(!editedFormData?.about?.getCurrentContent()?.hasText()) {
		// 	return updateEditError('about', 'Please enter about')
		// }

		const data = await generateWorkspaceUpdateRequest(
			editedFormData,
			workspaceDataToSettingsForm(workspaceData)!
		)

		if(!Object.keys(data).length) {
			toast({
				position: 'bottom-right',
				title: 'No Changes to Save!',
				status: 'info',
				isClosable: true,
				duration: 3000,
			})
			return undefined
		}

		setEditData(data)
	}

	useEffect(() => {
		setEditedFormData(workspaceDataToSettingsForm(workspaceData))
		if(workspaceData && workspaceData!.partners!.length >= 1) {
			setPartnersRequired(true)
			setPartners(JSON.parse(JSON.stringify(workspaceData.partners)))
		}

	}, [workspaceData])

	useEffect(() => {
		if(txnData) {
			showInfoToast(txnLink)
		}
	}, [toast, txnData])

	return (
		<>
			<Grid
				w="100%"
				gridTemplateColumns="4fr 1fr"
				justifyItems="space-between"
				mt={8}
				alignItems="flex-start"
			>
				<SingleLineInput
					label="Grants DAO Name"
					placeholder="Nouns DAO"
					subtext="Letters, spaces, and numbers are allowed."
					value={editedFormData?.name}
					onChange={(e) => updateFormData({ name: e.target.value })}
					isError={hasError('name')}
				/>
				<ImageUpload
					image={editedFormData?.image! || config.defaultDAOImagePath}
					isError={false}
					onChange={(e) => handleImageChange('image', e)}
					label="Add a logo"
				/>
			</Grid>
			<Grid
				w="100%"
				gridTemplateColumns="4fr 1fr"
				justifyItems="space-between">
				<MultiLineInput
					label="Bio"
					placeholder="Describe your DAO in 200 characters"
					value={editedFormData?.bio}
					onChange={(e) => updateFormData({ bio: e.target.value })}
					isError={hasError('bio')}
					maxLength={200}
					subtext={null}
				/>
			</Grid>
			<Grid
				w="100%"
				gridTemplateColumns="4fr 1fr"
				justifyItems="space-between">
				{
					editedFormData?.about
						? (
							<RichTextEditor
								label="About your Grants DAO"
								placeholder="Write details about your grants, bounty, and other projects."
								value={editedFormData!.about!}
								onChange={about => updateFormData({ about })}
								isError={hasError('about')}
								errorText="Required"
								maxLength={800}
							/>
						)
						: undefined
				}
			</Grid>
			<Grid
				w="100%"
				gridTemplateColumns="4fr 1fr"
				justifyItems="space-between"
				mt={8}
			>
				<SingleLineInput
					label="Network"
					placeholder="Network"
					value={supportedNetwork}
					onChange={() => {}}
					isError={false}
					disabled
				/>
			</Grid>
			<Grid
				w="80%"
				gridTemplateColumns="5fr 1fr"
				justifyItems="space-between"
				mt={5}
			>
				<Flex direction="column">
					<Text
						fontSize="18px"
						fontWeight="700"
						lineHeight="26px"
						letterSpacing={0}
						w="full"
					>
            			Do you want to showcase your grant program partners?
					</Text>
					<Text
						color="#717A7C"
						fontSize="14px"
						lineHeight="20px">
            			You can add their names, logo, and a link to their site.
					</Text>
				</Flex>
				<Flex
					justifySelf="right"
					gap={2}
					alignItems="center">
					<Switch
						id="encrypt"
						isChecked={partnersRequired}
						onChange={
							(e: any) => {
								setPartnersRequired(e.target.checked)
								const newPartners = partners?.map((partner: any) => ({
									...partner,
									nameError: false,
								}))
								setPartners(newPartners)
							}
						}
					/>
					<Text
						fontSize="12px"
						fontWeight="bold"
						lineHeight="16px">
						{`${partnersRequired ? 'YES' : 'NO'}`}
					</Text>
				</Flex>
			</Grid>

			{
				partners!.map((partner, index) => (
					<Box
						w="100%"
						key={index}>
						<Grid
							minW="100%"
							gridTemplateColumns="4fr 1fr"
							justifyItems="space-between"
							mt={2}
							opacity={partnersRequired ? 1 : 0.4}
						>
							<Flex
								mt={4}
								gap="2"
								alignItems="flex-start"
								direction="column"
								opacity={partnersRequired ? 1 : 0.4}
								justifyContent="space-between"
							>
								<Flex
									alignItems="center"
									direction="row"
									justifyContent="space-between"
									w="100%"
								>
									<Text
										color="#122224"
										fontWeight="bold"
										fontSize="16px"
										lineHeight="20px"
									>
										Partner Name
									</Text>
									<Flex
										onClick={
											() => {
												if(!partnersRequired) {
													return
												}

												const newPartners = [...partners!]
												newPartners.splice(index, 1)
												setPartners(newPartners)
												updateFormData({ partners: newPartners })
											}
										}
										alignItems="center"
										cursor="pointer"
										opacity={partnersRequired ? 1 : 0.4}
										gap="0.25rem"
										justifySelf="flex-end"
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
											lineHeight="20px"
										>
											Delete
										</Text>
									</Flex>
								</Flex>
							</Flex>
						</Grid>
						<Grid
							minW="100%"
							gridTemplateColumns="4fr 1fr"
							justifyItems="space-between"
							mt={2}
							opacity={partnersRequired ? 1 : 0.4}
						>
							<SingleLineInput
								value={partner.name}
								onChange={
									(e) => {
										const newPartners = [...partners]
										newPartners[index].name = e.target.value
										updateFormData({ partners: newPartners })
									}
								}
								placeholder="e.g. Partner DAO"
								maxLength={24}
								errorText="Required"
								disabled={!partnersRequired}
							/>
							<Box
								mt="-2.2rem"
								mb="-10rem">
								<ImageUpload
									image={isIpfsHash(partner.partnerImageHash) ? getUrlForIPFSHash(partner.partnerImageHash!) : partner.partnerImageHash!}
									isError={false}
									onChange={e => handlePartnerImageChange(e, index)}
									label="Partner logo"
								/>
							</Box>
						</Grid>

						<Flex
							w="80%"
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
							>
								<SingleLineInput
									value={partner.industry}
									onChange={
										(e) => {
											const newPartners = [...partners]
											newPartners[index].industry = e.target.value
											updateFormData({ partners: newPartners })
										}
									}
									placeholder="e.g. Security"
									maxLength={24}
									errorText="Required"
									disabled={!partnersRequired}
								/>
							</Flex>
						</Flex>

						<Flex
							w="80%"
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
									value={partner.website!}
									onChange={
										(e) => {
											const newPartners = [...partners]
											newPartners[index].website = e.target.value
											updateFormData({ partners: newPartners })
										}
									}
									placeholder="e.g. https://www.example.com"
									maxLength={48}
									errorText="Required"
									disabled={!partnersRequired}
								/>
							</Flex>
						</Flex>
					</Box>
				))
			}

			<Flex
				mt="19px"
				gap="2"
				justifyContent="flex-start">
				<Box
					onClick={
						() => {
							if(!partnersRequired) {
								return
							}

							const newPartners = [
								...partners,
								{
									name: '',
									industry: '',
									website: '',
								},
							]
							setPartners(newPartners)
						}
					}
					display="flex"
					alignItems="center"
					cursor="pointer"
					opacity={partnersRequired ? 1 : 0.4}
				>
					<Image
						h="16px"
						w="15px"
						src="/ui_icons/plus_circle.svg"
						mr="6px" />
					<Text
						fontWeight="500"
						fontSize="14px"
						color="#8850EA"
						lineHeight="20px"
					>
						Add
						{' '}
						{partners! && partners!.length >= 1 ? 'another' : 'a'}
						{' '}
service partner
					</Text>
				</Box>
			</Flex>

			<Flex
				w="100%"
				mt={10}>
				<CoverUpload
					image={editedFormData?.coverImage || ''}
					isError={false}
					onChange={(e) => handleImageChange('coverImage', e)}
					subtext="Upload a cover"
				/>
			</Flex>
			<Flex
				w="100%"
				mt={8}
				alignItems="flex-start">
				<SingleLineInput
					label="Twitter Profile Link"
					placeholder="https://twitter.com/questbookapp"
					subtext=""
					value={editedFormData?.twitterHandle}
					onChange={(e) => updateFormData({ twitterHandle: e.target.value })}
					isError={hasError('twitterHandle')}
				/>
			</Flex>
			<Flex
				w="100%"
				mt={8}
				alignItems="flex-start">
				<SingleLineInput
					label="Discord Server Link"
					placeholder="https://discord.gg/questbook"
					subtext=""
					value={editedFormData?.discordHandle}
					onChange={(e) => updateFormData({ discordHandle: e.target.value })}
					isError={hasError('discordHandle')}
				/>
			</Flex>
			<Flex
				w="100%"
				mt={8}
				alignItems="flex-start">
				<SingleLineInput
					label="Telegram Channel"
					placeholder="https://t.me/questbook"
					subtext=""
					value={editedFormData?.telegramChannel}
					onChange={(e) => updateFormData({ telegramChannel: e.target.value })}
					isError={hasError('telegramChannel')}
				/>
			</Flex>
			<Flex
				direction="row"
				mt={4}>
				<Text
					textAlign="left"
					variant="footer"
					fontSize="12px">
					<Image
						display="inline-block"
						src="/ui_icons/info.svg"
						alt="pro tip"
						mb="-2px"
					/>
					{' '}
					By pressing the button Save Changes below you&apos;ll have to approve
					this transaction in your wallet.
					{' '}
					<Link
						href="https://www.notion.so/questbook/FAQs-206fbcbf55fc482593ef6914f8e04a46"
						isExternal
					>
            			Learn more
					</Link>
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

			<Flex
				direction="row"
				justify="start"
				mt={4}>
				<Button
					ref={buttonRef}
					w={loading ? buttonRef.current?.offsetWidth : 'auto'}
					variant="primary"
					onClick={loading ? () => {} : handleSubmit}
					py={loading ? 2 : 0}
				>
					{loading ? <Loader /> : 'Save changes'}
				</Button>
			</Flex>
		</>
	)
}

export default EditForm
