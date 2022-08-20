import React, { useContext, useEffect, useState } from 'react'
import {
	Box,
	Button,
	Checkbox,
	Drawer,
	DrawerContent,
	DrawerOverlay,
	Flex,
	IconButton,
	Image,
	Text,
} from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import { SupportedChainId } from 'src/constants/chains'
import useAssignReviewers from 'src/hooks/useAssignReviewers'
import useCustomToast from 'src/hooks/utils/useCustomToast'
import { truncateStringFromMiddle } from 'src/utils/formattingUtils'
import SingleLineInput from '../ui/forms/singleLineInput'
import Loader from '../ui/loader'

function ReviewDrawer({
	reviewDrawerOpen,
	setReviewDrawerOpen,
	initialReviewers,
	grantAddress,
	chainId,
	workspaceId,
	applicationId,
	onClose,
	reviews,
}: {
  reviewDrawerOpen: boolean;
  setReviewDrawerOpen: (reviewDrawerOpen: boolean) => void;
  grantAddress: string;
  chainId: SupportedChainId | undefined;
  workspaceId: string;
  initialReviewers: any[];
  applicationId: string;
  onClose: () => void;
  reviews: any[];
}) {
	const { workspace } = useContext(ApiClientsContext)!
	const [isReviewer, setIsReviewer] = React.useState<{
    [key: string]: boolean;
  }>({})
	const [editedReviewData, setEditedReviewData] = React.useState<any>()

	// useEffect(() => {
	//   if (!workspace) return;
	//   if (!initialReviewers) return;
	//   const newIsReviewer = [] as any[];
	//   workspace.members.forEach((member: any) => {
	//     newIsReviewer.push(
	//       initialReviewers.find((r: any) => r.address === member.address) !== undefined,
	//     );
	//   });
	//   setIsReviewer(newIsReviewer);
	// }, [initialReviewers, workspace]);

	// const handleOnSubmit = () => {
	//   setEditedReviewData({
	//     reviewers: workspace?.members.map((reviewer) => reviewer.id.split('.')[1]),
	//     active: isReviewer,
	//   });
	// };

	useEffect(() => {
		if(!workspace) {
			return
		}

		if(!initialReviewers) {
			return
		}

		const newIsReviewer: { [key: string]: boolean } = {}
		workspace.members
			.forEach((member: any) => {
				console.log(member)
				console.log(initialReviewers)
				// eslint-disable-next-line max-len
				newIsReviewer[member.actorId] = initialReviewers.find((r: any) => r.id.split('.')[1] === member.actorId)
        !== undefined
			})
		console.log(newIsReviewer)
		setIsReviewer(newIsReviewer)
	}, [initialReviewers, workspace, reviews])

	const handleOnSubmit = () => {
		setEditedReviewData({
			reviewers: workspace?.members
				.map(
					(reviewer) => reviewer.id.split('.')[1],
				),
			active: Object.values(isReviewer),
		})
	}

	const [
		data,
		transactionLink,
		loading,
	] = useAssignReviewers(
		editedReviewData,
		chainId,
		workspaceId,
		grantAddress,
		applicationId,
	)
	// ] = useSetReviews(editedReviewData, chainId, workspaceId, grantAddress);

	const { setRefresh } = useCustomToast(transactionLink)

	useEffect(() => {
		setRefresh(true)
	}, [transactionLink])

	const [emailSearchText, setEmailSearchText] = useState('')

	useEffect(() => {
		if(data) {
			setReviewDrawerOpen(false)
		}
	}, [data, setReviewDrawerOpen])

	return (
		<Drawer
			isOpen={reviewDrawerOpen}
			placement="right"
			onClose={() => setReviewDrawerOpen(false)}
			size="lg"
		>
			<DrawerOverlay />
			<DrawerContent>
				<Flex
					direction="column"
					p={8}
					justify="space-between"
					h="100%"
					overflow="scroll">
					<Flex direction="row">
						<Text
							fontSize="16px"
							fontWeight="700"
							lineHeight="16px">
              Select Reviewers
						</Text>
						<Box mx="auto" />
						<IconButton
							aria-label="close-button"
							size="14px"
							icon={
								(
									<Image
										boxSize="20px"
										_active={{}}
										_hover={{}}
										src="/ui_icons/close_drawer.svg"
									/>
								)
							}
							_hover={{}}
							_active={{}}
							variant="ghost"
							onClick={onClose}
						/>
					</Flex>

					<Box mt={3} />
					<Flex>
						<SingleLineInput
							placeholder="Search by email"
							onChange={
								(e) => {
									setEmailSearchText(e.target.value)
								}
							}
							value={emailSearchText}
							inputLeftElement={<Image src="/ui_icons/reviewer_search_email.svg" />}
						/>
					</Flex>

					<Flex
						direction="column"
						overflowY="scroll"
						maxH="40%"
						mt={6}>

						{
							workspace?.members
							// .filter((member) => (member.publicKey || '').length > 0)
								.filter(
									(member) => emailSearchText === ''
                    || (member.email && member.email.startsWith(emailSearchText)),
								)
								.map((member) => {
									let reviewExists = false
									if(reviews?.find((r) => r.reviewer.id.split('.')[1].toLowerCase() === member.actorId.toLowerCase())) {
										reviewExists = true
									}

									return (
										<Flex
											key={member.id}
											w="100%"
											h="64px"
											// eslint-disable-next-line no-nested-ternary
											bg={reviewExists ? '#F3F4F4' : isReviewer[member.actorId] ? '#F3EDFD' : '#FFFFFF'}
											borderRadius="8px"
											align="center"
											mt={2}
											py={3}
										>
											<Checkbox
												value={member.actorId}
												isChecked={isReviewer[member.actorId]}
												onChange={
													(v) => {
														const newIsReviewer = { ...isReviewer }
														newIsReviewer[v.target.value] = !isReviewer[v.target.value]
														setIsReviewer(newIsReviewer)
													}
												}
												mx={4}
												defaultChecked={isReviewer[member.actorId]}
												colorScheme="brand"
												disabled={reviewExists}
											/>
											<Image
												ml={4}
												src="/ui_icons/reviewer_account.svg" />
											<Flex
												direction="column"
												ml={4}>
												<Text
													fontWeight="700"
													color="#122224"
													fontSize="14px"
													lineHeight="20px"
												>
													{ member.fullName ? member.fullName : member.email ? member.email : member.actorId}
												</Text>
												<Text
													mt={member.email || reviewExists ? 1 : 0}
													color="#717A7C"
													fontSize="12px">
													{
														member.email
                          && truncateStringFromMiddle(member.actorId)
													}
													{member.email ? ' | ' : ''}
													{reviewExists && 'Review submitted'}
												</Text>
											</Flex>
										</Flex>
									)
								})
						}

					</Flex>

					<Text
						fontSize="12px"
						color="#717A7C"
						mt={4}>
            The reviewers who have already submitted their
            reviews cannot be unassigned as reviewers.
						{' '}
					</Text>

					<Box my="auto" />

					{/* <Flex mt={8} gap="2">
            <Flex direction="column" flex={1}>
              <Text
                color="#122224"
                fontWeight="bold"
                fontSize="16px"
                lineHeight="20px"
              >
                Hide applicant reviews
              </Text>
              <Flex mt={1}>
                <Text color="#717A7C" fontSize="14px" lineHeight="20px">
                  Only DAO admins and reviewers can view
                  <Tooltip
                    icon="/ui_icons/tooltip_questionmark.svg"
                    label="Public key linked to your wallet will allow you to see the hidden data."
                    placement="bottom-start"
                  />
                </Text>
              </Flex>
            </Flex>
            <Flex justifyContent="center" gap={2} alignItems="center">
              <Switch
                id="hideApplicantReviews"
                onChange={(e) => {
                  setHideApplicantReviews(e.target.checked);
                }}
              />
              <Text fontSize="12px" fontWeight="bold" lineHeight="16px">
                {hideApplicantReviews ? 'YES' : 'NO'}
              </Text>
            </Flex>
          </Flex>

          <Flex alignItems="flex-start" mt={8} maxW="100%">
            <Image
              display="inline-block"
              h="10px"
              w="10px"
              src="/ui_icons/info_brand.svg"
              mt={1}
              mr={2}
            />
            {' '}
            <Text variant="footer">
              By assigning, you&apos;ll have to approve this transaction in your
              wallet.
            </Text>
          </Flex> */}

					<Flex
						direction="row"
						mt={6}
						alignItems="center">
						<Button
							mt="auto"
							variant="primary"
							onClick={handleOnSubmit}>
							{!loading ? 'Confirm' : <Loader />}
						</Button>
						<Text
							fontSize="12px"
							color="#717A7C"
							ml={4}>
              The reviewers will be notified via email to review the applicant.
						</Text>
					</Flex>
				</Flex>
			</DrawerContent>
		</Drawer>
	)
}

export default ReviewDrawer
