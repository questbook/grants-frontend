import { ReactElement, useContext, useEffect, useMemo, useState } from 'react'
import { Button, Flex, Text } from '@chakra-ui/react'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import { useQuery } from 'src/libraries/hooks/useQuery'
import logger from 'src/libraries/logger'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import { WebwalletContext } from 'src/pages/_app'
import ProofQrModal from 'src/screens/profile/_components/ProofQrModal'
import { generateProof } from 'src/screens/profile/hooks/generateProof'
import { getMigrationStatusQuery } from 'src/screens/recover_proposal/data/getMigrationStatusQuery'

function RecoverProposal() {

	const buildComponent = () => {
		return view()
	}


	const view = () => {
		return (
			<Flex
				w='100%'
				h='calc(100vh - 64px)'
				justify='center'
				align='center'>
				<ProofQrModal
					isOpen={isQrModal}
					onClose={
						() => {
							setQrCode('')
							setIsQrModal(false)
						}
					}
					proofQr={qrCode}
				/>
				<Flex
					bg='white'
					w={['95%', '60%']}
					border='1px solid #E7E4DD'
					boxShadow='0px 2px 4px rgba(29, 25, 25, 0.1)'
					h='90%'
					pt={8}
					p={[4, 8]}
					direction='column'
					align='center'
					overflowY='auto'>
					<Text
						variant='heading3'
						fontWeight='500'>
						Recover your proposal
					</Text>
					<Text
						mt={1}
						fontSize={['sm', 'md']}
						color='gray.500'>
						Migrate your proposal to a new wallet address
					</Text>
					<Flex
						w={['95%', '80%']}
						mt={8}
						px={6}
						py={12}
						direction='column'
						border='1px solid #E7E4DD'>
						<Text>
							Proposal URL
						</Text>
						<FlushedInput
							w='100%'
							flexProps={{ w: '100%', mt: 5 }}
							placeholder='Proposal URL (e.g. https://questbook.app/dashboard/?proposalId=0x01&grantId=0x01&chainId=10)'
							borderBottom='1px solid #E7E4DD'
							textAlign='left'
							fontSize='16px'
							lineHeight='24px'
							fontWeight='400'
							value={url}
							errorBorderColor='red.500'
							isInvalid={error}
							onChange={
								(e) => {
									setURL(e.target.value)
								}
							} />
						{
							error && (
								<Text
									color='red'
									fontSize='12px'>
									Invalid proposal URL
								</Text>
							)
						}
						<Text mt={8}>
							Wallet Address (migrate to)
						</Text>
						<FlushedInput
							w='100%'
							flexProps={{ w: '100%', mt: 5 }}
							placeholder='your wallet address'
							borderBottom='1px solid #E7E4DD'
							value={scwAddress}
							textAlign='left'
							fontSize='16px'
							lineHeight='24px'
							fontWeight='400'
							disabled={true}
							 />
						<Text
							fontSize='sm'
							color='gray.500'
							mt={2}>
							Please make sure to save your privateKey safe somewhere before migrating your proposal.
						</Text>

					</Flex>
					<Text
						mt={8}
						w={['95%', '80%']}
						fontSize='sm'
						color='gray.500'
						size='sm'>
						*Please note that we use Reclaim Protocol (zero-knowledge proofs) to verify your ownership of the proposal using the associated email address. You will be required to sign in with this email to prove ownership.
					</Text>
					<Button
						mt={8}
						variant='primaryLarge'
						isLoading={!scwAddress || isLoading}
						loadingText={isLoading ? 'Migrating proposal' : 'Loading your wallet'}
						isDisabled={isDisabled}
						onClick={onCreateClick}>
						<Text color='white'>
							Migrate to new wallet
						</Text>
					</Button>
				</Flex>
			</Flex>
		)
	}

	const { scwAddress, webwallet } = useContext(WebwalletContext)!
	const toast = useCustomToast()

	const [url, setURL] = useState<string>('')
	const [error, setError] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [qrCode, setQrCode] = useState<string>('')
	const [isQrModal, setIsQrModal] = useState<boolean>(false)
	const [migrationId, setMigrationId] = useState<string>('')

	const { fetchMore: fetchMigrationStatus } = useQuery({
		query: getMigrationStatusQuery,
	})

	const getMigrationStatus = async() => {
		try {
			const fetch = await fetchMigrationStatus({ id: migrationId }, true) as { migration: { status: string } }

			if(fetch?.migration?.status === 'completed') {
				toast({
					title: 'Proposal migrated successfully',
					description: 'Proposal migrated successfully',
					status: 'success',
					duration: 5000,
					isClosable: true
				})
				setURL('')
				setMigrationId('')
				setIsLoading(false)
				setIsQrModal(false)
			}

			if(fetch?.migration?.status === 'failed') {
				toast({
					title: 'Proposal migration failed (please check your email)',
					description: 'Proposal migration failed (please check your email)',
					status: 'error',
					duration: 5000,
					isClosable: true
				})
				setMigrationId('')
				setIsLoading(false)
				setIsQrModal(false)
				window.open(url, '_blank')
			}
		} catch(e) {
			logger.error(e)
		}
	}


	const validateProposalUrl = (url: string) => {
		try {
			const urlObj = new URL(url)
			const params = new URLSearchParams(urlObj.search)

			const proposalId = params.get('proposalId')
			const grantId = params.get('grantId')
			const chainId = params.get('chainId')
			if(!proposalId || !grantId || !chainId) {
				setError(true)
				return
			}

			setError(false)
		} catch(e) {
			setError(true)
		}

	}

	const isDisabled = useMemo(() => {
		if(!scwAddress || isLoading) {
			return true
		}

		if(url === '') {
			return true
		}

		if(error) {
			return true
		}

		return false
	}, [url])

	const onCreateClick = async() => {
		setIsLoading(true)
		setIsQrModal(true)
		const proposalId = new URL(url).searchParams.get('proposalId')
		if(!proposalId) {
			toast({
				title: 'Error',
				description: 'Invalid proposal URL',
				status: 'error',
				duration: 5000,
				isClosable: true
			})
			setIsLoading(false)
			return
		}

		const proof = await generateProof('email', scwAddress!, proposalId, webwallet?.publicKey)
		if(!proof || proof.error) {
			setIsLoading(false)
			setIsQrModal(false)
			await toast({
				title: 'Error',
				description: 'Failed to generate proof request',
				status: 'error',
				duration: 5000,
				isClosable: true
			})
			return
		}

		setMigrationId(proof.migrationId)
		setQrCode(proof.requestUrl)
	}

	useEffect(() => {
		if(url !== '') {
			validateProposalUrl(url)
		}
	}, [url])


	useEffect(() => {
		if(migrationId !== '') {
			getMigrationStatus()
			const interval = setInterval(() => {
				getMigrationStatus()
			}, 5000)
			return () => clearInterval(interval)
		}
	}, [migrationId, isQrModal])


	return buildComponent()
}

RecoverProposal.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

export default RecoverProposal