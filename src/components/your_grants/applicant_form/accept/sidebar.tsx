import React, { useContext } from 'react'
import {
	Box, Divider, Flex, Heading, Image, Link, Text, Tooltip,
} from '@chakra-ui/react'
import FloatingSidebar from 'src/components/ui/sidebar/floatingSidebar'
import MailTo from 'src/components/your_grants/mail_to/mailTo'
import { ApiClientsContext } from 'src/pages/_app'
import { getFieldString, getFormattedFullDateFromUnixTimestamp, truncateStringFromMiddle } from 'src/utils/formattingUtils'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import { getAssetInfo } from 'src/utils/tokenUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

function Sidebar({ applicationData }: any) {
	const { workspace } = useContext(ApiClientsContext)!
	const chainId = getSupportedChainIdFromWorkspace(workspace)
	const applicantEmail = getFieldString(applicationData, 'applicantEmail')
	const applicantAddress = getFieldString(applicationData, 'applicantAddress')

	let icon
	if(applicationData.grant.reward.token) {
		icon = getUrlForIPFSHash(applicationData.grant.reward.token.iconHash)
	} else {
		icon = getAssetInfo(applicationData?.grant?.reward?.asset, chainId)?.icon
	}

	return (
		<Box mt='8px'>
			<FloatingSidebar>
				<Heading
					fontSize='16px'
					fontWeight='400'
					color='#414E50'
					lineHeight='26px'
					fontStyle='normal'
				>
					Application Details
				</Heading>
				<Flex
					direction='row'
					justify='start'
					w='full'
					mt={6}
					align='center'>
					<Image
						h='45px'
						w='45px'
						src={icon} />
					<Box mx={3} />
					<Tooltip label={applicantAddress}>
						<Heading
							variant='applicationHeading'
							color='brand.500'>
							{truncateStringFromMiddle(applicantAddress)}
						</Heading>
					</Tooltip>
				</Flex>
				<Box my={4} />
				<Flex
					direction='row'
					justify='space-between'
					w='full'
					align='center'>
					<Text
						variant='applicationText'
						lineHeight='32px'>
						Name
					</Text>
					<Heading
						variant='applicationHeading'
						lineHeight='32px'>
						{getFieldString(applicationData, 'applicantName')}
					</Heading>
				</Flex>
				<Flex
					direction='row'
					justify='space-between'
					w='full'
					align='center'>
					<Text
						variant='applicationText'
						lineHeight='32px'>
						Email
					</Text>
					<Heading
						variant='applicationHeading'
						lineHeight='32px'>
						{
							getFieldString(applicationData, 'applicantEmail') && (
								<>
									{getFieldString(applicationData, 'applicantEmail')}
									<MailTo applicantEmail={applicantEmail} />
								</>
							)
						}
					</Heading>
				</Flex>
				<Flex
					direction='row'
					justify='space-between'
					w='full'
					align='center'>
					<Text
						variant='applicationText'
						lineHeight='32px'>
						Sent On
					</Text>
					<Heading
						variant='applicationHeading'
						lineHeight='32px'>
						{getFormattedFullDateFromUnixTimestamp(applicationData?.createdAtS)}
					</Heading>
				</Flex>
				<Divider mt='37px' />
				<Flex
					mt='22px'
					mb='3px'
					direction='row'
					w='full'
					alignItems='center'>
					<Link
						variant='link'
						fontSize='14px'
						lineHeight='24px'
						fontWeight='500'
						fontStyle='normal'
						color='#414E50'
						href={`/explore_grants/about_grant?grantId=${applicationData?.grant?.id}&chainId=${chainId}`}
					>
						View Grant
						{' '}
						<Image
							display='inline-block'
							h={3}
							w={3}
							src='/ui_icons/link.svg'
						/>
					</Link>
					<Link
						variant='link'
						fontSize='14px'
						lineHeight='24px'
						fontWeight='500'
						fontStyle='normal'
						color='#414E50'
						href={`/your_applications/grant_application?applicationId=${applicationData?.id}&chainId=${chainId}`}
						ml='auto'
					>
						View Application
						{' '}
						<Image
							display='inline-block'
							h={3}
							w={3}
							src='/ui_icons/link.svg'
						/>
					</Link>
				</Flex>
			</FloatingSidebar>
		</Box>
	)
}

export default Sidebar
