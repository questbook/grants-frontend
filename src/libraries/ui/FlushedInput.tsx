import { Flex, Text, Input, ResponsiveValue } from "@chakra-ui/react"
import { ChangeEventHandler, MutableRefObject } from "react"

interface Props {
    placeholder: string,
    width?: string,
    type?: string,
    isDisabled?: boolean,
    value?: string,
    onChange?: ChangeEventHandler<HTMLInputElement>,
    textAlign?: any,
    helperText?: string,
    ref?: MutableRefObject<HTMLInputElement | null>,
    onClick?: () => void,
    height?: ResponsiveValue<string | number>,
}

function FlushedInput({ placeholder, width, height, type, isDisabled, value, onChange, textAlign, helperText, ref }: Props) {
    return (
        <>
            <Flex direction='column' gap={2}>
                <Input
                    variant='flushed'
                    placeholder={placeholder}
                    borderBottom='5px solid'
                    borderColor={value ? 'black' : 'gray.300'}
                    fontWeight='400'
                    fontSize='20px'
                    width={width ? width : value ? `${value.length + 1}ch` : `${placeholder.length + 5}ch`}
                    height={height}
                    type={type}
                    isDisabled={isDisabled}
                    value={value}
                    onChange={onChange}
                    textAlign={textAlign ? textAlign : 'center'}
                    ref={ref} />
                <Text variant="v2_helper_text">{helperText}</Text>
            </Flex>
        </>
    )
}

export default FlushedInput