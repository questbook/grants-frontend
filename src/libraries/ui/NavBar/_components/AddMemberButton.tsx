import { useContext, useRef, useState } from 'react'
import { Button, CircularProgress, Flex, Image, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Text, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import CopyIcon from 'src/libraries/ui/CopyIcon'
import { serialiseInviteInfoIntoUrl, useMakeInvite } from 'src/libraries/utils/invite'
import { ApiClientsContext } from 'src/pages/_app'

function AddMemberButton() {
	const buildComponent = () => {
		return (
			<Popover
				isLazy
				initialFocusRef={popoverRef}>
				{
					({ onClose }) => (
						<>
							<PopoverTrigger>
								{popoverButton()}
							</PopoverTrigger>
							<PopoverContent maxW='fit-content'>
								<PopoverArrow />
								<PopoverBody
									maxH='30vh'
									overflowY='auto'>
									<Flex
										direction='column'
										align='start'
									>
										<Flex align='center'>
											<Image
												src='/v2/icons/link.svg'
												boxSize='18px' />
											<Text
												variant='v2_body'
												ml={3}>
												Invite
											</Text>
											{memberButton(0)}
											{memberButton(1)}
										</Flex>
										{
											createLinkStep !== undefined && (
												<Flex mt={2}>
													<CircularProgress
														isIndeterminate
														color='black'
														size='18px' />
													<Text
														ml={3}
														variant='v2_body'>
														Generating link on-chain...
													</Text>
												</Flex>
											)
										}
										{
											link && (
												<Flex
													mt={2}
												>
													<Text
														variant='v2_body'
														noOfLines={4}
														wordBreak='break-all'
														mr={2}>
														{link}
													</Text>
													<CopyIcon text={link} />
												</Flex>
											)
										}
										<Flex mt={3}>
											<Image
												src='/v2/icons/group.svg'
												boxSize='18px' />
											<Button
												disabled={!workspace?.id}
												ml={3}
												variant='link'
												onClick={
													() => {
														router.push('/settings')
														onClose()
													}
												}>
												<Text
													variant='v2_body'
													fontWeight='400'>
													See all Members
												</Text>
											</Button>
										</Flex>
									</Flex>
								</PopoverBody>
							</PopoverContent>
						</>
					)
				}

			</Popover>
		)
	}

	// id = 0 --> Admin
	// id = 1 --> Reviewer
	const memberButton = (id: number) => {
		return (
			<Button
				ml={3}
				bg='white'
				borderRadius='2px'
				border='1px solid #C1BDB7'
				px={2}
				py={1}
				h='28px'
				disabled={!isBiconomyInitialised}
				onClick={
					async() => {
						await createLink(id)
					}
				}>
				<Text
					variant='v2_body'
					fontWeight='400'>
					{id === 0 ? 'Admin' : 'Reviewer'}
				</Text>

			</Button>
		)
	}

	const popoverButton = () => {
		return (
			<Button
				variant='ghost'
				leftIcon={
					<Image
						src='/v2/icons/add user.svg'
						boxSize='16px' />
				}>
				<Text
					variant='v2_body'
					fontWeight='500'>
					Add Members
				</Text>
			</Button>
		)
	}

	const { workspace } = useContext(ApiClientsContext)!
	const router = useRouter()

	const popoverRef = useRef<HTMLButtonElement>(null)
	const { makeInvite, isBiconomyInitialised } = useMakeInvite()
	const [ createLinkStep, setCreateLinkStep ] = useState<number>()
	const [ , setTransactionHash ] = useState<string>()
	const [ link, setLink ] = useState<string>()

	const toast = useToast()

	const createLink = async(role: number) => {

		setCreateLinkStep(0)

		try {
			const info = await makeInvite(
				role,
				() => setCreateLinkStep(1),
				setTransactionHash,
			)

			setCreateLinkStep(2)

			// artificial delay to show the final completion state
			await new Promise(resolve => setTimeout(resolve, 1000))

			const url = serialiseInviteInfoIntoUrl(info)
			setLink(url)
		} catch(error) {
			// // console.error('error ', error)
			toast({
				title: `Error in generating the invite: "${(error as Error).message}"`,
				status: 'error',
				isClosable: true
			})
		} finally {
			setCreateLinkStep(undefined)
		}
	}

	return buildComponent()
}

export default AddMemberButton