import { useMemo } from 'react'
import { useNetwork } from 'src/hooks/gasless/useNetwork'

/**
 * Return the chain ID if supported by the app, otherwise return undefined
 * @returns the chain ID if supported -- undefined otherwise
 */
export default function useChainId() {
	// @TODO-gasless: Change here!
	const { data } = useNetwork()
	const id = useMemo(() => data.id, [data])
	return id
}