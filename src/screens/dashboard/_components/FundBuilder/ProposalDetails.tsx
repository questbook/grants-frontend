import { useContext, useEffect, useMemo, useState } from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { TokenDetailsInterface } from '@questbook/supported-safes/lib/types/Safe'
import { defaultChainId } from 'src/constants/chains'
import { Dot } from 'src/generated/icons'
import logger from 'src/libraries/logger'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import { getFieldString } from 'src/libraries/utils/formatting'
import { useEncryptPiiForApplication } from 'src/libraries/utils/pii'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { GrantsProgramContext } from 'src/pages/_app'
import MilestoneChoose from 'src/screens/dashboard/_components/FundBuilder/MilestoneChoose'
import { ProposalType } from 'src/screens/dashboard/_utils/types'
import { FundBuilderContext } from 'src/screens/dashboard/Context'

interface Props {
	proposal: ProposalType
	index: number
	tokenInfo: TokenDetailsInterface
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
					<Text color='gray.600'>
						{getFieldString(decryptedProposal, 'applicantName')}
					</Text>

					<Dot
						boxSize='4px'
						mx={2} />

					<Text color='gray.600'>
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
							if(e.target.value?.includes('.')) {
								return
							} else {
								try {
									const copy = [...amounts]
									logger.info({ entered: e.target.value, parsed: parseInt(e.target.value) }, 'FundBuilderModal: entered amount')
									copy[index] = e.target.value !== '' ? parseInt(e.target.value) : 0
									setAmounts(copy)
									// const val = parseInt(e.target.value)
									// logger.info({ entered: e.target.value, parsed: val }, 'FundBuilderModal: entered amount')
									// setAmounts([val])
								} catch(e) {
									logger.error(e, 'FundBuilderModal: error parsing entered amount')
								}
							}

						}
					}
					fontSize='16px'
					fontWeight='400'
					lineHeight='20px'
					borderBottom='2px solid'
					w='100%'
					type='number'
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
							{(amounts?.[index] / (tokenInfo?.fiatConversion)).toFixed(2)}
							{' '}
							{tokenInfo?.tokenName}
						</Text>
					) : null
				}
			</Flex>
		)
	}

	const { grant } = useContext(GrantsProgramContext)!
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