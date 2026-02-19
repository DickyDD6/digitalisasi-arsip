/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ["@repo/ui"],
	reactStrictMode: process.env.NODE_ENV !== "production",
};

export default nextConfig;
