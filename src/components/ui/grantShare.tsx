import React from 'react'
import { Button, Image } from '@chakra-ui/react'
import copy from 'copy-to-clipboard'
import { SupportedChainId } from 'src/constants/chains'

interface Props {
  grantID: string;
  chainId: SupportedChainId | undefined;
}

function GrantShare({ grantID, chainId } : Props) {
	const [copied, setCopied] = React.useState(false)

	const copyGrantLink = async() => {
		const href = window.location.href.split('/')
		const protocol = href[0]
		const domain = href[2]
		// console.log(domain);

		const req = {
			long_url: `${protocol}//${domain}/explore_grants/about_grant/?grantId=${grantID}&chainId=${chainId}&utm_source=questbook&utm_medium=grant_details&utm_campaign=share`,
			domain: 'bit.ly',
			group_guid: process.env.NEXT_PUBLIC_BITLY_GROUP,
		}

		await fetch('https://api-ssl.bitly.com/v4/shorten', {
			method: 'POST',
			headers: {
				Authorization: process.env.NEXT_PUBLIC_BITLY_AUTH,
				'Content-Type': 'application/json',
			} as HeadersInit,
			body: JSON.stringify(req),
		}).then((response) => {
			if(!response.ok) {
				console.log(response)
			}

			return response.json()
		}).then((data) => {
			copy(data.link)
			setCopied(true)
		})
	}

	return (
		<Button
			aria-label="share"
			leftIcon={<Image src="/ui_icons/share_brand.svg" />}
			variant="ghost"
			_hover={{}}
			_active={{}}
			onClick={copyGrantLink}
			fontSize="14px"
			lineHeight="20px"
			fontWeight="400"
			color="brand.500"
			letterSpacing={0.5}
		>
			{copied ? 'Link copied!' : 'Share Link'}
		</Button>
	)
}

export default GrantShare
