import { ChangeEvent, useEffect, useState } from 'react'
import { Button, Checkbox, Flex, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text, Textarea } from '@chakra-ui/react'
import TextField from 'src/v2/components/InputFields/TextField'
import { ethers, Wallet } from 'ethers';
import { BsArrowLeft } from 'react-icons/bs';
import copy from 'copy-to-clipboard'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
interface Props {
    importWebwallet: (privateKey: string) => void
    inited: boolean
    loading: boolean
    exportWalletToGD: (wallet: Wallet) => Promise<void>
    setSignIn: (signIn: boolean) => void
    setSignInMethod: (signInMethod: 'newWallet' | 'existingWallet' | 'choosing') => void
}

function CreateNewWallet({ setSignInMethod, setSignIn, inited, loading, exportWalletToGD, importWebwallet }: Props) {
    const toast = useCustomToast()
    const [isPrivateKeySaved, setIsPrivateKeySaved] = useState<boolean>(false)
    const [newWallet, setNewWallet] = useState<ethers.Wallet>(ethers.Wallet.createRandom())
    const buildComponent = () => {
        return (
            <ModalBody>
                <Flex
                    pb={6}
                    direction='column'
                    align='center'>
                    <Button
                        colorScheme='white'
                        textColor='black'
                        // variant='linkV2'
                        ml={-5}
                        alignSelf={'flex-start'}
                        leftIcon={<BsArrowLeft />}
                        onClick={() => setSignInMethod('choosing')}
                    >
                        Back
                    </Button>
                    <Text
                        variant='v2_subheading'
                        fontWeight='500'
                        mt={5}>
                        New Questbook wallet
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
                        value={newWallet.privateKey}
                    />
                    <Flex
                        flexDirection='row'
                        gap={3}
                        marginTop={2}
                    >
                        <Button
                            variant='primaryMedium'
                            marginTop={4}
                            isDisabled={loading || !inited}
                            onClick={async () => {

                                await exportWalletToGD(newWallet)
                            }
                            }

                        >
                            <Text
                                variant='v2_body'
                                color='white'
                                fontWeight='500'
                            >
                                Import to Google Drive
                            </Text>
                        </Button>

                        <Button
                            variant='primaryMedium'
                            marginTop={4}
                            onClick={() => {
                                const copied = copy(newWallet.privateKey)
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
                                color='white'
                                fontWeight='500'
                            >
                                Back up manually
                            </Text>
                        </Button>
                    </Flex>
                    <Checkbox
                        marginTop={4}
                        alignSelf={'flex-start'}
                        checked={isPrivateKeySaved}
                        onChange={() => setIsPrivateKeySaved(!isPrivateKeySaved)}
                    >
                        <Text variant='v2_subheading'
                            fontWeight='500'
                            fontSize='14'
                        >
                            I have saved my Questbook wallet private key.
                        </Text>
                    </Checkbox>
                    <Button
                        marginTop={3}
                        isDisabled={!isPrivateKeySaved}
                        onClick={() => {
                            try {
                                importWebwallet(newWallet.privateKey)
                                setSignIn(false)
                            } catch {
                                toast({
                                    title: 'Error',
                                    description: "Try again later.",
                                    status: 'warning',
                                    duration: 6000,
                                    isClosable: true,
                                })
                            }
                        }
                        }
                    >
                        continue
                    </Button>
                </Flex>
            </ModalBody>
        )
    }

    return buildComponent()
}

export default CreateNewWallet