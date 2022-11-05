import { Container, Flex } from "@chakra-ui/react"

interface Props {
    step: number
}

function StepIndicator({step}: Props) {
    return (
        <Flex gap={2}>
            <Flex width='100%' flexDirection='row'>
            
            <Container borderRadius='1px' bgColor={step>0 ? 'azure.1' : 'gray.2'} height={1}></Container>
            {/* <Container borderRadius='1px' bgColor={step>0 ? 'azure.1' : 'gray.2'} height={5} width={1} alignSelf='flex-end'></Container> */}
            </Flex>
            
            <Container bgColor={step>1 ? 'azure.1' : 'gray.2'} height={1}></Container>
            <Container bgColor={step>2 ? 'azure.1' : 'gray.2'} height={1}></Container>
        </Flex>
    )
}

export default StepIndicator