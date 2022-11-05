import { Flex, Text, Input } from "@chakra-ui/react"

interface Props {
    placeholder: string,
    width?: string,
    type?: string,
    isDisabled?: boolean
}

function FlushedInput({ placeholder, width, type, isDisabled}: Props) {
    return (
        
        <Input variant='flushed' placeholder={placeholder} borderBottom='5px solid' fontWeight='400' fontSize='20px' width={width} type={type} isDisabled={isDisabled} />
        
    )
}

export default FlushedInput