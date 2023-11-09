import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { defaultChainId } from 'src/constants/chains'
import { useGetGrantDetailsByIdQuery } from 'src/generated/graphql'
import { useMultiChainQuery } from 'src/libraries/hooks/useMultiChainQuery'
import logger from 'src/libraries/logger'
import { RFPForm, RFPFormContextType, RFPFormType } from 'src/screens/request_proposal/_utils/types'

const RFPFormContext = createContext<RFPFormContextType | undefined>(undefined)

const RFPFormProvider = ({ children }: {children: ReactNode}) => {
	const providerComponent = () => (
		<RFPFormContext.Provider
			value={
				{
					rfpData: RFPData!,
					setRFPData,
					rfpFormType: type,
					grantId,
					setGrantId,
					workspaceId,
					chainId,
					executionType,
					setExecutionType,
				}
			}>
			{children}
		</RFPFormContext.Provider>
	)

	const [RFPData, setRFPData] = useState<RFPForm>()
	const [type, setType] = useState<RFPFormType>('submit')
	const [executionType, setExecutionType] = useState<RFPFormType>()
	const [grantId, setGrantId] = useState<string>('')

	const router = useRouter()
	const { grantId: _grantId, workspaceId: _workspaceId, chainId: _chainId } = router.query

	useEffect(() => {
		if(typeof _grantId === 'string') {
			setGrantId(_grantId)
		} else {
			setGrantId('')
		}
	}, [_grantId])

	const workspaceId = useMemo(() => {
		return typeof(_workspaceId) === 'string' ? _workspaceId : ''
	}, [_workspaceId])

	const chainId = useMemo(() => {
		logger.info({ chainId: _chainId }, 'Chain id from query')
		return typeof(_chainId) === 'string' ? parseInt(_chainId) : defaultChainId
	}, [_chainId])

	useEffect(() => {
		logger.info({ workspaceId, grantId, chainId }, 'RFP form edit')
	}, [workspaceId, grantId, chainId])

	const { fetchMore: fetchRFP } = useMultiChainQuery({
		useQuery: useGetGrantDetailsByIdQuery,
		options: {},
		chains: [chainId]
	})

	useEffect(() => {
		logger.info({ grantId, chainId }, 'RFP form edit')
		if(executionType !== undefined) {
			return
		}

		if(grantId && chainId) {
			setType('edit')
		} else if(!grantId || !chainId) {
			setType('submit')
		}
	}, [grantId, chainId])


	const fetchRFPDetails = useCallback(async() => {
		const grantID = typeof(grantId) === 'string' ? grantId : ''
		logger.info('Grant program fetching', { grantID, chainId })
		const response = await fetchRFP({
			grantID,
		})
		logger.info('Grant program fetched', response)
		let rubricData: string[] | undefined = []
		if(response[0]?.grant?.rubric?.items.length! > 0) {
			 rubricData = response[0]?.grant?.rubric?.items?.map((item) => {
				return item.title
			})
		}

		// console.log('all applicasnt details fetched', response[0]?.grant?.fields)
		const data = {
			proposalName: response[0]?.grant?.title!,
			startDate: response[0]?.grant?.startDate!,
			endDate: response[0]?.grant?.deadline!,
			allApplicantDetails: response[0]?.grant?.fields.filter(field => field.title.includes('customField')).map(field => {
				return {
					id: field.id.split('-')[1],
					title: field.title.split('-')[1],
					inputType: field.inputType,
					required: true,
					pii: false,
				}
			}),
			amount: response[0]?.grant?.reward.committed!,
			link: response[0]?.grant?.link ? response[0]?.grant?.link : '',
			doc: response[0]?.grant?.docIpfsHash ? response[0]?.grant?.docIpfsHash : '',
			milestones: response[0]?.grant?.milestones!,
			payoutMode: response[0]?.grant?.payoutType!,
			reviewMechanism: response[0]?.grant?.reviewType!,
			rubrics: rubricData!
		 }
		setRFPData(data)
		return response
	}, [chainId, grantId])

	useEffect(() => {
		if(!grantId) {
			return
		}

		fetchRFPDetails().then((message) => {
			logger.info({ message }, 'Fetch grant program message')
		})
	}, [grantId, chainId])

	return providerComponent()
}

export { RFPFormContext, RFPFormProvider }