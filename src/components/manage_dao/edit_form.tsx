import React, { useEffect } from 'react'
import {
	Box, Button, Flex, Image, Link,
	Text, } from '@chakra-ui/react'
import { CHAIN_INFO } from 'src/constants/chains'
import config from 'src/constants/config.json'
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

	const [daoAbout, setDaoAbout] = React.useState('')
	const [daoAboutError, setDaoAboutError] = React.useState(false)

	const [supportedNetwork, setSupportedNetwork] = React.useState('')

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

		if(!error) {
			onFormSubmit({
				name: daoName,
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
					maxLength={500}
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
