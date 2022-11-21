import { Button, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BsArrowLeft } from 'react-icons/bs'
import { AiOutlinePlus } from 'react-icons/ai'
import FlushedInput from "src/libraries/ui/FlushedInput";
import StepIndicator from "src/libraries/ui/StepIndicator";
import { ChangeEvent, useState } from "react";

interface Props {
    payoutMode: string,
    setPayoutMode: (value: string) => void,
    amount: number,
    setAmount: (value: number) => void,
    step: number,
    setStep: (value: number) => void,
    milestones: string[],
    setMilestones: (value: string[]) => void
}

function Payouts(
    {
        payoutMode,
        setPayoutMode,
        amount,
        setAmount,
        step,
        setStep,
        milestones,
        setMilestones
    }: Props) {
    const router = useRouter()
    const buildComponent = () => {
        enum PayoutMode {
            IN_ONE_GO = 'in one go',
            BASED_ON_MILESTONE = 'based on milestone'
        }
        return (
            <>
                {/* Start Proposal Submission Component */}
                <Flex alignSelf='flex-start'>
                    <Button variant='linkV2' leftIcon={<BsArrowLeft />} onClick={() => setStep(2)}>Back</Button>
                </Flex>
                <Flex flexDirection='column' width='100%' gap={6}>
                    <StepIndicator step={step} />
                    <Text alignSelf='center' fontWeight='500' fontSize='24px' lineHeight='32px' marginBottom={8}>Payouts</Text>

                    <Flex gap={4} alignItems='baseline'>
                        <Text variant="requestProposalBody">Accepted Proposals are paid out</Text>
                        <FlushedInput placeholder='select one' width='15%' isDisabled={true} value={payoutMode} onChange={(e) => setPayoutMode(e.target.value)} />
                    </Flex>

                    <Flex gap={4} alignItems='baseline'>
                        <Button variant='outline' leftIcon={<AiOutlinePlus />} borderColor='black' onClick={() => setPayoutMode('in one go')}>in one go</Button>
                        <Button variant='outline' leftIcon={<AiOutlinePlus />} borderColor='black' onClick={() => {setPayoutMode('based on milestone'); handleClick()}}>based on milestone</Button>
                    </Flex>

                    {
                        payoutMode === PayoutMode.BASED_ON_MILESTONE && (
                            <>
                                
                                {Array.from(Array(milestoneCounter)).map((c, index) => {
                                    return (
                                        <>
                                            <Flex gap={4} alignItems='baseline'>
                                                <Text variant="requestProposalBody">{`${index + 1}`}</Text>
                                                <FlushedInput placeholder='Add milestone' value={milestoneInputValues[index]} onChange={(e) => handleOnChange(e, index)} />
                                            </Flex>
                                        </>
                                    );
                                })}
                                <Flex gap={4} alignItems='baseline'>
                                    <Button
                                        variant='outline'
                                        leftIcon={<AiOutlinePlus />}
                                        borderColor='black'
                                        onClick={() => handleClick()}>Add another milestone</Button>
                                </Flex>
                            </>
                        )
                    }

                    <Flex gap={4} alignItems='baseline'>
                        <Text variant="requestProposalBody">Maximum amount paid out per proposal will be</Text>
                        <FlushedInput placeholder='enter number' type='number' width='15%' value={amount.toString()} onChange={(e) => setAmount(parseInt(e.target.value))} />
                        <Text variant="requestProposalBody">USD</Text>
                    </Flex>

                    {/* CTA */}
                    <Flex gap={8} width='100%' justifyContent='flex-end' >
                        <Button variant='link' onClick={() => setStep(3)}>Skip for now</Button>
                        <Button variant='primaryMedium' onClick={() => setStep(4)}>Continue</Button>
                    </Flex>
                </Flex>
            </>
        )
    }

    const [milestoneInputValues, setMilestoneInputValues] = useState({})
    const [milestoneCounter, setMilestoneCounter] = useState(0)

    const handleClick = () => {
        setMilestoneCounter(milestoneCounter + 1);
        console.log(milestoneCounter);
    };

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const abc = {};
        abc[index] = e.target.value;
        setMilestoneInputValues({ ...milestoneInputValues, ...abc });
        console.log({ ...milestoneInputValues, ...abc });
    };


    return buildComponent()


}

export default Payouts