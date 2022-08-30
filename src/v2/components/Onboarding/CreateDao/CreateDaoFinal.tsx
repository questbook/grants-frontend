import { useCallback, useEffect, useState } from 'react'
import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import { formatEther } from 'ethers/lib/utils'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useProvider } from 'wagmi'
import NetworkFeeEstimateView from '../../NetworkFeeEstimateView'
import { NetworkSelectOption } from '../SupportedNetworksData'
import ContinueButton from '../UI/Misc/ContinueButton'
import DaoImageUpload from '../UI/Misc/DaoImageUpload'

const CreateDaoFinal = ({
	daoName,
	daoNetwork,
	daoImageFile,
	onImageFileChange,
	onSubmit,
}: {
  daoName: string,
  daoNetwork: NetworkSelectOption,
	daoImageFile: File | null,
	onImageFileChange: (image: File | null) => void
	onSubmit: (() => Promise<void>) | null
}) => {
	const provider = useProvider()
	const [gasEstimate, setGasEstimate] = useState<string>()
	const [newDaoImageFile, setNewDaoImageFile] = useState<File | null>(null)

	const workspaceRegistryContract = useQBContract(
		'workspace',
		daoNetwork.id,
	)

	const getCreateWorkspaceGasEstimate = useCallback(
		() => {
			return workspaceRegistryContract.estimateGas.createWorkspace(
				// random hash -- just to estimate gas
				'QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB',
				new Uint8Array(32),
				'safe address',
				0
			)
		},
		[workspaceRegistryContract],
	)

	useEffect(() => {
		if(daoImageFile && !newDaoImageFile) {
			setNewDaoImageFile(daoImageFile)
		}
	}, [daoImageFile])

	const estimateCreateWorkspace = async(hash: string) => {
		setGasEstimate(undefined)
		try {

			const estimate = await workspaceRegistryContract.estimateGas.createWorkspace(hash, new Uint8Array(32), 'safe address', 0)
			const gasPrice = await provider.getGasPrice()
			setGasEstimate(formatEther(estimate.mul(gasPrice)))
		} catch(e) {
			// console.log(e)
			// console.log('error', Date.now())
			// console.log(workspaceRegistryContract)

			// @TODO
			// getting cannot estimate gas error unpredictably
		}
	}

	useEffect(() => {
		if(workspaceRegistryContract.signer !== null && provider !== null) {
			estimateCreateWorkspace('0000000000000000000000000000000000000000000000')
		}
	}, [workspaceRegistryContract, provider])

	useEffect(() => {
		onImageFileChange(newDaoImageFile)
	}, [newDaoImageFile])

	return (
		<>
			<Heading variant={'small'}>
        My DAO
			</Heading>
			<Flex mt={6}>

				<DaoImageUpload
					daoImageFile={newDaoImageFile}
					setDaoImageFile={setNewDaoImageFile} />

				<Flex
					ml={4}
					direction={'column'}>
					<Text
						fontWeight={'500'}
						fontSize={'2xl'}
					>
						{daoName}
					</Text>
					<Box
						display={'inline-flex'}
						alignItems={'center'}
						p={0}
						m={0}
						mt={'10.32px'}
					>
						<Box boxSize={5}>
							{daoNetwork.icon}
						</Box>
						<Text
							ml={1}
							mt={'1.5px'}
							fontWeight={'700'}
							fontSize={'sm'}
							color={'brandSubtext'}
						>
							{daoNetwork.label}
						</Text>
					</Box>
				</Flex>
			</Flex>

			<NetworkFeeEstimateView
				getEstimate={getCreateWorkspaceGasEstimate}
				chainId={daoNetwork.id} />

			<Flex
				mt={4}
				justifyContent={'center'}
			>
				<ContinueButton
					onClick={() => onSubmit!()}
					disabled={onSubmit === null}
					props={
						{
							minW: '343px',
							variant: 'primaryLightV2'
						}
					}
					content={
						<>
            				Create Dao
						</>
					}
				/>
			</Flex>
		</>
	)
}

export default CreateDaoFinal