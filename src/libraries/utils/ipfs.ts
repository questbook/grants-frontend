import config from 'src/constants/config.json'

const IPFS_UPLOAD_ENDPOINT = 'https://ipfs.questbook.app/api/v0/add?pin=true'
const IPFS_DOWNLOAD_ENDPOINT = 'https://ipfs.questbook.app:8080'

export const uploadToIPFS = async(data: string | Blob | null): Promise<{ hash: string }> => {
	if(data === null) {
		return { hash: config.defaultDAOImageHash }
	}

	const form = new FormData()
	form.append('file', data)

	// refer to https://infura.io/docs/ipfs#section/Getting-Started/Add-a-file
	const fetchResult = await fetch(IPFS_UPLOAD_ENDPOINT, {
		method: 'POST',
		body: form,
	})
	const responseBody = await fetchResult.json()

	return { hash: responseBody.Hash }
}

export const getFromIPFS = async(hash: string): Promise<string> => {
	if(hash === '' || typeof window === 'undefined') {
		return ''
	}

	const cached = localStorage.getItem(hash)
	if(cached !== null) {
		return cached
	}

	const url = getUrlForIPFSHash(hash)

	try {
		// console.log(hash)
		const fetchResult = await fetch(url)
		const text = await fetchResult.text()
		localStorage.setItem(hash, text)
		return text
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch(e: any) {
		// console.log(e)
	}

	// fallback
	try {
		// console.log(hash)
		const fetchResult = await fetch(`https://ipfs.io/ipfs/${hash}`)
		const text = await fetchResult.text()
		localStorage.setItem(hash, text)
		return text
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch(e: any) {
		// console.log(e)
	}

	return ''
}

export const getUrlForIPFSHash = (hash: string) => {
	// https://docs.ipfs.io/concepts/what-is-ipfs
	// https://infura.io/docs/ipfs#section/Getting-Started/Pin-a-file
	if(hash === '') {
		return ''
	}

	if(hash === config.defaultDAOImageHash) {
		return `https://ipfs.io/ipfs/${hash}`
	}

	return `${IPFS_DOWNLOAD_ENDPOINT}/ipfs/${hash}`
}

export const isIpfsHash = (str: string | undefined | null) => !!str && str.startsWith('Qm') && str.length < 256