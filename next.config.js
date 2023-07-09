/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs')
const withYaml = require('next-plugin-yaml')

const nextConfig = {
	reactStrictMode: true,
	// eslint: {
	// 	ignoreDuringBuilds: true,
	//   },
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
		BICO_AUTH_TOKEN: process.env.BICO_AUTH_TOKEN,
		SOLANA_RPC: process.env.SOLANA_RPC,
		UD_KEY: process.env.UD_KEY,
		API_ENDPOINT: process.env.API_ENDPOINT,
		NOTIF_BOT_USERNAME: process.env.NOTIF_BOT_USERNAME,
		INFURA_IPFS_PROJECT_ID: process.env.INFURA_IPFS_PROJECT_ID,
		INFURA_IPFS_API_KEY: process.env.INFURA_IPFS_API_KEY
	},
	sentry: {
		disableServerWebpackPlugin: true,
		disableClientWebpackPlugin: true,
		// Use `hidden-source-map` rather than `source-map` as the Webpack `devtool`
		// for client-side builds. (This will be the default starting in
		// `@sentry/nextjs` version 8.0.0.) See
		// https://webpack.js.org/configuration/devtool/ and
		// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
		// for more information.
		// hideSourceMaps: true,
		org: 'questbook'
	},
}
const withPWA = require('next-pwa')({
	dest: 'public',
	disable: process.env.NODE_ENV === 'development',
	register: true,
})
module.exports = withSentryConfig(withYaml(withPWA(nextConfig)))
