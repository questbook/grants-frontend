import React from 'react'
import { Box, Button, Flex, Image, Spacer, Text } from '@chakra-ui/react'
import Loader from 'src/components/ui/loader'
import DaoImageUpload from 'src/v2/components/Onboarding/UI/Misc/DaoImageUpload'

interface Props {
	domainImageFile: File | null
	onImageFileChange: (image: File | null) => void
	safeAddress: string
	safeChainIcon: string
	domainName: string
	onCreateDomain: () => void
	isVerified: boolean
	signerAddress?: string
	isBiconomyLoading: boolean
	isBiconomyInitialised: boolean
}

function ConfirmData({ domainImageFile, safeAddress, safeChainIcon, domainName, onCreateDomain, isVerified, signerAddress, isBiconomyInitialised, isBiconomyLoading }: Props) {
	const [newDomainImageFile, setNewDomainImageFile] = React.useState<File | null>(null)
	const formatAddress = (address: string) => `${address.substring(0, 4)}......${address.substring(address.length - 4)}`

	React.useEffect(() => {
		if(domainImageFile && !newDomainImageFile) {
			setNewDomainImageFile(domainImageFile)
		}
	}, [domainImageFile])

	return (
		<>
			<Text
				variant='v2_heading_3'
				fontWeight='500'>
				My domain
			</Text>
			<Text
				mt='2'
				variant='v2_heading_3'
				fontWeight='500'>
				{domainName}
			</Text>
			<Flex mt='70'>
				<Flex
					justify='space-between'>
					<Flex align='center'>
						<Image
							src={safeChainIcon}
							boxSize='24px' />
						{
							isVerified && signerAddress && (
								<Flex align='center'>
									<Text
										ml={1}
										variant='v2_title'>
										{formatAddress(safeAddress)}
									</Text>
									<Text
										ml={2}
										variant='v2_metadata'
										fontWeight='500'>
										(Verified signer:
										{formatAddress(signerAddress)}
										)
									</Text>
									<Image
										ml={2}
										src='/ui_icons/verified-signer.svg'
										boxSize='16px' />
								</Flex>
							)
						}
						{
							!isVerified && (
								<Text
									ml={1}
									variant='v2_title'>
									{safeAddress}
								</Text>
							)
						}
					</Flex>


				</Flex>
				<Spacer />
				<Flex
					mt='-5'
				// align='start'
				// justify='end'
				>
					<DaoImageUpload
						daoImageFile={newDomainImageFile}
						setDaoImageFile={setNewDomainImageFile} />
				</Flex>
			</Flex>
			<Button
				disabled={!isBiconomyInitialised}
				variant='primaryV2'
				mx='auto'
				mt='auto'
				w='53%'
				onClick={onCreateDomain}>
				Create Domain
				<Box w={2} />
				{
					isBiconomyLoading && (
						<Loader size={5} />
					)
				}
			</Button>
			{
				!isVerified && (
					<Text
						variant='v2_body'
						color='black.2'
						mt={2}
						textAlign='center'>
						You will be asked to verify that you’re a signer on the safe.
						{' '}
					</Text>
				)
			}
		</>
	)
}

export default ConfirmData