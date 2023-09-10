const http = require('http');
const socket = require('./socket');
const app = require('./app');


const server = http.createServer(app);


const  chatNamespace  = socket(server);

app.set('chatNamespace', chatNamespace);



server.listen(3003, () => {
    console.log('Il server è in esecuzione sulla porta 3003');
    }
);