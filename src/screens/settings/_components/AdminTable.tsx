import { useContext, useEffect, useState } from 'react'
import { Button, Flex, Select, Text, Textarea } from '@chakra-ui/react'
import {
	Table,
	TableContainer,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from '@chakra-ui/react'
import { logger } from 'ethers'
import { ExportDownload } from 'src/generated/icons'
import { addTableNotesMutation } from 'src/generated/mutation'
import { executeMutation } from 'src/graphql/apollo'
import { GrantsProgramContext } from 'src/pages/_app'
import StateButton from 'src/screens/discover/_components/stateButton'
import KYCStatusUpdateModal from 'src/screens/settings/_components/KYCStatusUpdateModal'
import { adminTable } from 'src/screens/settings/_utils/types'
import { SettingsFormContext } from 'src/screens/settings/Context'
import {
	Box,
	Badge,
	HStack,
	IconButton,
	Tooltip,
	useColorModeValue,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Heading,
	Card,
	CardHeader,
	CardBody,
	Tag,
	Stat,
	StatLabel,
	StatNumber,
	StatGroup,
	Divider,
	VStack,
	Progress,
	ExternalLinkIcon,
	InfoIcon,
} from '@chakra-ui/react'
import { SettingsIcon, ChevronDownIcon } from '@chakra-ui/icons'


function AdminTable() {

	const TableHeader = ['No', 'Proposal Name', 'Proposal Status', 'KYC/KYB Status', 'Grant Agreement Status', 'Milestone', 'Funding Status', 'Notes']

	const buildComponent = () => {
		logger.info({ tableData }, 'tableData')

		const downloadTXT = () => {
			if(!tableData?.length) {
				return
			}

			const filteredData = tableData
				.filter((row: { state: string }) => {
					if(filter === 'all') {
						return true
					}

					return row?.state === filter
				})
				.sort((a, b) => a.updatedAtS - b.updatedAtS)

			let content = `# ${grant?.title}\n\n`

			content += '## Summary\n'
			content += `- Total Proposals: ${tableData.length}\n`
			content += `- Total Proposals Approved: ${filteredData.filter((row) => row.state === 'approved').length}\n`
			content += `- Total Milestones: ${filteredData.reduce((acc, row) => acc + row.milestones.length, 0)}\n`
			content += `- Total Milestones Completed: ${filteredData.reduce((acc, row) => acc + row.milestones.filter((m) => m.amountPaid > 0).length, 0)}\n\n`

			content += '## Proposals\n\n'
			filteredData.forEach((row) => {
				content += `### [${row.name[0]?.values[0]?.value || 'Untitled'}](https://arbitrum.questbook.app/dashboard/?grantId=${grant?.id}&chainId=10&role=community&proposalId=${row.id})\n`

				const fundingApproved = row?.milestones?.reduce((acc, milestone) => acc + milestone.amount, 0) || 0
				content += `**Funding Approved:** ${fundingApproved}\n\n`

				const completedMilestones = row?.milestones?.filter((m) => m.amountPaid > 0).length || 0
				const totalMilestones = row?.milestones?.length || 0
				content += `**Milestone Progress:** ${completedMilestones}/${totalMilestones}\n\n`

				if(row?.milestones?.length && row?.milestones?.find((milestone) => milestone.amountPaid > 0)) {
					content += '#### Milestones\n'
					row.milestones.forEach((milestone, index) => {
						if(milestone.amountPaid > 0) {
							content += `- [Milestone ${index + 1}: ${milestone.amount} Paid](https://app.safe.global/arb1:${grant?.workspace?.safe?.address}/transactions/tx?id=multisig_${grant?.workspace?.safe?.address}_${row?.fundTransfer?.find((transfer) => transfer.milestone.id === milestone.id)?.transactionHash})\n`
						}
					})
					content += '\n'
				}
			})

			const element = document.createElement('a')
			element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
			element.setAttribute('download', `${grant?.title || 'protocol-ideas'}-${new Date().toISOString().split('T')[0]}.md`)

			element.style.display = 'none'
			document.body.appendChild(element)
			element.click()
			document.body.removeChild(element)
		}

		const downloadCSV = () => {
			if(!tableData?.length) {
				return
			}

			const filteredData = tableData
				.filter((row: { state: string }) => {
					if(filter === 'all') {
						return true
					}

					return row?.state === filter
				})
				.sort((a, b) => a.updatedAtS - b.updatedAtS)

			let csvContent = 'Proposal Name,Funding Approved,Funding Disbursed,Funding Left,Total Milestones,Completed Milestones,Remaining Milestones\n'

			filteredData.forEach((row) => {
				const proposalName = row.name[0]?.values[0]?.value?.replace(/,/g, ' ') || 'Untitled'
				const fundingApproved = row?.milestones?.reduce((acc, milestone) => acc + milestone.amount, 0) || 0
				const fundingDisbursed = row?.milestones?.reduce((acc, milestone) => acc + (milestone.amountPaid || 0), 0) || 0
				const fundingLeft = fundingApproved - fundingDisbursed
				const totalMilestones = row?.milestones?.length || 0
				const completedMilestones = row?.milestones?.filter((m) => m.amountPaid > 0).length || 0
				const remainingMilestones = totalMilestones - completedMilestones

				csvContent += `${proposalName},${fundingApproved},${fundingDisbursed},${fundingLeft},${totalMilestones},${completedMilestones},${remainingMilestones}\n`
			})

			const element = document.createElement('a')
			element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent))
			element.setAttribute('download', `${grant?.title || 'protocol-ideas'}-${new Date().toISOString().split('T')[0]}.csv`)
			element.style.display = 'none'
			document.body.appendChild(element)
			element.click()
			document.body.removeChild(element)
		}

		const TableRow = ({ row, index }: { row: any; index: number }) => {
			const totalFunding = row?.milestones?.reduce((acc, m) => acc + m.amount, 0) || 0
			const fundingDisbursed = row?.milestones?.reduce((acc, m) => acc + (m.amountPaid || 0), 0) || 0
			const completedMilestones = row?.milestones?.filter(m => m.amountPaid > 0).length || 0
			const totalMilestones = row?.milestones?.length || 0

			return (
				<Tr
					_hover={{ bg: 'gray.50' }}
					transition="all 0.2s"
					borderBottom="1px"
					borderColor="gray.100"
				>
					<Td>{index + 1}</Td>
					<Td>
						<HStack spacing={2}>
							<Text
								fontWeight="medium"
								color="blue.600"
								cursor="pointer"
								_hover={{ color: 'blue.700', textDecoration: 'underline' }}
								onClick={() => window.open(`${window.location.origin}/dashboard/?grantId=${grant?.id}&proposalId=${row.id}&chainId=10`, '_blank')}
							>
								{row.name[0].values[0].value}
							</Text>
							<IconButton
								aria-label="Open proposal"
								icon={<ExternalLinkIcon />}
								size="xs"
								variant="ghost"
								color="gray.500"
							/>
						</HStack>
					</Td>

					<Td>
						<StateButton
							state={row.state}
							title={row.state.charAt(0).toUpperCase() + row.state.slice(1)}
						/>
					</Td>

					<Td>
						<StateButton
							state={row?.synapsStatus === 'verified' ? 'approved' : 'submitted'}
							title={row?.synapsStatus === 'verified' ? 'Verified' : 'Pending'}
						/>
					</Td>

					<Td>
						<StateButton
							state={row?.helloSignStatus === 'verified' ? 'approved' : 'submitted'}
							title={row?.helloSignStatus === 'verified' ? 'Verified' : 'Pending'}
						/>
					</Td>

					<Td>
						<HStack spacing={2}>
							<Text fontWeight="medium">
								{completedMilestones}/{totalMilestones}
							</Text>
							<Progress
								value={(completedMilestones/totalMilestones) * 100}
								size="sm"
								width="100px"
								borderRadius="full"
								colorScheme={completedMilestones === totalMilestones ? 'green' : 'blue'}
							/>
						</HStack>
					</Td>

					<Td>
						<HStack spacing={2}>
							<Badge colorScheme="green">
								${fundingDisbursed.toLocaleString()} paid
							</Badge>
							<Badge colorScheme="orange">
								${(totalFunding - fundingDisbursed).toLocaleString()} left
							</Badge>
						</HStack>
					</Td>
				</Tr>
			)
		}

		return (
			<Card shadow="sm" borderRadius="lg">
				<Box p={6}>
					<VStack spacing={6} align="stretch">
						<HStack justify="space-between">
							<Heading size="md">Grant Proposals ({tableData.length})</Heading>
							<HStack spacing={4}>
								<Select
									w="150px"
									value={filter}
									onChange={(e) => setFilter(e.target.value as any)}
								>
									{['All', 'Submitted', 'Approved', 'Rejected'].map((state) => (
										<option key={state} value={state.toLowerCase()}>
											{state}
										</option>
									))}
								</Select>
								<Button
									leftIcon={<ExportDownload />}
									colorScheme="blue"
									variant="outline"
									size="sm"
									onClick={downloadTXT}
								>
									Export MD
								</Button>
								<Button
									leftIcon={<ExportDownload />}
									colorScheme="blue"
									variant="outline"
									size="sm"
									onClick={downloadCSV}
								>
									Export CSV
								</Button>
							</HStack>
						</HStack>

						<Table variant="simple">
							<Thead>
								<Tr bg="gray.50">
									{TableHeader.map((header) => (
										<Th key={header} py={4}>
											{header}
										</Th>
									))}
								</Tr>
							</Thead>
							<Tbody>
								{tableData
									?.filter(row => filter === 'all' ? true : row?.state === filter)
									?.map((row, index) => (
										<TableRow key={row.id} row={row} index={index} />
									))}
							</Tbody>
						</Table>
					</VStack>
				</Box>
			</Card>
		)

	}

	const [showKYCStatusUpdateModal, setShowKYCStatusUpdateModal] = useState<{
        type: 'kyc' | 'hellosign'
        isOpen: boolean
        grantId: string
    }>({
    	type: 'kyc',
    	isOpen: false,
    	grantId: ''
    })
	const [filter, setFilter] = useState<'all' | 'submitted' | 'approved' | 'rejected'>('all')
	const [filteredMilestones, setFilteredMilestones] = useState([{
		id: '',
		value: ''
	}])
	const [tableData, setTableData] = useState<adminTable>([])
	const { adminTable, workspace } = useContext(SettingsFormContext)!
	const { grant } = useContext(GrantsProgramContext)!

	useEffect(() => {
		setTableData(adminTable)
	}, [adminTable])


	return buildComponent()
}

export default AdminTable