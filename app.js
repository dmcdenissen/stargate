const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const apicache = require('apicache');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');
const http = require('http');
const https = require('https');
const fs = require('fs');

require("dotenv").config();

const app = express();
app.set('x-powered-by', false)

const PORT = process.env.PORT || 8888;
const SSL_KEY_PATH = process.env.SSL_KEY_PATH || '';
const SSL_CERT_PATH = process.env.SSL_CERT_PATH || '';

// Enable CORS for all routes
app.use(cors());

// Enable CORS for all routes
app.use(helmet());

// Set up rate limiter middleware
const limiter = rateLimit({
    windowMs: process.env.RATELIMIT_TIME || 60 * 1000, 
    max: process.env.RATELIMIT_REQ || 100, 
});

// Use the rate limiter middleware
app.use(limiter);

// Enable caching for all rou   tes
const cache = apicache.middleware;

// Use morgan for log usage
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms - ":user-agent"'));

// setup proxys from routes
const routes = require('./routes');
for (const [path, route] of Object.entries(routes)) {
    app.use(path, cache(route.cache), createProxyMiddleware(route.options));
}

// Start HTTP OR HTTPS server 
if (SSL_KEY_PATH && SSL_CERT_PATH) {
    const server = https.createServer({
        key: fs.readFileSync(SSL_KEY_PATH),
        cert: fs.readFileSync(SSL_CERT_PATH),
    }, app);
  
     server.listen(PORT, () => {
         console.log(`Stargate Api gateway is running on port ${PORT} (HTTPS)`);
     });
} else {
    const server = http.createServer(app);
  
    server.listen(PORT, () => {
      console.log(`Stargate Api gateway is running on port ${PORT} (HTTP)`);
    });
}
