import React, { useEffect, useState } from 'react'
import {
	Box,
	Button,
	Flex,
	Image,
	Link,
	Text,
	ToastId,
	useToast,
} from '@chakra-ui/react'
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js'
import SecondaryDropdown from 'src/components/ui/secondaryDropdown'
import ErrorToast from 'src/components/ui/toasts/errorToast'
import { CHAIN_INFO } from 'src/constants/chains'
import { ALL_SUPPORTED_CHAIN_IDS, SupportedChainId } from 'src/constants/chains'
import config from 'src/constants/config.json'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useChainId from 'src/hooks/utils/useChainId'
import ImageUpload from '../../ui/forms/imageUpload'
import MultiLineInput from '../../ui/forms/multiLineInput'
import RichTextEditor from '../../ui/forms/richTextEditor'
import SingleLineInput from '../../ui/forms/singleLineInput'

function Form({
	onSubmit: onFormSubmit,
}: {
  onSubmit: (data: {
    name: string;
	bio: string;
    about: string;
    image: File | null;
    network: SupportedChainId;
    ownerId: string;
  }) => void;
}) {
	const chainId = useChainId()

	const [daoName, setDaoName] = React.useState('')
	const [daoNameError, setDaoNameError] = React.useState(false)

	const [daoBio, setDaoBio] = React.useState('')
	const [daoBioError, setDaoBioError] = React.useState(false)

	const [daoAbout, setDaoAbout] = React.useState(
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
	const [daoAboutError, setDaoAboutError] = React.useState(false)

	const [image, setImage] = React.useState<string>(config.defaultDAOImagePath)
	const [imageFile, setImageFile] = React.useState<File | null>(null)
	const [imageError, setImageError] = React.useState(false)
	const toast = useToast()
	const toastRef = React.useRef<ToastId>()
	const maxImageSize = 2

	const { data: accountData, nonce } = useQuestbookAccount()
	const { data: networkData, switchNetwork } = useNetwork()
	const [defaultItem, setDefaultItem] = useState<{ icon?: string; label: string, id: number }>()

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if(event.target.files && event.target.files[0]) {
			const img = event.target.files[0]
			if(img.size / 1024 / 1024 <= maxImageSize) {
				setImageFile(img)
				setImage(URL.createObjectURL(img))
				setImageError(false)
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
		let error = false

		const aboutString = await JSON.stringify(
			convertToRaw(daoAbout.getCurrentContent())
		  )

		if(!daoName || daoName.length === 0) {
			setDaoNameError(true)
			error = true
		}

		console.log('GG', chainId)
		if(!chainId) {
			error = true
		}
		// if (image === null || imageFile === null) {
		//   setImageError(true);
		//   error = true;
		// }

		if(error) {
			return
		}

		// console.log("TTTT", chainId, accountData.address);
		console.log(aboutString, daoBio)

		onFormSubmit({
			name: daoName,
			bio: daoBio,
			about: aboutString,
			image: imageFile,
			network: chainId!,
			ownerId: accountData?.address || '0x0000000000000000000000000000000000000000',
		})
	}

	useEffect(() => {
		console.log('chainID -->', chainId)
		if(chainId) {
			const newItem = { icon: CHAIN_INFO[chainId!].icon, label: CHAIN_INFO[chainId!].name, id: chainId }
			setDefaultItem(newItem)
		}

	}, [chainId])

	return (
		<>
			<Flex
				mt={8}
				w="100%"
				maxW="502px"
				flexDirection="column">
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
						errorText="Required"
					/>
					<Box ml={9} />
					<ImageUpload
						image={image}
						onChange={handleImageChange}
						label="Add a logo"
						isError={imageError}
					/>
				</Flex>
				<Flex
					w="100%"
					mt={1}>
					<RichTextEditor
						label="About your Grants DAO"
						placeholder="Write details about your grants, bounty, and other projects."
						value={daoAbout}
						onChange={
							(e: EditorState) => {
								setDaoAbout(e)
							}
						}
						isError={daoAboutError}
						errorText="Required"
						maxLength={800}
					/>
				</Flex>
				<Flex
					w="100%"
					mt={1}>
					<MultiLineInput
						label="Bio"
						placeholder="A small description of your dao in a few sentences"
						value={daoBio}
						onChange={
							(e) => {
								if(daoAboutError) {
									setDaoBioError(false)
								}

								setDaoBio(e.target.value)
							}
						}
						isError={daoBioError}
						errorText="Required"
						maxLength={200}
					/>
				</Flex>
				<Flex
					w="100%"
					mt={1}>
					{/* <SingleLineInput
						label="Network"
						placeholder="Network"
						value={
							chainId
								? CHAIN_INFO[
									chainId
								].name
								: 'Network not supported'
						}
						onChange={() => { }}
						isError={false}
						disabled
						inputRightElement={
							(
								<Tooltip
									icon="/ui_icons/error.svg"
									label={
										chainId
											? highlightWordsInString(
												`Your wallet is connected to the ${CHAIN_INFO[chainId].name
												} Network. Your GrantsDAO will be created on the same network. To create a GrantsDAO on another network, connect a different wallet.`,
												[
													`${CHAIN_INFO[chainId].name
													} Network`,
												],
												'#122224',
											)
											: 'Select a supported network'
									}
								/>
							)
						}
					/> */}
					<SecondaryDropdown
						listItemsMinWidth="100%"
						dropdownWidth='100%'
						listItems={
							ALL_SUPPORTED_CHAIN_IDS.map((chainId) => ({
								id: chainId,
								label: CHAIN_INFO[chainId].name,
								icon: CHAIN_INFO[chainId].icon,
							}))
						}
						defaultItem={defaultItem}
						// value={rewardCurrency}
						onChange={
							(id: SupportedChainId) => {
								if(switchNetwork) {
									console.log(' (CREATE DAO) Switch Network before: ', chainId, id)
									const network = switchNetwork(id)
									console.log(' (CREATE DAO) Switch Network after: ', network, chainId, id)
								}
								// setSelectedNetworkId(id)
							}
						}
					/>
				</Flex>
			</Flex>

			<Text
				display="flex"
				alignItems="center"
				variant="footer"
				mt="51px">
				<Image
					mr={1}
					display="inline-block"
					h="14px"
					w="14px"
					src="/ui_icons/info_brand.svg"
				/>
				{' '}
        By pressing continue you&apos;ll have to approve this transaction in
        your wallet.
				{' '}
				<Link
					mx={1}
					href="https://www.notion.so/questbook/FAQs-206fbcbf55fc482593ef6914f8e04a46"
					isExternal>
          Learn more
					<Image
						ml={1}
						display="inline-block"
						h="10px"
						w="10px"
						src="/ui_icons/link.svg"
					/>
				</Link>
			</Text>

			<Button
				onClick={handleSubmit}
				w="100%"
				maxW="502px"
				variant="primary"
				mt={5}
				mb={16}
			>
        Create Grants DAO
			</Button>
		</>
	)
}

export default Form
