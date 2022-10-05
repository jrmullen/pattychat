import { RawData, WebSocket } from 'ws';

const webSocket = new WebSocket('ws://localhost:8080')

webSocket.on('open', () => {
    webSocket.send('Message From Client');
});

webSocket.on('close', () => {
    console.log('Disconnected');
});

webSocket.on('error', (error: Error) => {
    console.log(`WebSocket error: ${error.message}`);
});

webSocket.on('message', (messageData: RawData, isBinary: Boolean) => {
    console.log(`Client received message: ${messageData}`);
});
