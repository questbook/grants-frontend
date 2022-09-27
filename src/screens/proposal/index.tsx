import { ReactElement, useEffect, useMemo, useState } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { defaultChainId } from 'src/constants/chains'
import { useGetApplicationDetailsQuery } from 'src/generated/graphql'
import SupportedChainId from 'src/generated/SupportedChainId'
import logger from 'src/libraries/logger'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import { useMultiChainQuery } from 'src/screens/proposal/_hooks/useMultiChainQuery'

function Proposal() {

    const buildComponent = () => (

        <Flex
            bg='gray.1'
            w='100vw'
            h='calc(100vh - 64px)'
            mx={8}
            pt={6}>
            <Flex
                flex={2}
                w='100%'
                h='100%'
                bg='red' />
            <Box mx={4} />
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
    }, [proposalData])

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