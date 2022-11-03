import { Flex, Text, Input } from "@chakra-ui/react"

interface Props {
    placeholder: string,
    width?: string,
    type?: string,
}

function FlushedInput({ placeholder, width, type}: Props) {
    return (
        
        <Input variant='flushed' placeholder={placeholder} borderBottom='5px solid' fontWeight='400' fontSize='20px' width={width} type={type} />
        
    )
}

export default FlushedInput