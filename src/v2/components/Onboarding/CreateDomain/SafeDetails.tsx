import { Box, Button, CircularProgress, Flex, Text } from '@chakra-ui/react'
import TextField from '../../InputFields/TextField'

interface Props {
    step: number;
    safeAddress: string;
    setSafeAddress: (safeAddress: string) => void;
    isPasted?: boolean;
    setIsPasted?: (isPasted: boolean) => void;
    isVerified?: boolean;
    setIsVerified?: (isVerified: boolean) => void;
    isLoading?: boolean;
    setIsLoading?: (isLoading: boolean) => void;
    onContinue: () => void;
}

function SafeDetails({ step, safeAddress, setSafeAddress, isPasted, setIsPasted, isVerified, setIsVerified, isLoading, setIsLoading, onContinue }: Props) {
	return (
		<>
			<Text
				variant="v2_body"
				color="black.3">
            Let’s begin the adventure.
			</Text>
			<Text
				variant="v2_heading_3"
				fontWeight="500">
            Create a domain
			</Text>
			<Text
				variant="v2_body"
				fontWeight="500"
				mt={6}>
            To create a domain, you need a safe.
			</Text>
			<Box mb="auto" />
			<TextField
				label='Safe Address'
				helperText='Your safe can be used to invite members & do payouts on Questbook.'
				helperLinkText='Learn about safe and supported safes'
				helperLinkUrl='https://youtube.com'
				placeholder='0xE6379586E5D8350038E9126c5553c0C77549B6c3'
				value={safeAddress}
				onChange={
					(e) => {
						setSafeAddress(e.target.value)
					}
				}
				isPasted={isPasted}
				setIsPasted={setIsPasted}
				isVerified={isVerified}
				setIsVerified={setIsVerified} />
			{
				isLoading && (
					<Flex
						mt={2}
						align="center">
						<CircularProgress
							color="violet.2"
							size="11px"
							isIndeterminate />
						<Text
							ml={2}
							variant="v2_metadata"
							color="black.3">
								Looking up safes with this address on different networks...
						</Text>
					</Flex>
				)
			}


			<Button
				variant="primaryV2"
				ml="auto"
				mt={6}
				disabled={!isVerified}
				onClick={onContinue}>
            Continue
			</Button>
		</>
	)
}

export default SafeDetails