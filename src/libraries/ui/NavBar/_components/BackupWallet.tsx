import { ChangeEvent, useEffect, useState } from 'react'
import { Button, Checkbox, Flex, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text, Textarea } from '@chakra-ui/react'
import TextField from 'src/v2/components/InputFields/TextField'
import { ethers, Wallet } from 'ethers';
import { BsArrowLeft } from 'react-icons/bs';
import copy from 'copy-to-clipboard'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
interface Props {
    privateKey: string
    inited: boolean
    loading: boolean
    exportWalletToGD: (wallet: Wallet) => Promise<void>
    isNewUser: boolean
}
export default function BackupWallet({ isNewUser, exportWalletToGD, loading, inited, privateKey }: Props) {
    const toast = useCustomToast()
    const title = isNewUser ? 'New Questbook wallet' : 'Backup your Questbook wallet'
    useEffect(() => {
        console.log('hihi', loading, inited)
    }, [loading, inited])
    return (<><Text
        variant='v2_subheading'
        fontWeight='500'
        mt={5}
    >
        {title}
    </Text>
        <Text
            variant='v2_body'
            mt={1}
            color='black.3'>
            You will need the private key to sign into Questbook again. Save it in a
            secure place.
        </Text>
        <Textarea
            readOnly
            w='100%'
            mt={4}
            value={privateKey}
        />
        <Flex
            flexDirection='row'
            gap={3}
            width='100%'
            marginTop={2}
        >
            <Button
                width='50%'
                bg='gray.3'
                height={10}
                borderRadius={'20'}
                // variant='primaryMedium'
                marginTop={4}
                isDisabled={loading || !inited}
                onClick={async () => {
                    try {
                        await exportWalletToGD(new ethers.Wallet(privateKey))
                        toast({
                            title: "Imported to Google Drive",
                            status: 'success',
                            duration: 3000,
                            isClosable: true,
                        })
                    } catch {
                        toast({
                            title: "Error, try again with another account.",
                            status: 'success',
                            duration: 3000,
                            isClosable: true,
                        })
                    }
                }
                }

            >
                <Text
                    variant='v2_body'
                    color='black'
                    fontWeight='500'
                >
                    Import to Google Drive
                </Text>
            </Button>

            <Button
                // variant='primaryMedium'
                marginTop={4}
                width='50%'
                bg='gray.3'
                height={10}
                borderRadius={'20'}
                onClick={() => {
                    const copied = copy(privateKey)
                    if (copied) {
                        toast({
                            title: "Copied to clipboard",
                            status: 'success',
                            duration: 6000,
                            isClosable: true,
                        })
                    }
                }}
            >
                <Text
                    variant='v2_body'
                    color='black'
                    fontWeight='500'
                >
                    Back up manually
                </Text>
            </Button>
        </Flex></>)
}