import config from 'src/constants/config.json'

const IPFS_UPLOAD_ENDPOINT = 'https://api.thegraph.com/ipfs/api/v0/add?pin=true'
const IPFS_DOWNLOAD_ENDPOINT = 'https://api.thegraph.com/ipfs/api/v0/cat'

export const uploadToIPFS = async(data: string | Blob): Promise<{ hash: string }> => {
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
	try {
		console.log(hash)
		const fetchResult = await fetch(`${IPFS_DOWNLOAD_ENDPOINT}?arg=${hash}`)
		const responseBody = await fetchResult.text()
		return responseBody
	} catch(e) {
		console.log(e)
	}

	// fallback
	try {
		console.log(hash)
		const fetchResult = await fetch(`https://ipfs.io/ipfs/${hash}`)
		const responseBody = await fetchResult.text()
		return responseBody
	} catch(e) {
		console.log(e)
	}

	return ''
}

export const getUrlForIPFSHash = (hash: string) => {
	// https://docs.ipfs.io/concepts/what-is-ipfs
	// https://infura.io/docs/ipfs#section/Getting-Started/Pin-a-file
	if(hash === '') {
		return ''
	}

	// api.thegraph is having problem returning svg files, will fix later
	// this shoudln't affect in the near future as uploading svg files is not supported
	if(hash === config.defaultDAOImageHash) {
		return `https://ipfs.io/ipfs/${hash}`
	}

	return `${IPFS_DOWNLOAD_ENDPOINT}?arg=${hash}`
	// const v1 = CID.parse(hash).toV1();
	// return `https://${v1}.ipfs.dweb.link/#x-ipfs-companion-no-redirect`;
	// return `https://ipfs.infura.io:5001/api/v0/cat?arg=${v1}`;
	// return `https://infura-ipfs.io:5001/api/v0/cat?arg=${hash}`;
	// return `https://ipfs.io/ipfs/${hash}`;
}

export const isIpfsHash = (str: string | undefined | null) => !!str && str.startsWith('Qm') && str.length < 256