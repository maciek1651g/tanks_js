import { OtherPlayer } from './otherPlayer';

export interface TransferData {
    id: string;
    messageType: 'player';
    coordinates: { x: number; y: number };
    hp: number;
}

export class Connection {
    socket: WebSocket;
    syncObjects: { [key: string]: any } = {};

    constructor() {
        const hostname = window.location.hostname;
        let port = '';
        let protocol = 'wss';

        if (hostname === 'localhost') {
            port = ':8080';
            protocol = 'ws';
        }

        const url = `${protocol}://${hostname}${port}/tanks/objects:exchange`;
        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
            console.log('connected');
        };

        this.socket.onmessage = (event) => {
            try {
                const data: TransferData = JSON.parse(event.data);
                if (!this.syncObjects[data.id]) {
                    this.syncObjects[data.id] = new OtherPlayer(
                        window.currentScene,
                        data.coordinates.x,
                        data.coordinates.y,
                        data.id
                    );
                } else {
                    this.syncObjects[data.id].setPosition(data.coordinates.x, data.coordinates.y);
                }
            } catch (e) {
                console.log(e);
            }
        };

        this.socket.onerror = (error) => {
            console.log(error);
        };

        this.socket.onclose = (close) => {
            console.log('closed');
        };
    }

    public send(message: TransferData): void {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        }
    }
}
