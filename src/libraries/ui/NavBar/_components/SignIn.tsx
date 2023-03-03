import { ChangeEvent, useState, useContext } from 'react'
import { Button, Flex, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text } from '@chakra-ui/react'
import TextField from 'src/v2/components/InputFields/TextField'
import RestoreWallet from './RestoreWallet'
import { WebwalletContext } from 'src/pages/_app'
import useGoogleDriveWalletRecoveryReact from './googleRecovery'
import { ArrowLeft } from 'src/generated/icons'
import { BsArrowLeft } from 'react-icons/bs'
import CreateNewWallet from './CreateNewWallet'
interface Props {
    isOpen: boolean
    setSignIn: (signIn: boolean) => void
    onClose: () => void
    // onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

function SignIn({ isOpen, onClose, setSignIn }: Props) {
    const [signInMethod, setSignInMethod] = useState<'newWallet' | 'existingWallet' | 'choosing'>('choosing')

    const { importWebwallet } = useContext(WebwalletContext)!

    const { inited, loading, importWalletFromGD, exportWalletToGD } = useGoogleDriveWalletRecoveryReact({ googleClientID: '986000900135-tscgujbu2tjq4qk9duljom0oimnb79la.apps.googleusercontent.com' })

    const buildComponent = () => {
        return (
            <Modal
                isCentered={true}
                size='2xl'
                isOpen={isOpen}
                onClose={onClose}>
                <ModalOverlay />
                <ModalContent
                    maxW={['94%', '70%', '50%', '40%']}
                >
                    
                   
                    <ModalCloseButton />
                    {/* {signInMethod!='choosing'&& 
                    } */}
                    {signInMethod == 'choosing' && (<ModalBody>
                        <Flex
                            p={6}
                            direction='column'
                            align='center'>
                            <Text
                                variant='v2_subheading'
                                fontWeight='500'
                                mt={5}>
                                Sign in with wallet
                            </Text>
                            <Text
                                variant='v2_body'
                                mt={1}
                                color='black.3'>
                                Use your existing Questbook wallet or create new one
                            </Text>
                            <Button
                                variant='primaryMedium'
                                marginTop={4}
                                onClick={() => setSignInMethod('newWallet')}
                            >
                                <Text
                                    variant='v2_body'
                                    color='white'
                                    fontWeight='500'
                                >
                                    create new wallet
                                </Text>
                            </Button>

                            <Button
                                variant='primaryMedium'
                                marginTop={2}
                                onClick={() => setSignInMethod('existingWallet')}
                            >
                                <Text
                                    variant='v2_body'
                                    color='white'
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
                            setSignIn={setSignIn}
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