import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { defaultChainId } from 'src/constants/chains'
import { useQuery } from 'src/libraries/hooks/useQuery'
import logger from 'src/libraries/logger'
import { GrantsProgramContext, WebwalletContext } from 'src/pages/_app'
import { getGrantDetailsByIdQuery } from 'src/screens/request_proposal/_data/getGrantDetailsByIdQuery'
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
	const { setRole } = useContext(GrantsProgramContext)!
	const { scwAddress } = useContext(WebwalletContext)!

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

	const { fetchMore: fetchRFP } = useQuery({
		query: getGrantDetailsByIdQuery,
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
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const response: any = await fetchRFP({
			grantID,
		})
		const rubricData = response?.grant?.rubric?.items?.map((item: { title: string }) => item.title) ?? []
		// let rubricData: string[] | undefined = []
		// if(response?.grant?.rubric?.items.length! > 0) {
		// 	 rubricData = response[0]?.grant?.rubric?.items!.map((item: { title: string}) => {
		// 		return item.title
		// 	})
		// }
		// console.log('all applicasnt details fetched', response[0]?.grant?.fields)
		const data = {
			proposalName: response?.grant?.title!,
			startDate: response?.grant?.startDate!,
			endDate: response?.grant?.deadline!,
			allApplicantDetails: response?.grant?.fields.filter((field: {
				title: string
			}) => field.title.includes('customField')).map((field: {
				id: string
				title: string
				inputType: string
			}) => {
				return {
					id: field.id.split('-')[1],
					title: field.title.split('-')[1],
					inputType: field.inputType,
					required: true,
					pii: false,
				}
			}),
			amount: response?.grant?.reward.committed!,
			link: response?.grant?.link ? response?.grant?.link : '',
			doc: response?.grant?.docIpfsHash ? response?.grant?.docIpfsHash : '',
			milestones: response?.grant?.milestones!,
			payoutMode: response?.grant?.payoutType!,
			reviewMechanism: response?.grant?.reviewType!,
			rubrics: rubricData!
		 }
		setRFPData(data)
		return response
	}, [chainId, grantId])


	const getLocalGrant = () => {

		const rawGrant = localStorage.getItem('cur-grant')

		logger.info('Fetching grant from local storage')

		if(!rawGrant) {
			logger.info('No grant found in local storage')
			return undefined
		}

		if(!scwAddress) {
			logger.info('No SCW Address')
			return undefined
		}

		const grant = JSON.parse(rawGrant)

		if(scwAddress) {
			logger.info({ scwAddress }, 'SCW Address')
			for(const member of grant?.workspace?.members ?? []) {
				if(member.actorId.toLowerCase() === scwAddress.toLowerCase()) {
					logger.info({ member }, 'Member (ROLE)')
					setRole(member.accessLevel === 'reviewer' ? 'reviewer' : 'admin')
				}
			}
		}

		return grant
	}

	useEffect(() => {
		getLocalGrant()
	}, [scwAddress])

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