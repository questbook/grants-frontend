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
import {
	ContentState,
	convertFromRaw,
	convertToRaw,
	EditorState,
} from 'draft-js'
// CONSTANTS AND TYPES
import { CHAIN_INFO } from 'src/constants/chains'
import config from 'src/constants/config'
// UTILS AND TOOLS
import useUpdateWorkspace from 'src/hooks/useUpdateWorkspace'
import { PartnersProps, SettingsForm, Workspace } from 'src/types'
import { getUrlForIPFSHash, uploadToIPFS } from 'src/utils/ipfsUtils'
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

function EditForm({ workspaceData }: EditFormProps) {
	const toast = useToast()

	const [editedFormData, setEditedFormData] = useState<SettingsForm>()
	const [editData, setEditData] = useState<WorkspaceUpdateRequest>()
	const [editError, setEditError] = useState<EditErrors>({})
	const [newAbout, setNewAbout] = useState(
		EditorState.createWithContent(
			convertFromRaw({
				entityMap: {},
				blocks: [
          {
          	text: '',
          	key: 'foo',
          	type: 'unstyled',
          	entityRanges: [],
          } as any,
				],
			})
		)
	)

	const [partnersRequired, setPartnersRequired] = React.useState(false)
	const [partners, setPartners] = React.useState<PartnersProps[] | undefined>([])
	const [changedPartners, setChangedPartners] = React.useState(false)
	const [changedAbout, setChangedAbout] = React.useState(false)
	const [changedPartnersImage, setChangedPartnersImage] = React.useState(false)

	React.useEffect(() => {
		console.log(partners)
	}, [partners])

	const [txnData, txnLink, loading] = useUpdateWorkspace(editData as any)

	const [aboutData, setAboutData] = useState(
		useMemo(() => {
			try {
				const data = JSON.parse(editedFormData?.about!)
				return EditorState.createWithContent(convertFromRaw(data))
			} catch(e) {
				if(editedFormData?.about) {
					return EditorState.createWithContent(
						ContentState.createFromText(editedFormData.about)
					)
				}

				return EditorState.createEmpty()
			}
		}, [editedFormData?.about])
	)

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

	const updateFormData = (update: Partial<SettingsForm>) => {
		// eslint-disable-next-line guard-for-in, no-restricted-syntax
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
			updateFormData({ [key]: URL.createObjectURL(img).toString() })
		}
	}

	const handlePartnerImageChange = (
		event: React.ChangeEvent<HTMLInputElement>,
		index: number
	) => {

		if(event.target.files && event.target.files[0]) {
			const img = event.target.files[0]
			const maxImageSize = 2
			if(img.size / 1024 / 1024 <= maxImageSize) {
				const oldPartners = [...partners!]
				oldPartners[index].image = URL.createObjectURL(img)
				setPartners(oldPartners)
				setChangedPartners(true)
			} else {
				toastRef.current = toast({
					position: 'top',
					render: () => ErrorToast({
						content: `Image size exceeds ${maxImageSize} MB`,
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
		if(changedAbout) {
			const newAboutString = await JSON.stringify(
				convertToRaw(newAbout.getCurrentContent())
			)

			const newAboutHash = (await uploadToIPFS(newAboutString)).hash
			updateFormData({ about: newAboutHash })
		}

		if(changedPartners || changedPartnersImage) {
			const oldPartners = [...partners!]
			let partnerImageHash = ''
			await Promise.all(oldPartners.map(async(partner, index) => {
				partnerImageHash = (await uploadToIPFS(partner?.image!)).hash
				oldPartners[index].image = partnerImageHash
				updateFormData({ partners: oldPartners })
			}))
		}

		if(!editedFormData?.bio?.length) {
			return updateEditError('bio', 'Please enter a bio')
		}

		if(!editedFormData?.name?.length) {
			return updateEditError('name', 'Please enter a name')
		}

		if(!editedFormData?.about?.startsWith('Qm')) {
			return updateEditError('about', 'Please enter about')
		}

		console.log(editedFormData)

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

		return setEditData(data)
	}

	useEffect(() => {
		setEditedFormData(workspaceDataToSettingsForm(workspaceData))
	}, [workspaceData])

	useEffect(() => {
		if(!changedPartners) {
			setPartners(editedFormData?.partners)
			console.log(partners, editedFormData)
		}
	}, [editedFormData])

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
					image={editedFormData?.image || config.defaultDAOImagePath}
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
				<RichTextEditor
					label="About your Grants DAO"
					placeholder="Write details about your grants, bounty, and other projects."
					value={changedAbout ? newAbout : aboutData}
					onChange={
						(e: EditorState) => {
							setNewAbout(e)
							setChangedAbout(true)
						}
					}
					isError={hasError('about')}
					errorText="Required"
					maxLength={800}
				/>
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
				partners?.map((partner: any, index: any) => (
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

												const newPartners = [...partners]
												newPartners.splice(index, 1)
												setPartners(newPartners)
												setChangedPartners(true)
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
								value={partners[index].name}
								onChange={
									(e) => {
										const newPartners = [...partners]
										newPartners[index].name = e.target.value
										setPartners(newPartners)
										setChangedPartners(true)
									}
								}
								placeholder="e.g. Partner DAO"
								errorText="Required"
								disabled={!partnersRequired}
							/>
							<Box
								mt="-2.2rem"
								mb="-10rem">
								<ImageUpload
									image={changedPartners ? partners[index]?.image! : getUrlForIPFSHash(partners[index]?.image!)}
									isError={false}
									onChange={
										(e) => {
											handlePartnerImageChange(e, index)
											setChangedPartnersImage(true)
										}
									}
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
									value={partners[index].industry}
									onChange={
										(e) => {
											const newPartners = [...partners]
											newPartners[index].industry = e.target.value
											setPartners(newPartners as any)
											setChangedPartners(true)
										}
									}
									placeholder="e.g. Security"
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
									value={partners[index].website}
									onChange={
										(e) => {
											const newPartners = [...partners]
											newPartners[index].website = e.target.value
											setPartners(newPartners)
											setChangedPartners(true)
										}
									}
									placeholder="e.g. www.example.com"
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
								...partners!,
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
            Add another service partner
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
