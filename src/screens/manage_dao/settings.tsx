import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
// UI AND COMPONENTS
import {
	Box,
	Button,
	Flex,
	Grid,
	Image,
	Switch,
	Text,
} from '@chakra-ui/react'
import CoverUpload from 'src/components/ui/forms/coverUpload'
import ImageUpload from 'src/components/ui/forms/imageUpload'
import MultiLineInput from 'src/components/ui/forms/multiLineInput'
import RichTextEditor from 'src/components/ui/forms/richTextEditor'
import SingleLineInput from 'src/components/ui/forms/singleLineInput'
import Loader from 'src/components/ui/loader'
// CONSTANTS AND TYPES
import config from 'src/constants/config.json'
import useSettings from 'src/screens/manage_dao/_hooks/useSettings'
// UTILS AND TOOLS
import { getUrlForIPFSHash, isIpfsHash } from 'src/utils/ipfsUtils'
import NetworkTransactionModal from 'src/v2/components/NetworkTransactionModal'

function Settings() {
	const buildComponent = () => (
		<Flex
			direction='column'
			align='start'
			w='70%'>
			<Grid
				w='100%'
				gridTemplateColumns='4fr 1fr'
				justifyItems='space-between'
				mt={8}
				alignItems='flex-start'
			>
				<SingleLineInput
					label={t('/manage_dao.ecosystem_growth_program_name')}
					subtext='Letters, spaces, and numbers are allowed.'
					value={editedFormData?.name}
					onChange={(e) => updateFormData({ name: e.target.value })}
					isError={hasError('name')}
				/>
				<ImageUpload
					image={editedFormData?.image! || config.defaultDAOImagePath}
					isError={false}
					onChange={(e) => handleImageChange('image', e)}
					label='Add a logo'
				/>
			</Grid>
			<Grid
				w='100%'
				gridTemplateColumns='4fr 1fr'
				justifyItems='space-between'>
				<MultiLineInput
					label='Bio'
					placeholder='Describe your DAO in 200 characters'
					value={editedFormData?.bio}
					onChange={(e) => updateFormData({ bio: e.target.value })}
					isError={hasError('bio')}
					maxLength={200}
					subtext={null}
				/>
			</Grid>
			<Grid
				w='100%'
				gridTemplateColumns='4fr 1fr'
				justifyItems='space-between'>
				{
					editedFormData?.about
						? (
							<RichTextEditor
								label={t('/manage_dao.about')}
								placeholder={t('/manage_dao.about_description')}
								value={editedFormData!.about!}
								onChange={about => updateFormData({ about })}
								isError={hasError('about')}
								errorText='Required'
								maxLength={800}
							/>
						)
						: undefined
				}
			</Grid>
			<Grid
				w='80%'
				gridTemplateColumns='5fr 1fr'
				justifyItems='space-between'
				mt={5}
			>
				<Flex direction='column'>
					<Text
						fontSize='18px'
						fontWeight='700'
						lineHeight='26px'
						letterSpacing={0}
						w='full'
					>
						Do you want to showcase your grant program partners?
					</Text>
					<Text
						color='#717A7C'
						fontSize='14px'
						lineHeight='20px'>
						You can add their names, logo, and a link to their site.
					</Text>
				</Flex>
				<Flex
					justifySelf='right'
					gap={2}
					alignItems='center'>
					<Switch
						id='encrypt'
						isChecked={partnersRequired}
						onChange={
							(e) => {
								setPartnersRequired(e.target.checked)
								const newPartners = partners?.map((partner) => ({
									...partner,
									nameError: false,
								}))
								setPartners(newPartners)
							}
						}
					/>
					<Text
						fontSize='12px'
						fontWeight='bold'
						lineHeight='16px'>
						{`${partnersRequired ? 'YES' : 'NO'}`}
					</Text>
				</Flex>
			</Grid>

			{
				partners!.map((partner, index) => (
					<Box
						w='100%'
						key={index}>
						<Grid
							minW='100%'
							gridTemplateColumns='4fr 1fr'
							justifyItems='space-between'
							mt={2}
							opacity={partnersRequired ? 1 : 0.4}
						>
							<Flex
								mt={4}
								gap='2'
								alignItems='flex-start'
								direction='column'
								opacity={partnersRequired ? 1 : 0.4}
								justifyContent='space-between'
							>
								<Flex
									alignItems='center'
									direction='row'
									justifyContent='space-between'
									w='100%'
								>
									<Text
										color='#122224'
										fontWeight='bold'
										fontSize='16px'
										lineHeight='20px'
									>
										Partner Name
									</Text>
									<Flex
										onClick={
											() => {
												if(!partnersRequired) {
													return
												}

												const newPartners = [...partners!]
												newPartners.splice(index, 1)
												setPartners(newPartners)
												updateFormData({ partners: newPartners })
											}
										}
										alignItems='center'
										cursor='pointer'
										opacity={partnersRequired ? 1 : 0.4}
										gap='0.25rem'
										justifySelf='flex-end'
									>
										<Image
											h='0.875rem'
											w='0.875rem'
											src='/ui_icons/delete_red.svg'
										/>
										<Text
											fontWeight='500'
											fontSize='14px'
											color='#DF5252'
											lineHeight='20px'
										>
											Delete
										</Text>
									</Flex>
								</Flex>
							</Flex>
						</Grid>
						<Grid
							minW='100%'
							gridTemplateColumns='4fr 1fr'
							justifyItems='space-between'
							mt={2}
							opacity={partnersRequired ? 1 : 0.4}
						>
							<SingleLineInput
								value={partner.name}
								onChange={
									(e) => {
										const newPartners = [...partners]
										newPartners[index].name = e.target.value
										updateFormData({ partners: newPartners })
									}
								}
								placeholder='e.g. Partner DAO'
								maxLength={24}
								errorText='Required'
								disabled={!partnersRequired}
							/>
							<Box
								mt='-2.2rem'
								mb='-10rem'>
								<ImageUpload
									image={isIpfsHash(partner.partnerImageHash) ? getUrlForIPFSHash(partner.partnerImageHash!) : partner.partnerImageHash!}
									isError={false}
									onChange={e => handlePartnerImageChange(e, index)}
									label='Partner logo'
								/>
							</Box>
						</Grid>

						<Flex
							w='80%'
							gap='2'
							alignItems='flex-start'
							direction='column'
							opacity={partnersRequired ? 1 : 0.4}
						>
							<Flex flex={0.3327}>
								<Text
									mt='18px'
									color='#122224'
									fontWeight='bold'
									fontSize='16px'
									lineHeight='20px'
								>
									Industry
								</Text>
							</Flex>
							<Flex
								justifyContent='center'
								gap={2}
								alignItems='center'
								w='100%'
							>
								<SingleLineInput
									value={partner.industry}
									onChange={
										(e) => {
											const newPartners = [...partners]
											newPartners[index].industry = e.target.value
											updateFormData({ partners: newPartners })
										}
									}
									placeholder='e.g. Security'
									maxLength={24}
									errorText='Required'
									disabled={!partnersRequired}
								/>
							</Flex>
						</Flex>

						<Flex
							w='80%'
							gap='2'
							alignItems='flex-start'
							direction='column'
							opacity={partnersRequired ? 1 : 0.4}
						>
							<Flex flex={0.3327}>
								<Text
									mt='18px'
									color='#122224'
									fontWeight='bold'
									fontSize='16px'
									lineHeight='20px'
								>
									Website
								</Text>
							</Flex>
							<Flex
								justifyContent='center'
								gap={2}
								alignItems='center'
								w='full'
								flex={0.6673}
							>
								<SingleLineInput
									value={partner.website!}
									onChange={
										(e) => {
											const newPartners = [...partners]
											newPartners[index].website = e.target.value
											updateFormData({ partners: newPartners })
										}
									}
									placeholder='e.g. https://www.example.com'
									maxLength={48}
									errorText='Required'
									disabled={!partnersRequired}
								/>
							</Flex>
						</Flex>
					</Box>
				))
			}

			<Flex
				mt='19px'
				gap='2'
				justifyContent='flex-start'>
				<Box
					onClick={
						() => {
							if(!partnersRequired) {
								return
							}

							const newPartners = [
								...partners,
								{
									name: '',
									industry: '',
									website: '',
								},
							]
							setPartners(newPartners)
						}
					}
					display='flex'
					alignItems='center'
					cursor='pointer'
					opacity={partnersRequired ? 1 : 0.4}
				>
					<Image
						h='16px'
						w='15px'
						src='/ui_icons/plus_circle.svg'
						mr='6px' />
					<Text
						fontWeight='500'
						fontSize='14px'
						color='#8850EA'
						lineHeight='20px'
					>
						Add
						{' '}
						{partners! && partners!.length >= 1 ? 'another' : 'a'}
						{' '}
						service partner
					</Text>
				</Box>
			</Flex>

			<Flex
				w='100%'
				mt={10}>
				<CoverUpload
					image={editedFormData?.coverImage || ''}
					isError={false}
					onChange={(e) => handleImageChange('coverImage', e)}
					subtext='Upload a cover'
				/>
			</Flex>
			<Flex
				w='100%'
				mt={8}
				alignItems='flex-start'>
				<SingleLineInput
					label='Twitter Profile Link'
					placeholder='https://twitter.com/questbookapp'
					subtext=''
					value={editedFormData?.twitterHandle}
					onChange={(e) => updateFormData({ twitterHandle: e.target.value })}
					isError={hasError('twitterHandle')}
				/>
			</Flex>
			<Flex
				w='100%'
				mt={8}
				alignItems='flex-start'>
				<SingleLineInput
					label='Discord Server Link'
					placeholder='https://discord.gg/questbook'
					subtext=''
					value={editedFormData?.discordHandle}
					onChange={(e) => updateFormData({ discordHandle: e.target.value })}
					isError={hasError('discordHandle')}
				/>
			</Flex>
			<Flex
				w='100%'
				mt={8}
				alignItems='flex-start'>
				<SingleLineInput
					label='Telegram Channel'
					placeholder='https://t.me/questbook'
					subtext=''
					value={editedFormData?.telegramChannel}
					onChange={(e) => updateFormData({ telegramChannel: e.target.value })}
					isError={hasError('telegramChannel')}
				/>
			</Flex>

			<Flex
				direction='row'
				justify='start'
				mt={4}>
				<Button
					disabled={!isBiconomyInitialised}
					ref={buttonRef}
					w={loading ? buttonRef.current?.offsetWidth : 'auto'}
					variant='primary'
					onClick={loading ? () => {} : handleSubmit}
					py={loading ? 2 : 0}
				>
					{loading ? <Loader /> : 'Save changes'}
				</Button>
			</Flex>

			<NetworkTransactionModal
				isOpen={networkTransactionModalStep !== undefined}
				subtitle='Updating Workspace Details'
				description={
					<Flex direction='column'>
						<Text
							variant='v2_title'
							fontWeight='500'
						>
							{workspaceData?.title}
						</Text>
					</Flex>
				}
				currentStepIndex={networkTransactionModalStep || 0}
				steps={
					[
						'Uploading data to IPFS',
						'Signing transaction with in-app wallet',
						'Waiting for transaction to complete on chain',
						'Indexing transaction on graph protocol',
						'Workspace Details updated',
					]
				}
				viewLink={txnLink}
				onClose={onNetworkModalClose} />
			<Box my={10} />
		</Flex>
	)

	const { t } = useTranslation()
	const buttonRef = useRef<HTMLButtonElement>(null)
	const {
		workspaceData,
		editedFormData,
		updateFormData,
		partnersRequired,
		setPartnersRequired,
		partners,
		setPartners,
		hasError,
		loading,
		networkTransactionModalStep,
		isBiconomyInitialised,
		txnLink,
		handleImageChange,
		handlePartnerImageChange,
		handleSubmit,
		onNetworkModalClose,
	} = useSettings()

	return buildComponent()
}

export default Settings
