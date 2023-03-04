import { ChangeEvent, useState, useContext } from 'react'
import { Button, Flex, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text } from '@chakra-ui/react'
import TextField from 'src/v2/components/InputFields/TextField'
import RestoreWallet from './RestoreWallet'
import { SignInMethodContext, WebwalletContext } from 'src/pages/_app'
import useGoogleDriveWalletRecoveryReact from './googleRecovery'
import { ArrowLeft } from 'src/generated/icons'
import { BsArrowLeft } from 'react-icons/bs'
import CreateNewWallet from './CreateNewWallet'
import { Wallet } from 'ethers'
interface Props {
    isOpen: boolean
    setSignIn: (signIn: boolean) => void
    onClose: () => void
    inited: boolean
    loading: boolean
    exportWalletToGD: (wallet: Wallet) => Promise<void>
    importWalletFromGD: () => Promise<Wallet>
    // onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

function SignIn({ inited, loading, importWalletFromGD, exportWalletToGD, isOpen, onClose, setSignIn }: Props) {
    // const [signInMethod, setSignInMethod] = useState<'newWallet' | 'existingWallet' | 'choosing'>('choosing')
    const {signInMethod, setSignInMethod}= useContext(SignInMethodContext)!
    const { importWebwallet } = useContext(WebwalletContext)!

    const buildComponent = () => {
        return (
            <Modal
                isCentered={true}
                size='2xl'
                isOpen={isOpen}
                onClose={onClose}>
                <ModalOverlay />
                <ModalContent
                    maxW={['94%', '70%', '50%', '50%']}
                >


                    <ModalCloseButton />
                    {/* {signInMethod!='choosing'&& 
                    } */}
                    {signInMethod == 'choosing' && (<ModalBody>
                        <Flex
                            p={6}
                            direction='column'
                            align='center'>
                            <Image
                                alignSelf='center'
                                // display={['none', 'inherit']}
                                // mr='auto'
                                src='/ui_icons/qb.svg'
                                alt='Questbook'
                                marginBottom={1}
                                cursor='pointer' />
                            <Text
                                variant='v2_subheading'
                                fontWeight='500'
                                mt={5}>
                                Sign in with wallet
                            </Text>
                            <Text
                                variant='v2_body'
                                mt={1}
                                mb={5}
                                color='black.3'>
                                Use your existing Questbook wallet or create new one
                            </Text>
                            <Button
                                variant='primaryMedium'
                                marginTop={4}
                                borderRadius={'20'}
                                width={['70%','60%']}
                                height={10}
                                onClick={() => setSignInMethod('newWallet')}
                            >
                                <Text
                                    variant='v2_body'
                                    color='gray.100'
                                    fontWeight='500'
                                >
                                    create new wallet
                                </Text>
                            </Button>

                            <Button
                                variant='primaryMedium'
                                marginTop={2}
                                width={['70%','60%']}
                                bg='gray.3'
                                height={10}
                                borderRadius={'20'}
                                onClick={() => setSignInMethod('existingWallet')}
                            >
                                <Text
                                    variant='v2_body'
                                    color='black'
                                    fontWeight='500'
                                >
                                    I have a Questbook wallet
                                </Text>
                            </Button>
                        </Flex>
                    </ModalBody>)}
                    {signInMethod == 'existingWallet' && (
                        <RestoreWallet
                            importWebwallet={importWebwallet}
                            inited={inited}
                            loading={loading}
                            importWalletFromGD={importWalletFromGD}
                            closeModal={()=>setSignIn(false)}
                            setSignInMethod={setSignInMethod}
                        />)}
                    {signInMethod == 'newWallet' && (
                        <CreateNewWallet
                            importWebwallet={importWebwallet}
                            inited={inited}
                            loading={loading}
                            exportWalletToGD={exportWalletToGD}
                            setSignIn={setSignIn}
                            setSignInMethod={setSignInMethod}
                        />
                    )}

                </ModalContent>
            </Modal>
        )
    }

    return buildComponent()
}

export default SignIn