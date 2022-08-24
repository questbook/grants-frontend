function getAvatar(address: string | null | undefined) {
	if(!address) {
		return '/ui_icons/default_profile_picture.png'
	} else {
		return `https://cdn.stamp.fyi/avatar/${address}?cb=1`
	}
}

export default getAvatar