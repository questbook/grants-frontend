import { Container, Flex } from "@chakra-ui/react"

interface Props {
    step: number
}

function StepIndicator({step}: Props) {
    return (
        <Flex gap={1} alignSelf='stretch'>
            <Flex width='100%' flexDirection='row'>
            
            <Container borderRadius='1px' bgColor={step>0 ? 'accent.azure' : 'gray.2'} height={1}></Container>
            {/* <Container borderRadius='1px' bgColor={step>0 ? 'azure.1' : 'gray.2'} height={5} width={1} alignSelf='flex-end'></Container> */}
            </Flex>
            
            <Container borderRadius='1px' bgColor={step>1 ? 'accent.azure' : 'gray.2'} height={1}></Container>
            <Container borderRadius='1px' bgColor={step>2 ? 'accent.azure' : 'gray.2'} height={1}></Container>
        </Flex>
    )
}

export default StepIndicator