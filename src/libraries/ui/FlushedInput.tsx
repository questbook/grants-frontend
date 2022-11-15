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
            borderColor={ value ? 'black' : 'gray.300'}
            fontWeight='400'
            fontSize='20px'
            width={value ? `${value.length + 1}ch` : `${placeholder.length + 5}ch`}
            type={type}
            isDisabled={isDisabled}
            value={value}
            onChange={onChange}
            textAlign='center' />

    )
}

export default FlushedInput