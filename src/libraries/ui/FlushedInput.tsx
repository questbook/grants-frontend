import { Flex, Text, Input } from "@chakra-ui/react"
import { ChangeEventHandler } from "react"

interface Props {
    placeholder: string,
    width?: string,
    type?: string,
    isDisabled?: boolean,
    value?: string,
    onChange?: ChangeEventHandler<HTMLInputElement>
}

function FlushedInput({ placeholder, width, type, isDisabled, value, onChange }: Props) {
    return (

        <Input
            variant='flushed'
            placeholder={placeholder}
            borderBottom='5px solid'
            fontWeight='400'
            fontSize='20px'
            width={width}
            type={type}
            isDisabled={isDisabled}
            value={value}
            onChange={onChange} />

    )
}

export default FlushedInput