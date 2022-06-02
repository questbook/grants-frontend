import React, { useEffect, useState } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { WorkspaceUpdateRequest } from '@questbook/service-validator-client'
import { useRouter } from 'next/router'
import SubmitPublicKeyModal from 'src/components/ui/submitPublicKeyModal'
import SuccessToast from 'src/components/ui/toasts/successToast'
import useChainId from './utils/useChainId'
import useUpdateWorkspacePublicKeys from './useUpdateWorkspacePublicKeys'

export default function useSubmitPublicKey() {
	const [hiddenModalOpen, setHiddenModalOpen] = useState(false)
	const [publicKey, setPublicKey] = React.useState<WorkspaceUpdateRequest>({ publicKey: '' })
	const [transactionData, loading] = useUpdateWorkspacePublicKeys(publicKey)

	const router = useRouter()
	const toastRef = React.useRef<ToastId>()
	const toast = useToast()
	const chainId = useChainId()
	useEffect(() => {
		if(transactionData) {
			toastRef.current = toast({
				position: 'top',
				render: () => (
					<SuccessToast
						heading="Access applicant personal details"
						body="You can view all the details on new applicant forms submitted."
						close={
							() => {
								if(toastRef.current) {
									toast.close(toastRef.current)
								}
							}
						}
					/>
				),
				onCloseComplete: () => {
					router.reload()
				}
			})
			setHiddenModalOpen(false)
		}
	}, [chainId, toast, transactionData])

	function RenderModal() {
		return (
			<SubmitPublicKeyModal
				hiddenModalOpen={hiddenModalOpen}
				setHiddenModalOpen={setHiddenModalOpen}
				setPublicKey={setPublicKey}
				loading={loading}
			/>
		)
	}

	return {
		RenderModal, hiddenModalOpen, setHiddenModalOpen, publicKey, transactionData, loading,
	}
}
