import copy from 'copy-to-clipboard'
import logger from 'src/libraries/logger'


const copyGrantLink = async(grantID: string, chainId: number) => {
	const href = window.location.href.split('/')
	const protocol = href[0]
	const domain = href[2]

	const URL = `${protocol}//${domain}/proposal_form/?grantId=${grantID}&chainId=${chainId}&utm_source=questbook&utm_medium=grant_details&utm_campaign=share`

	copy(URL)
	logger.info('copied grant link', URL)
	return URL

	// NEXT_PUBLIC_BITLY_GROUP not available: commented the below code block

	// if(process.env.NODE_ENV === 'development') {
	// 	copy(URL)
	// 	return true
	// }

	// const req = {
	// 	long_url: URL,
	// 	domain: 'bit.ly',
	// 	group_guid: process.env.NEXT_PUBLIC_BITLY_GROUP,
	// }

	// const res = await fetch('https://api-ssl.bitly.com/v4/shorten', {
	// 	method: 'POST',
	// 	headers: {
	// 		Authorization: process.env.NEXT_PUBLIC_BITLY_AUTH,
	// 		'Content-Type': 'application/json',
	// 	} as HeadersInit,
	// 	body: JSON.stringify(req),
	// })

	// if(!res.ok) {
	// 	return false
	// }

	// const data = await res.json()
	// return copy(data.link)
}

const copyShareGrantLink = () => {
	const link = window.location.href.split('&role')[0]
	logger.info('copied share grant link', link)
	copy(link)
	return (link)
}

export { copyGrantLink, copyShareGrantLink }