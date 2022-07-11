import { ReactElement, useContext, useEffect, useState } from 'react'
import { Flex } from '@chakra-ui/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import NavbarLayout from '../src/layout/navbarLayout'
import { GitHubTokenContext, WebwalletContext } from './_app'

function GitHubOauth() {

	const router = useRouter()
	const [msg, setMsg] = useState<string>('Redirecting you in a second ...')
	const { webwallet } = useContext(WebwalletContext)!
	const { isLoggedIn, setIsLoggedIn } = useContext(GitHubTokenContext)!

	useEffect(() => {
		const _code = router.query.code
		console.log('THIS IS CODE', _code)
		console.log('GITHUB', localStorage.getItem('webwalletPrivateKey'))
		console.log('WEB', webwallet)
		if(!_code && isLoggedIn) {
			router.push('/')
		}

		if(_code && webwallet) {
			axios.post('https://2j6v8c5ee6.execute-api.ap-south-1.amazonaws.com/v0/add_user', {
				code: _code,
				webwallet_address: webwallet.address
			})
				.then(res => {
					if(res) {
						return res.data
					}
				})
				.then(data => {
					if(data) {
						return data.authorize
					}
				})
				.then(status => {
					console.log(status)
					if(status === true) {
						setIsLoggedIn(true)
						router.push('/')
					}
				})
		} else {
			setMsg('Something went wrong. Please try again')
		}

	}, [])

	return (
		<Flex
			width='100%'
			flexDir='row'
			justifyContent='center'>
			{msg}
		</Flex>
	)

}

GitHubOauth.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

export default GitHubOauth
