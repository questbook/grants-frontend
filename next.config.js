/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs')
const withYaml = require('next-plugin-yaml')

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
		UD_KEY: process.env.UD_KEY,
		API_ENDPOINT: process.env.API_ENDPOINT
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

module.exports = process.env.NODE_ENV === 'production' ? withSentryConfig(withYaml(nextConfig)) : withYaml(nextConfig)
