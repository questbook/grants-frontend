import { ChangeEvent, ReactElement, useContext, useEffect, useMemo, useState } from 'react'
import { Button, Flex, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import logger from 'src/libraries/logger'
import BackButton from 'src/libraries/ui/BackButton'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import NetworkTransactionFlowStepperModal from 'src/libraries/ui/NetworkTransactionFlowStepperModal'
import { getChainInfo } from 'src/libraries/utils/token'
import { ApiClientsContext } from 'src/pages/_app'
import SectionHeader from 'src/screens/proposal_form/_components/SectionHeader'
import SectionInput from 'src/screens/proposal_form/_components/SectionInput'
import SectionRichTextEditor from 'src/screens/proposal_form/_components/SectionRichTextEditor'
import SectionSelect from 'src/screens/proposal_form/_components/SectionSelect'
import SelectArray from 'src/screens/proposal_form/_components/SelectArray'
import useSubmitProposal from 'src/screens/proposal_form/_hooks/useSubmitProposal'
import { containsField, findField } from 'src/screens/proposal_form/_utils'
import { MILESTONE_INPUT_STYLE } from 'src/screens/proposal_form/_utils/constants'
import { ProposalFormContext, ProposalFormProvider } from 'src/screens/proposal_form/Context'
import { getExplorerUrlForTxHash, getRewardAmountMilestones } from 'src/utils/formattingUtils'

function ProposalForm() {
	const buildComponent = () => {
		return (
			<Flex
				w='100%'
				h='calc(100vh - 64px)'
				align='start'
				justify='center'>
				<Flex
					direction='column'
					w='90%'
					bg='white'
					boxShadow='0px 2px 4px rgba(29, 25, 25, 0.1)'
					overflowY='auto'
					my={5}
					px={6}
					py={10}>
					<Flex justify='start'>
						<BackButton />
					</Flex>
					<Flex
						mx='auto'
						direction='column'
						w='84%'
						h='100%'
						align='center'
					>
						<Text
							w='100%'
							textAlign='center'
							variant='v2_heading_3'
							fontWeight='500'
							borderBottom='1px solid #E7E4DD'
							pb={4}>
							Submit Proposal
						</Text>

						{/* Builder Details */}
						<SectionHeader mt={8}>
							Builder details
						</SectionHeader>
						{
							containsField(grant, 'applicantName') && (
								<SectionInput
									label='Full Name'
									placeholder='Ryan Adams'
									value={findField(form, 'applicantName').value}
									onChange={
										(e) => {
											onChange(e, 'applicantName')
										}
									} />
							)
						}
						{
							containsField(grant, 'applicantEmail') && (
								<SectionInput
									label='Email'
									placeholder='name@sample.com'
									value={findField(form, 'applicantEmail').value}
									onChange={
										(e) => {
											onChange(e, 'applicantEmail')
										}
									} />
							)
						}
						{
							containsField(grant, 'applicantAddress') && (
								<SectionInput
									label='Wallet Address'
									placeholder='0xEbd6dB5a58c9812df3297E2Bc2fF0BDFEac2453c'
									value={findField(form, 'applicantAddress').value}
									onChange={
										(e) => {
											onChange(e, 'applicantAddress')
										}
									} />
							)
						}

						{
							containsField(grant, 'teamMembers') && (
								<SectionSelect
									label='Team Members'
									defaultValue={1}
									min={1}
									max={10}
									value={form?.members?.length}
									onChange={
										(e) => {
											const copy = { ...form }
											const newLength = parseInt(e)
											if(newLength > copy.members.length) {
												copy.members = copy.members.concat(Array(newLength - copy.members.length).fill(''))
											} else if(newLength < copy.members.length) {
												copy.members = copy.members.slice(0, newLength)
											}

											setForm(copy)
										}
									} />
							)
						}

						{
							containsField(grant, 'teamMembers') && form.members?.map((member, index) => {
								return (
									<SectionInput
										key={index}
										label={`Member ${index + 1}`}
										placeholder={`Bio about member ${index + 1}`}
										maxLength={300}
										value={member}
										onChange={
											(e) => {
												const copy = { ...form }
												copy.members[index] = e.target.value
												setForm(copy)
											}
										} />
								)
							})
						}

						{/* Proposal Details */}
						<SectionHeader mt={8}>
							Proposal
						</SectionHeader>
						{
							containsField(grant, 'projectName') && (
								<SectionInput
									label='Title'
									placeholder='Name of your proposal'
									maxLength={80}
									value={findField(form, 'projectName').value}
									onChange={
										(e) => {
											onChange(e, 'projectName')
										}
									} />
							)
						}
						{
							containsField(grant, 'tldr') && (
								<SectionInput
									label='tl;dr'
									placeholder='Explain your proposal in one sentence'
									maxLength={120}
									value={findField(form, 'tldr').value}
									onChange={
										(e) => {
											onChange(e, 'tldr')
										}
									} />
							)
						}

						{
							containsField(grant, 'projectDetails') && (
								<SectionRichTextEditor
									label='Details'
									flexProps={{ align: 'start' }}
									editorState={form.details}
									setEditorState={
										(e) => {
											const copy = { ...form }
											copy.details = e
											setForm(copy)
										}
									} />
							)
						}

						<SelectArray
							label='Milestones'
							allowMultiple={grant?.payoutType === 'milestones'}
							config={
								form?.milestones?.map((milestone, index) => {
									return [
										{
											...MILESTONE_INPUT_STYLE[0],
											value: milestone?.title,
											onChange: (e) => {
												const copy = { ...form }
												copy.milestones[index].title = e.target.value
												setForm(copy)
											}
										},
										{
											...MILESTONE_INPUT_STYLE[1],
											value: milestone?.amount > 0 ? milestone?.amount : '',
											onChange: (e) => {
												const copy = { ...form }
												copy.milestones[index].amount = parseFloat(e.target.value)
												setForm(copy)
											}
										},
									]
								})
							} />

						<SectionInput
							label='Funding Asked'
							isDisabled
							placeholder='12000 USD'
							value={`${fundingAsk} ${chainInfo?.label}`}
						/>

						{/* Render custom Fields */}
						{
							containsField(grant, 'customField0') && (
								<SectionHeader mt={8}>
									Other information
								</SectionHeader>
							)
						}

						{
							grant?.fields?.filter((field) => field.id.substring(field.id.indexOf('.') + 1).startsWith('customField')).map((field) => {
								const id = field.id.substring(field.id.indexOf('.') + 1)
								return (
									<SectionInput
										key={field.id}
										label={field.title}
										value={findField(form, id).value}
										onChange={
											(e) => {
												onChange(e, id)
											}
										} />
								)
							})
						}

						<Button
							mt={10}
							w='30%'
							ml='auto'
							variant='primaryLarge'
							isDisabled={!isBiconomyInitialised}
							onClick={
								() => {
									submitProposal(form)
								}
							}>
							<Text
								color='white'
								fontWeight='500'>
								{type === 'submit' ? 'Submit' : 'Resubmit'}
								{' '}
								Proposal
							</Text>
						</Button>
					</Flex>
				</Flex>
				<NetworkTransactionFlowStepperModal
					isOpen={networkTransactionModalStep !== undefined}
					currentStepIndex={networkTransactionModalStep || 0}
					viewTxnLink={getExplorerUrlForTxHash(chainId, transactionHash)}
					onClose={
						() => {
							setNetworkTransactionModalStep(undefined)
							setRole('builder')
							router.push({ pathname: '/dashboard' })
						}
					} />
			</Flex>
		)
	}

	const { setRole } = useContext(ApiClientsContext)!
	const { type, grant, chainId, form, setForm } = useContext(ProposalFormContext)!

	const router = useRouter()

	const [networkTransactionModalStep, setNetworkTransactionModalStep] = useState<number>()
	const [transactionHash, setTransactionHash] = useState<string>('')
	const { submitProposal, isBiconomyInitialised } = useSubmitProposal({ setNetworkTransactionModalStep, setTransactionHash })

	const chainInfo = useMemo(() => {
		if(!grant || !chainId) {
			return
		}

		return getChainInfo(grant, chainId)
	}, [grant, chainId])

	const fundingAsk = useMemo(() => {
		const val = getRewardAmountMilestones(chainInfo?.decimals ?? 0, { milestones: form.milestones.map((m) => ({ ...m, amount: m.amount.toString() })) })
		return val
	}, [form])

	useEffect(() => {
		logger.info({ form }, 'Form changed')
	}, [form])

	const onChange = (e: ChangeEvent<HTMLInputElement>, id: string) => {
		const copy = { ...form }
		findField(copy, id).value = e.target.value
		setForm(copy)
	}

	return buildComponent()
}

ProposalForm.getLayout = (page: ReactElement) => {
	return (
		<NavbarLayout renderSidebar={false}>
			<ProposalFormProvider>
				{page}
			</ProposalFormProvider>
		</NavbarLayout>
	)
}

export default ProposalForm