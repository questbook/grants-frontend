import React, { useState } from 'react'
import {
	Button,
	Flex, Text, } from '@chakra-ui/react'
import Modal from 'src/components/ui/modal'
import AbstractMilestonesTable, { AbstractMilestonesTableProps } from 'src/components/ui/tables/AbstractMilestonesTable'
import MilestoneDoneModalContent from 'src/components/your_applications/manage_grant/modals/modalContentMilestoneDone'
import MilestoneDoneCheckModalContent from 'src/components/your_applications/manage_grant/modals/modalContentMilestoneDoneCheck'
import MilestoneDoneConfirmationModalContent from 'src/components/your_applications/manage_grant/modals/modalContentMilestoneDoneConfirmation'
import { ApplicationMilestone } from 'src/types'
import { getMilestoneTitle, timeToString } from 'src/utils/formattingUtils'

type OpenedModalType = 'milestone-done' | 'milestone-view' | 'milestone-confirm';
type OpenedModal = { type: OpenedModalType, milestone: ApplicationMilestone };

function Table(props: Omit<AbstractMilestonesTableProps, 'renderStatus'>) {
	const [openedModal, setOpenedModal] = useState<OpenedModal>()

	const renderStatus = (milestone: ApplicationMilestone) => {
		const status = milestone.state
		const updatedAtS = milestone.updatedAtS || 0
		if(status === 'submitted') {
			return (
				<Button
					variant='outline'
					color='brand.500'
					fontWeight='500'
					fontSize='14px'
					lineHeight='14px'
					textAlign='center'
					borderRadius={8}
					borderColor='brand.500'
					height='32px'
					onClick={() => setOpenedModal({ type: 'milestone-done', milestone })}
				>
					Mark as Done
				</Button>
			)
		}

		if(status === 'requested') {
			return (
				<Flex
					direction='column'
					justify='end'
					align='end'>
					<Text
						variant='footer'
						whiteSpace='nowrap'
						fontWeight='400'
						color='#A0A7A7'
					>
						Marked as Done on
						{' '}
						<Text
							display='inline-block'
							variant='footer'
							fontWeight='500'>
							{timeToString(updatedAtS * 1000)}
						</Text>
					</Text>
					<Button
						variant='link'
						onClick={() => setOpenedModal({ type: 'milestone-view', milestone })}>
						<Text
							variant='footer'
							color='#6200EE'>
							View
						</Text>
					</Button>
				</Flex>
			)
		}

		return (
			<Flex
				direction='column'
				justify='end'
				align='flex-end'>
				<Text
					textAlign='right'
					variant='footer'
					fontWeight='bold'
					color='#6200EE'
					whiteSpace='nowrap'
				>
					Approved
					{' '}
					<Text
						textAlign='right'
						display='inline-block'
						variant='footer'
						fontWeight='400'
						color='#A0A7A7'
					>
						on
					</Text>
					{' '}
					<Text
						textAlign='right'
						display='inline-block'
						variant='footer'
						fontWeight='500'
					>
						{timeToString(updatedAtS * 1000)}
					</Text>
				</Text>
				<Button
					variant='link'
					onClick={() => setOpenedModal({ type: 'milestone-view', milestone })}>
					<Text
						textAlign='right'
						variant='footer'
						color='#6200EE'>
						View
					</Text>
				</Button>
			</Flex>
		)
	}

	const { chainId } = props
	return (
		<>
			<AbstractMilestonesTable
				{...props}
				renderStatus={renderStatus}
			/>
			<Modal
				isOpen={openedModal?.type === 'milestone-done'}
				onClose={() => setOpenedModal(undefined)}
				title={`Mark ${getMilestoneTitle(openedModal?.milestone)} as Done`}
				alignTitle='center'
			>
				<MilestoneDoneModalContent
					chainId={chainId}
					milestone={openedModal?.milestone}
					onClose={
						() => {
						// eslint-disable-next-line react/destructuring-assignment
							props.refetch()
							setOpenedModal({ type: 'milestone-confirm', milestone: openedModal!.milestone })
						}
					}
				/>
			</Modal>
			<Modal
				isOpen={openedModal?.type === 'milestone-view'}
				onClose={() => setOpenedModal(undefined)}
				title={getMilestoneTitle(openedModal?.milestone)}
			>
				<MilestoneDoneCheckModalContent
					milestone={openedModal?.milestone}
					onClose={() => setOpenedModal(undefined)}
				/>
			</Modal>
			<Modal
				isOpen={openedModal?.type === 'milestone-confirm'}
				onClose={() => setOpenedModal(undefined)}
				title=''
			>
				<MilestoneDoneConfirmationModalContent
					milestone={openedModal?.milestone}
					onClose={() => setOpenedModal(undefined)}
				/>
			</Modal>
		</>
	)
}

export default Table
