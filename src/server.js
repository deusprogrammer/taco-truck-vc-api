import WebSocket from 'ws';

const wss = new WebSocket.Server({ port: 3001 });

wss.on('connection', async (ws) => {
    ws.on('close', async () => {
        // TODO Clean up users and dungeons when they disconnect
        console.log('Websocket closed, cleaning up.');
    });

    ws.on('message', async (message) => {
        const { buttons, controllerId } = JSON.parse(message);

        console.log("CONTROLLER: " + controllerId);
        console.log("BUTTONS:    " + JSON.stringify(buttons, null, 5));
    });
});