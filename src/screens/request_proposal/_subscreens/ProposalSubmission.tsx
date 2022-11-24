import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useRef } from "react";
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
    requiredDetails: string[],
    moreDetails: string,
    setMoreDetails: (value: string) => void,
    link: string,
    setLink: (value: string) => void,
    doc: string,
    setDoc: (value: string) => void,
    step: number,
    setStep: (value: number) => void,
}

function ProposalSubmission(
    {
        proposalName,
        setProposalName,
        startdate,
        setStartdate,
        endDate,
        setEndDate,
        requiredDetails,
        moreDetails,
        setMoreDetails,
        link,
        setLink,
        doc,
        setDoc,
        step,
        setStep
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
                    <StepIndicator step={step} />
                    <Text alignSelf='center' fontWeight='500' fontSize='24px' lineHeight='32px' marginBottom={8}>Proposal Submission</Text>

                    {/* Proposal title */}
                    <Flex gap={4} alignItems='baseline'>
                        <Text variant="requestProposalBody">Receive proposals for</Text>
                        <FlushedInput placeholder='Give a title for inviting proposals.' value={proposalName} onChange={(e) => {
                            setProposalName(e.target.value)
                        }} />
                    </Flex>

                    {/* Proposal dates */}
                    <Flex gap={4} alignItems='baseline'>
                        <Text variant="requestProposalBody">Receive proposal submissions from</Text>
                        <FlushedInput type='date' placeholder='start date' value={startdate} onChange={(e) => {
                            setStartdate(e.target.value)
                        }} />
                        <Text variant="requestProposalBody">till</Text>
                        <FlushedInput type='date' placeholder="end date" value={endDate} onChange={(e) => {
                            setEndDate(e.target.value)
                        }} />
                    </Flex>

                    {/* Required details */}
                    <Flex gap={4} alignItems='baseline' wrap='wrap'>
                        <Text variant="requestProposalBody">Proposals must include</Text>
                        <FlushedInput placeholder='title' value={requiredDetails[0]} isDisabled={true} />
                        <Text variant="requestProposalBody">,</Text>
                        <FlushedInput placeholder='tl,dr' value={requiredDetails[1]} isDisabled={true} />
                        <Text variant="requestProposalBody">,</Text>
                        <FlushedInput placeholder='details' value={requiredDetails[2]} isDisabled={true} />
                        <Text variant="requestProposalBody">,</Text>
                        <FlushedInput placeholder='funding ask' value={requiredDetails[3]} isDisabled={true} />
                        <Text variant="requestProposalBody">,</Text>
                        <FlushedInput placeholder='ask for more details from the builder' value={moreDetails} onChange={(e) => {
                            setMoreDetails(e.target.value)
                        }} />
                    </Flex>

                    {/* More details */}
                    <Text variant="requestProposalBody">Anything else you want the builder to know?</Text>
                    <Flex gap={4} alignItems='baseline' wrap='wrap'>
                        <FlushedInput placeholder='Add a link' value={link} onChange={(e) => setLink(e.target.value)} />
                        <Text variant="requestProposalBody">Or</Text>
                        <Input type='file' placeholder='Upload a file' value={doc} onChange={(e) => setDoc(e.target.value)} style={{display: "none"}}/>
                        {/* <Text variant="requestProposalBody" >Upload a doc</Text> */}
                        <FlushedInput type="file" placeholder='Upload a doc' ref={ref}  />
                        <FlushedInput onClick={() => openInput()}  placeholder='Upload a doc' />
                    </Flex>
                    {/* CTA */}
                    <Button variant='primaryMedium' alignSelf='flex-end' isDisabled={!proposalName || !startdate || !endDate} onClick={() => setStep(2)}>Continue</Button>

                </Flex>

                {/* End Proposal Submission Component */}
            </>
        );
    }

    const router = useRouter()
    const ref = useRef(null)

    const openInput = () => {
        console.log('open input')
        if (ref.current) {
            (ref.current as HTMLInputElement).click()
        }
    }


    return buildComponent()
}

export default ProposalSubmission
