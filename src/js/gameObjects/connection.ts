import { OtherPlayer } from './otherPlayer';
import { Player } from './player';
import { CreateOtherPlayer, ServerMessage, ClientMessage, UpdateOtherPlayer, UserDisconnected } from '../helpers/types';

export interface GamePlayerData {
    id: string;
    coordinates: { x: number; y: number };
    health: number;
    directionX: -1 | 1;
}

export const uid = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export class Connection {
    socket: WebSocket;
    syncObjects: Map<string, any> = new Map();
    gamePlayerData: GamePlayerData;
    scene: Phaser.Scene;
    localStorage = window.sessionStorage;

    constructor() {
        this.initLocalData();

        setTimeout(() => {
            this.initConnection();
            this.initCallbacks();
        }, 500);
    }

    public send(message: ClientMessage): void {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        }
    }

    public close(): void {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.close();
        }
    }

    public initScene(scene: Phaser.Scene): Player {
        this.scene = scene;
        return new Player(
            scene,
            this.gamePlayerData.coordinates.x,
            this.gamePlayerData.coordinates.y,
            this.gamePlayerData.id
        );
    }

    private initLocalData(): void {
        const data = this.localStorage.getItem('game_player_data');

        if (data) {
            this.gamePlayerData = JSON.parse(data);
        } else {
            this.gamePlayerData = {
                id: uid(),
                coordinates: { x: 200, y: 600 },
                health: 100,
                directionX: 1,
            };
            this.localStorage.setItem('game_player_data', JSON.stringify(this.gamePlayerData));
        }
    }

    private initConnection(): void {
        let hostname = window.location.hostname;
        let port = '';
        let protocol = 'wss';

        if (hostname === 'localhost') {
            port = ':8080';
            protocol = 'ws';
        } else if (window.location.hostname.includes('github.io')) {
            hostname = 'tanks-maciejdominiak.b4a.run';
        }

        const url = `${protocol}://${hostname}${port}/tanks/objects:exchange`;
        this.socket = new WebSocket(url);
    }

    private initCallbacks(): void {
        this.socket.onopen = (ev: Event) => {
            this.send({ ...this.gamePlayerData, messageType: 'create_player' });
            console.log('connected');
        };

        this.socket.onmessage = (event) => {
            try {
                const data: ServerMessage = JSON.parse(event.data);
                console.log(data);

                switch (data.messageType) {
                    case 'create_player':
                        this.syncObjects.set(
                            data.id,
                            new OtherPlayer(this.scene, data.coordinates.x, data.coordinates.y, data.id)
                        );
                        break;
                    case 'user_disconnected':
                        if (this.syncObjects.has(data.id)) {
                            this.syncObjects.get(data.id).deletePlayer();
                            this.syncObjects.delete(data.id);
                        }
                        break;
                    case 'update':
                        if (!this.syncObjects.has(data.id)) {
                            this.syncObjects.set(
                                data.id,
                                new OtherPlayer(this.scene, data.coordinates.x, data.coordinates.y, data.id)
                            );
                        } else {
                            if (this.syncObjects.get(data.id) instanceof OtherPlayer) {
                                this.syncObjects
                                    .get(data.id)
                                    .updatePlayer(data.coordinates.x, data.coordinates.y, data.health);
                            }
                        }

                        break;
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
}
