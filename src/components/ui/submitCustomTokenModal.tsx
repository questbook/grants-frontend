import React, { useEffect, useState } from 'react'
import {
	Box, Button, Flex, ListItem, ModalBody, ToastId, UnorderedList, useToast,
} from '@chakra-ui/react'
import { Token, WorkspaceUpdateRequest } from '@questbook/service-validator-client'
import ImageUpload from 'src/components/ui/forms/imageUpload'
import SingleLineInput from 'src/components/ui/forms/singleLineInput'
import Loader from 'src/components/ui/loader'
import Modal from 'src/components/ui/modal'
import ErrorToast from 'src/components/ui/toasts/errorToast'
import config from 'src/constants/config.json'
import useUpdateWorkspace from 'src/hooks/useUpdateWorkspace'
import { getUrlForIPFSHash, uploadToIPFS } from 'src/utils/ipfsUtils'
import { isValidEthereumAddress } from 'src/utils/validationUtils'
import SuccessToast from 'src/v2/components/Toasts/successToast'

interface ModalProps {
  isModalOpen: boolean
  setIsModalOpen: (isModalOpen: boolean) => void
  setRewardCurrency: (rewardCurrency: string) => void
  setRewardCurrencyAddress: (rewardCurrencyAddress: string) => void
  setRewardToken: (rewardToken: Token) => void
  setSupportedCurrenciesList: (supportedCurrencyList: Array<any>) => void
  supportedCurrenciesList: TokenDisplay[]
  // setIsJustAddedToken: (isJustAddedToken: boolean) => void;
  setIsJustAddedToken: React.Dispatch<React.SetStateAction<boolean>>
}

type TokenDisplay = {
  address: string
  decimals: number
  icon: string
  id: string
  label: string
};

function CustomTokenModal({
	isModalOpen,
	setIsModalOpen,
	setRewardCurrency,
	setRewardCurrencyAddress,
	setRewardToken,
	supportedCurrenciesList,
	setSupportedCurrenciesList,
	setIsJustAddedToken,
}: ModalProps) {
	const [tokenAddress, setTokenAddress] = useState<string>('')
	// const [tokenName, setTokenName] = useState<string>('');
	const [tokenSymbol, setTokenSymbol] = useState<string>('')
	const [tokenDecimal, setTokenDecimal] = useState<string>('')
	const [tokenIconIPFSURI, setTokenIconIPFSURI] = useState<string | undefined>('')
	const [tokenIconHash, setTokenIconHash] = useState<string>('')
	// const [newCurrency, setNewCurrency] = useState<Token>();
	const [tokenAddressError, setTokenAddressError] = useState<boolean>(false)
	const [tokenIconError, setTokenIconError] = useState<boolean>(true)
	const [image, setImage] = useState<string>(config.defaultTokenUploadImagePath)
	const [imageFile, setImageFile] = useState<File | null>(null)

	const [tokenData, setTokenData] = useState<WorkspaceUpdateRequest | any>()
	const [txnData, txnLink, loading, isBiconomyInitialised] = useUpdateWorkspace(tokenData)

	const toast = useToast()
	const toastRef = React.useRef<ToastId>()

	useEffect(() => {
		if(txnData) {
			toastRef.current = toast({
				position: 'top',
				render: () => SuccessToast({
					content: 'New token added at ' + txnLink,
					close: () => {
						if(toastRef.current) {
							toast.close(toastRef.current)
						}
					},
				}),
			})
		}
	}, [txnData])

	const validateTokenAddress = () => {
		if(!tokenAddress || !isValidEthereumAddress(tokenAddress)) {
			setTokenAddressError(true)
		}
	}

	// eslint-disable-next-line consistent-return
	const uploadLogo = async() => {
		let imageHash
		let imageIPFSURL: string
		// console.log('Uploading...')
		if(imageFile) {
			imageHash = (await uploadToIPFS(imageFile)).hash
			imageIPFSURL = getUrlForIPFSHash(imageHash)
			setTokenIconIPFSURI(imageIPFSURL)
			setTokenIconHash(imageHash)
			// setTokenIconError(false);
			return imageIPFSURL
		}

		toastRef.current = toast({
			position: 'top',
			render: () => ErrorToast({
				content: 'Please upload token icon',
				close: () => {
					if(toastRef.current) {
						toast.close(toastRef.current)
					}
				},
			}),
		})
	}

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if(event.target.files && event.target.files[0]) {
			const img = event.target.files[0]
			setImageFile(img)
			setImage(URL.createObjectURL(img))

			const logoImage = new Image()
			logoImage.src = URL.createObjectURL(img)
			logoImage.onload = () => {
				if(logoImage.height < 100 || logoImage.width < 100) {
					setTokenIconError(true)
					toastRef.current = toast({
						position: 'top',
						render: () => ErrorToast({
							content: 'Please upload image of size 100 X 100 px',
							close: () => {
								if(toastRef.current) {
									toast.close(toastRef.current)
								}
							},
						}),
					})
				} else {
					setTokenIconError(false)
				}
			}
		}
	}

	const configureNewToken = (token: Token): TokenDisplay => {
		const newToken: TokenDisplay = {
			id: token.address,
			address: token.address,
			decimals: parseInt(token.decimal, 10),
			label: token.label,
			icon: getUrlForIPFSHash(token.iconHash),
		}
		return newToken
	}

	const handleSubmit = () => {
		validateTokenAddress()
		if(tokenIconError) {
			toastRef.current = toast({
				position: 'top',
				render: () => ErrorToast({
					content: 'Please upload image of size 100 X 100 px',
					close: () => {
						if(toastRef.current) {
							toast.close(toastRef.current)
						}
					},
				}),
			})
		}

		if(!tokenAddressError && !tokenIconError) {
			uploadLogo().then((imgURI) => setTokenIconIPFSURI(imgURI))
		}

		if(!tokenAddressError && !tokenIconError && tokenIconIPFSURI && tokenAddress && tokenSymbol) {
			setRewardCurrency(tokenSymbol)
			setRewardCurrencyAddress(tokenAddress)
			const newToken = {
				address: tokenAddress,
				decimal: tokenDecimal,
				iconHash: tokenIconHash,
				id: tokenAddress,
				label: tokenSymbol,
			}
			// console.log('Supported Currencies list', supportedCurrenciesList)
			setTokenData({ tokens: [newToken] })
			setRewardToken(newToken)
			// // console.log('Logging type of setIsJUstAddedToken', typeof setIsJustAddedToken)
			setIsJustAddedToken(true)
			const configuredToken = configureNewToken(newToken)
			setSupportedCurrenciesList([...supportedCurrenciesList, configuredToken])
			// console.log('New list of supported currencies', [...supportedCurrenciesList, configuredToken])
		}
	}

	useEffect(() => {
		if(txnData) {
			setIsModalOpen(false)
		}

	}, [toast, txnData])
	return (
		<Modal
			isOpen={isModalOpen}
			onClose={
				() => {
					setIsModalOpen(false); setImage(config.defaultTokenUploadImagePath)
				}
			}
			title='Add token'
			modalWidth={566}>
			<ModalBody px={10}>
				<Flex direction='column'>
					<Box my={4} />
					<SingleLineInput
						label='Contract Address *'
						placeholder='0xb794f5e74279579268'
						subtext=''
						value={tokenAddress}
						onChange={
							(e) => {
								if(tokenAddressError) {
									setTokenAddressError(false)
								}

								setTokenAddress(e.target.value)
							}
						}
						isError={tokenAddressError}
						errorText='Address required with proper format'
					/>

					<Box my={4} />
					<SingleLineInput
						label='Token Symbol *'
						placeholder='e.g. ETH'
						subtext=''
						value={tokenSymbol}
						onChange={
							(e) => {
								setTokenSymbol(e.target.value)
							}
						}
					/>
					<Box my={4} />
					<SingleLineInput
						label='Decimal *'
						placeholder='e.g. 18'
						subtext=''
						value={tokenDecimal}
						onChange={
							(e) => {
								setTokenDecimal(e.target.value)
							}
						}
						type='number'
					/>
					<Box my={4} />
					<Flex
						direction='row'
						my={4}>
						<ImageUpload
							image={image}
							isError={false}
							onChange={handleImageChange}
							label='Add a logo' />
						<Box
							bg='#EBF9FC'
							borderWidth='1px'
							borderRadius='lg'
							borderColor='#98C6CD'
							ml={8}
							p={8}
							alignItems='center'>
							<UnorderedList>
								<ListItem>
									Upload logo of atleast 100 X 100 px size
								</ListItem>
								<ListItem>
									.jpeg, .png and .svg formats allowed
								</ListItem>
							</UnorderedList>
						</Box>
					</Flex>
					<Box my={4} />
					<Button
						disabled={!isBiconomyInitialised}
						variant='primary'
						onClick={handleSubmit}>
						{loading ? <Loader /> : 'Add token'}
					</Button>
					<Box my={4} />
				</Flex>
			</ModalBody>
		</Modal>
	)
}

export default CustomTokenModal
