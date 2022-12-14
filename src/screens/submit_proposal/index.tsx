import { ReactElement } from 'react'
import { Flex, Text } from '@chakra-ui/react'
import BackButton from 'src/libraries/ui/BackButton'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import SectionHeader from 'src/screens/submit_proposal/_components/SectionHeader'
import SectionInput from 'src/screens/submit_proposal/_components/SectionInput'
import SectionRichTextEditor from 'src/screens/submit_proposal/_components/SectionRichTextEditor'
import SectionSelect from 'src/screens/submit_proposal/_components/SectionSelect'
import SelectArray from 'src/screens/submit_proposal/_components/SelectArray'

function SubmitProposal() {
	const buildComponent = () => {
		return (
			<Flex
				w='100%'
				h='calc(100vh - 64px)'
				align='start'
				justify='center'
				py={5}>
				<Flex
					direction='column'
					w='90%'
					bg='white'
					boxShadow='0px 2px 4px rgba(29, 25, 25, 0.1)'
					overflowY='auto'
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
						<SectionInput
							label='Full Name'
							placeholder='Ryan Adams' />
						<SectionInput
							label='Email'
							placeholder='name@sample.com' />
						<SectionInput
							label='Wallet Address'
							placeholder='0xEbd6dB5a58c9812df3297E2Bc2fF0BDFEac2453c' />
						<SectionSelect
							label='Team Members'
							defaultValue={1}
							min={1}
							max={10} />
						<SectionInput
							label='Member 1'
							placeholder='Bio about member 1'
							maxLength={300} />
						<SectionInput
							label='Member 2'
							placeholder='Bio about member 2'
							maxLength={300} />

						{/* Proposal Details */}
						<SectionHeader mt={8}>
							Proposal
						</SectionHeader>
						<SectionInput
							label='Title'
							placeholder='Name of your proposal'
							maxLength={80} />
						<SectionInput
							label='tl:dr'
							placeholder='Explain your proposal in one sentence'
							maxLength={120} />

						<SectionRichTextEditor
							label='Details'
							flexProps={{ align: 'start' }} />

						<SelectArray
							label='Milestones'
							config={Array(5).fill(milestoneConfig)} />

						<SectionInput
							label='Funding Asked (in USD)'
							placeholder='12000'
							type='number' />

					</Flex>
				</Flex>
			</Flex>
		)
	}

	const milestoneConfig = [{ placeholder: 'Add milestone', maxLength: 1024 }, { placeholder: 'Funding ask for this milestone', type: 'number' }]

	return buildComponent()
}

SubmitProposal.getLayout = (page: ReactElement) => {
	return (
		<NavbarLayout renderSidebar={false}>
			{page}
		</NavbarLayout>
	)
}

export default SubmitProposal