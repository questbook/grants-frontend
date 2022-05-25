import React, { useState } from 'react'
import {
	Button, Flex, Image,
	Menu, MenuButton, MenuItem, MenuList, Text, } from '@chakra-ui/react'
import moment from 'moment'
import AbstractMilestonesTable, { AbstractMilestonesTableProps } from 'src/components/ui/tables/AbstractMilestonesTable'
import { ApplicationMilestone } from 'src/types'
import { getMilestoneTitle } from 'src/utils/formattingUtils'
import Modal from '../../../ui/modal'
import MilestoneDoneModalContent from '../modals/modalContentMilestoneDone'
import MilestoneDoneConfirmationModalContent from '../modals/modalContentMilestoneDoneConfirmation'
import MilestoneViewModalContent from '../modals/modalContentMilestoneView'
// src/components/your_grants/manage_grant/modals/sendFundModalContent

type OpenedModalType = 'milestone-view' | 'milestone-done' | 'milestone-done-confirm';
type OpenedModal = { type: OpenedModalType, milestone: ApplicationMilestone };

function Milestones(props: Omit<AbstractMilestonesTableProps, 'renderStatus'>) {
	const [openedModal, setOpenedModal] = useState<OpenedModal>()

	const { sendFundOpen } = props

	const renderStatus = (milestone: ApplicationMilestone) => {
		const status = milestone.state
		const updatedAtS = milestone.updatedAtS || 0
		if(status === 'submitted' || status === 'requested') {
			return (
				<Flex direction="column">
					<Menu placement="bottom">
						<MenuButton
							as={Button}
							aria-label="View More Options"
							rightIcon={<Image src="/ui_icons/dropdown_arrow.svg" />}
							variant="outline"
							color="brand.500"
							fontWeight="500"
							fontSize="14px"
							lineHeight="14px"
							textAlign="center"
							borderRadius={8}
							borderColor="brand.500"
							_focus={{}}
						>
              Manage
						</MenuButton>
						<MenuList
							minW="164px"
							p={0}>
							<MenuItem
								icon={<Image src="/ui_icons/see.svg" />}
								onClick={() => setOpenedModal({ type: 'milestone-done', milestone })}>
								<Text
									fontSize="14px"
									fontWeight="400"
									lineHeight="20px"
									color="#122224">
Approve Milestone
								</Text>
							</MenuItem>
							{/* TODO: Need to change the icons */}
							{
								status === 'requested' ? (
									<MenuItem
										icon={<Image src="/ui_icons/see.svg" />}
										onClick={() => setOpenedModal({ type: 'milestone-view', milestone })}>
										<Text
											fontSize="14px"
											fontWeight="400"
											lineHeight="20px"
											color="#122224">
View Grantee Submission
										</Text>
									</MenuItem>
								) : (
									<MenuItem disabled>
										<Text
											fontSize="14px"
											fontWeight="400"
											lineHeight="20px"
											color="#122224">
No Grantee Submission
										</Text>
									</MenuItem>
								)
							}
						</MenuList>
					</Menu>
				</Flex>
			)
		}

		return (
			<Flex
				direction="column"
				justify="end"
				align="flex-end">
				<Text
					textAlign="right"
					variant="footer"
					fontWeight="bold"
					color="#6200EE"
					whiteSpace="nowrap"
				>
          Approved
					{' '}
					<Text
						textAlign="right"
						display="inline-block"
						variant="footer"
						fontWeight="400"
						color="#A0A7A7"
					>
            on
					</Text>
					{' '}
					<Text
						textAlign="right"
						display="inline-block"
						variant="footer"
						fontWeight="500"
					>
						{moment(new Date(updatedAtS * 1000)).format('MMM DD, YYYY')}
					</Text>
				</Text>
				<Button
					variant="link"
					_focus={{}}
					onClick={() => setOpenedModal({ type: 'milestone-view', milestone })}>
					<Text
						textAlign="right"
						variant="footer"
						color="#6200EE">
            View
					</Text>
				</Button>
			</Flex>
		)
	}

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
				alignTitle="center"
			>
				<MilestoneDoneModalContent
					milestone={openedModal?.milestone}
					done={
						() => {
						// eslint-disable-next-line react/destructuring-assignment
							props.refetch()
							setOpenedModal({ type: 'milestone-done-confirm', milestone: openedModal!.milestone })
						}
					}
				/>
			</Modal>
			<Modal
				isOpen={openedModal?.type === 'milestone-view'}
				onClose={() => setOpenedModal(undefined)}
				title={getMilestoneTitle(openedModal?.milestone)}
			>
				<MilestoneViewModalContent
					milestone={openedModal?.milestone}
					onClose={() => setOpenedModal(undefined)}
				/>
			</Modal>
			<Modal
				isOpen={openedModal?.type === 'milestone-done-confirm'}
				onClose={() => setOpenedModal(undefined)}
				title=""
			>
				<MilestoneDoneConfirmationModalContent
					milestone={openedModal?.milestone}
					onClose={() => setOpenedModal(undefined)}
					openSendFund={sendFundOpen!}
				/>
			</Modal>
		</>
	)
}

export default Milestones
