import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { WorkspaceUpdateRequest } from '@questbook/service-validator-client'
import { useRouter } from 'next/router'
import ErrorToast from 'src/components/ui/toasts/errorToast'
import { defaultChainId } from 'src/constants/chains'
import { useGetWorkspaceDetailsQuery } from 'src/generated/graphql'
import { useMultiChainQuery } from 'src/hooks/useMultiChainQuery'
import useUpdateWorkspace from 'src/hooks/useUpdateWorkspace'
import { ApiClientsContext } from 'src/pages/_app'
import { MAX_IMAGE_SIZE_MB } from 'src/screens/manage_dao/_utils/constants'
import { EditErrors } from 'src/screens/manage_dao/_utils/types'
import { PartnersProps, SettingsForm } from 'src/types'
import {
	generateWorkspaceUpdateRequest,
	workspaceDataToSettingsForm,
} from 'src/utils/settingsUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

function useSettings() {
	const { workspace } = useContext(ApiClientsContext)!

	const router = useRouter()
	const toast = useToast()

	const { results, fetchMore } = useMultiChainQuery({
		useQuery: useGetWorkspaceDetailsQuery,
		options: {
			variables: {
				workspaceID: workspace?.id ?? '',
			}
		},
		chains: [getSupportedChainIdFromWorkspace(workspace) ?? defaultChainId]
	})

	useEffect(() => {
		if(!workspace) {
			return
		}

		fetchMore({
			workspaceID: workspace.id
		}, true)
	}, [workspace])

	const workspaceData = useMemo(() => {
		if(!results) {
			return undefined
		}

		return results[0]?.workspace
	}, [results])

	const toastRef = useRef<ToastId>()
	const [editedFormData, setEditedFormData] = useState<SettingsForm>()
	const [editData, setEditData] = useState<WorkspaceUpdateRequest>()
	const [editError, setEditError] = useState<EditErrors>({})

	const [partnersRequired, setPartnersRequired] = useState(false)
	const [partners, setPartners] = useState<PartnersProps[]>([{
		name: '',
		industry: '',
		website: ''
	}])
	const [networkTransactionModalStep, setNetworkTransactionModalStep] = useState<number>()
	const [, txnLink, loading, isBiconomyInitialised] = useUpdateWorkspace(editData as WorkspaceUpdateRequest, setNetworkTransactionModalStep)

	useEffect(() => {
		if(!workspaceData) {
			return
		}

		setEditedFormData(workspaceDataToSettingsForm(workspaceData))
		if(workspaceData && workspaceData!.partners!.length >= 1) {
			setPartnersRequired(true)
			setPartners(JSON.parse(JSON.stringify(workspaceData.partners)))
		}

	}, [workspaceData])

	const updateEditError = (
		key: keyof SettingsForm,
		error: string | undefined
	) => setEditError((err) => ({ ...err, [key]: error ? { error } : undefined }))

	/**
     * Update the edited form data with the newly updated key/value pair
     * @param update the updated keys
     */
	const updateFormData = (update: Partial<SettingsForm>) => {
		for(const key in update) {
			updateEditError(key as keyof SettingsForm, undefined)
		}

		if(editedFormData) {
			setEditedFormData((current) => ({ ...current!, ...update }))
		}
	}

	const hasError = (key: keyof SettingsForm) => !!editError[key]

	const handleImageChange = (
		key: 'image' | 'coverImage',
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		if(event?.target?.files?.length) {
			const img = event.target.files[0]
			updateFormData({ [key]: URL.createObjectURL(img) })
		}
	}

	const handlePartnerImageChange = (
		event: React.ChangeEvent<HTMLInputElement>,
		index: number
	) => {
		if(event?.target?.files?.length) {
			const img = event.target.files[0]
			if(img.size / 1024 / 1024 <= MAX_IMAGE_SIZE_MB) {
				const newPartners = [...partners!]
				newPartners[index].partnerImageHash = URL.createObjectURL(img)
				updateFormData({ partners: newPartners })
			} else {
				toastRef.current = toast({
					position: 'top',
					render: () => ErrorToast({
						content: `Image size exceeds ${MAX_IMAGE_SIZE_MB} MB`,
						close: () => {
							if(toastRef.current) {
								toast.close(toastRef.current)
							}
						},
					}),
				})
			}
		}
	}

	const handleSubmit = async() => {
		if(!editedFormData || !workspaceData) {
			return
		}

		const data = await generateWorkspaceUpdateRequest(
			editedFormData,
            workspaceDataToSettingsForm(workspaceData)!
		)

		if(!Object.keys(data).length) {
			toast({
				position: 'bottom-right',
				title: 'No Changes to Save!',
				status: 'info',
				isClosable: true,
				duration: 3000,
			})
			return undefined
		}

		setEditData(data)
	}

	const onNetworkModalClose = () => {
		router.reload()
	}

	return {
		workspaceData,
		editedFormData,
		updateFormData,
		partnersRequired,
		setPartnersRequired,
		partners,
		setPartners,
		hasError,
		loading,
		networkTransactionModalStep,
		isBiconomyInitialised,
		txnLink,
		handleImageChange,
		handlePartnerImageChange,
		handleSubmit,
		onNetworkModalClose,
	}
}

export default useSettings