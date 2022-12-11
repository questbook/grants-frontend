import { useContext, useEffect, useMemo, useState } from 'react'
import { Flex, Image, Text } from '@chakra-ui/react'
import { defaultChainId } from 'src/constants/chains'
import logger from 'src/libraries/logger'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import { useEncryptPiiForApplication } from 'src/libraries/utils/pii'
import { ApiClientsContext } from 'src/pages/_app'
import MilestoneChoose from 'src/screens/dashboard/_components/FundBuilder/MilestoneChoose'
import { ProposalType } from 'src/screens/dashboard/_utils/types'
import { DashboardContext, FundBuilderContext } from 'src/screens/dashboard/Context'
import { getFieldString } from 'src/utils/formattingUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

interface Props {
	proposal: ProposalType
	index: number
}

function ProposalDetails({ proposal, index }: Props) {
	const buildComponent = () => {
		return (
			<Flex
				p={4}
				w='100%'
				direction='column'
				borderBottom='1px solid #E7E4DD'>

				<Flex align='center'>
					<Text color='gray.6'>
						{getFieldString(decryptedProposal, 'applicantName')}
					</Text>

					<Image
						src='/v2/icons/dot.svg'
						boxSize='4px'
						mx={2} />

					<Text color='gray.6'>
						{getFieldString(decryptedProposal, 'projectName')}
					</Text>
				</Flex>

				<FlushedInput
					isDisabled={!proposal}
					placeholder='Enter builder address here'
					value={tos?.[index]}
					onChange={
						(e) => {
							const copy = [...tos]
							copy[index] = e.target.value
							setTos(copy)
						}
					}
					fontSize='16px'
					fontWeight='400'
					lineHeight='20px'
					borderBottom='2px solid'
					w='100%'
					textAlign='left'
					flexProps={
						{
							w: '100%',
						}
					} />

				<MilestoneChoose
					p={0}
					mt={5}
					borderBottom={undefined}
					proposal={proposal}
					index={index} />

				<FlushedInput
					isDisabled={!proposal}
					placeholder='$0'
					value={amounts?.[index]}
					onChange={
						(e) => {
							const copy = [...amounts]
							copy[index] = parseFloat(e.target.value)
							setAmounts(copy)
						}
					}
					fontSize='16px'
					fontWeight='400'
					lineHeight='20px'
					borderBottom='2px solid'
					w='100%'
					textAlign='left'
					flexProps={
						{
							w: '100%',
						}
					} />
			</Flex>
		)
	}

	const { workspace } = useContext(ApiClientsContext)!
	const { grants, selectedGrantIndex } = useContext(DashboardContext)!
	const { amounts, setAmounts, tos, setTos } = useContext(FundBuilderContext)!
	const [decryptedProposal, setDecryptedProposal] = useState<ProposalType | undefined>(proposal)

	const chainId = useMemo(() => {
		return getSupportedChainIdFromWorkspace(workspace) ?? defaultChainId
	}, [workspace])

	const selectedGrant = useMemo(() => {
		if(!grants?.length || selectedGrantIndex === undefined || selectedGrantIndex >= grants?.length) {
			return
		}

		const temp = grants[selectedGrantIndex]
		if(temp.__typename === 'Grant') {
			return temp
		} else if(temp.__typename === 'GrantReviewerCounter') {
			return temp.grant
		}
	}, [selectedGrantIndex, grants])

	const { decrypt } = useEncryptPiiForApplication(
		selectedGrant?.id,
		proposal?.applicantPublicKey,
		chainId
	)

	useEffect(() => {
		if(!proposal) {
			return
		}

		decrypt(proposal).then(setDecryptedProposal)
	}, [proposal])

	useEffect(() => {
		logger.info({ decryptedProposal }, 'Decrypted proposal')
	}, [decryptedProposal])

	return buildComponent()
}

export default ProposalDetails