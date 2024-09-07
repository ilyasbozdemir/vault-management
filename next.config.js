// next.config.js
module.exports = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  publicRuntimeConfig: {
    NODE_ENV: process.env.NODE_ENV
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-Requested-With, Content-Type' },
        ],
      },
    ];
  },
};
