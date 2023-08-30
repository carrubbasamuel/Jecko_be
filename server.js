const http = require('http');
const app = require('./app');

const server = http.createServer(app);

server.listen(3003, () => {
    console.log('Il server è in esecuzione sulla porta 3003');
    }
);