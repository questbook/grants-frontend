import { Button, Flex, Text, Image, Select } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BsArrowLeft } from 'react-icons/bs'
import { MdArrowDropDown } from 'react-icons/md'
import FlushedInput from "src/libraries/ui/FlushedInput";
import StepIndicator from "src/libraries/ui/StepIndicator";
import { ChangeEvent, useEffect, useState } from "react";
import useSafeUSDBalances from "src/hooks/useSafeUSDBalances";


interface Props {
    multiSigAddress: string,
    setMultiSigAddress: (value: string) => void,
    step: number,
    setStep: (value: number) => void,
    selectedSafeNetwork: string,
    setSelectedSafeNetwork: (value: string) => void,
}

function LinkMultiSig({ multiSigAddress, setMultiSigAddress, step, setStep, selectedSafeNetwork, setSelectedSafeNetwork }: Props) {
    const buildComponent = () => {
        return (
            <>
                <Flex alignSelf='flex-start'>
                    <Button variant='linkV2' leftIcon={<BsArrowLeft />} onClick={() => setStep(3)}>Back</Button>
                </Flex>

                <Flex flexDirection='column' width='100%' gap={6} alignItems='center'>
                    <StepIndicator step={step} />
                    <Flex direction='column' alignItems='center' gap={10}>
                        <Flex direction='column' gap={2}>
                            <Text alignSelf='center' fontWeight='500' fontSize='24px' lineHeight='32px' >Link your multisig</Text>
                            <Text>Use your multisig to payout builders on Questbook</Text>
                        </Flex>

                        <Flex direction='column' gap={1}>
                            <Text>We currently support</Text>
                            <Flex gap={4}>
                                <Image src='/safes_icons/safe_logo.svg' />
                                <Image src='/safes_icons/realms_logo.svg' />
                            </Flex>
                        </Flex>
                        <Flex direction='column'>
                            <FlushedInput placeholder='Solana or Ethereum address' value={multiSigAddress} onChange={(e) => {
                                if (e.target.value.includes(':')) {
                                    setMultiSigAddress(e.target.value.split(':')[1])
                                } else {
                                    setMultiSigAddress(e.target.value)
                                }

                            }} />
                            
                            {(multiSigAddress && !loadedSafesUSDBalance) ?
                                safesUSDBalance.length < 1 ?
                                    (<>
                                        <Text variant="footerContent">Searching for this address on different networks..</Text>
                                    </>) :
                                    (<><Text variant="footerContent">Looks like this address is on {safesUSDBalance.length} network(s).</Text>
                                        <Select variant='flushed' icon={<MdArrowDropDown />} placeholder='Choose your network' onChange={(e) => { setSelectedSafeNetwork(e.target.value) }}>
                                            {
                                                safeNetworks.map((option, index) => <option value={selectedSafeNetwork}>{option} {index}</option>)
                                            }
                                        </Select></>) :

                                <>



                                </>
                            }
                        </Flex>

                        <Button variant='primaryMedium' isDisabled={selectedSafeNetwork.length > 0}>Link multisig</Button>
                        <Text>Why do I need a multisig?</Text>
                        <Button variant='link'>Skip for now</Button>
                    </Flex>
                    <Flex gap={1}>
                        <Text variant="footerContent">By continuing, you accept Questbook’s</Text>
                        <Text variant="footerContentBold">Terms of Service</Text>
                    </Flex>
                </Flex>

            </>
        )
    }

    const [safeNetworks, setSafeNetworks] = useState<string[]>([]);
    // const [selectedSafeNetwork, setSelectedSafeNetwork] = useState<string>('');

    const { data: safesUSDBalance, loaded: loadedSafesUSDBalance } = useSafeUSDBalances({ safeAddress: multiSigAddress })

    useEffect(() => {
        setSafeNetworks([])
        console.log('Multi-sig address entered', multiSigAddress)
        console.log('Safe USD balance', safesUSDBalance)
        console.log('Loaded Safe USD balance', loadedSafesUSDBalance)
        const networks = []
        for (let i = 0; i < safesUSDBalance.length; i++) {
            console.log('network', safesUSDBalance[i].networkName)
            networks.push(safesUSDBalance[i].networkName)

        }
        setSafeNetworks(networks)
    }, [multiSigAddress, safesUSDBalance])

    return buildComponent()
}

export default LinkMultiSig