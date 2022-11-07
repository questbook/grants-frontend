import { Button, Flex, Text, Divider, Input, Container } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BsArrowLeft } from 'react-icons/bs'
import FlushedInput from "src/libraries/ui/FlushedInput";
import StepIndicator from "src/libraries/ui/StepIndicator";

interface Props {
    proposalName: string,
    setProposalName: (value: string) => void,
    startdate: string,
    setStartdate: (value: string) => void,
    endDate: string,
    setEndDate: (value: string) => void,
    moreDetails: string,
    setMoreDetails: (value: string) => void,
    link: string,
    setLink: (value: string) => void,
    doc: string,
    setDoc: (value: string) => void,
}

function ProposalSubmission(
    {
        proposalName,
        setProposalName,
        startdate,
        setStartdate,
        endDate,
        setEndDate,
        moreDetails,
        setMoreDetails,
        link,
        setLink,
        doc,
        setDoc
    }: Props) {
    const buildComponent = () => {
        return (
            <>
                {/* Start Proposal Submission Component */}
                <Flex alignSelf='flex-start'>
                    <Button variant='linkV2' leftIcon={<BsArrowLeft />} onClick={() => router.push({
                        pathname: '/discover'
                    })}>Back</Button>
                </Flex>
                <Flex flexDirection='column' width='100%' gap={6}>
                    {/* TODO: Add Steps complete indicator */}
                    <StepIndicator step={1} />
                    <Text alignSelf='center' fontWeight='500' fontSize='24px' lineHeight='32px' marginBottom={8}>Proposal Submission</Text>
                    <Flex gap={4} alignItems='baseline'>
                        <Text variant="requestProposalBody">Receive proposals for</Text>
                        <FlushedInput placeholder='Give a title for inviting proposals.' width='50%' value={proposalName} onChange={(e) => { setProposalName(e.target.value) }} />
                    </Flex>
                    <Flex gap={4} alignItems='baseline'>
                        <Text variant="requestProposalBody">Receive proposal submissions from</Text>
                        <FlushedInput type='date' placeholder='start date' width='20%' value={startdate} onChange={(e) => { setStartdate(e.target.value) }} />
                        <Text variant="requestProposalBody">till</Text>
                        <FlushedInput type='date' placeholder="end date" width='20%' value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </Flex>
                    <Flex gap={4} alignItems='baseline'>
                        <Text variant="requestProposalBody">Proposals must include</Text>
                        <FlushedInput placeholder='title' width='3%' isDisabled={true} />
                        <Text variant="requestProposalBody">,</Text>
                        <FlushedInput placeholder='tl,dr' width='3%' isDisabled={true} />
                        <Text variant="requestProposalBody">,</Text>
                        <FlushedInput placeholder='details' width='5%' isDisabled={true} />
                        <Text variant="requestProposalBody">,</Text>
                        <FlushedInput placeholder='funding ask' width='8%' isDisabled={true} />
                        <Text variant="requestProposalBody">,</Text>
                        <FlushedInput placeholder='ask for more details from the builder' width='24%' value={moreDetails} onChange={(e) => setMoreDetails(e.target.value)}/>
                    </Flex>
                    <Text variant="requestProposalBody">Anything else you want the builder to know?</Text>
                    <Flex gap={4} alignItems='baseline'>
                        <FlushedInput placeholder='Add a link' width='10%' value={link} onChange={(e) => setLink(e.target.value)}/>
                        <Text variant="requestProposalBody">Or</Text>
                        <FlushedInput placeholder='Upload a doc' width='10%' />
                    </Flex>
                    <Button variant='primaryMedium' alignSelf='flex-end' marginTop='200px' isDisabled={true}>Continue</Button>

                </Flex>

                {/* End Proposal Submission Component */}
            </>
        );
    }

    const router = useRouter()

    return buildComponent()
}

export default ProposalSubmission