'use client'
import React from 'react'
import { mainnet } from '@starknet-react/chains'
import {
	braavos,
	publicProvider,
	StarknetConfig,
	voyager
} from '@starknet-react/core'

export function StarknetProvider({ children }: { children: React.ReactNode }) {
	const connectors = [braavos()]

	return (
		<StarknetConfig
			chains={[mainnet]}
			provider={publicProvider()}
			connectors={connectors}
			explorer={voyager}
		>
			{children}
		</StarknetConfig>
	)
}
