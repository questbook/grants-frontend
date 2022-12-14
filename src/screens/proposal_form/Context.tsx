import { createContext, PropsWithChildren, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { EditorState } from 'draft-js'
import { useRouter } from 'next/router'
import { ALL_SUPPORTED_CHAIN_IDS, defaultChainId } from 'src/constants/chains'
import { useGrantDetailsQuery } from 'src/generated/graphql'
import { useMultiChainQuery } from 'src/hooks/useMultiChainQuery'
import logger from 'src/libraries/logger'
import { containsField } from 'src/screens/proposal_form/_utils'
import { DEFAULT_FORM } from 'src/screens/proposal_form/_utils/constants'
import { Form, Grant, ProposalFormContextType } from 'src/screens/proposal_form/_utils/types'

const ProposalFormContext = createContext<ProposalFormContextType | undefined>(undefined)

const ProposalFormProvider = ({ children }: PropsWithChildren<ReactNode>) => {
	const providerComponent = () => (
		<ProposalFormContext.Provider
			value={
				{
					grant,
					chainId: ALL_SUPPORTED_CHAIN_IDS.indexOf(chainId) === -1 ? defaultChainId : chainId,
					form,
					setForm,
					error }
			}>
			{children}
		</ProposalFormContext.Provider>
	)

	const [grant, setGrant] = useState<Grant>()
	const [form, setForm] = useState<Form>(DEFAULT_FORM)

	const router = useRouter()
	const { grantId, chainId: chainIdString } = router.query
	const chainId = useMemo(() => {
		try {
			return typeof chainIdString === 'string' ? parseInt(chainIdString) : -1
		} catch(e) {
			return -1
		}
	}, [chainIdString])

	const error = useMemo(() => {
		if(!grantId) {
			return 'Grant ID not found'
		}

		if(chainId === -1) {
			return 'Chain ID not found'
		} else if(ALL_SUPPORTED_CHAIN_IDS.indexOf(chainId) === -1) {
			return 'Chain ID not supported'
		}

		return undefined
	}, [grantId, chainId])

	useEffect(() => {
		logger.info({ grantId, chainId }, 'ProposalForm: useEffect')
	}, [grantId, chainId])

	const { fetchMore } = useMultiChainQuery({
		useQuery: useGrantDetailsQuery,
		options: {},
		chains: [chainId === -1 ? defaultChainId : chainId]
	})

	const fetchGrant = useCallback(async() => {
		if(!grantId || !chainId || typeof grantId !== 'string' || typeof chainId !== 'number') {
			return
		}

		const result = await fetchMore({ grantId }, true)
		if(!result?.length || !result[0]?.grant) {
			return 'could-not-fetch-details'
		}


		const initForm: Form = {
			fields: result[0].grant.fields.map((field) => ({
				...field,
				id: field.id.substring(field.id.indexOf('.') + 1),
				value: ''
			})),
			milestones: [{ index: 0, title: '', amount: 0 }],
			members: containsField(result[0].grant, 'teamMembers') ? [''] : [],
			details: EditorState.createEmpty()
		}
		setForm(initForm)
		setGrant(result[0].grant)
		return 'fetched-grant-details'
	}, [grantId, chainId])

	useEffect(() => {
		fetchGrant().then((message) => {
			logger.info({ message }, 'Fetch grant details message')
		})
	}, [grantId, chainId])

	return providerComponent()
}

export { ProposalFormContext, ProposalFormProvider }