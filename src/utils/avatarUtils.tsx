import logger from 'src/utils/logger'

function getAvatar(initials: boolean, address: string | null | undefined) {
	let url = ''
	if(!address) {
		url = '/ui_icons/default_profile_picture.png'
	} else if(initials) {
		// violet 1, teal 1, orange 1, crimson 1, pink 1
		const colors = ['C8CBFC', 'C3EAE3', 'FFDCC0', 'FFC6C5', 'FFD6E5']
		const colorId = address ? address.charCodeAt(0) % 5 : Math.floor(Math.random() * 5)
		const color = colors[colorId]
		url = `https://avatars.dicebear.com/api/initials/${address}.svg?fontSize=32&backgroundColor=%23${color}`
	} else {
		url = `https://avatars.dicebear.com/api/identicon/${address}.svg`
	}

	return url
}

export default getAvatar