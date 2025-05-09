/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	experimental: {
		// Optimization settings
		optimizeCss: true,
		optimizePackageImports: ['lucide-react', '@radix-ui', 'react-icons'],
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
		],
		domains: ['res.cloudinary.com', 'avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
	},
	distDir: "dist",
	webpack: (config) => {
		// Improve chunk size and loading
		config.optimization.splitChunks = {
			chunks: 'all',
			maxInitialRequests: 25,
			minSize: 20000,
			cacheGroups: {
				default: false,
				vendors: false,
				framework: {
					chunks: 'all',
					name: 'framework',
					test: /[\\/]node_modules[\\/](@next|next|react|react-dom)[\\/]/,
					priority: 40,
					enforce: true,
				},
				lib: {
					test: /[\\/]node_modules[\\/]/,
					name(module) {
						const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
						return `npm.${packageName.replace('@', '')}`;
					},
					priority: 30,
					minChunks: 1,
					reuseExistingChunk: true,
				},
			},
		};
		return config;
	},
};

module.exports = nextConfig;
