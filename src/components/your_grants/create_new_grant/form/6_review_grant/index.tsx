import { useContext, useEffect, useState } from 'react'
import { Box, Flex, Skeleton, Text } from '@chakra-ui/react'
import { formatEther } from 'ethers/lib/utils'
import { ApiClientsContext } from 'pages/_app'
import { CHAIN_INFO } from 'src/constants/chains'
import useWorkspaceRegistryContract from 'src/hooks/contracts/useWorkspaceRegistryContract'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import { GasStation } from 'src/v2/assets/custom chakra icons/GasStation'
import { useProvider } from 'wagmi'
import ReviewApplicantDetails from './applicant_details'
import ReviewApplicantPrivacy from './applicant_privacy'
import ReviewGrantDetails from './grant_details'
import ReviewGrantReward from './grant_reward'
import ReviewGrantTitle from './grant_title'
import ReviewProjectEvaluation from './project_evaluation'
import ReviewProjectMilestone from './project_milestone'

function ReviewGrant({
	title,
	setTitle,
	titleError,
	setTitleError,
	details,
	setDetails,
	detailsError,
	setDetailsError,
	applicantDetailsList,
	detailsRequired,
	toggleDetailsRequired,
	customFieldsOptionIsVisible,
	setCustomFieldsOptionIsVisible,
	customFields,
	setCustomFields,
	milestoneSelectOptionIsVisible,
	defaultMilestoneFields,
	setDefaultMilestoneFields,
	setMilestoneSelectOptionIsVisible,
	shouldEncrypt,
	setShouldEncrypt,
	rubricRequired,
	setRubricRequired,
	rubrics,
	setRubrics,
	supportedCurrencies,
	reward,
	setReward,
	rewardError,
	setRewardError,
	rewardCurrency,
	setRewardCurrency,
	setRewardCurrencyAddress,
	setRewardToken,
	dateError,
	setDateError,
	date,
	setDate, }) {

	const provider = useProvider()

	const apiClients = useContext(ApiClientsContext)!
	const { workspace } = apiClients

	const [ gasEstimate, setGasEstimate ] = useState<string>()


	const chainId = getSupportedChainIdFromWorkspace(workspace)
	const workspaceRegistryContract = useWorkspaceRegistryContract(
		chainId
	)

	useEffect(() => {
		const calculateGasPrice = async(hash: string) => {
			const estimate = await workspaceRegistryContract.estimateGas.createWorkspace(hash,)
			const gasPrice = await provider.getGasPrice()
			setGasEstimate(formatEther(estimate.mul(gasPrice)))
		}

		if(workspace && workspaceRegistryContract.signer !== null && provider !== null) {
			calculateGasPrice('0000000000000000000000000000000000000000000000')
		}
	}, [ workspace, workspaceRegistryContract])

	return (
		<Box>
			<Box mt="20px" />
			<ReviewGrantTitle
				title={title}
				setTitle={setTitle}
				titleError={titleError}
				setTitleError={setTitleError} />
			<Box mt="20px" />
			<ReviewGrantDetails
				details={details}
				setDetails={setDetails}
				detailsError={detailsError}
				setDetailsError={setDetailsError} />
			<Box mt="20px" />
			<ReviewApplicantDetails
				applicantDetailsList={applicantDetailsList}
				detailsRequired={detailsRequired}
				toggleDetailsRequired={toggleDetailsRequired}
				customFieldsOptionIsVisible={customFieldsOptionIsVisible}
				setCustomFieldsOptionIsVisible={setCustomFieldsOptionIsVisible}
				customFields={customFields}
				setCustomFields={setCustomFields} />
			<Box mt="20px" />
			<ReviewProjectMilestone
				milestoneSelectOptionIsVisible={milestoneSelectOptionIsVisible}
				defaultMilestoneFields={defaultMilestoneFields}
				setDefaultMilestoneFields={setDefaultMilestoneFields}
				setMilestoneSelectOptionIsVisible={setMilestoneSelectOptionIsVisible} />
			<Box mt="20px" />
			<ReviewProjectEvaluation
				rubricRequired={rubricRequired}
				setRubricRequired={setRubricRequired}
				rubrics={rubrics}
				setRubrics={setRubrics}
			/>
			<Box mt="20px" />
			<ReviewGrantReward
				supportedCurrencies={supportedCurrencies}
				reward={reward}
				setReward={setReward}
				rewardError={rewardError}
				setRewardError={setRewardError}
				rewardCurrency={rewardCurrency}
				setRewardCurrency={setRewardCurrency}
				setRewardCurrencyAddress={setRewardCurrencyAddress}
				setRewardToken={setRewardToken}
				dateError={dateError}
				setDateError={setDateError}
				date={date}
				setDate={setDate} />
			<Box mt="20px" />
			<ReviewApplicantPrivacy
				shouldEncrypt={shouldEncrypt}
				setShouldEncrypt={setShouldEncrypt} />
			<Box mt="20px" />
			<Flex
				mt={'24px'}
				mb={'24px'}
				justifyContent={'center'}
			>
				<Skeleton isLoaded={gasEstimate !== undefined}>
					<Flex
						bg={'#F0F0F7'}
						borderRadius={'base'}
						px={3}>
						<GasStation
							color={'#89A6FB'}
							boxSize={5} />
						<Text
							ml={2}
							mt={'1.5px'}
							fontSize={'xs'}>
              Network Fee -
							{' '}
							{gasEstimate}
							{' '}
							{CHAIN_INFO[chainId].nativeCurrency.symbol}
						</Text>
					</Flex>
				</Skeleton>
			</Flex>
		</Box>
	)
}

export default ReviewGrant