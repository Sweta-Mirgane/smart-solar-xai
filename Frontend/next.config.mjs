/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:;
              connect-src 'self' https://smart-solar-backend.onrender.com wss://smart-solar-backend.onrender.com;
              img-src 'self' data: blob:;
            `.replace(/\n/g, ""),
          },
        ],
      },
    ]
  },
}

export default nextConfig
