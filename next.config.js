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
		CLIENT_ID: "33757236b2fdb527f204"
		// CLIENT_SECRET: process.env.CLIENT_SECRET,
		// BICO_AUTH_TOKEN: process.env.BICO_AUTH_TOKEN
	},
	async rewrites() {
        return [
          {
            source: '/nothing/:path*',
            destination: 'https://2j6v8c5ee6.execute-api.ap-south-1.amazonaws.com/:path*',
          },
        ]
      },
}

module.exports = nextConfig
