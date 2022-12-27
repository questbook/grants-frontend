import { ReactElement, useContext, useState } from 'react'
import { BsArrowLeft } from 'react-icons/bs'
import { Button, Checkbox, Divider, Flex, Image, Input, Spacer, Text, Textarea } from '@chakra-ui/react'
import router from 'next/router'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import ImageUpload from 'src/libraries/ui/ImageUpload'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import SectionInput from 'src/screens/proposal_form/_components/SectionInput'
import SettingsInput from 'src/screens/settings/_components/SettingsInput'
import { SettingsFormContext, SettingsFormProvider } from 'src/screens/settings/Context'
import WorkspaceMemberCard from 'src/screens/settings/WorkspaceMemberCard'

function Settings() {
	function buildComponent() {
		return (
			<>
				<Flex
					h='calc(100vh - 64px)'
					width='100vw'
					direction='column'
					justifyContent='flex-start'
					px={8}
					// py={4}
					gap={2}
				>
					<Button
						className='backBtn'
						variant='linkV2'
						// bgColor='gray.1'
						leftIcon={<BsArrowLeft />}
						width='fit-content'
						onClick={() => router.back()}>
						Back
					</Button>
					<Flex
						gap={2}
						p={2}>
						<Image
							boxSize={6}
							src='/v2/icons/settings.svg' />
						<Text
							variant='v2_subheading'
							fontWeight='500'>
							Settings
						</Text>
					</Flex>
					<Flex gap={8}>
						<Flex
							bg='white'
							width='70%'
							p={8}
							direction='column'
							gap={10}
							border='1px solid #E7E4DD'
							boxShadow='0px 2px 4px rgba(29, 25, 25, 0.1)'
						>
							<Flex
								width='100%'
								direction='column'
								gap={4}
							>
								<Flex>
									<Text
										variant='v2_body'
										fontWeight='500'>
										{' '}
										Builder Discovery
									</Text>
									<Spacer />
									<Button variant='primaryMedium'>
										Save
									</Button>
								</Flex>
								<Divider />
							</Flex>

							<Flex
								alignItems='end'
								gap={8}>
								<SettingsInput
								// width='70%'
									value='Climate Collective'
									helperText='Examples: Uniswap Foundation. Polygon Village DAO. Celo Climate Collective'
								/>
								<ImageUpload
									imageFile={imageFile}
									setImageFile={() => {}} />
							</Flex>
							<Flex
								w='100%'
								alignItems='center'
							>
								<Text
									variant='v2_title'
									fontWeight='500'
									width='15%'
								>
									Multisig Linked
								</Text>
								<SettingsInput
									width='100%'
									placeholder='0x2F05BFDc43e1bAAebdc3D507785fb942eE5cDFde' />
							</Flex>
							<Checkbox>
								<Text>
									Run the grant program in a community first fashion (recommended)
								</Text>
							</Checkbox>
							<SettingsInput placeholder='Add a brief intro' />
							<Flex gap={4}>
								<SettingsInput placeholder='Telegram username' />
								<SettingsInput placeholder='Discord server' />
								<SettingsInput placeholder='Twitter username' />
							</Flex>
							<Flex
								direction='column'
								gap={6}
							>
								<Text
									variant='v2_body'
									fontWeight='500'>
									More Info
								</Text>
								<Divider />
								<Textarea
									variant='outline'
									minH='200px'
									placeholder='Details about opportunities in your ecosystem for builders. Additionally, you can write about various active grant, and bounty programs.' />
							</Flex>


						</Flex>

						{/* Right column */}
						<Flex
							w='30%'
							bg='white'
							p={4}
							direction='column'
							gap={4}
							border='1px solid #E7E4DD'
							boxShadow='0px 2px 4px rgba(29, 25, 25, 0.1)'
						>
							<Flex>
								<Text
									variant='v2_title'
									fontWeight='500'>
									Members
								</Text>
								<Spacer />
								<Button variant='secondaryV2'>
									Add members
								</Button>
							</Flex>
							{
								workspaceMembers ?	workspaceMembers.map((member, index) => (
									<WorkspaceMemberCard
										key={index}
										role={member.accessLevel}
										address={member.actorId}
										email={member.email!}
										name={member.fullName!}
										pfp={member.profilePictureIpfsHash!}
										 />
								))
									: null
							}
						</Flex>
					</Flex>

				</Flex>
			</>
		)
	}

	const { workspace, workspaceMembers } = useContext(SettingsFormContext)!
	const [imageFile, setImageFile] = useState<{file: File | null, hash?: string}>({ file: null })

	return buildComponent()
}

Settings.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout
			renderSidebar={false}
			navbarConfig={{ showDomains: true, showLogo: false, showInviteProposals: true, showAddMembers: true, bg: 'gray.1', }}
		>
			<SettingsFormProvider>
				{page}
			</SettingsFormProvider>
		</NavbarLayout>
	)
}


export default Settings