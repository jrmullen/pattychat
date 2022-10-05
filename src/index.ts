import { createServer, IncomingMessage, ServerResponse } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { Duplex } from 'stream';
import { v4 as uuidv4 } from 'uuid';

interface ClientMetadata {
    id: string;
    connectedAt: number;
}

const PORT = 8080;
const clients = new Map<WebSocket, ClientMetadata>();

const httpServer = createServer((req: IncomingMessage, res: ServerResponse) => {
    console.log('HTTP server has received a request');
})

httpServer.on('upgrade', (req: IncomingMessage, socket: Duplex, head: Buffer) => {
    console.log('HTTP server is upgrading the request from HTTP to WebSocket');
});

const webSocketServer = new WebSocketServer({ server: httpServer});

webSocketServer.on('connection', (webSocket: WebSocket, req: IncomingMessage) => {
    // Capture some metadata about our connection and then add it to the map of clients
    const clientMetadata = { id: uuidv4(), connectedAt: Date.now()  };
    clients.set(webSocket, clientMetadata);
    console.log(`Client ${clientMetadata.id} has connected`);

    webSocket.on('message', (messageData: Buffer) => {
        console.log(`Received message data: ${messageData}`);
        const message: Record<string, unknown> = { body: messageData.toString() };
        const metadata = clients.get(webSocket);

        // Add properties to the received message
        message.sender = metadata.id;
        message.timestamp = Date.now();

        console.log(`Full message object: ${JSON.stringify(message)}`);
        webSocket.send(`Server response!`);

        // Send our message to every connected client
        webSocketServer.clients.forEach((client) => {
            client.send(JSON.stringify(message));
        });
    });

    webSocket.on('close', (code: number, reason: Buffer) => {
        const clientMetaData = clients.get(webSocket);
        console.log(`Client ${clientMetaData.id} has disconnected`);

        // Remove the client from the map
        console.log(`Removing client ${clientMetaData.id} from our set`);
        clients.delete(webSocket);
    });
});

httpServer.listen(PORT, () => {
    console.log(`The HTTP server is listening on port ${PORT} and ready to rock!`);
});
