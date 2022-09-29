/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs')

const nextConfig = {
	reactStrictMode: true,
	trailingSlash: true,
	// temporarily disable ESLint checks during builds
	// so we can transition to the new lint rules without breaking
	eslint: { ignoreDuringBuilds: true },
	webpack: function(config, options) {
		if(!options.isServer) {
			config.resolve.fallback.fs = false
		}

		config.experiments = { asyncWebAssembly: true }
		return config
	},
	env: {
		NEXT_PUBLIC_IS_TEST: process.env.NEXT_PUBLIC_IS_TEST,
		BICO_AUTH_TOKEN: process.env.BICO_AUTH_TOKEN,
		SOLANA_RPC: process.env.SOLANA_RPC,
		NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN
	},
	sentry: {
		// Use `hidden-source-map` rather than `source-map` as the Webpack `devtool`
		// for client-side builds. (This will be the default starting in
		// `@sentry/nextjs` version 8.0.0.) See
		// https://webpack.js.org/configuration/devtool/ and
		// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
		// for more information.
		hideSourceMaps: true,
	},
}

const sentryWebpackPluginOptions = {
	// Additional config options for the Sentry Webpack plugin. Keep in mind that
	// the following options are set automatically, and overriding them is not
	// recommended:
	//   release, url, org, project, authToken, configFile, stripPrefix,
	//   urlPrefix, include, ignore

	silent: true, // Suppresses all logs
	// For all available options, see:
	// https://github.com/getsentry/sentry-webpack-plugin#options.
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

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions)
