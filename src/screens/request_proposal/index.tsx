import { Box, Container, Flex, Button, Text } from "@chakra-ui/react"
import { ReactElement, useState } from "react"
import NavbarLayout from "src/libraries/ui/navbarLayout"
import ProposalSubmission from "./_components/ProposalSubmission"

function RequestProposal() {
    const buildComponent = () => {
        return (
        <Flex minWidth='90%' gap={8} bgColor='white' padding={4} width='xl' alignItems='center' marginTop={8} marginRight={16} marginLeft={16} marginBottom={4}>
            <ProposalSubmission />
        </Flex>
        )
    }

    return buildComponent()

    const [proposalName, setProposalName] = useState('')
    const [date, setDate] = useState('')
}

RequestProposal.getLayout = function (page: ReactElement) {
    return (
        <NavbarLayout renderSearchBar renderSidebar={false}>
            {page}
        </NavbarLayout>
    )
}

export default RequestProposal