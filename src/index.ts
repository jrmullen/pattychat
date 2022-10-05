import { createServer, IncomingMessage, ServerResponse } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { Duplex } from 'stream';

const PORT = 8080;

const httpServer = createServer((req: IncomingMessage, res: ServerResponse) => {
    console.log('HTTP server has received a request');
})

httpServer.on('upgrade', (req: IncomingMessage, socket: Duplex, head: Buffer) => {
    console.log('HTTP server is upgrading the request from HTTP to WebSocket');
});

const webSocketServer = new WebSocketServer({ server: httpServer});

webSocketServer.on('connection', (webSocket: WebSocket, req: IncomingMessage) => {
    console.log('A client has connected');

    webSocket.on('message', (messageData: Buffer) => {
        console.log(`Received message data: ${messageData}`);
        webSocket.send(`Server response!`);
    });

    webSocket.on('close', (code: number, reason: Buffer) => {
        console.log(`A client has disconnected`);
    });
});

httpServer.listen(PORT, () => {
    console.log(`The HTTP server is listening on port ${PORT} and ready to rock!`);
});
