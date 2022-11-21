import { Button, Flex, Text, Image, Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import FlushedInput from "src/libraries/ui/FlushedInput";
import { t } from "i18next";

interface Props {
    domainName: string,
    setDomainName: (domainName: string) => void,
    domainImage: string,
    setDomainImage: (domainImage: string) => void,
}

function BuilderDiscovery({ domainName, setDomainName, domainImage, setDomainImage }: Props) {

    const buildScreen = () => {

        return (
            <Flex alignItems='center' direction='column' width='100%' gap={12}>

                {/* Screen Heading */}
                <Flex direction='column' alignItems='center' width='100%' gap={2}>
                    <Text variant="v2_heading">
                        Builder Discovery
                    </Text>
                    <Text variant="v2_subheading_2">Customize how builders can discover you on the Discover feed</Text>
                </Flex>


                {/* Input Card */}
                <Flex width='100%' alignItems='center' direction='column'>
                    <Box display='flex' flexDirection='column' border='1px solid' gap={6} pt={8} p={6}>
                        <Flex gap={4} alignItems='center'>
                            <Image background='orange.4' boxSize={32} />
                            <Button color='azure.1'
                                background='linear-gradient(0deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), #0A84FF;'
                                borderRadius='3px'>
                                Upload
                            </Button>
                        </Flex>
                        <FlushedInput 
                        placeholder="Name" 
                        width="100%" 
                        textAlign='start'
                        value={domainName}
                        onChange={(e) => setDomainName(e.target.value)}
                        helperText="Examples: Uniswap Foundation. Polygon Village DAO. Celo Climate Collective"/>
                    </Box>
                </Flex>

                {/* CTA button */}
                <Button variant='primaryMedium' isDisabled={!domainName}>Create</Button>
            </Flex>
        )
    }

    return buildScreen()
}

export default BuilderDiscovery;