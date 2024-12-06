const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());

const proxyOptions = {
    target: 'http://45.13.225.83:5000',
    changeOrigin: true,
    secure: false,
    ws: true,
    timeout: 30000,
    proxyTimeout: 31000,
    followRedirects: true,
    onError: (err, req, res) => {
        console.error('Proxy Error:', err);
        res.writeHead(502, {
            'Content-Type': 'text/plain'
        });
        res.end('Proxy error: ' + err.message);
    },
    onProxyRes: function(proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
    },
    onProxyReq: (proxyReq, req, res) => {
        // Modify request headers here if needed
        proxyReq.setHeader('User-Agent', 'Mozilla/5.0');
        proxyReq.setHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8');
    }
};

// Add health check endpoint
app.get('/health', (req, res) => {
    res.send('OK');
});

// Create proxy middleware
const proxy = createProxyMiddleware(proxyOptions);

// Use proxy for all routes except health check
app.use((req, res, next) => {
    if (req.path === '/health') return next();
    return proxy(req, res, next);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});

// Error handling
process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
});

process.on('unhandledRejection', function(reason, p) {
    console.log('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});