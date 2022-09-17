import React from 'react'
import {
	Box,
	Flex,
	Image,
	Link,
	Text,
} from '@chakra-ui/react'
import EditForm from 'src/components/manage_dao/edit_form'
import { Workspace } from 'src/types'
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils'
import { useTranslation } from 'react-i18next'

interface Props {
  workspaceData: Workspace
}

function Settings({ workspaceData }: Props) {
	const { t } = useTranslation()
	return (
		<Flex
			direction='column'
			align='start'
			w='70%'>
			<EditForm
				workspaceData={workspaceData}
			/>
			<Box my={10} />
		</Flex>
	)
}

export default Settings
