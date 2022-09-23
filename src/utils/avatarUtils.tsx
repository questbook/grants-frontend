function getAvatar(initials: boolean, address: string | null | undefined) {
	let url = ''
	if(!address) {
		url = '/ui_icons/default_profile_picture.png'
	} else if(initials) {
		// violet 2, teal 2, orange 2, crimson 2, pink 2
		const colors = ['785EF0', '10AEBA', 'FF7545', 'FF4C4D', 'E281BF']
		const colorId = address ? address.charCodeAt(0) % 5 : Math.floor(Math.random() * 5)
		const color = colors[colorId]
		url = `https://avatars.dicebear.com/api/initials/${address}.svg?fontSize=32&backgroundColor=%23${color}`
	} else {
		url = `https://avatars.dicebear.com/api/identicon/${address}.svg`
	}

	return url
}

export default getAvatar