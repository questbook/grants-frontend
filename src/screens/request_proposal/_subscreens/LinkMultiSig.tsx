import { ChangeEvent, useEffect, useState } from 'react'
import { BsArrowLeft } from 'react-icons/bs'
import { MdArrowDropDown } from 'react-icons/md'
import { Button, Flex, Image, Select, Text } from '@chakra-ui/react'
import { SupportedSafes } from '@questbook/supported-safes'
import { t } from 'i18next'
import { useRouter } from 'next/router'
import { NetworkType } from 'src/constants/Networks'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import StepIndicator from 'src/libraries/ui/StepIndicator'
// import useSafeUSDBalances from "src/hooks/useSafeUSDBalances";
import VerifySignerModal from 'src/screens/request_proposal/_components/VerifySignerModal'
import SafeSelect, { SafeSelectOption } from 'src/v2/components/Onboarding/CreateDomain/SafeSelect'
// import useSafeOwners from "src/hooks/useSafeOwners";


interface Props {
    multiSigAddress: string
    setMultiSigAddress: (value: string) => void
    step: number
    setStep: (value: number) => void
    selectedSafeNetwork: SafeSelectOption
    setSelectedSafeNetwork: (value: SafeSelectOption) => void
}

function LinkMultiSig({ multiSigAddress, setMultiSigAddress, step, setStep, selectedSafeNetwork, setSelectedSafeNetwork }: Props) {
	console.log('selectedSafeNetwork', selectedSafeNetwork)
	const buildComponent = () => {
		return (
			<>
				<Flex alignSelf='flex-start'>
					<Button
						variant='linkV2'
						leftIcon={<BsArrowLeft />}
						onClick={() => setStep(3)}>
						Back
					</Button>
				</Flex>

                <Flex className="rightScreenCard" flexDirection='column' width='100%' gap={6} alignSelf='flex-start' alignItems='center'>
                    <StepIndicator step={step} />
                    <Flex direction='column' alignItems='center' gap={10}>
                        <Flex direction='column' gap={2}>
                            <Text alignSelf='center' fontWeight='500' fontSize='24px' lineHeight='32px' >Link your multisig</Text>
                            <Text>Use your multisig to payout builders on Questbook</Text>
                        </Flex>

						<Flex
							direction='column'
							gap={1}
							alignItems='center'>
							<Text>
								We currently support
							</Text>
							<Flex gap={4}>
								<Image src='/safes_icons/safe_logo.svg' />
								<Image src='/safes_icons/realms_logo.svg' />
								<Image src='/safes_icons/celo_safe.svg' />
							</Flex>
						</Flex>
						<Flex direction='column'>
							<FlushedInput
								placeholder='Solana or Ethereum address'
								value={multiSigAddress}
								onChange={
									(e) => {
										if(e.target.value.includes(':')) {
											setMultiSigAddress(e.target.value.split(':')[1])
										} else {
											setMultiSigAddress(e.target.value)
										}

									}
								} />

                            {
                                (multiSigAddress && loadingSafeData && safeNetworks.length < 1)
                                    ? <Text variant="footerContent" color='black.3'>Searching for this address on different networks..</Text>
                                    : (multiSigAddress)
                                        ? (<>
                                            <Flex gap={2}>
                                                <Image src="/ui_icons/Done_all_alt_round.svg" color='#273B4A' />
                                                <Text variant="footerContent">Looks like this address is on {safeNetworks.length} network(s).</Text>

												</Flex>

												<SafeSelect
													safesOptions={safeNetworks}
													label=''
													helperText=''
													value={selectedSafeNetwork}
													onChange={
														(safeSelected: SafeSelectOption | undefined) => {
															if(safeSelected) {
																setSelectedSafeNetwork(safeSelected)
															}
														}
													} />
											</>

										)

										: <></>
							}
						</Flex>

						<Button
							variant='primaryMedium'
							isDisabled={!selectedSafeNetwork}
							onClick={() => setIsVerifySignerModalOpen(true)}>
							Link multisig
						</Button>
						<Text>
							Why do I need a multisig?
						</Text>
						<Button
							variant='link'
							onClick={() => setStep(5)}>
							Skip for now
						</Button>
					</Flex>
					<Flex gap={1}>
						<Text
							variant='footerContent'
							color='black.3'>
							By continuing, you accept Questbook’s
						</Text>
						<Text variant='footerContentBold'>
							Terms of Service
						</Text>
					</Flex>
				</Flex>

				<VerifySignerModal
					owners={ selectedSafeNetwork ? selectedSafeNetwork.owners : []}
					setOwnerAddress={(newOwnerAddress) => setOwnerAddress(newOwnerAddress)}
					setIsOwner={
						(newState) => {
							setIsOwner(newState)
						}
					}
					networkType={selectedSafeNetwork?.networkType ?? NetworkType.EVM}
					isOpen={IsVerifySignerModalOpen}
					onClose={() => setIsVerifySignerModalOpen(false)} />

			</>
		)
	}

	const [safeNetworks, setSafeNetworks] = useState<SafeSelectOption[]>([])
	const [IsVerifySignerModalOpen, setIsVerifySignerModalOpen] = useState(false)
	const [isOwner, setIsOwner] = useState(false)
	const [loadingSafeData, setLoadingSafeData] = useState(false)

	const [ownerAddress, setOwnerAddress] = useState('')

	// const { data: safeOwners } = useSafeOwners({ safeAddress: multiSigAddress, chainID: selectedSafeNetwork?.networkId, type: selectedSafeNetwork?.networkType ?? NetworkType.EVM })

	// const { data: safesUSDBalance, loaded: loadedSafesUSDBalance } = useSafeUSDBalances({ safeAddress: multiSigAddress })

	// useEffect(() => {
	//     setSafeNetworks([])
	//     console.log('Multi-sig address entered', multiSigAddress)
	//     console.log('Safe USD balance', safesUSDBalance)
	//     console.log('Loaded Safe USD balance', loadedSafesUSDBalance)
	//     // const networks = []
	//     // for (let i = 0; i < safesUSDBalance.length; i++) {
	//     //     console.log('network', safesUSDBalance[i].networkName)
	//     //     networks.push(safesUSDBalance[i].networkName)

	//     // }
	//     setSafeNetworks(safesUSDBalance)
	// }, [multiSigAddress])

	useEffect(() => {
		console.log('Multi-sig address entered', multiSigAddress)
		const fetchSafeData = async() => {
			const supportedSafes = new SupportedSafes()
			const res = await supportedSafes.getSafeByAddress(multiSigAddress)
			console.log('res safe', res)
			setLoadingSafeData(false)
			setSafeNetworks(res)
		}

		setLoadingSafeData(true)
		fetchSafeData()
	}, [multiSigAddress])

	useEffect(() => {
		if(isOwner) {
			setIsVerifySignerModalOpen(false)
			setStep(5)
		}
	}, [isOwner])

	return buildComponent()
}

export default LinkMultiSig
