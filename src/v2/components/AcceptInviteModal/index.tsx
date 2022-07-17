import { useContext, useEffect, useState } from 'react'
import { Button, HStack, Image, Modal, ModalCloseButton, ModalContent, ModalOverlay, Progress, Spacer, Text, VStack } from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import { ROLES } from 'src/constants'
import { defaultChainId } from 'src/constants/chains'
import { useGetDaoNameLazyQuery } from 'src/generated/graphql'
import { InviteInfo } from 'src/utils/invite'
import { ForwardArrow } from 'src/v2/assets/custom chakra icons/Arrows/ForwardArrow'
import ControlBar from '../ControlBar'

export type AcceptInviteModalProps = {
	inviteInfo?: InviteInfo | undefined
	onClose: () => void
}

export default ({ inviteInfo, onClose }: AcceptInviteModalProps) => {
	const daoName = useDAOName(inviteInfo?.workspaceId, inviteInfo?.chainId)
	const [currentStep, setCurrentStep] = useState(0)

	const role = typeof inviteInfo?.role === 'undefined'
		? ROLES.reviewer
		: inviteInfo.role

	return (
		<Modal
			isCentered={true}
			isOpen={!!inviteInfo}
			size='3xl'
			onClose={onClose}
		>
			<ModalOverlay />
			<ModalContent style={{ overflow: 'clip' }}>
				<ModalCloseButton />
				<HStack
					align='stretch'
					justifyContent='stretch'>
					<Image
						w='50%'
						h='100%'
						src='/accept-invite-side.png' />
					<VStack
						align='start'
						spacing={4}
						p='0.75rem'
						pr='2.5rem'
						pb='2.5rem'
						w='50%'>
						<ControlBar
							points={SECTIONS}
							currentIndex={currentStep} />
						<Text
							fontWeight='bold'
							fontSize='2xl'>
							gm, 👋
							<br />
							Welcome to Questbook!
						</Text>

						<Text fontWeight='bold'>
							You are invited to
							{' '}
							{
								!!daoName
									? daoName
									: (
										<Progress
											w='4rem'
											display='inline-block'
											borderRadius='base'
											isIndeterminate />
									)
							}
						</Text>

						<RoleDataDisplay role={role} />

						<Spacer flexGrow={10} />

						<HStack w='100%'>
							<Spacer />
							<Button
								onClick={() => setCurrentStep(1)}
								colorScheme='brandv2'>
								Continue
								<Spacer w='2' />
								<ForwardArrow
									h='3'
									w='3' />
							</Button>
						</HStack>
					</VStack>
				</HStack>
			</ModalContent>
		</Modal>
	)
}

const RoleDataDisplay = ({ role }: { role: number }) => {
	const roleData = ROLE_DATA[role]

	return (
		<VStack
			align='start'
			spacing='3'>
			<Text
				fontWeight='bold'
				fontSize='sm'>
				As
				{' '}
				{roleData?.vowelStart ? 'an' : 'a'}
				{' '}
				{roleData.title}
				, here’s what you can do:
				<br />
			</Text>

			<VStack
				align='start'
				spacing='2'>
				{
					roleData.thingsCanDo.map(
						({ icon, label }) => {
							return (
								<HStack key={label}>
									<Image
										src={icon}
										w='8'
										h='8' />
									<Text fontSize='0.75rem'>
										{label}
									</Text>
								</HStack>
							)
						}
					)
				}
			</VStack>
		</VStack>
	)
}

const DEFAULT_DAO_NAME = 'A DAO'

const useDAOName = (workspaceId?: number, chainId?: number) => {
	const { subgraphClients } = useContext(ApiClientsContext)!

	const { client } = subgraphClients[chainId?.toString() || '']
		|| subgraphClients[defaultChainId]
	const [daoNameFetch, result] = useGetDaoNameLazyQuery({ client })

	useEffect(() => {
		(async() => {
			if(typeof workspaceId !== 'undefined') {
				const workspaceIdStr = '0x' + workspaceId.toString(16)
				await daoNameFetch({
					variables: { workspaceID: workspaceIdStr }
				})
			}
		})()
	}, [workspaceId, daoNameFetch])

	return result?.error
		? DEFAULT_DAO_NAME
		: result?.data?.workspace?.title
}

const ROLE_DATA = {
	[ROLES.admin]: {
		vowelStart: true,
		title: 'Administrator',
		thingsCanDo: [
			{
				icon: 'role_icons/admin0.svg',
				label: 'Pick your adventure - run grant and bounty programs.'
			},
			{
				icon: 'role_icons/admin1.svg',
				label: 'Review applications'
			},
			{
				icon: 'role_icons/admin2.svg',
				label: 'Disburse funds'
			},
			{
				icon: 'role_icons/admin3.svg',
				label: 'Invite members to your domain'
			}
		]
	},
	[ROLES.reviewer]: {
		vowelStart: false,
		title: 'Reviewer',
		thingsCanDo: [
			{
				icon: 'role_icons/reviewer0.svg',
				label: 'Pick your adventure - review grant applications.'
			},
			{
				icon: 'role_icons/reviewer1.svg',
				label: 'Get paid for it.'
			}
		]
	}
}

const SECTIONS = [
	{ id: 'aboutUs', label: 'About Us' },
	{ id: 'profile', label: 'Profile' }
]