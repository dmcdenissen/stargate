module.exports = {
    '/api1': { cache: '1 minute', options: { target: 'https://api.coindesk.com/v1/bpi/currentprice.json', changeOrigin: true, pathRewrite: {'^/api1': ''}, logLevel: 'silent' } },
    '/api2': { cache: '10 minutes', options: { target: 'https://api.publicapis.org/entries', changeOrigin: true, pathRewrite: {'^/api2': ''}, logLevel: 'silent' } },
    '/api3': { cache: '1 second', options: { target: 'https://randomuser.me/api/', changeOrigin: true, pathRewrite: {'^/api3': ''}, logLevel: 'silent' } },
};
