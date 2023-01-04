import { createContext, PropsWithChildren, ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useGetGrantDetailsByIdQuery } from 'src/generated/graphql'
import { useMultiChainQuery } from 'src/libraries/hooks/useMultiChainQuery'
import logger from 'src/libraries/logger'
import { ApiClientsContext } from 'src/pages/_app'
import { RFPForm, RFPFormContextType, RFPFormType } from 'src/screens/request_proposal/_utils/types'

const RFPFormContext = createContext<RFPFormContextType | undefined>(undefined)

const RFPFormProvider = ({ children }: PropsWithChildren<ReactNode>) => {
	const providerComponent = () => (
		<RFPFormContext.Provider
			value={
				{
					rfpData: RFPData!,
					setRFPData: setRFPData!,
					rfpFormType: type,
					grantId: grantId,
					workspaceId: workspaceId,
					RFPEditFormData: RFPEditFormData!,
					setRFPEditFormData: setRFPEditFormData!,
				}
			}>
			{children}
		</RFPFormContext.Provider>
	)

	const [RFPData, setRFPData] = useState<RFPForm>()
	const [RFPEditFormData, setRFPEditFormData] = useState<RFPForm>()
	const [type, setType] = useState<RFPFormType>('submit')
	// const [workspaceMembers, setWorkspaceMembers] = useState<WorkspaceMembers>()

	const { chainId } = useContext(ApiClientsContext)!


	const router = useRouter()
	const { grantId: _grantId, workspaceId: _workspaceId } = router.query

	const grantId = typeof(_grantId) === 'string' ? _grantId : ''
	const workspaceId = typeof(_workspaceId) === 'string' ? _workspaceId : ''

	useEffect(() => {
		logger.info({ workspaceId, grantId, chainId }, 'RFP form edit')
	}, [workspaceId, grantId, chainId])

	const { fetchMore: fetchRFP } = useMultiChainQuery({
		useQuery: useGetGrantDetailsByIdQuery,
		options: {},
		chains: [chainId]
	})

	// const handleOnEdit = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
	// 	const { value } = e.target
	// 	setRFPData({ ...RFPData, [field]: value })
	// }

	// const { fetchMore: fetchWorkspaceMembers } = useMultiChainQuery({
	// 	useQuery: useGetWorkspaceMembersByWorkspaceIdQuery,
	// 	options: {},
	// 	chains: [chainId ]
	// })

	useEffect(() => {
		logger.info({ grantId, chainId }, 'RFP form edit')
		if(grantId) {
			setType('edit')
		} else if(!grantId) {
			setType('submit')
		}
	}, [grantId, chainId])


	const fetchRFPDetails = useCallback(async() => {
		const response = await fetchRFP({
			grantID: typeof(grantId) === 'string' ? grantId : '',
		})
		logger.info('Grant program fetched', response)
		let rubricData: string[] | undefined = []
		if(response[0]?.grant?.rubric?.items.length! > 0) {
			 rubricData = response[0]?.grant?.rubric?.items!.map((item) => {
				return item.title
			})
		}

		// console.log('all applicasnt details fetched', response[0]?.grant?.fields)
		const data = {
			proposalName: response[0]?.grant?.title!,
			startDate: response[0]?.grant?.startDate!,
			endDate: response[0]?.grant?.deadline!,
			allApplicantDetails: response[0]?.grant?.fields!.filter(field => field.title.includes('customField')).map(field => {
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
			numberOfReviewers: response[0]?.grant?.numberOfReviewersPerApplication!,
			payoutMode: response[0]?.grant?.payoutType!,
			reviewMechanism: response[0]?.grant?.reviewType!,
			rubrics: rubricData!
		 }
		setRFPData(data)
		setRFPEditFormData(data)
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