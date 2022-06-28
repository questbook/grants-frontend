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
		CLIENT_ID: process.env.CLIENT_ID,
		CLIENT_SECRET: process.env.CLIENT_SECRET
	}
}

module.exports = nextConfig
