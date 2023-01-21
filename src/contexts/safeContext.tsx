import { createContext, PropsWithChildren, ReactNode, useContext, useState } from 'react'

export const SafeContext = createContext<any>(null)

export const useSafeContext = () => useContext(SafeContext)

export const SafeProvider = ({ children }: PropsWithChildren<ReactNode>) => {
	const [safeObj, setSafeObj] = useState(null)

	return (
		<SafeContext.Provider value={{ safeObj, setSafeObj }}>
			    {children}
		</SafeContext.Provider>
	)
}