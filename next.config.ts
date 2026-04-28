import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 外部画像ドメインの許可（将来的なCDN移行対応）
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // 環境変数の公開（サイトURL等）
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scone-media.netlify.app',
  },
};

export default nextConfig;
