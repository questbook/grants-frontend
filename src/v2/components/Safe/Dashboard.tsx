import { useContext, useEffect, useState } from 'react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Button, Flex, Image, Link, Text } from '@chakra-ui/react'
import { logger } from 'ethers'
import { ApiClientsContext } from 'pages/_app'
import { defaultChainId } from 'src/constants/chains'
import SupportedChainId from 'src/generated/SupportedChainId'
import useSafeUSDBalances from 'src/hooks/useSafeUSDBalances'
import { isValidEthereumAddress } from 'src/utils/validationUtils'
import getGnosisTansactionLink from 'src/v2/utils/gnosisUtils'
import getProposalUrl from 'src/v2/utils/phantomUtils'

function Dashboard() {
	const [safeChainId, setSafeChainId] = useState<SupportedChainId>(defaultChainId)

	const { workspace } = useContext(ApiClientsContext)!

	useEffect(() => {
		const chainId = workspace?.safe?.chainId ? parseInt(workspace?.safe?.chainId) as SupportedChainId : defaultChainId
		setSafeChainId(chainId)
	}, [workspace])

	const { data: safesUSDBalance, loaded: loadedSafesUSDBalance } = useSafeUSDBalances({ safeAddress: workspace?.safe?.address ?? '', chainId: safeChainId })

	useEffect(() => {
		logger.info({ safesUSDBalance }, 'safesUSDBalance')
	}, [safesUSDBalance])

	const openLink = () => {
		const safe = workspace?.safe
		if(!safe?.address) {
			return
		}

		const link = isValidEthereumAddress(safe?.address) ? getGnosisTansactionLink(safe.id?.toString()!, safe?.chainId.toString()!) : getProposalUrl(safe?.id?.toString()!, safe?.address)
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
					src={isValidEthereumAddress(workspace?.safe?.address ?? '') ? '/safes_icons/gnosis.svg' : '/safes_icons/realms.svg'} />
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
				<Text
					mt={8}
					variant='v2_body'
					color='black.3'>
					Balance
				</Text>
				<Text
					mt={1}
					variant='v2_heading_3'
					fontWeight='500'>
					{loadedSafesUSDBalance ? `\$${safesUSDBalance[0]?.amount}` : 'Loading...'}
				</Text>
				<Button
					mt={8}
					variant='primaryV2'
					rightIcon={<ExternalLinkIcon />}
					onClick={openLink}>
					Open Safe
				</Button>
				<Text
					mt={8}
					variant='v2_metadata'
					color='black.3'>
					Your safe can be used to do payouts on Questbook.
					{' '}
					<Link
						display='inline-block'
						fontWeight='500'
						color='black.3'
						isExternal
						href='https://www.notion.so/questbook/Connecting-your-Safe-with-Questbook-3a3be08527b54f87b9d71a7332b108ac'>
						Learn about safe and supported safes
					</Link>


				</Text>
			</Flex>

		</Flex>
	)
}

export default Dashboard