import React, { useContext } from 'react'
import {
	Flex,
	Image,
	Text,
} from '@chakra-ui/react'
import copy from 'copy-to-clipboard'
import { WebwalletContext } from 'pages/_app'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import getAvatar from 'src/utils/avatarUtils'
import { formatAddress } from 'src/utils/formattingUtils'

function AccountDetails() {
	const { nonce } = useQuestbookAccount()
	const { scwAddress } = useContext(WebwalletContext)!

	return (
		<Flex
			bg='gray.2'
			p={2}
			align='center'
			borderRadius='2px'>
			{
				nonce && scwAddress && (
					<Image
						borderRadius='3xl'
						src={getAvatar(scwAddress)}
						boxSize='24px' />
				)
			}
			{
				nonce && scwAddress && (
					<Text
						onClick={
							() => {
								// This is for debug purposes only
								const data1 = localStorage.getItem('webwalletPrivateKey')
								const data2 = localStorage.getItem('scwAddress')
								const data = { 'webwalletPrivateKey': data1, 'scwAddress': data2 }
								if(data1 !== null && data2 !== null) {
									copy(JSON.stringify(data))
								}
							}
						}
						ml={2}
						variant='v2_body'
						fontWeight='500'>
						{formatAddress(scwAddress)}
					</Text>
				)
			}
		</Flex>
	)
}

export default AccountDetails
