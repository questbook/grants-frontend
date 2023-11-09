export const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

export function getAvatar(initials: boolean, address: string | null | undefined) {
	let url = ''
	if(!address) {
		url = '/v2/images/default_profile_picture.png'
	// } else if(initials) {
	// 	address = address.toLowerCase()
	// 	// violet 2, teal 2, orange 2, crimson 2, pink 2
	// 	const colors = ['785EF0', '10AEBA', 'FF7545', 'FF4C4D', 'E281BF']
	// 	const colorId = address ? address.charCodeAt(0) % 5 : Math.floor(Math.random() * 5)
	// 	const color = colors[colorId]
	// 	url = `https://api.dicebear.com/7.x/identicon/svg?seed=${address}&fontSize=32&backgroundColor=%23${color}`
	} else {
		address = address.toLowerCase()
		url = `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`
	}

	return url

}