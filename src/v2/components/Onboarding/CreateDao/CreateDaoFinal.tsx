import { useEffect, useState } from 'react'
import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import { NetworkSelectOption } from 'src/v2/components/Onboarding/SupportedNetworksData'
import ContinueButton from 'src/v2/components/Onboarding/UI/Misc/ContinueButton'
import DaoImageUpload from 'src/v2/components/Onboarding/UI/Misc/DaoImageUpload'

const CreateDaoFinal = ({
	daoName,
	daoNetwork,
	daoImageFile,
	onImageFileChange,
	onSubmit,
	isBiconomyInitialised
}: {
  daoName: string
  daoNetwork: NetworkSelectOption
	daoImageFile: File | null
	onImageFileChange: (image: File | null) => void
	onSubmit: (() => Promise<void>) | null
	isBiconomyInitialised: boolean
}) => {
	const [newDaoImageFile, setNewDaoImageFile] = useState<File | null>(null)

	useEffect(() => {
		if(daoImageFile && !newDaoImageFile) {
			setNewDaoImageFile(daoImageFile)
		}
	}, [daoImageFile])

	useEffect(() => {
		onImageFileChange(newDaoImageFile)
	}, [newDaoImageFile])

	return (
		<>
			<Heading variant='small'>
				My DAO
			</Heading>
			<Flex mt={6}>

				<DaoImageUpload
					daoImageFile={newDaoImageFile}
					setDaoImageFile={setNewDaoImageFile} />

				<Flex
					ml={4}
					direction='column'>
					<Text
						fontWeight='500'
						fontSize='2xl'
					>
						{daoName}
					</Text>
					<Box
						display='inline-flex'
						alignItems='center'
						p={0}
						m={0}
						mt='10.32px'
					>
						<Box boxSize={5}>
							{daoNetwork.icon}
						</Box>
						<Text
							ml={1}
							mt='1.5px'
							fontWeight='700'
							fontSize='sm'
							color='brandSubtext'
						>
							{daoNetwork.label}
						</Text>
					</Box>
				</Flex>
			</Flex>

			{/* <NetworkFeeEstimateView
				getEstimate={getCreateWorkspaceGasEstimate}
				chainId={daoNetwork.id} /> */}

			<Flex
				mt={4}
				justifyContent='center'
			>
				<ContinueButton
					onClick={() => onSubmit!()}
					disabled={onSubmit === null || !isBiconomyInitialised}
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