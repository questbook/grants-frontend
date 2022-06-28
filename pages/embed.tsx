import { useContext, useEffect, useState } from 'react'
import {
	Button,
	Flex,
	Grid,
	Heading,
	Image,
	Link,
	Text,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
// TYPES, STATES, and CONSTANTS
import { SupportedChainId } from 'src/constants/chains'
import { CHAIN_INFO } from 'src/constants/chains'
import {
	useGetAllGrantsForADaoQuery,
	useGetDaoDetailsQuery,
} from 'src/generated/graphql'
import { DAOWorkspace } from 'src/types'
import { calculateUSDValue } from 'src/utils/calculatingUtils'
import { formatAmount } from 'src/utils/formattingUtils'
//TOOLS and UTILS
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils'
import { ApiClientsContext } from './_app'

export default function Embed() {
	const width = '1080px'
	const height = '480px'

	const router = useRouter()
	const { subgraphClients } = useContext(ApiClientsContext)!

	const [chainID, setChainId] = useState<SupportedChainId>()
	const [daoID, setDaoId] = useState<string>()
	const [workspaceData, setWorkspaceData] = useState<DAOWorkspace>()
	const [grantsApplicants, setGrantsApplicants] = useState<any>([])
	const [grantsDisbursed, setGrantsDisbursed] = useState<any>([])
	const [grantRecipients, setGrantRecipients] = useState<any>([])

	useEffect(() => {
		if(router && router.query) {
			const { chainId: cId, daoId: dId } = router.query
			setChainId(cId as unknown as SupportedChainId)
			setDaoId(dId?.toString())
		}
	}, [router])

	const [queryParams, setQueryParams] = useState<any>({
		client: subgraphClients[chainID ?? SupportedChainId.RINKEBY].client,
	})

	useEffect(() => {
		if(!daoID) {
			return
		}

		if(!chainID) {
			return
		}

		setQueryParams({
			client: subgraphClients[chainID].client,
			variables: {
				workspaceID: daoID,
				daoID,
			},
		})
	}, [chainID, daoID])

	const { data, error, loading } = useGetDaoDetailsQuery(queryParams)

	useEffect(() => {
		if(data) {
			setWorkspaceData(data?.workspace!)
		}
	}, [data, error, loading])

	const { data: grantsData } = useGetAllGrantsForADaoQuery({
		client:
      subgraphClients[
      	getSupportedChainIdFromSupportedNetwork(
          workspaceData?.supportedNetworks[0]!
      	) ?? SupportedChainId.RINKEBY
      ].client,
		variables: {
			workspaceId: workspaceData?.id ?? '',
			acceptingApplications: true,
		},
	})

	useEffect(() => {
		if(
			grantsData &&
      grantsData.grants.length >= 1 &&
      grantsApplicants.length === 0
		) {
			grantsData.grants.forEach((grant) => {
				setGrantsApplicants((array: any) => [
					...array,
					grant.numberOfApplications,
				])
			})
		}
	}, [grantsData, grantsApplicants])

	useEffect(() => {
		if(
			grantsData &&
      grantsData.grants.length >= 1 &&
      grantRecipients.length === 0
		) {
			grantsData.grants.forEach((grant) => {
				grant.applications.forEach(
					(app: any) => app.state === 'approved' &&
            setGrantRecipients((winners: any) => [...winners, app])
				)
			})
		}
	}, [grantsData, grantRecipients])

	useEffect(() => {
		if(grantsData && grantsDisbursed.length === 0) {
			grantsData.grants.forEach((grant) => {
				const chainId = getSupportedChainIdFromSupportedNetwork(
					grant.workspace.supportedNetworks[0]
				)

				const tokenInfo =
          CHAIN_INFO[chainId]?.supportedCurrencies[
          	grant.reward.asset.toLowerCase()
          ]

				const tokenValue = formatAmount(
					grant.funding,
					tokenInfo?.decimals ?? 18
				)

				if(tokenInfo !== undefined && tokenValue !== '0') {
					calculateUSDValue(tokenValue, tokenInfo.label).then((promise) => {
						setGrantsDisbursed((array: any) => [...array, promise])
					})
				}
			})
		}
	}, [grantsData, grantsDisbursed])

	return (
		<Flex
			mt="2%"
			ml="2%"
			w={{ base: '90%', md: '70%', xl: '50%' }}
			h="fit-content"
			bgColor="white"
			p="3rem"
			direction="column"
			borderRadius="1rem"
			gap="1.5rem"
			justifyItems="center"
			boxShadow="0px 4px 20px -8px rgba(9, 17, 18, 0.2)"
		>
			<Flex
				justifyContent="center"
				direction="column"
				gap="1rem">
				<Heading
					fontFamily="DM Sans"
					color="#122224"
					fontWeight="700"
					fontSize="2rem"
					lineHeight="2.5rem"
					textAlign="center"
				>
          Help us build the future of web3
				</Heading>
				<Text
					textAlign="center"
					fontFamily="DM Sans"
					color="#373737"
					fontWeight="400"
					fontSize="1rem"
					lineHeight="1.5rem"
					w={{ base: '90%', md: '70%', xl: '50%' }}
					m="auto"
				>
          The ultimate aim through this program is to help developers build
          their dream solution and take it to the masses.
				</Text>
			</Flex>
			<Flex
	  			direction="column"
				gap="2rem"
				border="1px solid #C4C4C4"
				borderRadius="0.5rem"
				w={{ base: '90%', md: '70%' }}
				h="fit-content"
				alignSelf="center"
				p="1.5rem"
			>
				<Flex
					w="100%"
					justifyContent="center"
					alignContent="center"
					gap="0.5rem"
				>
					<Image
						objectFit="cover"
						h="2rem"
						w="2rem"
						borderRadius="100%"
						src={getUrlForIPFSHash(workspaceData?.logoIpfsHash!)}
					/>
					<Heading
						fontFamily="DM Sans"
						color="#122224"
						fontWeight="700"
						fontSize="1rem"
						lineHeight="1.5rem"
						textAlign="center"
					>
						{workspaceData?.title}
					</Heading>
				</Flex>
				<Grid
					gap="1rem"
					gridTemplateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
					m="auto"
					w="100%"
					justifyItems="center"
					alignItems="center"
				>
					<Flex
						minW={{ base: '120px', md: 'auto' }}
						direction="column">
						<Heading
							color="#122224"
							fontSize="1.2rem"
							lineHeight="1.5rem">
              $
							{
								grantsDisbursed
									.reduce((sum: number, a: number) => sum + a, 0)
									.toFixed(0)
							}
						</Heading>
						<Text
							fontSize="0.875rem"
							lineHeight="24px"
							fontWeight="400"
							color="#AAAAAA"
						>
              Grants Disbursed
						</Text>
					</Flex>

					<Flex
						minW={{ base: '120px', md: 'auto' }}
						direction="column">
						<Heading
							color="#122224"
							fontSize="1.2rem"
							lineHeight="1.5rem">
							{grantsData?.grants.length!}
						</Heading>
						<Text
							fontSize="0.875rem"
							lineHeight="24px"
							fontWeight="400"
							color="#AAAAAA"
						>
              Active Grants
						</Text>
					</Flex>

					<Flex
						minW={{ base: '120px', md: 'auto' }}
						direction="column">
						<Heading
							color="#122224"
							fontSize="1.2rem"
							lineHeight="1.5rem">
							{grantsApplicants.reduce((sum: number, a: number) => sum + a, 0)}
						</Heading>
						<Text
							fontSize="0.875rem"
							lineHeight="24px"
							fontWeight="400"
							color="#AAAAAA"
						>
              Total Applicants
						</Text>
					</Flex>

					<Flex
						minW={{ base: '120px', md: 'auto' }}
						direction="column">
						<Heading
							color="#122224"
							fontSize="1.2rem"
							lineHeight="1.5rem">
							{grantRecipients.length}
						</Heading>
						<Text
							fontSize="0.875rem"
							lineHeight="24px"
							fontWeight="400"
							color="#AAAAAA"
						>
              Grant Recipients
						</Text>
					</Flex>
				</Grid>
			</Flex>
			<Link
				m="auto"
				href={`https://www.questbook.app/profile/?daoId=${daoID}&chainId=${chainID}`}
				isExternal
				_hover={{ textDecoration: 'none' }}
			>
				<Button
					p="12px 32px"
					w="200px"
					variant="primary">
        Apply for Grants
				</Button>
			</Link>
			<Flex
				justifyItems="center"
				alignItems="center"
				justifyContent="center"
				gap="0.5rem"
			>
				<Link
					href="https://www.questbook.app"
					isExternal
					_hover={{ textDecoration: 'none' }}
				>
					<Text
						textAlign="center"
						fontFamily="DM Sans"
						color="#AAAAAA"
						fontWeight="400"
						fontSize="0.875rem"
						lineHeight="1rem"
					>
            Powered by
					</Text>
				</Link>
				<Link
					href="https://www.questbook.app"
					isExternal>
					<Image src="/questbook_logo_full.svg" />
				</Link>
			</Flex>
		</Flex>
	)
}
