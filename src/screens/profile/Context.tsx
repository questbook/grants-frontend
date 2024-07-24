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
	}, [address, router.isReady])

	const provider = () => {
		return (
			<ProfileContext.Provider
				value={
					{ isLoading, proposals, builder,
						isQrModalOpen, setIsQrModalOpen,
						qrCode, setQrCode,
						providerName, setProviderName,
						refresh: (refresh: boolean) => {
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
	const [isBuilderInfoLoading, setBuilderInfoLoading] = useState<boolean>(true)
	const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false)
	const [qrCode, setQrCode] = useState<string>('')
	const [providerName, setProviderName] = useState<string>('')

	const [isLoading, setIsLoading] = useState<boolean>(true)

	const { fetchMore: fetchMyProposals } = useQuery({
		query: getMyProposals,
	})

	const { fetchMore: fetchBuilder } = useQuery({
		query: getBuilderInfo,
	})

	const getBuilderDetails = async() => {
		if(!address) {
			setBuilderInfoLoading(false)
			return 'No Address'
		}

		const results: any = await fetchBuilder({
			wallet: address,
		}, true) //TODO - fix any
		logger.info(results, 'Get Builder')
		if(results?.getProfile) {
			setBuilder(results.getProfile)
		}

		if(providerName?.length > 0) {
			if((providerName === 'compound' && results?.getProfile?.compound?.identifier !== undefined) ||
				(providerName === 'axelar' && results?.getProfile?.axelar?.identifier) ||
				(providerName === 'polygon' && results?.getProfile?.polygon?.identifier) ||
				(providerName === 'ens' && results?.getProfile?.ens?.identifier) ||
				(providerName === 'github' && results?.getProfile?.github?.identifier) ||
				(providerName === 'twitter' && results?.getProfile?.twitter?.identifier) ||
				(providerName === 'arbitrum' && results?.getProfile?.arbitrum?.identifier)) {
				logger.info('Setting Builder Info', results?.getProfile[providerName])
				setIsQrModalOpen(false)
				setQrCode('')
				setProviderName('')
				logger.info('Closing Modal', results?.getProfile?.[providerName]?.claimData)
			}
		}


		setBuilderInfoLoading(false)
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
		if(isQrModalOpen && providerName.length > 0) {
		  // poll builder info every 5 seconds
		  const interval = setInterval(() => {
				getBuilderDetails().then(r => logger.info(r, 'Get Builder Details'))
			}, 5000)
			return () => clearInterval(interval)
		}

	}, [scwAddress, isQrModalOpen, providerName])

	useEffect(() => {
		getBuilderProposals().then(r => logger.info(r, 'Get Builder Proposal'))
	}, [address, scwAddress])

	useEffect(() => {
		if(!isBuilderInfoLoading && builder === undefined && scwAddress?.toLowerCase() === address?.toString().toLowerCase()) {
			logger.info('Setting Profile Modal', builder, scwAddress, address)
			setBuildersProfileModal(true)
		}
	}, [builder, scwAddress, address, isBuilderInfoLoading])


	return provider()
}

export { ProfileContext, ProfileProvider }