import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Button, Flex, Image, Link, Text } from '@chakra-ui/react'
import { ApiClientsContext } from 'src/contexts/ApiClientsContext'
import { getSafeIcon } from 'src/utils/tokenUtils'
import { getSafeURL } from 'src/v2/utils/gnosisUtils'
import { getSafeURL as getRealmsURL } from 'src/v2/utils/phantomUtils'

interface Props {
	setEdit: (edit: boolean) => void
}

function Dashboard({ setEdit }: Props) {
	const { t } = useTranslation()
	const { workspace } = useContext(ApiClientsContext)!

	const openLink = () => {
		const safe = workspace?.safe
		if(!safe?.address || !safe.chainId) {
			return
		}

		let link = ''
		if(safe.chainId === '900001') {
			// Open Realms
			link = getRealmsURL(safe.address)
		} else {
			// Open celo safe or Gnosis
			link = getSafeURL(safe.address, safe.chainId)
		}

		window.open(link, '_blank')
	}

	return (
		<Flex
			direction='column'
			bg='#F5F5F5'
			w='100%'
			px={8}
			py={6}>
			<Text
				variant='v2_heading_3'
				fontWeight='700'>
				Safe
			</Text>
			<Flex
				mt={4}
				py={10}
				w='100%'
				borderRadius='4px'
				boxShadow='inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7'
				bg='white'
				direction='column'
				align='center'
			 >
				<Image
					boxSize='60px'
					src={getSafeIcon(workspace?.safe?.chainId)} />
				<Button
					mt={4}
					variant='link'
					rightIcon={<ExternalLinkIcon />}
					onClick={openLink}>
					<Text
						variant='v2_body'
						fontWeight='500'>
						{workspace?.safe?.address}
					</Text>
				</Button>
				<Flex mt={8}>
					<Button
						variant='link'
						onClick={() => setEdit(true)}>
						<Text variant='v2_body'>
							{t('/safe.edit')}
						</Text>
					</Button>
					<Button
						ml={4}
						variant='primaryV2'
						rightIcon={<ExternalLinkIcon />}
						onClick={openLink}>
						{t('/safe.open')}
					</Button>
				</Flex>

				<Text
					mt={8}
					variant='v2_metadata'
					color='black.3'>
					{t('/safe.note')}
					{' '}
					<Link
						display='inline-block'
						fontWeight='500'
						color='black.3'
						isExternal
						href='https://www.notion.so/questbook/Connecting-your-Safe-with-Questbook-3a3be08527b54f87b9d71a7332b108ac'>
						{t('/safe.learn_more')}
					</Link>


				</Text>
			</Flex>

		</Flex>
	)
}

export default Dashboard