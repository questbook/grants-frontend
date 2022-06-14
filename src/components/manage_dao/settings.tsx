import React, { useEffect, useState } from 'react'
import {
	Box,
	Flex,
	Image,
	Link,
	Text,
} from '@chakra-ui/react'
import useUpdateWorkspace from 'src/hooks/useUpdateWorkspace'
import useCustomToast from 'src/hooks/utils/useCustomToast'
import { Workspace } from 'src/types'
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils'
import { getUrlForIPFSHash, uploadToIPFS } from '../../utils/ipfsUtils'
import EditForm from './edit_form'

interface Props {
  workspaceData: Workspace;
}

function Settings({ workspaceData }: Props) {

	interface Props {
		workspaceData: Workspace;
	  }	  

	return (
		<Flex
			direction="column"
			align="start"
			w="65%">
			<Flex
				direction="row"
				w="full"
				justify="space-between">
				<Text
					fontStyle="normal"
					fontWeight="bold"
					fontSize="18px"
					lineHeight="26px"
				>
          Workspace Settings
				</Text>
				<Link
					href={
						`/profile?daoId=${
							workspaceData?.id
						}&chainId=${getSupportedChainIdFromSupportedNetwork(
							workspaceData?.supportedNetworks[0],
						)}`
					}
					color="brand.500"
					fontWeight="700"
					letterSpacing={0.5}
				>
					<Flex
						direction="row"
						align="center">
						<Image
							src="/ui_icons/see.svg"
							display="inline-block"
							mr={2} />
            See Profile Preview
					</Flex>
				</Link>
			</Flex>
			<EditForm
				workspaceData={workspaceData}
			/>
			<Box my={10} />
		</Flex>
	)
}

export default Settings
