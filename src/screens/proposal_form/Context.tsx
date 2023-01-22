import { createContext, PropsWithChildren, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { SupportedPayouts } from '@questbook/supported-safes'
import { EditorState } from 'draft-js'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import applicantDetailsList from 'src/constants/applicantDetailsList'
import { ALL_SUPPORTED_CHAIN_IDS, defaultChainId, USD_ASSET } from 'src/constants/chains'
import { useSafeContext } from 'src/contexts/safeContext'
import { useGrantDetailsQuery, useProposalDetailsQuery } from 'src/generated/graphql'
import { useMultiChainQuery } from 'src/hooks/useMultiChainQuery'
import logger from 'src/libraries/logger'
import { useEncryptPiiForApplication } from 'src/libraries/utils/pii'
import { getChainInfo } from 'src/libraries/utils/token'
import { WebwalletContext } from 'src/contexts/WebwalletContext'
import { containsField, getProjectDetails } from 'src/screens/proposal_form/_utils'
import { DEFAULT_FORM, DEFAULT_MILESTONE } from 'src/screens/proposal_form/_utils/constants'
import { Form, FormType, Grant, Proposal, ProposalFormContextType } from 'src/screens/proposal_form/_utils/types'
import { getFieldString, getFieldStrings } from 'src/utils/formattingUtils'

const ProposalFormContext = createContext<ProposalFormContextType | undefined>(undefined)

const ProposalFormProvider = ({ children }: PropsWithChildren<ReactNode>) => {
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
					error }
			}>
			{children}
		</ProposalFormContext.Provider>
	)

	const { scwAddress } = useContext(WebwalletContext)!
	const { setSafeObj } = useSafeContext()
	const [type, setType] = useState<FormType>('submit')
	const [grant, setGrant] = useState<Grant>()
	const [proposal, setProposal] = useState<Proposal>()
	const [form, setForm] = useState<Form>(DEFAULT_FORM)

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

	const { fetchMore: fetchGrantDetails } = useMultiChainQuery({
		useQuery: useGrantDetailsQuery,
		options: {},
		chains: [chainId === -1 ? defaultChainId : chainId]
	})

	const { fetchMore: fetchProposalDetails } = useMultiChainQuery({
		useQuery: useProposalDetailsQuery,
		options: {},
		chains: [chainId === -1 ? defaultChainId : chainId]
	})

	const fetchGrant = useCallback(async() => {
		if(!grantId || !chainId || typeof grantId !== 'string' || typeof chainId !== 'number') {
			return
		}

		const result = await fetchGrantDetails({ grantId }, true)
		if(!result?.length || !result[0]?.grant) {
			return 'could-not-fetch-grant-details'
		}


		const fieldIDs = applicantDetailsList.map(d => d.id)
		logger.info({ fieldIDs }, 'ProposalForm: fetchGrant (fieldIDs)')
		const initForm: Form = {
			fields: result[0].grant.fields.filter(f => fieldIDs.indexOf(f.title) !== -1 || f.title.includes('customField')).map((field) => {
				const id = field.id.substring(field.id.indexOf('.') + 1)
				return {
					...field,
					id,
					value: id === 'isMultipleMilestones' ? 'true' : id === 'teamMembers' ? '1' : ''
				}
			}),
			milestones: result[0].grant.milestones?.length ? result[0].grant.milestones?.map((m, index) => ({ title: m, index, amount: 0 })) : [DEFAULT_MILESTONE],
			members: containsField(result[0].grant, 'teamMembers') ? [''] : [],
			details: EditorState.createEmpty()
		}
		logger.info('grants', result[0])
		setForm(initForm)
		setGrant(result[0].grant)
		const currentSafe = new SupportedPayouts().getSafe(parseInt(result[0].grant?.workspace?.safe?.chainId!), result[0].grant?.workspace?.safe?.address!)
		setSafeObj(currentSafe)
		return 'fetched-grant-details'
	}, [grantId, chainId])

	const fetchProposal = useCallback(async() => {
		if(!proposalId || !chainId || typeof proposalId !== 'string' || typeof chainId !== 'number') {
			return
		}

		const result = await fetchProposalDetails({ proposalId }, true)
		if(!result?.length || !result[0]?.grantApplication) {
			return 'could-not-fetch-proposal-details'
		}

		const chainInfo = getChainInfo(result[0].grantApplication.grant, chainId)
		const initForm: Form = {
			fields: result[0].grantApplication.grant.fields.map((field) => {
				const id = field.id.substring(field.id.indexOf('.') + 1)
				return {
					...field,
					id,
					value: id === 'isMultipleMilestones' ? 'true' : getFieldString(result[0]?.grantApplication, id) ?? ''
				}
			}),
			milestones: result[0].grantApplication.milestones.map((milestone, index) => (
				{ index,
					title: milestone.title,
					amount: chainInfo.address === USD_ASSET ?
						parseInt(milestone.amount) :
						parseInt(ethers.utils.formatUnits(milestone.amount.toString(), chainInfo.decimals))
				})),
			members: containsField(result[0].grantApplication.grant, 'teamMembers') ? getFieldStrings(result[0].grantApplication, 'memberDetails') ?? [''] : [],
			details: await getProjectDetails(getFieldString(result[0].grantApplication, 'projectDetails') ?? '')
		}
		setForm(initForm)
		setProposal(result[0].grantApplication)
		setGrant(result[0].grantApplication.grant)
		const currentSafe = new SupportedPayouts().getSafe(parseInt(result[0].grantApplication.grant?.workspace?.safe?.chainId!), result[0].grantApplication.grant?.workspace?.safe?.address!)
		setSafeObj(currentSafe)
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
		logger.info({}, 'HERE 1')
		if(!grant?.id || !proposal?.applicantPublicKey || !chainId || !proposal?.pii?.length) {
			logger.info({ grantId: grant?.id, proposalKey: proposal?.applicantPublicKey, chainId, length: proposal?.pii }, 'Could not decrypt proposal 2')
			return
		}

		decryptProposal().then((message) => {
			logger.info({ message }, 'Decrypt proposal message')
		})
	}, [grant?.id, proposal?.applicantPublicKey, chainId, scwAddress])

	return providerComponent()
}

export { ProposalFormContext, ProposalFormProvider }