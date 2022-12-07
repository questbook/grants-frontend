import { Button, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BsArrowLeft } from 'react-icons/bs'
import { AiOutlinePlus } from 'react-icons/ai'
import FlushedInput from "src/libraries/ui/FlushedInput";
import StepIndicator from "src/libraries/ui/StepIndicator";
import { ChangeEvent, useState } from "react";
import { DynamicInputValues } from "src/types";

interface Props {
    numberOfReviewers: number,
    setNumberOfReviewers: (value: number) => void,
    rubricMechanism: string,
    setRubricMechanism: (value: string) => void,
    rubrics: {},
    setRubrics: (value: {}) => void,
    step: number,
    setStep: (value: number) => void,
}

function ProposalReview(
    {
        numberOfReviewers,
        setNumberOfReviewers,
        rubricMechanism,
        setRubricMechanism,
        rubrics,
        setRubrics,
        step,
        setStep
    }: Props) {

    console.log('step', step)


    const buildComponent = () => {
        return (
            <>
                <Flex alignSelf='flex-start'>
                    <Button className="backBtn" variant='linkV2' leftIcon={<BsArrowLeft />} onClick={() => setStep(1)}>Back</Button>
                </Flex>
                <Flex className="rightScreenCard" flexDirection='column' width='100%' gap={6} alignSelf='flex-start'>
                    {/* TODO: Add Steps complete indicator */}
                    <StepIndicator step={step} />
                    <Text alignSelf='center' fontWeight='500' fontSize='24px' lineHeight='32px' >Proposal Review</Text>

                    <Flex gap={4} alignItems='baseline'>
                        <Text variant="requestProposalBody">Assign</Text>
                        <FlushedInput placeholder='2' value={numberOfReviewers.toString()} type='number' onChange={(e) => setNumberOfReviewers(parseInt(e.target.value))} />
                        <Text variant="requestProposalBody">reviewers for each proposal</Text>
                    </Flex>

                    <Flex gap={4} alignItems='baseline'>
                        <Text variant="requestProposalBody">Review will be based on</Text>
                        <FlushedInput placeholder='Select one' value={rubricMechanism} isDisabled={true} onChange={(e) => setRubricMechanism(e.target.value)} />
                    </Flex>

                    <Flex gap={4} alignItems='baseline'>
                        <Button variant='outline' leftIcon={<AiOutlinePlus />} borderColor='black' onClick={() => setRubricMechanism('Voting')}>Voting</Button>
                        <Button variant='outline' leftIcon={<AiOutlinePlus />} borderColor='black' onClick={() => setRubricMechanism('Rubric')}>Rubric</Button>
                    </Flex>

                    {/* Rubric Selected */}
                    {rubricMechanism === 'Rubric'
                        &&
                        (<>
                            <Flex gap={4} alignItems='baseline' wrap='wrap'>
                                <Text variant="requestProposalBody">Rubric includes</Text>

                                {Array.from(Array(rubricsCounter)).map((c, index) => {
                                    return (
                                        <>
                                            <FlushedInput placeholder='Add your own'  value={rubricInputValues[index]} onChange={(e) => handleOnChange(e, index)}/>
                                            <Text variant="requestProposalBody">,</Text>
                                        </>
                                    );
                                })}

                            </Flex>
                            <Flex gap={4} alignItems='baseline'>
                                <Button
                                    variant='outline'
                                    leftIcon={<AiOutlinePlus />}
                                    borderColor='black'
                                    onClick={() => handleClick()}>Add another</Button>
                            </Flex>
                        </>
                        )
                    }

                    {/* CTA */}
                    <Flex gap={8} width='100%' justifyContent='flex-end'>
                        <Button variant='link' onClick={() => setStep(3)}>Skip for now</Button>
                        <Button variant='primaryMedium'
                         onClick={() => {
                            setStep(3)
                            setRubrics(rubricInputValues)
                            }}
                          isDisabled={!rubricMechanism}   >Continue</Button>
                    </Flex>


                </Flex>
            </>
        )
    }

    const [rubricInputValues, setRubricInputValues] = useState<DynamicInputValues>({ 0: 'Team competence', 1: 'Idea Quality', 2: 'Relevance to our ecosystem' })
    const [rubricsCounter, setRubricsCounter] = useState(3)

    const handleClick = () => {
        setRubricsCounter(rubricsCounter + 1);
        console.log(rubricsCounter);
    };

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const inputValues:DynamicInputValues = {};
        inputValues[index] = e.target.value;
        setRubricInputValues({ ...rubricInputValues, ...inputValues });
        console.log({ ...rubricInputValues, ...inputValues });
    };


    return buildComponent()

}


export default ProposalReview 
