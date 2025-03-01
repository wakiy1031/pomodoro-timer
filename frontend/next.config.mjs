/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 静的エクスポートを使用
  output: "export",
  // 画像の最適化を無効化（静的エクスポート時に必要）
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
