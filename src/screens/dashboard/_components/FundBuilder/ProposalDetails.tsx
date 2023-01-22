import { useContext, useEffect, useMemo, useState } from 'react'
import { Flex, Image, Text } from '@chakra-ui/react'
import { defaultChainId } from 'src/constants/chains'
import { GrantProgramContext } from 'src/contexts/GrantProgramContext'
import logger from 'src/libraries/logger'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import { useEncryptPiiForApplication } from 'src/libraries/utils/pii'
import MilestoneChoose from 'src/screens/dashboard/_components/FundBuilder/MilestoneChoose'
import { ProposalType, TokenInfo } from 'src/screens/dashboard/_utils/types'
import { FundBuilderContext } from 'src/screens/dashboard/Context'
import { getFieldString } from 'src/utils/formattingUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

interface Props {
	proposal: ProposalType
	index: number
	tokenInfo: TokenInfo
}

function ProposalDetails({ proposal, index, tokenInfo }: Props) {


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
				{
					amounts?.[index] > 0 && tokenInfo?.fiatConversion ? (
						<Text
							color='#53514F'
							fontSize='14px'
							mt='8px'>
							≈
							{' '}
							{(amounts?.[0] / parseFloat(tokenInfo?.fiatConversion!.toString())).toFixed(2)}
							{' '}
							{tokenInfo?.tokenName}
						</Text>
					) : null
				}
			</Flex>
		)
	}

	const { grant } = useContext(GrantProgramContext)!
	const { amounts, setAmounts, tos, setTos } = useContext(FundBuilderContext)!
	const [decryptedProposal, setDecryptedProposal] = useState<ProposalType | undefined>(proposal)

	const chainId = useMemo(() => {
		return getSupportedChainIdFromWorkspace(grant?.workspace) ?? defaultChainId
	}, [grant])

	const { decrypt } = useEncryptPiiForApplication(
		grant?.id,
		proposal?.applicantPublicKey,
		chainId
	)

	useEffect(() => {
		if(!proposal) {
			return
		}

		decrypt(proposal).then((decrypted) => {
			setDecryptedProposal({ ...proposal, ...decrypted })
		})
	}, [proposal])

	useEffect(() => {
		logger.info({ decryptedProposal }, 'Decrypted proposal')
	}, [decryptedProposal])

	return buildComponent()
}

export default ProposalDetails