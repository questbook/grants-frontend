import { useEffect, useState } from 'react'
import { Box, Flex, HStack, Image, Spacer, Text } from '@chakra-ui/react'
import { Organization } from 'src/v2/assets/custom chakra icons/Organization'
import AccountDetails from 'src/v2/components/NavBar/AccountDetails'
import NetworkTransactionModal from 'src/v2/components/NetworkTransactionModal'
import { ConfirmData, DomainName, SafeAddress } from 'src/v2/components/Onboarding/CreateDomain'
import SuccessfulDomainCreationModal from 'src/v2/components/Onboarding/CreateDomain/SuccessfulDomainCreationModal'
import QuestbookLogo from 'src/v2/components/QuestbookLogo'
import VerifySignerModal from 'src/v2/components/VerifySignerModal'

const OnboardingCreateDomain = () => {
	const [step, setStep] = useState(0)
	const [currentStep, setCurrentStep] = useState<number>()

	// State variables for step 0 and 1
	const [safeAddress, setSafeAddress] = useState('')
	const [isSafeAddressPasted, setIsSafeAddressPasted] = useState(false)
	const [isSafeAddressVerified, setIsSafeAddressVerified] = useState(false)
	const [isSafesLoading, setIsSafesLoading] = useState(true)

	// State variables for step 2
	const [domainName, setDomainName] = useState('')
	const [isDomainNameVerified, setIsDomainNameVerified] = useState(false)

	// State variables for step 3 and 4
	const [daoImageFile, setDaoImageFile] = useState<File | null>(null)
	const [isOwner, setIsOwner] = useState(false)
	const [isVerifySignerModalOpen, setIsVerifySignerModalOpen] = useState(false)

	const [isDomainCreationSuccessful, setIsDomainCreationSuccessful] = useState(false)

	useEffect(() => {
		if(!setIsSafeAddressVerified) {
			return
		}

		if(safeAddress.length > 0) {
			setIsSafeAddressVerified(true)
			setIsSafeAddressPasted(true)
		} else {
			setIsSafeAddressVerified(false)
			setIsSafeAddressPasted(false)
		}
	}, [safeAddress])

	useEffect(() => {
		if(!setIsDomainNameVerified) {
			return
		}

		setIsDomainNameVerified(domainName.length > 0)
	}, [domainName])

	const steps = [
		<SafeAddress
			key={0}
			step={step}
			safeAddress={safeAddress}
			setSafeAddress={setSafeAddress}
			isPasted={isSafeAddressPasted}
			setIsPasted={setIsSafeAddressPasted}
			isVerified={isSafeAddressVerified}
			setIsVerified={setIsSafeAddressVerified}
			isLoading={isSafesLoading}
			setIsLoading={setIsSafesLoading}
			onContinue={
				() => {
					if(step === 0) {
						setStep(1)
					} else if(step === 1) {
						setStep(2)
					}
				}
			} />, <DomainName
			key={1}
			domainName={domainName}
			onChange={
				(e) => {
					setDomainName(e.target.value)
				}
			}
			isVerified={isDomainNameVerified}
			setIsVerified={setIsDomainNameVerified}
			onContinue={
				() => {
					setStep(3)
				}
			} />, <ConfirmData
			key={2}
			safeAddress={safeAddress}
			safeChainIcon="/ui_icons/gnosis.svg"
			domainName={domainName}
			domainNetwork="Polygon"
			domainNetworkIcon='/ui_icons/polygon.svg'
			domainImageFile={daoImageFile}
			onImageFileChange={(image) => setDaoImageFile(image)}
			onCreateDomain={
				() => {
					console.log('Is Owner: ', isOwner)
					if(!isOwner && !isVerifySignerModalOpen) {
						setIsVerifySignerModalOpen(true)
						setIsOwner(true)
					} else {
						// This would open the Network Transaction Modal
						// setCurrentStep(1)
						// This would open the final successful domain creation modal
						setIsDomainCreationSuccessful(true)
						setIsOwner(false)
					}
				}
			}
			isVerified={isOwner}
			signerAddress="0xE6379586E5D8350038E9126c5553c0C77549B6c3" />
	]


	return (
		<>
			<Flex
				position="absolute"
				left={0}
				right={0}
				top={0}
				bottom={0}
				zIndex={-1} >
				<Image
					src="/background/create-domain.jpg"
					w="100%"
					h="100%" />
			</Flex>

			<Flex
				direction="column"
				w="100vw"
				h="100vh">
				<Flex
					w="100vw"
					h="64px"
					align="center"
					px="42px">
					<QuestbookLogo color='white' />
					<Box mr="auto" />
					<AccountDetails />
				</Flex>

				{

					<Flex
						key={step}
						w="47%"
						h={step === 0 ? '43%' : (step === 1 ? '55%' : (step === 2 ? '38%' : (isOwner ? '36%' : '40%')))}
						mx="auto"
						mt="15vh"
						bg="white"
						p={6}
						boxShadow="2.2px 4.43px 44.33px rgba(31, 31, 51, 0.05)"
						borderRadius="4px"
						direction="column">
						{step <= 1 ? steps[0] : (step === 2 ? steps[1] : steps[2])}
					</Flex>

				}
			</Flex>
			<NetworkTransactionModal
				isOpen={currentStep !== undefined}
				subtitle='creating DAO'
				description={
					<HStack w='100%'>
						<Text
							fontWeight={'500'}
							fontSize={'17px'}
						>
							{domainName}
						</Text>

						<Spacer />

						<Box>
							{
								daoImageFile ? (
									<Image
										objectFit="cover"
										src={URL.createObjectURL(daoImageFile)}
										w="100%"
										h="100%"
										minH={'48px'}
										minW={'48px'}
									/>
								) : (

									<Organization
										color={'#389373'}
										boxSize={8} />
								)
							}
						</Box>
					</HStack>
				}
				currentStepIndex={currentStep || 0}
				steps={
					[
						'Confirming Transaction',
						'Complete Transaction',
						'Complete indexing',
						'Create domain on the network',
						'Your domain is now on-chain'
					]
				} />
			<VerifySignerModal
				isOpen={isVerifySignerModalOpen}
				onClose={
					() => {
						setIsVerifySignerModalOpen(false)
					}
				} />
			<SuccessfulDomainCreationModal
				isOpen={isDomainCreationSuccessful}
				onClose={
					() => {
						setIsDomainCreationSuccessful(false)
					}
				} />
		</>
	)
}

// OnboardingCreateDomain.getLayout = function(page: ReactElement) {
// 	return (
// 		<NavbarLayout renderSidebar={false}>
// 			{page}
// 		</NavbarLayout>
// 	)
// }

export default OnboardingCreateDomain
