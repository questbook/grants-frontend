/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from 'src/libraries/hooks/useQuery'
import logger from 'src/libraries/logger'
import { WebwalletContext } from 'src/pages/_app'
import { BuilderInfoType, BuilderProposals, ProfileContextType } from 'src/screens/profile/_utils/types'
import { getBuilderInfo } from 'src/screens/profile/data/getBuilderInfo'
import { getMyProposals } from 'src/screens/profile/data/getMyProposals'


const ProfileContext = createContext<ProfileContextType | null>(null)


const ProfileProvider = ({ children }: {children: ReactNode}) => {
	const router = useRouter()


	const { address } = router.query
	useEffect(() => {
		if(!router.isReady) {
			return
		}

		logger.info(address, 'Address')
	}, [address, router.isReady])

	const provider = () => {
		return (
			<ProfileContext.Provider
				value={
					{ isLoading, proposals, builder, refresh: (refresh: boolean) => {
						if(refresh) {
							getBuilderDetails()
							getBuilderProposals()
						}
					},
					}
				}>
				{children}
			</ProfileContext.Provider>
		)
	}

	const { scwAddress, setBuildersProfileModal } = useContext(WebwalletContext)!
	const [proposals, setProposals] = useState<BuilderProposals[] | undefined>(undefined)
	const [builder, setBuilder] = useState<BuilderInfoType | undefined>(undefined)

	const [isLoading, setIsLoading] = useState<boolean>(true)

	const { fetchMore: fetchMyProposals } = useQuery({
		query: getMyProposals,
	})

	const { fetchMore: fetchBuilder } = useQuery({
		query: getBuilderInfo,
	})


	const getBuilderDetails = async() => {
		if(!address) {
			setIsLoading(false)
			return 'No Address'
		}

		const results: any = await fetchBuilder({
			wallet: address,
		}, true) //TODO - fix any
		logger.info(results, 'Get Builder')
		if(results?.getProfile) {
			setBuilder(results.getProfile)
		}

		setIsLoading(false)
	}

	const getBuilderProposals = async() => {
		if(!address) {
			setIsLoading(false)
			return 'No Address'
		}

		const results: any = await fetchMyProposals({
			wallet: address,
		}, true) //TODO - fix any
		logger.info(results, 'Get Proposals')
		if(results?.grantApplications?.length) {
			setProposals(results.grantApplications)
		} else {
			setProposals([])
		}

		setIsLoading(false)
	}


	useEffect(() => {
		getBuilderDetails().then(r => logger.info(r, 'Get Builder Details'))
	}, [scwAddress])

	useEffect(() => {
		getBuilderProposals().then(r => logger.info(r, 'Get Builder Proposal'))
	}, [address, scwAddress])

	useEffect(() => {
		if(!isLoading && !builder?._id && scwAddress?.toLowerCase() === address?.toString().toLowerCase()) {
			logger.info('Setting Profile Modal', builder, scwAddress, address)
			setBuildersProfileModal(true)
		}
	}, [builder, scwAddress, address])


	return provider()
}

export { ProfileContext, ProfileProvider }