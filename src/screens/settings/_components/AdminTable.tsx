import { useContext, useEffect, useState } from 'react'
import { CSVLink } from 'react-csv'
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


		const downloadCSV = () => {


			const csvDownload = tableData?.length > 0 ? tableData?.filter((row: {
        state: string
    }) => {
				if(filter === 'all') {
					return true
				} else if(filter === 'submitted') {
					return row?.state === 'submitted'
				} else if(filter === 'approved') {
					return row?.state === 'approved'
				} else if(filter === 'rejected') {
					return row?.state === 'rejected'
				}
			})?.map((row, index) => {
				const milestones = row?.milestones?.map((milestone, index) => {
					return {
						[`Milestone ${index + 1}`]: milestone?.title?.length > 0 ? milestone?.title : 'N/A',
						[`Funding Status: Milestone ${index + 1}`]: row?.fundTransfer && row?.fundTransfer?.find((transfer) => transfer.milestone.id === milestone.id)?.status === 'executed' ? 'Executed' : 'Pending',
					}
				})
				return {
					'No': index + 1,
					'Proposal Name': row.name[0].values[0].value,
					'Proposal Status': row.state,
					'KYC/KYB Status': row?.state === 'approved' ? row?.synapsStatus === 'completed' || row?.synapsStatus === 'verified' ? 'Verified' : 'Pending' : '',
					'Synaps Type': row?.synapsStatus !== '' ? row?.synapsType : '',
					'Grant Agreement Status': row?.state === 'approved' ? row?.helloSignStatus === 'verified' ? 'Verified' : 'Pending' : '',
					'Notes': row?.notes,
					...milestones?.reduce((acc, curr) => {
						return {
							...acc,
							...curr
						}
					}, {})
				}
			}) : []

			return csvDownload

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
									title={row?.synapsStatus === 'verified' || row?.synapsStatus === 'completed' ? `Verified - ${row?.synapsType}` : `Pending - ${row?.synapsType}`}
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
						// onClick={
						// 	() => {
						// 		if(row?.state === 'approved') {
						// 			setShowKYCStatusUpdateModal({
						// 				...showKYCStatusUpdateModal,
						// 				isOpen: true,
						// 				grantId: row.id,
						// 				type: 'hellosign'
						// 			})
						// 		}
						// 	}
						// }
					>
						{
							row.helloSignStatus?.length > 0 ? (
								<StateButton
									state={row?.helloSignStatus === 'verified' ? 'approved' : 'submitted'}
									title={row?.helloSignStatus === 'verified' ? 'Verified' : 'Pending'}
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

					<CSVLink
						data={downloadCSV()}
						filename={grant?.title ? `${grant?.title}-${new Date().toISOString()}.csv` : `admin-table-${new Date().toISOString()}.csv`}
						target='_blank'>
						<Button
							leftIcon={<ExportDownload />}
							colorScheme='blue'
							variant='outline'
							size='sm'>
							Export
						</Button>
					</CSVLink>
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