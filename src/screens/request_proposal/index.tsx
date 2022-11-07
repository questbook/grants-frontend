import { Box, Container, Flex, Button, Text } from "@chakra-ui/react"
import { ReactElement, useState } from "react"
import NavbarLayout from "src/libraries/ui/navbarLayout"
import ProposalSubmission from "./_components/ProposalSubmission"

function RequestProposal() {
    const buildComponent = () => {
        return (
        <Flex minWidth='90%' gap={8} bgColor='white' padding={4} width='xl' alignItems='center' marginTop={8} marginRight={16} marginLeft={16} marginBottom={4}>
            <ProposalSubmission 
            proposalName={proposalName}
            setProposalName={setProposalName}
            startdate={startDate}
            setStartdate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            moreDetails={moreDetails}
            setMoreDetails={setMoreDetails}
            link={link}
            setLink={setLink}
            doc={doc}
            setDoc={setDoc}
            />
        </Flex>
        )
    }

    const [proposalName, setProposalName] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [requiredDetails, setRequiredDetails] = useState(['title', 'tl,dr', 'details', 'funding ask'])
    const [moreDetails, setMoreDetails] = useState('')
    const [link, setLink] = useState('')
    const [doc, setDoc] = useState('')

    return buildComponent()
}

RequestProposal.getLayout = function (page: ReactElement) {
    return (
        <NavbarLayout renderSearchBar renderSidebar={false}>
            {page}
        </NavbarLayout>
    )
}

export default RequestProposal