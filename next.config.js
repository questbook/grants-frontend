/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	trailingSlash: true,
	webpack: function(config, options) {
		if(!options.isServer) {
			config.resolve.fallback.fs = false
		}

		config.experiments = { asyncWebAssembly: true }
		return config
	},
	env: {
		NEXT_PUBLIC_IS_TEST: process.env.NEXT_PUBLIC_IS_TEST,
		BICO_AUTH_TOKEN: process.env.BICO_AUTH_TOKEN
	}
}

/* eslint-disable @typescript-eslint/no-var-requires */
const withTM = require('next-transpile-modules')([
	'@blocto/sdk',
	'@project-serum/sol-wallet-adapter',
	'@solana/wallet-adapter-base',
	'@solana/wallet-adapter-react',
	'@solana/wallet-adapter-bitkeep',
	'@solana/wallet-adapter-bitpie',
	'@solana/wallet-adapter-blocto',
	'@solana/wallet-adapter-clover',
	'@solana/wallet-adapter-coin98',
	'@solana/wallet-adapter-coinhub',
	'@solana/wallet-adapter-ledger',
	'@solana/wallet-adapter-mathwallet',
	'@solana/wallet-adapter-phantom',
	'@solana/wallet-adapter-safepal',
	'@solana/wallet-adapter-slope',
	'@solana/wallet-adapter-solflare',
	'@solana/wallet-adapter-sollet',
	'@solana/wallet-adapter-solong',
	'@solana/wallet-adapter-tokenpocket',
	'@solana/wallet-adapter-torus',
	'@solana/wallet-adapter-wallets',
])

/** @type {import('next').NextConfig} */
module.exports = withTM({
	reactStrictMode: true,
	webpack5: true,
})

module.exports = nextConfig
