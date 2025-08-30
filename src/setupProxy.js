// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api/stormglass',
    createProxyMiddleware({
      target: 'https://api.stormglass.io',
      changeOrigin: true,
      pathRewrite: { '^/api/stormglass': '/v2/weather/point' },
      logLevel: 'debug', // 문제시 터미널에 상세 로그 출력
      onProxyReq(proxyReq) {
        proxyReq.setHeader(
          'Authorization',
          '37a046bc-83fa-11f0-b07a-0242ac130006-37a0477a-83fa-11f0-b07a-0242ac130006'
        );
      },
      onError(err, req, res) {
        console.error('Proxy error:', err?.message);
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ proxyError: err?.message }));
      },
    })
  );
};
