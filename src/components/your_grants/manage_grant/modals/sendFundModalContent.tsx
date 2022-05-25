import React, { useContext, useEffect, useState } from 'react'
import {
	Box,
	Button,
	Checkbox,
	Divider,
	Flex,
	Heading,
	Image,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	ModalBody,
	Text,
	ToastId,
	useToast,
} from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import { ApiClientsContext } from 'pages/_app'
import Loader from 'src/components/ui/loader'
import useDisburseP2PReward from 'src/hooks/useDisburseP2PReward'
import useDisburseReward from 'src/hooks/useDisburseReward'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import { useContract, useNetwork, useSigner } from 'wagmi'
import ERC20ABI from '../../../../contracts/abi/ERC20.json'
import { formatAmount, parseAmount } from '../../../../utils/formattingUtils'
import Dropdown from '../../../ui/forms/dropdown'
import SingleLineInput from '../../../ui/forms/singleLineInput'
import InfoToast from '../../../ui/infoToast'

interface Props {
  isOpen: boolean;
  onClose: () => void;
  rewardAsset: {
    address: string;
    committed: BigNumber;
    label: string;
    icon: string;
    decimals?: number;
  };
  contractFunding: string;
  milestones: any[];
  applicationId: string;
  grantId: string;
}

function ModalContent({
	isOpen,
	onClose,
	rewardAsset,
	contractFunding,
	milestones,
	applicationId,
	grantId,
}: Props) {
	const apiClients = useContext(ApiClientsContext)!
	const { workspace } = apiClients
	const [checkedItems, setCheckedItems] = React.useState([true, false])
	const [chosen, setChosen] = React.useState(-1)
	const [selectedMilestone, setSelectedMilestone] = React.useState(-1)
	const [funding, setFunding] = React.useState('')
	const [error, setError] = React.useState(false)
	const [rewardAssetDecimals, setRewardAssetDecimals] = React.useState(0)
	const [submitClicked, setSubmitClicked] = useState(false)
	const [submitClickedP2P, setSubmitClickedP2P] = useState(false)

	const [walletBalance, setWalletBalance] = React.useState(0)
	// const toast = useToast();
	const [signerStates] = useSigner()
	const [, switchNetwork] = useNetwork()
	const rewardAssetContract = useContract({
		addressOrName:
      rewardAsset.address ?? '0x0000000000000000000000000000000000000000',
		contractInterface: ERC20ABI,
		signerOrProvider: signerStates.data,
	})

	const toast = useToast()
	const toastRef = React.useRef<ToastId>()

	const [disburseAmount, setDisburseAmount] = useState<any>()
	const [disburseData, disburseDataLink, disburseLoading, disburseError] = useDisburseReward(
		disburseAmount,
		grantId,
		applicationId,
		selectedMilestone === -1
			? undefined
			: milestones[selectedMilestone].id.split('.')[1],
		rewardAsset.address,
		submitClicked,
		setSubmitClicked,
	)

	useEffect(() => {
		if(workspace && switchNetwork && isOpen) {
			const chainId = getSupportedChainIdFromWorkspace(workspace)
			switchNetwork(chainId!)
		}
	}, [isOpen, switchNetwork, workspace])

	useEffect(() => {
		// console.log(depositTransactionData);
		if(disburseData) {
			onClose()
			setDisburseAmount(undefined)
			setFunding('')
			toastRef.current = toast({
				position: 'top',
				render: () => (
					<InfoToast
						link={disburseDataLink}
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
		} else if(disburseError) {
			setDisburseAmount(undefined)
			setFunding('')
		}

	}, [toast, disburseData, disburseError])

	const sendFundsFromContract = async() => {
		let hasError = false

		if(selectedMilestone === -1) {
			hasError = true
		}

		if(funding === '') {
			setError(true)
			hasError = true
		}

		if(hasError) {
			return
		}

		setSubmitClicked(true)
		setDisburseAmount(parseAmount(funding, rewardAsset.address))
	}

	const [disburseP2PAmount, setDisburseP2PAmount] = useState<any>()
	const [
		disburseP2PData,
		disburseP2PDataLink,
		disburseP2PLoading,
		disburseP2PError,
	] = useDisburseP2PReward(
		disburseP2PAmount,
		grantId,
		applicationId,
		selectedMilestone === -1
			? undefined
			: milestones[selectedMilestone].id.split('.')[1],
		rewardAsset.address,
		submitClickedP2P,
		setSubmitClickedP2P,
	)

	useEffect(() => {
		// console.log(depositTransactionData);
		if(disburseP2PData) {
			onClose()
			setDisburseP2PAmount(undefined)
			setFunding('')
			toastRef.current = toast({
				position: 'top',
				render: () => (
					<InfoToast
						link={disburseP2PDataLink}
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
		} else if(disburseP2PError) {
			setDisburseP2PAmount(undefined)
			setFunding('')
		}

	}, [toast, disburseP2PData, disburseP2PError])

	const sendFundsFromWallet = async() => {
		let hasError = false

		if(selectedMilestone === -1) {
			hasError = true
		}

		if(funding === '') {
			setError(true)
			hasError = true
		}

		if(hasError) {
			return
		}

		setSubmitClickedP2P(true)
		setDisburseP2PAmount(parseAmount(funding, rewardAsset.address, rewardAssetDecimals))
	}

	useEffect(() => {
		(async function() {
			try {
				if(!rewardAssetContract.provider) {
					return
				}

				const assetDecimal = await rewardAssetContract.decimals()
				setRewardAssetDecimals(assetDecimal)
				const tempAddress = await signerStates.data?.getAddress()
				const tempWalletBalance = await rewardAssetContract.balanceOf(
					// signerStates.data._address,
					tempAddress,
				)
				// console.log('tempAddress', tempAddress);
				// console.log(tempWalletBalance);
				setWalletBalance(tempWalletBalance)
			} catch(e) {
				console.error(e)
			}
		}())
	}, [signerStates, rewardAssetContract])

	return (
		<ModalBody>
			{
				chosen === -1 && (
					<Flex
						direction="column"
						justify="start"
						align="start">
						<Heading
							variant="applicationHeading"
							mt={4}>
            Use funds from the grant smart contract
						</Heading>
						<Flex
							direction="row"
							justify="space-between"
							align="center"
							w="100%"
							mt={9}
						>
							<Flex
								direction="row"
								justify="start"
								align="center">
								<Image src={rewardAsset.icon} />
								<Flex
									direction="column"
									ml={2}>
									<Text
										variant="applicationText"
										fontWeight="700">
                  Funds Available
									</Text>
									<Text
										fontSize="14px"
										lineHeight="20px"
										fontWeight="700"
										color="brand.500"
									>
										{
											`${formatAmount(contractFunding.toString(), rewardAssetDecimals)} ${
												rewardAsset?.label
											}`
										}
									</Text>
								</Flex>
							</Flex>
							<Checkbox
								m={0}
								p={0}
								colorScheme="brand"
								isChecked={checkedItems[0]}
								onChange={() => setCheckedItems([true, false])}
							/>
						</Flex>

						<Divider mt={6} />
						<Heading
							variant="applicationHeading"
							mt={6}>
            Use funds from the wallet linked to your account
						</Heading>
						<Flex
							direction="row"
							justify="space-between"
							align="center"
							w="100%"
							mt={9}
						>
							<Flex
								direction="row"
								justify="start"
								align="center">
								<Image src={rewardAsset.icon} />
								<Flex
									direction="column"
									ml={2}>
									<Text
										variant="applicationText"
										fontWeight="700">
                  Funds Available
									</Text>
									<Text
										fontSize="14px"
										lineHeight="20px"
										fontWeight="700"
										color="brand.500"
									>
										{
											`${formatAmount(walletBalance.toString(), rewardAssetDecimals)} ${
												rewardAsset?.label
											}`
										}
									</Text>
								</Flex>
							</Flex>
							<Checkbox
								m={0}
								p={0}
								colorScheme="brand"
								isChecked={checkedItems[1]}
								onChange={() => setCheckedItems([false, true])}
							/>
						</Flex>
						<Divider mt={6} />
						<Button
							variant="primary"
							w="100%"
							my={8}
							onClick={
								() => {
									setDisburseAmount(undefined)
									setDisburseP2PAmount(undefined)
									if(checkedItems[0]) {
										setChosen(0)
									} else {
										setChosen(1)
									}
								}
							}
						>
            Continue
						</Button>
					</Flex>
				)
			}

			{
				chosen === 0 && (
					<Flex
						direction="column"
						justify="start"
						align="start">
						<Heading
							variant="applicationHeading"
							mt={4}>
            Sending funds from grant smart contract
						</Heading>
						<Button
							mt={1}
							variant="link"
							_focus={{}}
							onClick={
								() => {
									setChosen(-1)
									setSelectedMilestone(-1)
									setFunding('')
								}
							}
						>
							<Heading
								variant="applicationHeading"
								color="brand.500">
              Change
							</Heading>
						</Button>

						<Flex
							direction="row"
							justify="start"
							align="center"
							mt={6}>
							<Image src={rewardAsset.icon} />
							<Flex
								direction="column"
								ml={2}>
								<Text
									variant="applicationText"
									fontWeight="700">
                Funds Available
								</Text>
								<Text
									fontSize="14px"
									lineHeight="20px"
									fontWeight="700"
									color="brand.500"
								>
									{
										`${formatAmount(contractFunding.toString(), rewardAssetDecimals)} ${
											rewardAsset?.label
										}`
									}
								</Text>
							</Flex>
						</Flex>

						<Box mt={8} />
						<Heading
							variant="applicationHeading"
							color="#122224">
            Milestone
						</Heading>
						<Menu matchWidth>
							<MenuButton
								w="100%"
								as={Button}
								color="#122224"
								background="#E8E9E9"
								_disabled={{ color: '#A0A7A7', background: '#F3F4F4' }}
								rightIcon={<Image src="/ui_icons/dropdown_arrow.svg" />}
								textAlign="left"
							>
								<Text
									variant="applicationText"
									color={selectedMilestone === -1 ? '#717A7C' : '#122224'}
								>
									{
										selectedMilestone === -1
											? 'Select a milestone'
											: `Milestone ${selectedMilestone + 1}: ${
												milestones[selectedMilestone].title
											}`
									}
								</Text>
							</MenuButton>
							<MenuList>
								{
									milestones.map((milestone, index) => (
										<MenuItem
											key={milestone.id}
											onClick={() => setSelectedMilestone(index)}>
											Milestone
											{' '}
											{index + 1}
											{': '}
											{milestone.title}
										</MenuItem>
									))
								}
							</MenuList>
						</Menu>

						<Flex
							direction="row"
							w="100%"
							alignItems="start"
							justify="space-between"
							mt={8}
						>
							<Flex
								w="70%"
								direction="column">
								<SingleLineInput
									label="Amount to be disbursed"
									placeholder="100"
									value={funding}
									onChange={
										(e) => {
											if(error) {
												setError(false)
											}

											setFunding(e.target.value)
										}
									}
									isError={error}
									errorText="Required"
									type="number"
								/>
							</Flex>
							<Flex
								direction="column"
								w="25%"
								mt="20px">
								<Dropdown
									listItemsMinWidth="132px"
									listItems={
										[
											{
												icon: rewardAsset?.icon,
												label: rewardAsset?.label,
											},
										]
									}
								/>
							</Flex>
						</Flex>

						<Button
							variant="primary"
							w="100%"
							my={10}
							onClick={disburseLoading ? () => {} : sendFundsFromContract}
							py={disburseLoading ? 2 : 0}
						>
							{disburseLoading ? <Loader /> : 'Send Funds'}
						</Button>
					</Flex>
				)
			}

			{
				chosen === 1 && (
					<Flex
						direction="column"
						justify="start"
						align="start">
						<Heading
							variant="applicationHeading"
							mt={4}>
            Sending funds from wallet linked to your account
						</Heading>
						<Button
							mt={1}
							variant="link"
							_focus={{}}
							onClick={
								() => {
									setChosen(-1)
									setSelectedMilestone(-1)
									setFunding('')
								}
							}
						>
							<Heading
								variant="applicationHeading"
								color="brand.500">
              Change
							</Heading>
						</Button>

						<Flex
							direction="row"
							justify="start"
							align="center"
							mt={6}>
							<Image src={rewardAsset.icon} />
							<Flex
								direction="column"
								ml={2}>
								<Text
									variant="applicationText"
									fontWeight="700">
                Funds Available
								</Text>
								<Text
									fontSize="14px"
									lineHeight="20px"
									fontWeight="700"
									color="brand.500"
								>
									{
										`${formatAmount(walletBalance.toString(), rewardAssetDecimals)} ${
											rewardAsset?.label
										}`
									}
								</Text>
							</Flex>
						</Flex>

						<Box mt={8} />
						<Heading
							variant="applicationHeading"
							color="#122224">
            Milestone
						</Heading>
						<Menu matchWidth>
							<MenuButton
								w="100%"
								as={Button}
								rightIcon={<Image src="/ui_icons/dropdown_arrow.svg" />}
								textAlign="left"
							>
								<Text
									variant="applicationText"
									color={selectedMilestone === -1 ? '#717A7C' : '#122224'}
								>
									{
										selectedMilestone === -1
											? 'Select a milestone'
											: `Milestone ${selectedMilestone + 1}: ${
												milestones[selectedMilestone].title
											}`
									}
								</Text>
							</MenuButton>
							<MenuList>
								{
									milestones.map((milestone, index) => (
										<MenuItem
											key={milestone.id}
											onClick={() => setSelectedMilestone(index)}>
											Milestone
											{' '}
											{index + 1}
											{': '}
											{milestone.title}
										</MenuItem>
									))
								}
							</MenuList>
						</Menu>

						<Flex
							direction="row"
							w="100%"
							alignItems="start"
							justify="space-between"
							mt={8}
						>
							<Flex
								w="70%"
								direction="column">
								<SingleLineInput
									label="Amount to be disbursed"
									placeholder="100"
									value={funding}
									onChange={
										(e) => {
											if(error) {
												setError(false)
											}

											setFunding(e.target.value)
										}
									}
									isError={error}
									errorText="Required"
									type="number"
								/>
							</Flex>
							<Flex
								direction="column"
								w="25%"
								mt="20px">
								<Dropdown
									listItemsMinWidth="132px"
									listItems={
										[
											{
												icon: rewardAsset?.icon,
												label: rewardAsset?.label,
											},
										]
									}
								/>
							</Flex>
						</Flex>

						<Button
							variant="primary"
							w="100%"
							my={10}
							onClick={disburseP2PLoading ? () => {} : sendFundsFromWallet}
							py={disburseP2PLoading ? 2 : 0}
						>
							{disburseP2PLoading ? <Loader /> : 'Send Funds'}
						</Button>
					</Flex>
				)
			}
		</ModalBody>
	)
}

export default ModalContent
