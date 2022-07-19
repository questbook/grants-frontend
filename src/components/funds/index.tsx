import React, { useContext, useEffect, useState } from 'react'
import {
	Box,
	Button,
	Divider,
	Flex,
	IconButton,
	Image,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
} from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'
import { ApiClientsContext } from 'pages/_app'
import { defaultChainId } from 'src/constants/chains'
import ERC20ABI from 'src/contracts/abi/ERC20.json'
import { useGetFundingQuery } from 'src/generated/graphql'
import { Grant } from 'src/types'
import { formatAmount } from 'src/utils/formattingUtils'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import { getAssetInfo } from 'src/utils/tokenUtils'
import { getSupportedChainIdFromSupportedNetwork, getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import { useContract, useSigner } from 'wagmi'
import Funding from '../your_grants/manage_grant/tables/funding'
import AddFunds from './add_funds_modal'
import WithdrawFunds from './withdraw_funds_modal'

export type FundForAGrantProps = {
  grant: Grant;
};

const TABS = ['Deposits', 'Withdrawals'] as const

const TABS_MAP = [
	{
		type: 'funds_deposited',
		columns: ['from', 'to', 'amount', 'date', 'action'] as const,
	},
	{
		type: 'funds_withdrawn',
		columns: ['from', 'to', 'initiator', 'amount', 'date', 'action'] as const,
	},
] as const

function FundForAGrant({ grant }: FundForAGrantProps) {
	const { subgraphClients, workspace } = useContext(ApiClientsContext)!
	const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false)
	const [isWithdrawFundsModalOpen, setIsWithdrawFundsModalOpen] = useState(false)
	const [selected, setSelected] = React.useState(0)
	const [fundingAssetDecimals, setFundingAssetDecimals] = React.useState(18)
	const { data: signer } = useSigner()
	const rewardAssetContract = useContract({
		addressOrName: grant.reward.asset,
		contractInterface: ERC20ABI,
		signerOrProvider: signer,
	})

	const { data } = useGetFundingQuery({
		client:
      subgraphClients[
      	getSupportedChainIdFromWorkspace(workspace) || defaultChainId
      ].client,
		variables: { grantId: grant.id },
	})

	// useEffect(() => {
	//   console.log('data', data);
	// }, [data]);

	// eslint-disable-next-line max-len
	// const assetInfo = getAssetInfo(grant.reward.asset, getSupportedChainIdFromWorkspace(workspace));
	let assetInfo
	if(grant.reward.token) {
		assetInfo = {
			label: grant.reward.token.label,
			icon: getUrlForIPFSHash(grant.reward.token.iconHash),
		}
	} else {
		assetInfo = getAssetInfo(grant.reward.asset, getSupportedChainIdFromWorkspace(workspace))
	}

	const switchTab = (to: number) => {
		setSelected(to)
	}

	useEffect(() => {
		// eslint-disable-next-line wrap-iife
		// eslint-disable-next-line func-names
		(async function() {
			try {
				if(!rewardAssetContract.provider) {
					return
				}

				const assetDecimal = await rewardAssetContract.decimals()
				console.log('decimal', assetDecimal)
				setFundingAssetDecimals(assetDecimal)
			} catch(e) {
				// console.error(e);
			}
		}())
	}, [grant, rewardAssetContract])

	return (
		<Flex
			direction="column"
			w="100%"
			mt={3}
			mb={12}>
			<Flex
				direction="row"
				justify="space-between"
				w="100%">
				<Text
					fontWeight="700"
					fontSize="18px"
					lineHeight="26px"
					maxW="50%">
					{grant.title}
				</Text>
				<Flex
					direction="row"
					justify="start"
					align="center">
					<Image
						src={assetInfo?.icon}
						alt="Ethereum Icon"
						boxSize="36px" />
					<Box mr={2} />
					<Text
						fontWeight="700"
						fontSize="16px"
						lineHeight="24px"
						letterSpacing={0.5}
					>
            Funds Available
					</Text>
					<Box mr={2} />
					<Text
						fontWeight="700"
						fontSize="16px"
						lineHeight="24px"
						letterSpacing={0.5}
						color="brand.500"
					>
						{formatAmount(grant.funding, fundingAssetDecimals)}
						{' '}
						{assetInfo?.label}
					</Text>
					<Box mr={5} />
					<Button
						variant="primaryCta"
						onClick={() => setIsAddFundsModalOpen(true)}
					>
            Add Funds
					</Button>
					<Menu>
						<MenuButton
							as={IconButton}
							aria-label="hamburger dot"
							icon={<Image src="/ui_icons/brand/hamburger_dot.svg" />}
							_hover={{}}
							_active={{}}
							variant="ghost"
						/>
						<MenuList>
							<MenuItem
								icon={<Image src="/ui_icons/withdraw_fund.svg" />}
								_hover={{}}
								onClick={() => setIsWithdrawFundsModalOpen(true)}
							>
                Withdraw Funds
							</MenuItem>
						</MenuList>
					</Menu>
				</Flex>
			</Flex>
			<Flex
				direction="row"
				w="full"
				justify="start"
				align="stretch"
				my={4}>
				{
					TABS.map((tab, index) => (
						<Button
							key={tab}
							variant="link"
							ml={index === 0 ? 0 : 12}
							_hover={{ color: 'black' }}
							_focus={{}}
							fontWeight="700"
							fontStyle="normal"
							fontSize="18px"
							lineHeight="26px"
							borderRadius={0}
							color={index === selected ? '#122224' : '#A0A7A7'}
							onClick={() => switchTab(index)}
						>
							{tab}
						</Button>
					))
				}
			</Flex>
			<Divider />

			<Funding
				fundTransfers={
					data?.fundsTransfers?.filter(
						(d) => d.type === TABS_MAP[selected].type,
					) || []
				}
				assetId={grant.reward.asset}
				columns={[...TABS_MAP[selected].columns]}
				assetDecimals={fundingAssetDecimals}
				grantId={grant.id}
				type={TABS_MAP[selected].type}
				chainId={getSupportedChainIdFromSupportedNetwork(grant.workspace.supportedNetworks[0])}
			/>

			{/* Modals */}
			<AddFunds
				isOpen={isAddFundsModalOpen}
				onClose={() => setIsAddFundsModalOpen(false)}
				grantAddress={grant.id}
				rewardAsset={
					{
						address: grant.reward.asset,
						committed: BigNumber.from(grant.reward.committed),
						label: assetInfo?.label,
						icon: assetInfo?.icon,
					}
				}
			/>
			<WithdrawFunds
				isOpen={isWithdrawFundsModalOpen}
				onClose={() => setIsWithdrawFundsModalOpen(false)}
				grantAddress={grant.id}
				rewardAsset={
					{
						address: grant.reward.asset,
						committed: BigNumber.from(grant.reward.committed),
						label: assetInfo?.label,
						icon: assetInfo?.icon,
					}
				}
			/>
		</Flex>
	)
}

export default FundForAGrant
