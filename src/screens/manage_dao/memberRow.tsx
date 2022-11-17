import { CloseIcon, EditIcon } from '@chakra-ui/icons'
import { Fade, Flex, GridItem, HStack, IconButton, Image, Spacer, Text, Tooltip, VStack } from '@chakra-ui/react'
import CopyIcon from 'src/components/ui/copy_icon'
import { WorkspaceMember } from 'src/generated/graphql'
import EditMemberModal from 'src/screens/manage_dao/_components/EditMemberModal'
import useMemberRow from 'src/screens/manage_dao/_hooks/useMemberRow'
import getAvatar from 'src/utils/avatarUtils'
import { formatAddress, getExplorerUrlForTxHash, getFormattedFullDateFromUnixTimestamp } from 'src/utils/formattingUtils'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import NetworkTransactionModal from 'src/v2/components/NetworkTransactionModal'

interface Props {
    member: Partial<WorkspaceMember>
}

function MemberRow({ member }: Props) {
	const buildComponent = () => {
		return (
			<>
				{/* Member Details */}
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
								<Text
									ml={1}
									fontStyle='italic'
									fontWeight='400'>
									{member?.actorId === scwAddress?.toLowerCase() && '(You)'}
								</Text>
							</Text>
						</Flex>
					</Flex>
				</GridItem>

				{/* Access Level */}
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

				{/* Joined on  */}
				<GridItem
					onMouseEnter={() => setIsHovering(true)}
					onMouseLeave={() => setIsHovering(false)}>
					<Text
						ml='12px'
						variant='v2_body'>
						{getFormattedFullDateFromUnixTimestamp(member?.addedAt ?? 0)}
					</Text>
				</GridItem>

				{/* Can access encrypted data  */}
				<GridItem
					onMouseEnter={() => setIsHovering(true)}
					onMouseLeave={() => setIsHovering(false)}>
					<Flex
						align='center'
						justify='center'>
						<Tooltip
							label={getEncryptedTooltipLabel()}>
							<Image
								onClick={
									async() => {
										if(member?.actorId !== scwAddress?.toLowerCase() || canAccessEncryptedData()) {
											return
										}

										setType('pub-key')
										await onSaveClick()
									}
								}
								cursor={canAccessEncryptedData() || member?.actorId !== scwAddress?.toLowerCase() ? 'default' : 'pointer'}
								src={canAccessEncryptedData() ? '/ui_icons/success_toast_icon.svg' : '/ui_icons/error_toast_icon.svg'} />
						</Tooltip>

					</Flex>

				</GridItem>

				{/* Action items */}
				<GridItem>
					<Fade
						onMouseEnter={() => setIsHovering(true)}
						onMouseLeave={() => setIsHovering(false)}
						in={isHovering}>
						<Flex
							align='center'
							justify='center'>
							<IconButton
								onClick={
									async() => {
										await onSaveClick(undefined, false)
									}
								}
								icon={<CloseIcon color='black' />}
								aria-label='' />
							<IconButton
								ml={2}
								onClick={
									() => {
										setType('edit')
										setIsEditMemberModalOpen(true)
									}
								}
								icon={<EditIcon color='black' />}
								aria-label='' />
						</Flex>

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
					subtitle={type === 'edit' ? 'Editing member details' : 'Providing encrypted data access'}
					description={
						<HStack w='100%'>
							<VStack
							// slightly lesser spacing between lines
								spacing='-0.2rem'
								align='left'>
								<Text
									fontWeight='bold'
									color='#3F8792'>
									{type === 'edit' ? 'Editing details for' : 'Providing access to'}
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
							type === 'edit' ? 'Member details updated' : 'Access enabled to encrypted data',
						]
					}
					viewLink={getExplorerUrlForTxHash(chainId, transactionHash)}
					onClose={onNetworkModalClose}
				/>
			</>
		)
	}

	const {
		isHovering,
		setIsHovering,
		isEditMemberModalOpen,
		setIsEditMemberModalOpen,
		type,
		setType,
		chainId,
		transactionHash,
		scwAddress,
		isBiconomyInitialised,
		networkTransactionModalStep,
		onSaveClick,
		canAccessEncryptedData,
		getEncryptedTooltipLabel,
		onNetworkModalClose
	} = useMemberRow(member)

	return buildComponent()
}

export default MemberRow