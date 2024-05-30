import { GetServerSidePropsContext } from 'next'
import { isValidEthereumAddress } from 'src/libraries/utils/validations'
import _ from 'src/screens/profile'
import { ProfileDataType } from 'src/screens/profile/_utils/types'

export default _

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const { address } = context.query


	if(typeof address !== 'string' || !isValidEthereumAddress(address)) {
		return {
			parseError: true
		}
	}

	let dynamicData: ProfileDataType

	try {
		dynamicData = { address }

	} catch(error) {
		return {
			notFound: true,
		}
	}

	return {
		props: {
			dynamicData
		},
	}
}