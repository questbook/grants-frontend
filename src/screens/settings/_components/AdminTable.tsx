import { useContext, useEffect, useState } from 'react'
import { CSVLink } from 'react-csv'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Button, Flex, Select, Text, Textarea } from '@chakra-ui/react'
import {
	Switch,
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
					...(listAllGrants ? {
						'Grant Title': grant?.title,
					} : {}),
					'Proposal Name': row.name[0].values[0].value,
					'Proposal Status': row.state,
					'KYC/KYB Status': row?.state === 'approved' ? row?.synapsStatus === 'completed' || row?.synapsStatus === 'verified' ? 'Verified' : row?.synapsStatus === 'rejected' ? 'Rejected' : 'Pending' : '',
					'Synaps Type': row?.synapsStatus !== '' ? row?.synapsType : '',
					'Grant Agreement Status': row?.state === 'approved' ? (row?.helloSignStatus === 'verified' || row?.helloSignStatus === 'completed') ? 'Verified' : row?.helloSignStatus === 'rejected' ? 'Rejected' : 'Pending' : '',
					'Notes': row?.notes,
					...milestones?.reduce((acc, curr) => {
						return {
							...acc,
							...curr
						}
					}, {}),
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
					{
						listAllGrants && (
							<Td>
								<Text
									fontSize='sm'
								>
									{row?.grantTitle && row?.grantTitle?.length > 40 ? row?.grantTitle.substring(0, 40) + '...' : row?.grantTitle}
								</Text>
							</Td>
						)
					}
					<Td>
						<Text
							fontSize='sm'
							onClick={
								() => {

									window.open(`${window.location.origin}/dashboard/?grantId=${listAllGrants ? row?.grantId : grant?.id}&proposalId=${row.id}&chainId=10`, '_blank')

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
						onClick={
							() => {
								if(row?.state === 'approved' && row.synapsStatus !== 'completed' && !listAllGrants) {
									setShowKYCStatusUpdateModal({
										...showKYCStatusUpdateModal,
										isOpen: true,
										grantId: row.id,
										type: 'kyc',
										synapsId: row.synapsId ?? '0x',
										synapsType: row.synapsType as 'KYC' | 'KYB',
										editId: !!(!row.synapsId && (row.synapsStatus !== 'completed'))
									})
								}
							}
						}
					>
						{
							row.synapsStatus?.length > 0 ? (
								<StateButton
									state={row?.synapsStatus === 'verified' || row?.synapsStatus === 'completed' ? 'approved' : row?.synapsStatus === 'rejected' ? 'rejected' : 'submitted'}
									title={row?.synapsStatus === 'verified' || row?.synapsStatus === 'completed' ? `Verified - ${row?.synapsType}` : row?.synapsStatus === 'rejected' ? `Rejected - ${row?.synapsType}` : `Pending - ${row?.synapsType}`}
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
						gap={4}
					// onClick={
					// 	() => {
					// 		if(row?.state === 'approved' && row.helloSignStatus !== 'completed' && !listAllGrants) {
					// 			setShowKYCStatusUpdateModal({
					// 				...showKYCStatusUpdateModal,
					// 				isOpen: true,
					// 				grantId: row.id,
					// 				type: 'hellosign',
					// 				docuSignId: row.helloSignId ?? '0x',
					// 				editId: (!!(!row.helloSignId && (row.helloSignStatus !== 'completed' || !row.helloSignStatus)))
					// 			})
					// 		}
					// 	}
					// }
					>
						{
							row.helloSignStatus?.length > 0 ?
								row?.helloSignId && (row?.helloSignStatus !== 'completed' && row?.helloSignStatus !== 'rejected') ?
									(
										<Button
											size='sm'
											colorScheme='blue'
											variant='outline'
											leftIcon={<ExternalLinkIcon />}
											onClick={
												() => {
													const popupWindow = window.open(
														`https://app.hellosign.com/sign/${row?.helloSignId}`,
														'HelloSign',
														'width=800,height=600,resizable=yes,scrollbars=yes,status=yes'
													)
													if(popupWindow) {
														popupWindow.focus()
													} else {
														window.open(`https://app.hellosign.com/sign/${row?.helloSignId}`, '_blank')
													}
												}
											}
										>
											View Agreement
										</Button>
									) :
									(
										<StateButton
											state={row?.helloSignStatus === 'verified' || row?.helloSignStatus === 'completed' ? 'approved' : row?.helloSignStatus === 'rejected' ? 'rejected' : 'submitted'}
											title={row?.helloSignStatus === 'verified' || row?.helloSignStatus === 'completed' ? 'Verified' : row?.helloSignStatus === 'rejected' ? 'Rejected' : 'Pending'}
										/>
									) :
								row?.state === 'approved' ? (
									<StateButton
										state='submitted'
										title='Pending' />
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
					{
						!listAllGrants && (
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
						)
					}

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
					<Flex
						gap={4}
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
						<Flex
							align='center'
							justify='space-between'
							gap={4}
						>
							<Text
								fontSize='sm'
							>
								List All Grants
							</Text>
							<Switch

								colorScheme='blue'
								size='md'
								onChange={() => setListAllGrants(!listAllGrants)}
							/>
						</Flex>
					</Flex>


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
						size={listAllGrants ? 'md' : 'sm'}>
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
					synapsId={showKYCStatusUpdateModal.synapsId}
					synapsType={showKYCStatusUpdateModal.synapsType}
					docuSignId={showKYCStatusUpdateModal.docuSignId}
					editId={showKYCStatusUpdateModal.editId}
				/>
			</Flex>
		)

	}

	const [showKYCStatusUpdateModal, setShowKYCStatusUpdateModal] = useState<{
		type: 'kyc' | 'hellosign'
		isOpen: boolean
		grantId: string
		synapsId: string
		synapsType: 'KYC' | 'KYB'
		docuSignId: string
		editId: boolean
	}>({
		type: 'kyc',
		isOpen: false,
		grantId: '',
		synapsId: '',
		synapsType: 'KYC',
		docuSignId: '',
		editId: false
	})
	const [filter, setFilter] = useState<'all' | 'submitted' | 'approved' | 'rejected'>('all')
	const [filteredMilestones, setFilteredMilestones] = useState([{
		id: '',
		value: ''
	}])
	const [tableData, setTableData] = useState<adminTable>([])
	const { adminTable, workspace, listAllGrants, setListAllGrants, allGrantsAdminTable } = useContext(SettingsFormContext)!
	const { grant } = useContext(GrantsProgramContext)!
	const TableHeader = listAllGrants ? ['No', 'Grant Title', 'Proposal Name', 'Proposal Status', 'KYC/KYB Status', 'Grant Agreement Status', 'Milestone', 'Funding Status'] : ['No', 'Proposal Name', 'Proposal Status', 'KYC/KYB Status', 'Grant Agreement Status', 'Milestone', 'Funding Status', 'Notes']

	useEffect(() => {
		setTableData(listAllGrants ? allGrantsAdminTable : adminTable)
	}, [adminTable, allGrantsAdminTable, listAllGrants])


	return buildComponent()
}

export default AdminTable