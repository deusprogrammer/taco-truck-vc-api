import WebSocket from 'ws';
import vjoy from 'vjoy';

const { vJoy, vJoyDevice } = vjoy;

if (!vJoy.isEnabled()) {
	console.log("vJoy is not enabled.");
	process.exit();
}

let device = vJoyDevice.create(1);

const wss = new WebSocket.Server({ port: 3001 });

const idMap = {
    "138eb38b-3c33-4eb9-aeda-92acc51c00c9": 3,      //X
    "071027a6-3163-4831-ae14-0ce4f6e9165a": 4,      //Y
    "5d79dab9-2870-44bb-9869-eeeb5645693b": 1,      //A
    "1a895c5b-12ca-4127-9e10-7dfe694fc8ad": 2,      //B
    "d4633842-7542-44fc-aadd-dfbf1dd70637": 6,      //RB
    "73df552b-f240-4b43-b6d0-4796c41efc0c": 5,      //LB
    "ac5b12c5-1658-4ce5-a18c-37cc167ccf01": 8,      //RT
    "4c505564-795d-4ef4-95c2-118580382e49": 7,      //LT
    "cb359ede-9861-4b87-8360-2bf2d5a98e9b": 15,      //LEFT
    "80c93995-2450-40a8-bbe1-079a6a37f1a8": 14,     //DOWN
    "0e13c9df-f4b9-478a-90f0-28a839636cb0": 16,     //RIGHT
    "91399ced-018a-4e50-96e1-1546bbe3783b": 13      //UP
}

wss.on('connection', async (ws) => {
    ws.on('close', async () => {
        // TODO Clean up users and dungeons when they disconnect
        console.log('Websocket closed, cleaning up.');
    });

    ws.on('message', async (message) => {
        const { buttons, controllerId } = JSON.parse(message);

        console.log("CONTROLLER: " + controllerId);
        console.log("BUTTONS:    " + JSON.stringify(buttons, null, 5));

        device.resetButtons();
        device.axes.X.set(1);
        device.axes.Y.set(1);

        buttons.forEach((button) => {
            const mapping = idMap[button.id];
            console.log("MAPPING [" + button.id + "]: "  + mapping);

            if (!mapping) {
                return;
            }

            device.buttons[mapping].set(true);

        })

        // device.buttons[1].set(true); // press the first button
    });
});