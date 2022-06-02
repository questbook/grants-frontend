import React, { ReactElement, useContext, useEffect } from 'react'
import {
	Container, Text, ToastId, useToast,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { SupportedChainId } from 'src/constants/chains'
import { SupportedNetwork } from 'src/generated/graphql'
import useCreateGrant from 'src/hooks/useCreateGrant'
import useCreateWorkspace from 'src/hooks/useCreateWorkspace'
import Form from '../src/components/signup/create_dao/form'
import Loading from '../src/components/signup/create_dao/loading'
import CreateGrant from '../src/components/signup/create_grant'
import DaoCreated from '../src/components/signup/daoCreated'
import InfoToast from '../src/components/ui/infoToast'
import NavbarLayout from '../src/layout/navbarLayout'
import { ApiClientsContext } from './_app'

function SignupDao() {
	const router = useRouter()
	const { setWorkspace } = useContext(ApiClientsContext)!

	const [daoCreated, setDaoCreated] = React.useState(false)
	const [creatingGrant, setCreatingGrant] = React.useState(router.query.create_grant === 'true')

	const [newWorkspaceObject, setNewWorkspaceObject] = React.useState<any>({})
	const [newPublicKey, setNewPublicKey] = React.useState()

	const [daoData, setDaoData] = React.useState<{
    name: string;
    description: string;
    image: string;
    network: SupportedChainId;
    id: string;
  } | null>(null)

	const toastRef = React.useRef<ToastId>()
	const toast = useToast()

	const [workspaceData, setWorkspaceData] = React.useState<any>()
	const [
		workspaceTransactionData,
		workspaceTxnLink,
		imageHash,
		workspaceLoading,
	] = useCreateWorkspace(workspaceData)

	useEffect(() => {
		if(
			workspaceData
      && workspaceTransactionData
      && workspaceTransactionData.events.length > 0
      && workspaceTransactionData.events[0].event === 'WorkspaceCreated'
      && imageHash
		) {
			const newId = workspaceTransactionData.events[0].args.id
			setDaoData({
				...workspaceData,
				image: imageHash,
				id: Number(newId).toString(),
			})
			setDaoCreated(true)
			const w = {
				id: Number(newId).toString(),
				logoIpfsHash: imageHash,
				ownerId: workspaceData.ownerId,
				supportedNetworks: [`chain_${workspaceData.network}` as SupportedNetwork],
				title: workspaceData.name,
				members: [{
					accessLevel: 'owner' as any,
					email: null,
					id: `${Number(newId).toString()}.${workspaceData.ownerId}`,
					lastReviewSubmittedAt: 0,
					outstandingReviewIds: [],
					actorId: workspaceData.ownerId,
					publicKey: undefined,
				}],
				tokens: [],
			}
			setNewWorkspaceObject(w)
			setWorkspace(w)
		}

	}, [workspaceTransactionData, imageHash, workspaceData, router])

	const [grantData, setGrantData] = React.useState<any>()
	const [
		grantTransactionData,
		transactionLink,
		createGrantLoading,
	] = useCreateGrant(grantData, workspaceData?.network, daoData?.id)

	useEffect(() => {
		// console.log(grantTransactionData);
		if(grantTransactionData) {
			setGrantData(null)

			if(newPublicKey) {
				const w = { ...newWorkspaceObject }
				w.members = [{
					accessLevel: 'owner',
					email: null,
					id: `${w.id}.${workspaceData.ownerId}`,
					lastReviewSubmittedAt: 0,
					outstandingReviewIds: [],
					actorId: workspaceData.ownerId,
					publicKey: newPublicKey,
				}]
				setWorkspace(w)
			}

			router.replace({ pathname: '/your_grants', query: { done: 'yes' } })

			const link = transactionLink
			toastRef.current = toast({
				position: 'top',
				render: () => (
					<InfoToast
						link={link}
						close={
							() => {
								if(toastRef.current) {
									toast.close(toastRef.current)
								}
							}
						}
					/>
				),
			})
		}

	}, [toast, grantTransactionData, router])

	if(creatingGrant) {
		return (
			<CreateGrant
				hasClicked={createGrantLoading}
				onSubmit={
					(data) => {
						const dataCopy = { ...data }
						if(data.publicKey) {
							setNewPublicKey(data.publicKey)
							delete dataCopy.publicKey
						}

						setGrantData(dataCopy)
					}
				}
			/>
		)
	}

	if(daoCreated && daoData) {
		return (
			<DaoCreated
				daoName={daoData.name}
				network={daoData.network}
				onCreateGrantClick={() => setCreatingGrant(true)}
				onVisitGrantsClick={() => router.push({ pathname: '/your_grants' })}
				txnLink={workspaceTxnLink}
			/>
		)
	}

	if(workspaceLoading) {
		return <Loading />
	}

	return (
		<Container
			maxW="100%"
			display="flex"
			px="70px"
			flexDirection="column"
			alignItems="center"
		>
			<Text
				mt="46px"
				variant="heading">
        What should we call your Grants DAO?
			</Text>
			<Text
				mt={7}
				maxW="676px"
				textAlign="center">
        A Grants DAO is a neatly arranged space where you can manage grants,
        review grant applications and fund grants.
			</Text>
			<Form
				// hasClicked={workspaceLoading}
				onSubmit={
					(data) => {
						setWorkspaceData(data)
					}
				}
			/>
		</Container>
	)
}

SignupDao.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout renderTabs={false}>
			{page}
		</NavbarLayout>
	)
}

export default SignupDao
