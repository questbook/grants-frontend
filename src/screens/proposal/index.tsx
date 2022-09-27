import { ReactElement, useEffect, useMemo, useState } from 'react'
import { Box, Flex, Heading, Image, Link, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { CHAIN_INFO, defaultChainId } from 'src/constants/chains'
import { useGetApplicationDetailsQuery } from 'src/generated/graphql'
import SupportedChainId from 'src/generated/SupportedChainId'
import logger from 'src/libraries/logger'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import { useMultiChainQuery } from 'src/screens/proposal/_hooks/useMultiChainQuery'
import { getFieldString, getFormattedDate, getFormattedDateFromUnixTimestampWithYear } from 'src/utils/formattingUtils'
import { getFromIPFS } from 'src/utils/ipfsUtils'
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils'
import TextViewer from 'src/components/ui/forms/richTextEditor/textViewer'

function Proposal() {

    const buildComponent = () => (

        <Flex
            w='100vw'
            mx={8}
            pt={6}
            gap={8}
            bg='#F5F5F5'
            padding={2}>
            <Flex
                flex={2}
                w='100%'
                h='100%'
                flexDirection='column'
                gap={4}
                padding={4}>
                <Text variant='proposalHeading'>{getFieldString(proposalData, 'projectName')}</Text>
                {/* Proposal info start */}
                <Flex bg='white' gap={4} height='60px' alignItems='center' padding={4}>
                    <Flex alignItems='center' gap={1} >
                        <Image boxSize={4} src='/ui_icons/user_icon.svg' />
                        <Text variant='footer'> {getFieldString(proposalData, 'applicantName')}  </Text>
                    </Flex>
                    <Flex alignItems='center' gap={1}>
                        <Image boxSize={4} src='/ui_icons/wallet_line.svg' />
                        <Text variant='footer'> {proposalData?.applicantId}  </Text>
                    </Flex>
                    <Flex alignItems='center' gap={1}>
                        <Image boxSize={4} src='/ui_icons/mail_line.svg' />
                        <Text variant='footer'> {getFieldString(proposalData, 'applicantEmail')}  </Text>
                    </Flex>
                    <Flex alignItems='center' gap={1}>
                        <Image boxSize={4} src='/ui_icons/calendar_line.svg' />
                        <Text variant='footer'> {getFormattedDateFromUnixTimestampWithYear(proposalData?.createdAtS!)}  </Text>
                    </Flex>
                </Flex>
                {/* Proposal info end */}

                {/* Proposal details start */}
                <Flex bg='white' gap={4} alignItems='start' flexDirection='column' padding={4}>
                    <Box>
                        <Heading
                            variant='applicationHeading'>
                            Links
                        </Heading>{
                            projectLink.map(({ link }) => (
                                <Text
                                    key={link}
                                    variant='applicationText'
                                    mt={2}>
                                    <Link
                                        href={link}
                                        isExternal>
                                        {link}
                                    </Link>
                                </Text>
                            ))
                        }
                    </Box>
                    <Box>
                        <Heading variant='applicationHeading'>Project Details</Heading>
                        <Text>{decodedDetails ? (
                            <TextViewer
                                text={decodedDetails}
                            />
                        ) : null}</Text>
                    </Box>

                </Flex>
                {/* Proposal details end */}
            </Flex>

            <Flex
                flex={1}
                w='100%'
                h='100%'
                bg='blue' />
        </Flex>

    )

    const router = useRouter()

    const [proposalId, setProposalId] = useState<string>()
    const [chainId, setChainId] = useState<SupportedChainId>()

    const [projectTitle, setProjectTitle] = useState('')
    const [projectLink, setProjectLink] = useState<any[]>([])
    const [projectGoals, setProjectGoals] = useState('')
    const [projectMilestones, setProjectMilestones] = useState<any[]>([])
    const [decodedDetails, setDecodedDetails] = useState('')

    const [fundingAsk, setFundingAsk] = useState('')
    const [fundingBreakdown, setFundingBreakdown] = useState('')
    const [teamMembers, setTeamMembers] = useState('')
    const [memberDetails, setMemberDetails] = useState<any[]>([])
    const [customFields, setCustomFields] = useState<any[]>([])
    const [decimal, setDecimal] = useState<number>()

    useEffect(() => {
        if (typeof router.query.id === 'string') {
            setProposalId(router.query.id)
        }

        if (typeof router.query.chain === 'string' && router.query.chain in SupportedChainId) {
            setChainId(parseInt(router.query.chain) as SupportedChainId)
        }
    }, [])

    const { results, fetchMore } = useMultiChainQuery({
        useQuery: useGetApplicationDetailsQuery,
        options: {
            variables: {
                applicationID: proposalId ?? '',
            }
        },
        chains: [chainId ?? defaultChainId]
    })

    useEffect(() => {
        fetchMore({ applicationID: proposalId }, true)
    }, [proposalId, chainId])

    const proposalData = useMemo(() => {
        return results[0]?.grantApplication
    }, [results])

    useEffect(() => {
        logger.info({ proposalData }, 'Proposal Data')

        if (!proposalData) {
            return
        }

        setProjectTitle(getFieldString(proposalData, 'projectName'))
        setProjectLink(
            proposalData?.fields
                ?.find((fld: any) => fld?.id?.split('.')[1] === 'projectLink')
                ?.values.map((val) => ({ link: val.value })) || [],
        )

        const projectDetailsTemp = getFieldString(proposalData, 'projectDetails')
        if (projectDetailsTemp.startsWith('Qm') && projectDetailsTemp.length < 64) {
            getDecodedDetails(projectDetailsTemp)
        } else {
            setDecodedDetails(projectDetailsTemp)
        }

        // console.log(decodedDetails)

        setProjectGoals(getFieldString(proposalData, 'projectGoals'))
        setProjectMilestones(proposalData?.milestones || [])
        setFundingAsk(getFieldString(proposalData, 'fundingAsk'))
        setFundingBreakdown(getFieldString(proposalData, 'fundingBreakdown'))
        setTeamMembers(getFieldString(proposalData, 'teamMembers'))
        setMemberDetails(
            proposalData?.fields
                ?.find((fld: any) => fld?.id?.split('.')[1] === 'memberDetails')
                ?.values.map((val) => val.value) || [],
        )
        if (proposalData.grant.reward.token) {
            setDecimal(proposalData.grant.reward.token.decimal)
        } else {
            setDecimal(CHAIN_INFO[
                getSupportedChainIdFromSupportedNetwork(
                    proposalData.grant.workspace.supportedNetworks[0],
                )
            ]?.supportedCurrencies[proposalData.grant.reward.asset.toLowerCase()]
                ?.decimals)
        }

        if (proposalData.fields.length > 0) {
            setCustomFields(proposalData.fields
                .filter((field: any) => (field.id.split('.')[1].startsWith('customField')))
                .map((field: any) => {
                    const i = field.id.indexOf('-')
                    return ({
                        title: field.id.substring(i + 1).split('\\s').join(' '),
                        value: field.values[0].value,
                        isError: false,
                    })
                }))
        }
    }, [proposalData])

    const getDecodedDetails = async (detailsHash: string) => {
        // console.log(detailsHash)
        const d = await getFromIPFS(detailsHash)
        setDecodedDetails(d)
    }


    return buildComponent()
}

Proposal.getLayout = function (page: ReactElement) {
    return (
        <NavbarLayout>
            {page}
        </NavbarLayout>
    )
}

export default Proposal