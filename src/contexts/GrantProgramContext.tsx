import { createContext, PropsWithChildren, ReactNode, useMemo, useState } from 'react'
import { GrantProgramContextType, GrantType, Roles } from 'src/types'


const GrantProgramContext = createContext<GrantProgramContextType | null>(null)

const GrantProgramContextProvider = ({ children }: PropsWithChildren<ReactNode>) => {
	const [grant, setGrant] = useState<GrantType>()
	const [role, setRole] = useState<Roles>('community')
	const [isLoading, setIsLoading] = useState<boolean>(true)

	const grantProgram = useMemo(() => {
		return {
			grant,
			setGrant,
			role,
			setRole,
			isLoading,
			setIsLoading
		}
	}, [grant, setGrant, role, setRole, isLoading, setIsLoading])

	const context = () => {
		return (
			<GrantProgramContext.Provider value={grantProgram}>
				{children}
			</GrantProgramContext.Provider>
		)
	}

	return context()
}

export { GrantProgramContext, GrantProgramContextProvider }