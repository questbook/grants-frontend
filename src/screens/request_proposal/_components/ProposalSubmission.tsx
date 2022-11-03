import { Button, Flex, Text, Divider, Input } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BsArrowLeft } from 'react-icons/bs'
import FlushedInput from "src/components/ui/FlushedInput";


function ProposalSubmission() {
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
                    <Divider height={2} />
                    <Text alignSelf='center' fontWeight='500' fontSize='24px' lineHeight='32px' marginBottom={8}>Proposal Submission</Text>
                    <Flex gap={4} alignItems='baseline'>
                        <Text variant="requestProposalBody">Receive proposals for</Text>
                        <FlushedInput placeholder='Give a title for inviting proposals.' width='50%' />
                    </Flex>
                    <Flex gap={4} alignItems='baseline'>
                        <Text variant="requestProposalBody">Receive proposal submissions from</Text>
                        <FlushedInput type='date' placeholder='start date' width='20%' />
                        <Text variant="requestProposalBody">till</Text>
                        <FlushedInput type='date' placeholder="end date" width='20%' />
                    </Flex>
                    <Flex gap={4} alignItems='baseline'>
                        <Text variant="requestProposalBody">Proposals must include</Text>
                        <FlushedInput placeholder='title' width='3%' />
                        <Text variant="requestProposalBody">,</Text>
                        <FlushedInput placeholder='tl,dr' width='3%' />
                        <Text variant="requestProposalBody">,</Text>
                        <FlushedInput placeholder='details' width='5%' />
                        <Text variant="requestProposalBody">,</Text>
                        <FlushedInput placeholder='funding ask' width='8%' />
                        <Text variant="requestProposalBody">,</Text>
                        <FlushedInput placeholder='ask for more details from the builder' width='24%' />
                    </Flex>
                    <Text variant="requestProposalBody">Anything else you want the builder to know?</Text>
                    <Flex gap={4} alignItems='baseline'>
                        <FlushedInput placeholder='Add a link' width='10%' />
                        <Text variant="requestProposalBody">Or</Text>
                        <FlushedInput placeholder='Upload a doc' width='10%' />
                    </Flex>
                    <Button variant='primaryCTAv2' alignSelf='flex-end' marginTop='200px'>Continue</Button>

                </Flex>

                {/* End Proposal Submission Component */}
            </>
        );
    }

    const router = useRouter()

    return buildComponent()
}

export default ProposalSubmission