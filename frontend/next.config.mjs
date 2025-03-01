/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // サーバーサイドレンダリングのみを使用する
  output: "export",
  // 静的生成時にwindowオブジェクトを使用するコンポーネントをスキップする
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
