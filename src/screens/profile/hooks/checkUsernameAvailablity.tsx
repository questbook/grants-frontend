import { useEffect, useState } from 'react'
import { useQuery } from 'src/libraries/hooks/useQuery'
import { getUserNameAvailability } from 'src/screens/profile/data/getUserNameAvailability'

const useCheckUsernameAvailability = (initialUsername: string = '') => {
	const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean>(false)
	const [username, setUsername] = useState<string>(initialUsername)

	const { fetchMore: fetchUsername } = useQuery({
		query: getUserNameAvailability,
	})

	const checkUsername = async(usernameToCheck: string): Promise<boolean> => {
		const results = await fetchUsername({
			username: usernameToCheck,
		}, true) as { usernameCheck: { isAvailable: boolean } }
		return results?.usernameCheck?.isAvailable || false
	}

	useEffect(() => {
		if(username) {
			checkUsername(username).then((result: boolean) => {
				setIsUsernameAvailable(result)
			})
		} else {
			setIsUsernameAvailable(false)
		}
	}, [username])

	return { isUsernameAvailable, checkUsername, setUsername }
}

export default useCheckUsernameAvailability