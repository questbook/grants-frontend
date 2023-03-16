import { createContext, createElement, PropsWithChildren, ReactNode } from 'react'

/**
 * Makes a context for a store and a component to provide the store
 */
export function ContextGenerator<T>(store: () => T) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const context = createContext<T>(undefined as any)
	return {
		context,
		contextMaker: ({ children }: {children: ReactNode}) => {
			const value = store()
			return createElement(context.Provider, { value }, children)
		},
	}
}