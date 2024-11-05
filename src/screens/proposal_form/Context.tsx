/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { SupportedPayouts } from '@questbook/supported-safes'
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import applicantDetailsList from 'src/constants/applicantDetailsList'
import { ALL_SUPPORTED_CHAIN_IDS, defaultChainId, USD_ASSET } from 'src/constants/chains'
import { useSafeContext } from 'src/contexts/safeContext'
import { useQuery } from 'src/libraries/hooks/useQuery'
import logger from 'src/libraries/logger'
import { getFieldString, getFieldStrings } from 'src/libraries/utils/formatting'
import { useEncryptPiiForApplication } from 'src/libraries/utils/pii'
import { getChainInfo } from 'src/libraries/utils/token'
import { WebwalletContext } from 'src/pages/_app'
import { grantDetailsQuery } from 'src/screens/proposal_form/_data/grantDetailsQuery'
import { proposalDetailsQuery } from 'src/screens/proposal_form/_data/proposalDetailsQuery'
import { containsField, getProjectDetails } from 'src/screens/proposal_form/_utils'
import { DEFAULT_FORM, DEFAULT_MILESTONE } from 'src/screens/proposal_form/_utils/constants'
import { Form, FormType, Grant, Proposal, ProposalFormContextType } from 'src/screens/proposal_form/_utils/types'

const ProposalFormContext = createContext<ProposalFormContextType | undefined>(undefined)

const ProposalFormProvider = ({ children }: { children: ReactNode }) => {
	const providerComponent = () => (
		<ProposalFormContext.Provider
			value={
				{
					type,
					grant,
					proposal,
					chainId: ALL_SUPPORTED_CHAIN_IDS.indexOf(chainId) === -1 ? defaultChainId : chainId,
					form,
					setForm,
					error,
					telegram,
					setTelegram,
					twitter,
					setTwitter,
					referral,
					setReferral,
					newsletter,
					setNewsLetter
				}
			}>
			{children}
		</ProposalFormContext.Provider>
	)

	const { scwAddress } = useContext(WebwalletContext)!
	const { setSafeObj } = useSafeContext()!
	const [type, setType] = useState<FormType>('submit')
	const [grant, setGrant] = useState<Grant>()
	const [proposal, setProposal] = useState<Proposal>()
	const [form, setForm] = useState<Form>(DEFAULT_FORM)
	const [telegram, setTelegram] = useState<string>('')
	const [referral, setReferral] = useState<{ type: string, value: string }>({ type: '', value: '' })
	const [newsletter, setNewsLetter] = useState<string>('')
	const [twitter, setTwitter] = useState<string>('')
	const router = useRouter()
	const { grantId, proposalId, chainId: chainIdString } = router.query
	const chainId = useMemo(() => {
		try {
			return typeof chainIdString === 'string' ? parseInt(chainIdString) : -1
		} catch(e) {
			return -1
		}
	}, [chainIdString])

	const error = useMemo(() => {
		if(!grantId && !proposalId) {
			return 'Neither grant nor proposal found'
		} else if(grantId && proposalId) {
			return 'Both grant and proposal cannot be present together'
		}

		if(chainId === -1) {
			return 'Chain ID not found'
		} else if(ALL_SUPPORTED_CHAIN_IDS.indexOf(chainId) === -1) {
			return 'Chain ID not supported'
		}

		return undefined
	}, [grantId, proposalId, chainId])

	const { decrypt } = useEncryptPiiForApplication(
		grant?.id,
		proposal?.applicantPublicKey,
		ALL_SUPPORTED_CHAIN_IDS.indexOf(chainId) === -1 ? defaultChainId : chainId
	)

	useEffect(() => {
		logger.info({ grantId, proposalId, chainId }, 'ProposalForm: useEffect')
		if(grantId && !proposalId) {
			setType('submit')
		} else if(!grantId && proposalId) {
			setType('resubmit')
		}
	}, [grantId, proposalId, chainId])

	const { fetchMore: fetchProposalDetails } = useQuery({
		query: proposalDetailsQuery,
	})
	const { fetchMore: fetchGrantDetails } = useQuery({
		query: grantDetailsQuery,
	})
	const fetchGrant = useCallback(async() => {
		if(!grantId || !chainId || typeof grantId !== 'string' || typeof chainId !== 'number') {
			return
		}

		const result: any = await fetchGrantDetails({ grantId }, true)
		if(!result?.grant) {
			return 'could-not-fetch-grant-details'
		}


		const fieldIDs = applicantDetailsList.map(d => d.id)
		logger.info({ fieldIDs }, 'ProposalForm: fetchGrant (fieldIDs)')
		const initForm: Form = {
			fields: result.grant.fields.filter((f: { title: string }) => fieldIDs.indexOf(f.title) !== -1 || f.title.includes('customField')).map((field: {
				id: string
				value: string
			}) => {
				const id = field.id.substring(field.id.indexOf('.') + 1)
				return {
					...field,
					id,
					value: id === 'isMultipleMilestones' ? 'true' : id === 'teamMembers' ? '1' : ''
				}
			}),
			milestones: result.grant.milestones?.length ? result.grant.milestones?.map((m: {
				title: string
			}, index: number) => ({ title: m, index, amount: 0 })) : [DEFAULT_MILESTONE],
			members: containsField(result.grant, 'teamMembers') ? [''] : [],
			details: EditorState.createEmpty()
		}
		logger.info('grants', result)
		try {
			const cache = false
			if(cache) {
				const formFromCache = JSON.parse(cache)
				logger.info({ formFromCache }, 'ProposalForm: fetchGrant (formFromCache)')
				setForm({ ...formFromCache, details: EditorState.createWithContent(convertFromRaw(formFromCache.details)) })
			} else {
				setForm(initForm)
			}
		} catch(e) {
			logger.error(e, 'ProposalForm: error load form from cache (formFromCache)')
			setForm(initForm)
		}

		setGrant(result.grant)
		const currentSafe = new SupportedPayouts().getSafe(parseInt(result.grant?.workspace?.safe?.chainId!), result.grant?.workspace?.safe?.address!)

		logger.info(result.grant?.workspace?.safe?.chainId, 'llllllw')
		setSafeObj(currentSafe)
		return 'fetched-grant-details'
	}, [grantId, chainId])

	const fetchProposal = useCallback(async() => {
		if(!proposalId || !chainId || typeof proposalId !== 'string' || typeof chainId !== 'number') {
			return
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result: any = await fetchProposalDetails({ proposalId }, true)
		if(!result?.grantApplication) {
			return 'could-not-fetch-proposal-details'
		}

		const chainInfo = getChainInfo(result.grantApplication.grant, chainId)
		const initForm: Form = {
			fields: result.grantApplication.grant.fields.map((field: { id: string, value: string }) => {
				const id = field.id.substring(field.id.indexOf('.') + 1)
				return {
					...field,
					id,
					value: id === 'isMultipleMilestones' ? 'true' : getFieldString(result?.grantApplication, id) ?? ''
				}
			}),
			milestones: result.grantApplication.milestones.map((milestone: { title: string, amount: string, details?: string, deadline?: string }, index: number) => (
				{
					index,
					title: milestone.title,
					amount: chainInfo.address === USD_ASSET ?
						parseInt(milestone.amount) :
						parseInt(ethers.utils.formatUnits(milestone.amount.toString(), chainInfo.decimals)),
					details: milestone?.details,
					deadline: milestone?.deadline,
				})),
			members: containsField(result.grantApplication.grant, 'teamMembers') ? getFieldStrings(result.grantApplication, 'memberDetails') ?? [''] : [],
			details: await getProjectDetails(getFieldString(result.grantApplication, 'projectDetails') ?? '')
		}
		setForm(initForm)
		setProposal(result.grantApplication)
		setGrant(result.grantApplication.grant)
		const currentSafe = new SupportedPayouts().getSafe(parseInt(result.grantApplication.grant?.workspace?.safe?.chainId!), result.grantApplication.grant?.workspace?.safe?.address!)
		setSafeObj(currentSafe)
		logger.info({ initForm }, 'ProposalForm: fetchProposal')
		return 'fetched-proposal-details'
	}, [proposalId, chainId])

	const decryptProposal = useCallback(async() => {
		if(!grant?.id || !proposal?.applicantPublicKey || !chainId || !proposal?.pii?.length) {
			logger.info({ grantId: grant?.id, proposalKey: proposal?.applicantPublicKey, chainId, length: proposal?.pii }, 'Could not decrypt proposal 1')
			return 'could-not-decrypt-proposal'
		}

		logger.info({ grant, proposal, chainId }, 'Decrypting proposal')
		const decryptedProposal = await decrypt(proposal)
		const newProposal = { ...proposal, ...decryptedProposal, pii: decryptedProposal ? [] : proposal.pii }
		logger.info({ decryptedProposal, newProposal }, 'Decrypted proposal')
		for(const field of grant.fields) {
			if(field.isPii) {
				const id = field.id.substring(field.id.indexOf('.') + 1)
				const value = getFieldString(newProposal, id)
				if(value) {
					setForm((form) => ({ ...form, fields: form.fields.map((f) => f.id === id ? { ...f, value } : f) }))
				}
			}
		}

		setProposal(newProposal)
	}, [grant?.id, proposal?.applicantPublicKey, chainId, scwAddress])

	useEffect(() => {
		fetchGrant().then((message) => {
			logger.info({ message }, 'Fetch grant details message')
		})
	}, [grantId, chainId])

	useEffect(() => {
		fetchProposal().then((message) => {
			logger.info({ message, proposal }, 'Fetch proposal details message')
		})
	}, [proposalId, chainId])

	useEffect(() => {
		if(!grant?.id || !proposal?.applicantPublicKey || !chainId || !proposal?.pii?.length) {
			logger.info({ grantId: grant?.id, proposalKey: proposal?.applicantPublicKey, chainId, length: proposal?.pii }, 'Could not decrypt proposal 2')
			return
		}

		decryptProposal().then((message) => {
			logger.info({ message }, 'Decrypt proposal message')
		})
	}, [grant?.id, proposal?.applicantPublicKey, chainId, scwAddress])

	useEffect(() => {
		if(!grant) {
			return
		}

		logger.info({ form }, 'ProposalForm: form changed')
		localStorage.setItem(`form-${grant?.id}`, JSON.stringify({ ...form, details: convertToRaw(form.details.getCurrentContent()) }))
	}, [form])

	return providerComponent()
}

export { ProposalFormContext, ProposalFormProvider }