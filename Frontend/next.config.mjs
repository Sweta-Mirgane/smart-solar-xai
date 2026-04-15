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
              connect-src 'self' ws://localhost:8000 ws://127.0.0.1:8000 http://localhost:8000 http://127.0.0.1:8000;
              img-src 'self' data: blob:;
            `.replace(/\n/g, ""),
          },
        ],
      },
    ]
  },
}

export default nextConfig
