import { Button, Flex, Text, Image, Box, useToast, ToastId } from "@chakra-ui/react";
import { useRouter } from "next/router";
import FlushedInput from "src/libraries/ui/FlushedInput";
import { t } from "i18next";
import { useRef, useState } from "react";
import ErrorToast from "src/components/ui/toasts/errorToast";

interface Props {
    domainName: string,
    setDomainName: (domainName: string) => void,
    domainImage: string,
    setDomainImage: (domainImage: string) => void,
}

function BuilderDiscovery({ domainName, setDomainName, domainImage, setDomainImage }: Props) {

    const ref = useRef(null)

    const toast = useToast()
    const toastRef = useRef<ToastId>()


    const openInput = () => {
        if (ref.current) {
            (ref.current as HTMLInputElement).click()
        }
    }

    const maxImageSize = 2

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.[0]) {
            const img = event.target.files[0]
            if (img.size / 1024 / 1024 <= maxImageSize) {
                setDomainLogoFile(img)
            } else {
                toastRef.current = toast({
                    position: 'top',
                    render: () => ErrorToast({
                        content: `Image size exceeds ${maxImageSize} MB`,
                        close: () => {
                            if (toastRef.current) {
                                toast.close(toastRef.current)
                            }
                        },
                    }),
                })
            }

            // @ts-ignore
            event.target.value = null
        }
    }

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
                            <input
                                style={{ visibility: 'hidden', height: 0, width: 0 }}
                                ref={ref}
                                type='file'
                                name='myImage'
                                onChange={handleImageChange}
                                accept='image/jpg, image/jpeg, image/png' />
                            <Image src={domainLogoFile ? URL.createObjectURL(domainLogoFile) : ''} background={domainLogoFile ? '' : 'gray.4'} boxSize={32} />
                            <Button color='azure.1'
                                background='linear-gradient(0deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), #0A84FF;'
                                borderRadius='3px'
                                onClick={() => openInput()}
                            >
                                Upload
                            </Button>
                        </Flex>
                        <FlushedInput
                            placeholder="Name"
                            width="100%"
                            textAlign='start'
                            value={domainName}
                            onChange={(e) => setDomainName(e.target.value)}
                            helperText="Examples: Uniswap Foundation. Polygon Village DAO. Celo Climate Collective" />
                    </Box>
                </Flex>

                {/* CTA button */}
                <Button variant='primaryMedium' isDisabled={!domainName}>Create</Button>
            </Flex>
        )
    }

    const [domainLogoFile, setDomainLogoFile] = useState<File | null>(null);

    return buildScreen()
}

export default BuilderDiscovery;