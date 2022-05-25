import React from 'react'
import {
	Button,
	Divider, Flex, Image, Text, useTheme, } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { CHAIN_INFO } from 'src/constants/chainInfo'
import { SupportedChainId } from 'src/constants/chains'

function GrantRewards({
	daoId,
	daoName,
	daoLogo,
	isGrantVerified,
	funding,
	rewardAmount,
	rewardCurrency,
	rewardCurrencyCoin,
	payoutDescription,
	chainId,
	defaultMilestoneFields,
}: {
  daoId: string;
  daoName: string;
  daoLogo: string;
  isGrantVerified: boolean;
  funding: string;
  rewardAmount: string;
  rewardCurrency: string;
  rewardCurrencyCoin: string;
  payoutDescription: string;
  chainId: SupportedChainId | undefined;
  defaultMilestoneFields: any[];
}) {
	const theme = useTheme()
	const router = useRouter()

	return (
		<>
			<Flex
				direction="row"
				alignItems="center"
				my="22px">
				<Text
					lineHeight="24px"
					fontSize="18px"
					fontWeight="400">
          Grant posted by
					{' '}
					<Button
						variant="link"
						// as="span"
						display="inline-block"
						color={theme.colors.brand[500]}
						fontWeight="bold"
						onClick={
							() => {
								router.push({
									pathname: '/profile',
									query: {
										daoId,
										chainId,
									},
								})
							}
						}
					>
						{daoName}
					</Button>
					<Text
						fontSize="16px"
						display="inline"
						color="#717A7C"
						fontWeight="400"
						lineHeight="24px"
						ml={2}>
						{`• ${CHAIN_INFO[chainId!]?.name}`}
					</Text>
				</Text>
				<Image
					objectFit="cover"
					ml="auto"
					h="54px"
					w="54px"
					src={daoLogo} />
			</Flex>

			<Divider />

			<Flex alignItems="start">
				<Flex
					direction="column"
					flex={1}>
					<Flex
						direction="row"
						alignItems="flex-start"
						mt="28px">
						<Image
							mt="2px"
							src="/sidebar/apply_for_grants.svg" />
						<Flex
							flex={1}
							direction="column"
							ml={3}>
							<Text fontWeight="500">
Reward
							</Text>
							<Text
								mt="1px"
								lineHeight="20px"
								fontSize="14px"
								fontWeight="400">
								{`${rewardAmount} ${rewardCurrency}`}
							</Text>
						</Flex>
					</Flex>
					<Flex
						direction="row"
						alignItems="flex-start"
						mt="28px">
						<Image
							mt="2px"
							src="/sidebar/apply_for_grants.svg" />
						<Flex
							flex={1}
							direction="column"
							ml={3}>
							<Text fontWeight="500">
								Milestones
							</Text>
							<Text
								mt="1px"
								lineHeight="20px"
								fontSize="14px"
								fontWeight="400">
								{payoutDescription}
							</Text>
						</Flex>
					</Flex>

					{
						!!defaultMilestoneFields.length && (
							<Flex
								direction="column"
								alignItems="flex-start"
								mt="28px">
								{
									defaultMilestoneFields.map((field, index) => (
										<Flex
											key={index?.toString()}
											mt={2}
											alignItems="baseline"
											w="100%">
											<Flex flex={0.1649}>
												<Text fontWeight="500">
                   									Milestone
													{' '}
													{index + 1}
													{' '}
                    								:
												</Text>
											</Flex>
											<Flex
												flex={0.8650}
												ml={3}>
												<Text
													w="100%"
													mt="1px"
													lineHeight="20px"
													fontSize="14px"
													fontWeight="400">
													{field.detail}
												</Text>
											</Flex>
										</Flex>
									))
								}
							</Flex>
						)
					}

					{
						isGrantVerified && (
							<Flex
								direction="row"
								alignItems="flex-start"
								mt="28px">
								<Image
									mt="2px"
									w="18px"
									h="21px"
									src="/ui_icons/verified.svg" />
								<Flex
									flex={1}
									direction="column"
									ml={3}>
									<Text fontWeight="500">
Verified Grant
									</Text>
									<Text
										mt="1px"
										lineHeight="20px"
										fontSize="14px"
										fontWeight="400">
                Funds deposited as reward ≈
										{' '}
										<Text
											fontWeight="700"
											display="inline-block">
											{funding}
											{' '}
											{rewardCurrency}
										</Text>
									</Text>
								</Flex>
							</Flex>
						)
					}
				</Flex>
				<Image
					mt="28px"
					ml="auto"
					h="45px"
					w="45px"
					src={rewardCurrencyCoin} />
			</Flex>
		</>
	)
}

export default GrantRewards
