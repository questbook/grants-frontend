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

		const rowData = tableData?.filter((row: {
        state: string
    }) => {
			return filter === 'all' ? true : row?.state === filter
		})?.map((row, index) => {
			return (
				<Tr
					key={index}
					_hover={
						{
							bg: 'gray.100'
						}
					}
				>
					<Td>
						{index + 1}
					</Td>
					<Td>
						<Text
							fontSize='sm'
							onClick={
								() => {

									window.open(`${window.location.origin}/dashboard/?grantId=${grant?.id}&proposalId=${row.id}&chainId=10`, '_blank')

								}
							}
							cursor='pointer'

						>
							{row.name[0].values[0].value?.length > 40 ? row.name[0].values[0].value.substring(0, 40) + '...' : row.name[0].values[0].value}
						</Text>
					</Td>
					<Td
						w='5%'
					>
						<StateButton
							state={row.state === 'approved' ? 'approved' : row.state === 'rejected' ? 'rejected' : 'submitted'}
							title={row.state}
						/>
					</Td>
					<Td
						w='5%'
						cursor='pointer'
						// onClick={
						// 	() => {
						// 		if(row?.state === 'approved') {
						// 			setShowKYCStatusUpdateModal({
						// 				...showKYCStatusUpdateModal,
						// 				isOpen: true,
						// 				grantId: row.id,
						// 				type: 'kyc'
						// 			})
						// 		}
						// 	}
						// }
					>
						{
							row.synapsStatus?.length > 0 ? (
								<StateButton
									state={row?.synapsStatus === 'verified' || row?.synapsStatus === 'completed' ? 'approved' : 'submitted'}
									title={row?.synapsStatus === 'verified' || row?.synapsStatus === 'completed' ? 'Verified' : 'Pending'}
								/>
							)
								: row?.state === 'approved' ? (
									<StateButton
										state='submitted'
										title='Pending'
									/>
								) : '-'

						}
					</Td>

					<Td
						w='5%'
						cursor='pointer'
					>
						{
							row.helloSignStatus?.length > 0 ? (
								<StateButton
									state={row?.helloSignStatus === 'verified' || row?.helloSignStatus === 'completed' ? 'approved' : row?.helloSignStatus === 'declined' ? 'rejected' : 'submitted'}
									title={row?.helloSignStatus === 'verified' || row?.helloSignStatus === 'completed' ? 'Verified' : row?.helloSignStatus === 'declined' ? 'Declined' : 'Pending'}
								/>
							) : row?.state === 'approved' ? (
								<StateButton
									state='submitted'
									title='Pending'
								/>
							) : '-'
						}
					</Td>
					<Td>
						<Select
							variant='unstyled'
							size='sm'
							value={
								filteredMilestones?.find((milestone: {
                                    id: string
                                    value: string
                                    //@ts-ignore
                                }) => milestone?.id === row?.id)?.value || row?.milestones[0]?.id
							}
							onChange={
								(e) => {
									const check = filteredMilestones?.find((milestone: {
                                        id: string
                                        value: string
                                    }) => milestone?.id === row?.id)
									if(check) {
										const newFilteredMilestones = filteredMilestones?.map((milestone: {
                                         id: string
                                         value: string
                                        }) => {
											if(milestone?.id === row?.id) {
												return {
													...milestone,
													value: e.target.value
												}
											} else {
												return milestone
											}
										}
										)
										setFilteredMilestones(newFilteredMilestones as [])
									} else {
										const newFilteredMilestones = [...filteredMilestones, {
											id: row?.id,
											value: e.target.value
										}]
										setFilteredMilestones(newFilteredMilestones as [])
									}


								}
							}
						>
							{
								row?.milestones?.map((milestone, index) => {
									return (
										<option
											key={index}
											value={milestone.id}>
											Milestone
											{' '}
											{index + 1}
											:
											{milestone.title?.length > 10 ? milestone.title.substring(0, 10) + '...' : milestone.title}
										</option>
									)
								})
							}
						</Select>


					</Td>

					<Td w='10%'>
						{/* {row?.milestones[0] && */}
						{
							filteredMilestones?.find((milestone: {
                            id: string
                            value: string
                        }) => milestone?.id === row?.id) ? (
	                        <StateButton
										key={index}
										state={
											row?.fundTransfer && row?.fundTransfer?.find((transfer) => transfer.milestone.id === filteredMilestones?.find((milestone: {
                                id: string
                                value: string
                            }) => milestone?.id === row?.id)?.value)?.status === 'executed' ? 'approved' : 'submitted'
										}
										title={
											row?.fundTransfer && row?.fundTransfer?.find((transfer) => transfer.milestone.id === filteredMilestones?.find((milestone: {
                                id: string
                                value: string
                            }) => milestone?.id === row?.id)?.value)?.status === 'executed' ? 'Executed' : 'Pending'
										}
									/>
								) : (
									<StateButton
										key={index}
										state={row?.fundTransfer && row?.fundTransfer?.find((transfer) => transfer.milestone.id === row?.milestones[0]?.id)?.status === 'executed' ? 'approved' : 'submitted'}
										title={row?.fundTransfer && row?.fundTransfer?.find((transfer) => transfer.milestone.id === row?.milestones[0]?.id)?.status === 'executed' ? 'Executed' : 'Pending'}
									/>
								)
						}

					</Td>
					<Td
						w='15%'
					>
						<Textarea
							w='100%'
							size='sm'
							value={row?.notes}
							onChange={
								(e) => {
									const newTableData = [...tableData]
									newTableData[index].notes = e.target.value
									setTableData(newTableData)
								}
							}
							onBlur={
								async() => {
									await executeMutation(addTableNotesMutation, {
										id: row.id,
										notes: row?.notes,
										workspace: workspace?.id
									})
								}
							}
						/>

					</Td>

				</Tr>
			)
		})

		return (
			 <Flex
				direction='column'
				p='4'
				w='100%'
				h='100%'
			>

				<Flex
					direction='row'
					justify='space-between'
					align='center'
					mb='4'
				>
					<Select
						w='auto'
						variant='outline'
						value={filter}
						onChange={(e) => setFilter(e.target.value as 'all' | 'submitted' | 'approved' | 'rejected')}
					>
						{
							['All', 'Submitted', 'Approved', 'Rejected']?.map((state, index) => {
								return (
									<option
										key={index}
										value={state.toLowerCase()}>
										{state}
									</option>
								)
							})
						}
					</Select>

					<Flex gap={2}>
						<Button
							leftIcon={<ExportDownload />}
							colorScheme='blue'
							variant='outline'
							size='sm'
							onClick={downloadTXT}>
							Export MD
						</Button>
						<Button
							leftIcon={<ExportDownload />}
							colorScheme='blue'
							variant='outline'
							size='sm'
							onClick={downloadCSV}>
							Export CSV
						</Button>
					</Flex>
				</Flex>
				<TableContainer >
					<Table
						variant='simple'
						size='sm'>
						<Thead>
							<Tr>
								{
									TableHeader.map((header, index) => {
										return (
											<Th
												p={4}
												bg='gray.100'
												key={index}
											>
												{header}
											</Th>
										)
									})
								}
							</Tr>
						</Thead>
						<Tbody>
							{rowData}
						</Tbody>
					</Table>
				</TableContainer>

				<KYCStatusUpdateModal
					type={showKYCStatusUpdateModal.type}
					isOpen={showKYCStatusUpdateModal.isOpen}
					onClose={
						() => setShowKYCStatusUpdateModal({
							...showKYCStatusUpdateModal,
							isOpen: false
						})
					}
					grantId={showKYCStatusUpdateModal.grantId}
				/>
			 </Flex>
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