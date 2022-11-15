import { Flex } from "@chakra-ui/react"
import { ReactElement, useState } from "react"
import NavbarLayout from "src/libraries/ui/navbarLayout"
import LinkMultiSig from "./_components/LinkMultiSig"
import Payouts from "./_components/Payouts"
import ProposalReview from "./_components/ProposalReview"
import ProposalSubmission from "./_components/ProposalSubmission"
import { today } from "./_utils/utils"

function RequestProposal() {
    const buildComponent = () => {
        return (
            <Flex minWidth='90%' gap={8} bgColor='white' padding={4} alignItems='center' marginTop={8} marginRight={16} marginLeft={16} marginBottom={4}>

                {renderBody()}
            </Flex>
        )
    }

    const renderBody = () => {
        switch (step) {
            case 1:
                return (<ProposalSubmission
                    proposalName={proposalName}
                    setProposalName={setProposalName}
                    startdate={startDate}
                    setStartdate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    requiredDetails={requiredDetails}
                    moreDetails={moreDetails}
                    setMoreDetails={setMoreDetails}
                    link={link}
                    setLink={setLink}
                    doc={doc}
                    setDoc={setDoc}
                    step={step}
                    setStep={setStep}
                />)
            case 2:
                return (<ProposalReview
                    numberOfReviewers={numberOfReviewers}
                    setNumberOfReviewers={setNumberOfReviewers}
                    rubricMechanism={rubricMechanism}
                    setRubricMechanism={setRubricMechanism}
                    step={step} setStep={setStep}
                    rubrics={rubrics}
                    setRubrics={setRubrics} />)
            case 3:
                return (<Payouts
                    payoutMode={payoutMode}
                    setPayoutMode={setPayoutMode}
                    amount={amount}
                    setAmount={setAmount}
                    step={step}
                    setStep={setStep}
                    milestones={milestones}
                    setMilestones={setMilestones} />)
            case 4: return (<LinkMultiSig
                multiSigAddress={multiSigAddress}
                setMultiSigAddress={setMultiSigAddress}
                step={step}
                setStep={setStep}
                selectedSafeNetwork={selectedSafeNetwork}
                setSelectedSafeNetwork={setSelectedSafeNetwork}></LinkMultiSig>)
        }
    }

    // State for Proposal Submission
    const todayDate = today()
    const [proposalName, setProposalName] = useState('')
    const [startDate, setStartDate] = useState(todayDate)
    const [endDate, setEndDate] = useState('')
    const [requiredDetails, setRequiredDetails] = useState(['title', 'tl,dr', 'details', 'funding ask'])
    const [moreDetails, setMoreDetails] = useState('')
    const [link, setLink] = useState('')
    const [doc, setDoc] = useState('')

    const [step, setStep] = useState(1)

    // State for Proposal Review
    const [numberOfReviewers, setNumberOfReviewers] = useState(2)
    const [rubricMechanism, setRubricMechanism] = useState('')
    const [rubrics, setRubrics] = useState({})

    // State for Payouts
    const [payoutMode, setPayoutMode] = useState('')
    const [amount, setAmount] = useState(0)
    const [milestones, setMilestones] = useState<string[]>([])

    // State for Linking MultiSig
    const [multiSigAddress, setMultiSigAddress] = useState('')
    const [selectedSafeNetwork, setSelectedSafeNetwork] = useState('')

    return buildComponent()
}

RequestProposal.getLayout = function (page: ReactElement) {
    return (
        <NavbarLayout renderSidebar={false}>
            {page}
        </NavbarLayout>
    )
}

export default RequestProposal