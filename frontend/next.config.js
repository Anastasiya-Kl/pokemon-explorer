import "./src/env.js";

/** @type {import("next").NextConfig} */

const config = {
	output: "standalone",
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "raw.githubusercontent.com",
			},
		],
	},
};

export default config;
