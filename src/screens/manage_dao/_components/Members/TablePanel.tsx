
import { Grid, GridItem, Text } from '@chakra-ui/react'
import { WorkspaceMember } from 'src/generated/graphql'
import TableRow from 'src/screens/manage_dao/_components/Members/TableRow'

interface Props {
    data: Partial<WorkspaceMember>[]
}

function TablePanel({ data }: Props) {
	const buildComponent = () => {
		return (
			<>
				<Grid
					justifyContent='start'
					templateColumns='3fr 2fr 2fr 2fr 2fr'
					alignItems='center'
				>
					{
						TABLE_HEADERS.map((header, index) => (
							<GridItem key={index}>
								<Text
									px={4}
									py={2}
									color='#555570'
									variant='v2_body'
									fontWeight='500'
								>
									{header}
								</Text>
							</GridItem>
						))
					}


					{/* new row */}
					{
						data.map((member, index) => (
							<TableRow
								key={index}
								member={member}
							/>
						))
					}
				</Grid>
			</>
		)
	}

	const TABLE_HEADERS = ['Members', 'Role', 'Joined on', 'Can access encrypted data', '']

	return buildComponent()
}

export default TablePanel