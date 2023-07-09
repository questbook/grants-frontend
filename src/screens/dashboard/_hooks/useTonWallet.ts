import { useEffect, useState } from 'react'
import TonWeb from 'tonweb'
// import { tonProvider, WindowWithSolana } from 'src/types'

export default function usetonWallet() {
    const [tonWalletAvailable, setTonWalletAvailable] = useState(false)
    const [tonWallet, setTonWallet] = useState<any>()
    const [tonWalletConnected, setTonWalletConnected] = useState(false)
    const [tonWalletAddress, setTonWalletAddress] = useState<string>('')

    useEffect(() => {
        if ('ton' in window) {
            setTonWallet(window.ton)
            setTonWalletAvailable(true)
        }
        console.log('ton wallet')
    }, [])

    const connectTonWallet = async (): Promise<boolean> => {
        if (!tonWalletAvailable)return false
        const accounts = await tonWallet.send('ton_requestAccounts')        
        if(accounts.length===0)return false
        const account = accounts[0]
        const userRawAddress = new TonWeb.Address(account).toString(false)
        setTonWalletAddress(userRawAddress)
        setTonWalletConnected(true)
        return true
    }

    return {
        tonWalletAvailable,
        tonWallet,
        tonWalletConnected,
        tonWalletAddress,
        setTonWalletConnected,
        connectTonWallet
    }
}