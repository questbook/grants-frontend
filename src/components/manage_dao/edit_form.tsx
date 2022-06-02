import React, { useEffect } from 'react'
import {
	Box, Button, Flex, Image, Link, Divider, Switch,
	Text, } from '@chakra-ui/react'
import { CHAIN_INFO } from 'src/constants/chainInfo'
import config from 'src/constants/config'
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils'
import CoverUpload from '../ui/forms/coverUpload'
import ImageUpload from '../ui/forms/imageUpload'
import MultiLineInput from '../ui/forms/multiLineInput'
import SingleLineInput from '../ui/forms/singleLineInput'
import Loader from '../ui/loader'

function EditForm({
	onSubmit: onFormSubmit,
	formData,
	hasClicked,
}: {
  onSubmit: (data: {
    name: string;
		bio: string;
    about: string;
    image?: File;
    coverImage?: File;
    twitterHandle?: string;
    discordHandle?: string;
    telegramChannel?: string;
  }) => void;
  formData: any;
  hasClicked: boolean;
}) {
	const [daoName, setDaoName] = React.useState('')
	const [daoNameError, setDaoNameError] = React.useState(false)

	const [daoAbout, setDaoAbout] = React.useState('');
	const [daoAboutError, setDaoAboutError] = React.useState(false);

	const [daoBio, setDaoBio] = React.useState('')
	const [daoBioError, setDaoBioError] = React.useState(false)

	const [supportedNetwork, setSupportedNetwork] = React.useState('')

	const [partnersRequired, setPartnersRequired] = React.useState(false)
	const [partners, setPartners] = React.useState<any>([
		{
			name: '',
			nameError: false,
			industry: '',
			industryError: false,
			website: '',
			websiteError: false
		},
	]);

	const [image, setImage] = React.useState<string>(config.defaultDAOImagePath)
	const [imageFile, setImageFile] = React.useState<File | null>(null)

	const [coverImage, setCoverImage] = React.useState<string | null>('')
	const [coverImageFile, setCoverImageFile] = React.useState<File | null>(null)

	const [twitterHandle, setTwitterHandle] = React.useState('')
	const [twitterHandleError, setTwitterHandleError] = React.useState(false)

	const [discordHandle, setDiscordHandle] = React.useState('')
	const [discordHandleError, setDiscordHandleError] = React.useState(false)

	const [telegramChannel, setTelegramChannel] = React.useState('')
	const [telegramChannelError, setTelegramChannelError] = React.useState(false)

	useEffect(() => {
		if(!formData) {
			return
		}

		const supportedChainId = getSupportedChainIdFromSupportedNetwork(formData.supportedNetwork)
		const networkName = supportedChainId ? CHAIN_INFO[supportedChainId].name : 'Unsupported Network'
		setDaoName(formData.name)
		setDaoAbout(formData.about)
		setDaoBio(formData.bio)
		setSupportedNetwork(networkName)
		setImage(formData.image)
		setCoverImage(formData.coverImage)
		setTwitterHandle(formData.twitterHandle)
		setDiscordHandle(formData.discordHandle)
		setTelegramChannel(formData.telegramChannel)
	}, [formData])

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if(event.target.files && event.target.files[0]) {
			const img = event.target.files[0]
			setImageFile(img)
			setImage(URL.createObjectURL(img))
		}
	}

	const handleCoverImageChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		if(event.target.files && event.target.files[0]) {
			const img = event.target.files[0]
			setCoverImageFile(img)
			setCoverImage(URL.createObjectURL(img))
		}
	}

	const handleSubmit = () => {
		let error = false
		if(!daoName || daoName.length === 0) {
			setDaoNameError(true)
			error = true
		}

		if(!daoAbout || daoAbout.length === 0) {
			setDaoAboutError(true)
			error = true
		}

		if(!daoBio || daoBio.length === 0) {
			setDaoBioError(true)
			error = true
		}

		if(!error) {
			onFormSubmit({
				name: daoName,
				bio: daoBio,
				about: daoAbout,
				image: imageFile!,
				coverImage: coverImageFile!,
				twitterHandle,
				discordHandle,
				telegramChannel,
			})
		}
	}

	const buttonRef = React.useRef<HTMLButtonElement>(null)

	return (
		<>
			<Flex
				w="100%"
				mt={8}
				alignItems="flex-start">
				<SingleLineInput
					label="Grants DAO Name"
					placeholder="Nouns DAO"
					subtext="Letters, spaces, and numbers are allowed."
					value={daoName}
					onChange={
						(e) => {
							if(daoNameError) {
								setDaoNameError(false)
							}

							setDaoName(e.target.value)
						}
					}
					isError={daoNameError}
				/>
				<Box ml={9} />
				<ImageUpload
					image={image}
					isError={false}
					onChange={handleImageChange}
					label="Add a logo"
				/>
			</Flex>
			<Flex
				w="100%"
				h="50%"
			>
			<MultiLineInput
				label="Bio"
				placeholder="Describe your DAO in 200 characters"
				value={daoBio}
				onChange={
					(e) => {
						if(daoBioError) {
							setDaoBioError(false)
						}

						setDaoBio(e.target.value)
					}
				}
				isError={daoBioError}
				maxLength={200}
				subtext={null}
			/>
			</Flex>
			<Flex
				w="100%"
				mt={1}>
				<MultiLineInput
					label="About your Grants DAO"
					placeholder="Sample"
					value={daoAbout}
					onChange={
						(e) => {
							if(daoAboutError) {
								setDaoAboutError(false)
							}

							setDaoAbout(e.target.value)
						}
					}
					isError={daoAboutError}
					maxLength={800}
					subtext={null}
				/>
			</Flex>
			<Flex
				w="100%"
				mt={1}>
				<SingleLineInput
					label="Network"
					placeholder="Network"
					value={supportedNetwork}
					onChange={() => {}}
					isError={false}
					disabled
				/>
			</Flex>
			<Flex
				mt={4}
				gap="2"
				justifyContent="space-between">
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
						<Text
							color="#717A7C"
							fontSize="14px"
							lineHeight="20px">
							You can add their names, logo, and a link to their site.
						</Text>
					</Flex>
				</Flex>
			<Flex
				justifyContent="center"
				gap={2}
				alignItems="center">
				<Switch
					id="encrypt"
					isChecked={partnersRequired}
					onChange={
						(e) => {
							setPartnersRequired(e.target.checked)
							const newRubrics = partners.map((partner: any) => ({
								...partner,
								nameError: false,
							}))
							setPartners(newRubrics)
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
		</Flex>

		{
			partners.map((partner: any, index: any) => (
				<Box>
					<Flex
						mt={4}
						gap="2"
						alignItems="flex-start"
						opacity={partnersRequired ? 1 : 0.4}
					>
						<Flex
							direction="row"
							flex={0.3327}>
							<Text
								mt="18px"
								color="#122224"
								fontWeight="bold"
								fontSize="16px"
								lineHeight="20px"
							>
								Name
							</Text>
						</Flex>
						<Flex
							justifyContent="center"
							gap={2}
							alignItems="center"
							flex={0.6673}>
							<SingleLineInput
								value={partners[index].name}
								onChange={
									(e) => {
										const newPartners = [...partners]
										newPartners[index].name = e.target.value
										newPartners[index].nameError = false
										setPartners(newPartners)
									}
								}
								placeholder="Name"
								isError={partners[index].nameError}
								errorText="Required"
								disabled={!partnersRequired}
							/>
						</Flex>
					</Flex>

					<Flex
						mt={6}
						gap="2"
						alignItems="flex-start"
						opacity={partnersRequired ? 1 : 0.4}>
					<Flex
						mt={2}
						gap="2"
						justifyContent="flex-end">
						<Box
							onClick={
								() => {
									if(!partnersRequired) {
										return
									}

									const newPartners = [...partners]
									newPartners.splice(index, 1)
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
								src="/ui_icons/delete_red.svg"
								mr="6px"
							/>
							<Text
								fontWeight="500"
								fontSize="14px"
								color="#DF5252"
								lineHeight="20px">
							Delete
							</Text>
						</Box>
					</Flex>
					</Flex>
					<Divider mt={4} />
				</Box>
			))
		}

			<Flex
				w="100%"
				mt={10}>
				<CoverUpload
					image={coverImage}
					isError={false}
					onChange={handleCoverImageChange}
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
					value={twitterHandle}
					onChange={
						(e) => {
							if(twitterHandleError) {
								setTwitterHandleError(false)
							}

							setTwitterHandle(e.target.value)
						}
					}
					isError={twitterHandleError}
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
					value={discordHandle}
					onChange={
						(e) => {
							if(discordHandleError) {
								setDiscordHandleError(false)
							}

							setDiscordHandle(e.target.value)
						}
					}
					isError={discordHandleError}
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
					value={telegramChannel}
					onChange={
						(e) => {
							if(telegramChannelError) {
								setTelegramChannelError(false)
							}

							setTelegramChannel(e.target.value)
						}
					}
					isError={telegramChannelError}
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
						mb="-2px" />
					{' '}
          By pressing the button Save Changes below
          you&apos;ll have to approve this transaction in your wallet.
					{' '}
					<Link
						href="https://www.notion.so/questbook/FAQs-206fbcbf55fc482593ef6914f8e04a46"
						isExternal>
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
					w={hasClicked ? buttonRef.current?.offsetWidth : 'auto'}
					variant="primary"
					onClick={hasClicked ? () => {} : handleSubmit}
					py={hasClicked ? 2 : 0}>
					{hasClicked ? <Loader /> : 'Save changes'}
				</Button>
			</Flex>
		</>
	)
}

export default EditForm
