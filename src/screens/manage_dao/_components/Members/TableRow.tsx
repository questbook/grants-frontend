import { useContext, useEffect, useRef, useState } from 'react'
import { EditIcon } from '@chakra-ui/icons'
import { Fade, Flex, GridItem, HStack, IconButton, Image, Spacer, Text, ToastId, Tooltip, useToast, VStack } from '@chakra-ui/react'
import { WorkspaceMemberUpdate } from '@questbook/service-validator-client'
import { useRouter } from 'next/router'
import CopyIcon from 'src/components/ui/copy_icon'
import { defaultChainId } from 'src/constants/chains'
import { WorkspaceMember } from 'src/generated/graphql'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import logger from 'src/libraries/logger'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import EditMemberModal from 'src/screens/manage_dao/_components/Members/EditMemberModal'
import getAvatar from 'src/utils/avatarUtils'
import getErrorMessage from 'src/utils/errorUtils'
import { formatAddress, getExplorerUrlForTxHash, getFormattedFullDateFromUnixTimestamp } from 'src/utils/formattingUtils'
import { bicoDapps, chargeGas, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import NetworkTransactionModal from 'src/v2/components/NetworkTransactionModal'
import ErrorToast from 'src/v2/components/Toasts/errorToast'

interface Props {
    member: Partial<WorkspaceMember>
}

function TableRow({ member }: Props) {
	const buildComponent = () => {
		return (
			<>
				<GridItem
					onMouseEnter={() => setIsHovering(true)}
					onMouseLeave={() => setIsHovering(false)}>
					<Flex
						ml={3}
						my={2}>
						<Flex
							bg='#F0F0F7'
							borderRadius='20px'
							h='40px'
							w='40px'
						>
							<Image
								borderRadius='3xl'
								src={member?.profilePictureIpfsHash ? getUrlForIPFSHash(member.profilePictureIpfsHash) : getAvatar(false, member?.actorId)}
							/>
						</Flex>

						<Flex
							direction='column'
							justify='center'
							align='start'
							ml={2}
						>
							<Text
								fontSize='14px'
								lineHeight='20px'
								fontWeight='500'
								noOfLines={1}
								textOverflow='ellipsis'
							>
								{member?.fullName}
							</Text>
							<Text
								fontSize='12px'
								lineHeight='16px'
								fontWeight='400'
								mt='2px'
								color='#7D7DA0'
								display='flex'
								alignItems='center'
							>
								<Tooltip label={member.actorId}>
									{formatAddress(member.actorId ?? '')}
								</Tooltip>
								<Flex
									display='inline-block'
									ml={2}
								>
									<CopyIcon text={member.actorId ?? ''} />
								</Flex>
							</Text>
						</Flex>
					</Flex>
				</GridItem>
				<GridItem
					onMouseEnter={() => setIsHovering(true)}
					onMouseLeave={() => setIsHovering(false)}>
					<Flex
					>
						{
							member?.accessLevel && (
								<Text
									px={2}
									ml={3}
									variant='v2_body'
									color='white'
									fontWeight='500'
									borderRadius='3px'
									bg={member.accessLevel === 'owner' ? 'yellow.3' : 'crimson.2' }>
									{member.accessLevel[0].toUpperCase() + member.accessLevel.slice(1)}
								</Text>
							)
						}
					</Flex>
				</GridItem>
				<GridItem
					onMouseEnter={() => setIsHovering(true)}
					onMouseLeave={() => setIsHovering(false)}>
					<Text
						ml='12px'
						variant='v2_body'>
						{getFormattedFullDateFromUnixTimestamp(member?.addedAt ?? 0)}
					</Text>
				</GridItem>
				<GridItem>
					<Fade
						onMouseEnter={() => setIsHovering(true)}
						onMouseLeave={() => setIsHovering(false)}
						in={isHovering}>
						<IconButton
							onClick={() => setIsEditMemberModalOpen(true)}
							icon={<EditIcon color='black' />}
							aria-label='' />
					</Fade>
				</GridItem>
				<EditMemberModal
					isSaveEnabled={isBiconomyInitialised}
					onSaveClick={onSaveClick}
					member={member}
					isOpen={isEditMemberModalOpen}
					onClose={() => setIsEditMemberModalOpen(false)} />
				<NetworkTransactionModal
					currentStepIndex={networkTransactionModalStep || 0}
					isOpen={networkTransactionModalStep !== undefined}
					subtitle='Editing member details'
					description={
						<HStack w='100%'>
							<VStack
							// slightly lesser spacing between lines
								spacing='-0.2rem'
								align='left'>
								<Text
									fontWeight='bold'
									color='#3F8792'>
									Editing details for
								</Text>
								<Text
									color='black.3'
									mt={1}
									variant='v2_body'>
									{formatAddress(member?.actorId ?? '')}
								</Text>
							</VStack>

							<Spacer />

							<Image src='/ui_icons/edit_member_header_icon.svg' />
						</HStack>
					}
					steps={
						[
							'Uploading data to IPFS',
							'Waiting for transaction to complete on chain',
							'Indexing transaction on graph protocol',
							'Member details updated',
						]
					}
					viewLink={getExplorerUrlForTxHash(chainId, transactionHash)}
					onClose={
						() => {
							setNetworkTransactionModalStep(undefined)
							setIsEditMemberModalOpen(false)
							router.reload()
						}
					}
				/>
			</>
		)
	}

	const router = useRouter()
	const { webwallet } = useContext(WebwalletContext)!
	const { validatorApi, subgraphClients, workspace } = useContext(ApiClientsContext)!
	const toastRef = useRef<ToastId>()
	const toast = useToast()

	const chainId = getSupportedChainIdFromWorkspace(workspace) ?? defaultChainId

	const { nonce } = useQuestbookAccount()
	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress, loading: biconomyLoading } = useBiconomy({
		chainId: chainId?.toString()!
		// targetContractABI: GrantFactoryAbi,
	})

	const [isHovering, setIsHovering] = useState(false)
	const [isEditMemberModalOpen, setIsEditMemberModalOpen] = useState<boolean>(false)
	const [isBiconomyInitialised, setIsBiconomyInitialised] = useState<boolean>(false)
	const [transactionHash, setTransactionHash] = useState<string>('')
	const [networkTransactionModalStep, setNetworkTransactionModalStep] = useState<number>()

	useEffect(() => {
		if(biconomy && biconomyWalletClient && scwAddress && !biconomyLoading && chainId && biconomy.networkId &&
			biconomy.networkId.toString() === chainId.toString()) {
			setIsBiconomyInitialised(true)
		}
	}, [biconomy, biconomyWalletClient, scwAddress, biconomyLoading, isBiconomyInitialised, chainId])

	const workspaceRegistryContract = useQBContract('workspace', chainId)

	const onSaveClick = async(name: string) => {
		logger.info({ name, chainId: getSupportedChainIdFromWorkspace(workspace) }, 'WorkspaceMember name')

		try {
			setNetworkTransactionModalStep(0)
			if(!webwallet) {
				throw new Error('webwallet not connected')
			}

			if(typeof biconomyWalletClient === 'string' || !biconomyWalletClient || !scwAddress) {
				throw new Error('Biconomy Wallet not initialised properly')
			}

			if(!workspace?.id) {
				throw new Error('Unable to find workspace id')
			}

			const {
				data: { ipfsHash }
			} = await validatorApi.validateWorkspaceMemberUpdate({
				fullName: name,
				// profilePictureIpfsHash: member?.profilePictureIpfsHash,
				publicKey: webwallet.publicKey
			} as WorkspaceMemberUpdate)

			if(!ipfsHash) {
				throw new Error('Failed to upload data to IPFS')
			}

			setNetworkTransactionModalStep(1)

			const methodArgs = [
				workspace.id,
				[member.actorId],
				[member.accessLevel === 'reviewer' ? 1 : 0],
				[true],
				[ipfsHash]
			]

			const response = await sendGaslessTransaction(
				biconomy,
				workspaceRegistryContract,
				'updateWorkspaceMembers',
				methodArgs,
				workspaceRegistryContract.address,
				biconomyWalletClient,
				scwAddress,
				webwallet,
				`${chainId}`,
				bicoDapps[chainId].webHookId,
				nonce
			)

			if(!response) {
				throw new Error('Some error occured on Biconomy side')
			}

			setNetworkTransactionModalStep(2)

			const { txFee, receipt } = await getTransactionDetails(response, chainId.toString())
			setTransactionHash(receipt.transactionHash)
			await subgraphClients[chainId].waitForBlock(receipt?.blockNumber)

			setNetworkTransactionModalStep(3)

			await chargeGas(Number(workspace.id), Number(txFee))
			setNetworkTransactionModalStep(4)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch(e: any) {
			setNetworkTransactionModalStep(undefined)
			const message = getErrorMessage(e)
			toastRef.current = toast({
				position: 'top',
				render: () => ErrorToast({
					content: message,
					close: () => {
						if(toastRef.current) {
							toast.close(toastRef.current)
						}
					},
				}),
			})
		}
	}

	return buildComponent()
}

export default TableRow