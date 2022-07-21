import React, { useContext, useEffect, useState } from 'react'
import {
    Button,
    Flex,
    ModalBody,
    ToastId,
    useToast,
} from '@chakra-ui/react'
import { BigNumber, utils } from 'ethers'
import { ApiClientsContext } from 'pages/_app'
import Loader from 'src/components/ui/loader'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useAccount, useContract, useNetwork, useSigner } from 'wagmi'

import ERC20ABI from '../../../../contracts/abi/ERC20.json'
import SingleLineInput from '../../../ui/forms/singleLineInput'
import useChainId from 'src/hooks/utils/useChainId'
import useERC20Contract from 'src/hooks/contracts/useERC20Contract'
import CustomToast from 'src/components/ui/toasts/customToast'
import { parseAmount } from '../../../../utils/formattingUtils'

interface Props {
    isOpen: boolean;
    onClose: () => void;
    rewardAsset: {
        address: string;
        committed: BigNumber;
        label: string;
        icon: string;
        decimals?: number;
    };
}

function ModalContent({
    isOpen,
    onClose,
    rewardAsset
}: Props) {
    const apiClients = useContext(ApiClientsContext)!
    const { workspace } = apiClients
    const [error, setError] = React.useState(false)
    const [rewardAssetDecimals, setRewardAssetDecimals] = React.useState(0)
    const [submitClicked, setSubmitClicked] = useState(false)
    const [approvalAmount, setApprovalAmount] = useState("")

    const { data: signer } = useSigner()
    const { data: accountData } = useAccount()
    const { switchNetwork } = useNetwork()
    const rewardAssetContract = useContract({
        addressOrName:
            rewardAsset.address || '0x0000000000000000000000000000000000000000',
        contractInterface: ERC20ABI,
        signerOrProvider: signer,
    })
    const currentChainId = useChainId()
    const chainId = getSupportedChainIdFromWorkspace(workspace)
    const workspaceRegistryContract = useQBContract('workspace', chainId)
    const rewardContract = useERC20Contract(rewardAsset.address)

    const toastRef = React.useRef<ToastId>()
    const toast = useToast()

    useEffect(() => {
        if (workspace && switchNetwork && isOpen) {
            const chainId = getSupportedChainIdFromWorkspace(workspace)
            switchNetwork(chainId!)
        }
    }, [isOpen, switchNetwork, workspace])

    async function approvalEvent() {
        rewardContract.on('Approval', (from, to, amount, eventDetail) => {
            if (from === accountData?.address && to === utils.getAddress(workspaceRegistryContract.address!)) {
                toastRef.current = toast({
                    position: 'top',
                    render: () => CustomToast({
                        content: 'Approval Succeeded!',
                        close: () => {
                            if (toastRef.current) {
                                toast.close(toastRef.current)
                            }
                        },
                    }),
                })
            }
            
        })
        onClose()
    }

    async function approveDisbursal() {
        setTimeout(()=>{
            onClose()
        }, 3000)
        if (!rewardAssetContract.provider) {
            return
        }
        const decimals = await rewardAssetContract.decimals()
        const amount = parseAmount(approvalAmount, rewardAsset.address, decimals)
        
        toastRef.current = toast({
            position: 'top',
            render: () => CustomToast({
                content: 'Waiting for approval to complete - please sign off',
                close: () => {
                    if (toastRef.current) {
                        toast.close(toastRef.current)
                    }
                },
            }),
        })
        await rewardContract.approve(workspaceRegistryContract.address, amount)
        Promise.all([approvalEvent()])
    }

    return (
        <ModalBody>
            <Flex
                direction="column"
                justify="start"
                align="start">
                <SingleLineInput
                    label='Funds to approve'
                    placeholder='$10000'
                    value={approvalAmount}
                    onChange={
                        (e) => {
                            if (error) {
                                setError(false)
                            }

                            setApprovalAmount(e.target.value)
                        }
                    } />
                <Button onClick={approveDisbursal}>Approve</Button>
            </Flex>
        </ModalBody>
    )
}

export default ModalContent