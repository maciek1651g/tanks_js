import { OtherPlayer } from './otherPlayer';
import { Player } from './player';
import { ServerMessage, ClientMessage, DTO } from '../helpers/types';
import { BaseScene } from '../scenes/level1/level1';
import { Enemy } from './enemy';

export interface GamePlayerData {
    id: string;
    coordinates: { x: number; y: number; directionX: -1 | 1 };
    health: number;
    directionX: -1 | 1;
}

export const uid = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export class Connection {
    socket: WebSocket;
    gamePlayerData: GamePlayerData;
    scene: BaseScene;
    localStorage = window.sessionStorage;
    currentServerUrl = '';
    currentWebSocketProtocol = '';
    servers: string[] = [];

    constructor() {
        this.initLocalData();
        this.initServers();
    }

    public send(message: ClientMessage): void {
        if (this.socket?.readyState === WebSocket.OPEN) {
            const messageDTO: DTO = {
                messageType: message.messageType,
                data: JSON.stringify(message),
            };
            try {
                this.socket.send(JSON.stringify(messageDTO));
            } catch (error) {
                console.log(error);
            }
        }
    }

    public updateHealth(health: number): void {
        this.gamePlayerData.health = health;
        this.localStorage.setItem('game_player_data', JSON.stringify(this.gamePlayerData));
    }

    public close(): void {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.close();
        }
    }

    public initScene(scene: BaseScene): void {
        this.scene = scene;
        this.startConnection();
    }

    public changeServer(): void {
        const playerId = this.gamePlayerData.id;
        const serverUrl = this.servers.find((url) => url !== this.currentServerUrl);
        const encodedParam1 = encodeURIComponent(playerId);
        const encodedParam2 = encodeURIComponent(window.location.protocol + '//' + serverUrl);

        fetch(
            `${window.location.protocol}//${this.currentServerUrl}/api/users:migrate?id=${encodedParam1}&url=${encodedParam2}`,
            {
                method: 'GET',
            }
        )
            .then((response) => {
                if (response.status === 200) {
                    this.close();
                    this.currentServerUrl = serverUrl;
                    this.reset(true);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    private startConnection(): void {
        this.initConnection();
        this.initCallbacks();
    }

    private initLocalData(): void {
        const data = this.localStorage.getItem('game_player_data');

        if (data) {
            this.gamePlayerData = JSON.parse(data);
        } else {
            this.gamePlayerData = {
                id: uid(),
                coordinates: { x: 200, y: 600, directionX: 1 },
                health: 100,
                directionX: 1,
            };
            this.localStorage.setItem('game_player_data', JSON.stringify(this.gamePlayerData));
        }
    }

    private initServers(): void {
        let hostname = window.location.hostname;
        let port = window.location.port;
        this.currentWebSocketProtocol = 'wss';

        if (hostname === 'localhost') {
            port = '8080';
            this.currentWebSocketProtocol = 'ws';
            this.servers = [`${hostname}:8080`, `${hostname}:8081`];
        } else {
            this.servers = [`tanksgo-production.up.railway.app:${port}`, `tanks-maciejdominiak.b4a.run:${port}`];
        }

        this.currentServerUrl = this.servers[0];
    }

    private initConnection(): void {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            const url = `${this.currentWebSocketProtocol}://${this.currentServerUrl}/tanks/objects:exchange`;
            this.socket = new WebSocket(url);
        }
    }

    private initCallbacks(): void {
        this.socket.onopen = (ev: Event) => {
            this.socket.send(JSON.stringify({ ...this.gamePlayerData, messageType: 'create_player' }));
            this.scene.initPlayer(
                new Player(
                    this.scene,
                    this.gamePlayerData.coordinates.x,
                    this.gamePlayerData.coordinates.y,
                    this.gamePlayerData.id,
                    this.gamePlayerData.health
                )
            );
            console.log('connected');
        };

        this.socket.onmessage = async (event) => {
            try {
                const data: ServerMessage = JSON.parse(event.data);
                console.log(data.messageType);

                switch (data.messageType) {
                    case 'create_player':
                        this.scene.spawnOtherPlayer(data.id, data.coordinates.x, data.coordinates.y, data.health);
                        break;
                    case 'user_disconnected':
                        this.scene.deleteOtherPlayer(data.id);
                        break;
                    case 'status':
                        (this.scene.children.getByName(data.id) as OtherPlayer)?.updatePlayer(
                            data.coordinates.x,
                            data.coordinates.y,
                            data.coordinates.directionX
                        );
                        break;
                    case 'user_attack':
                        (this.scene.children.getByName(data.id) as OtherPlayer).attack();
                        break;
                    case 'create_chest':
                        this.scene.spawnChest(data.id, data.coordinates.x, data.coordinates.y);
                        break;
                    case 'chest_destroy':
                        this.scene.deleteChest(data.id);
                        break;
                    case 'mob_create':
                        this.scene.spawnEnemy(data.id, data.coordinates.x, data.coordinates.y, data.health);
                        break;
                    case 'mob_destroy':
                        this.scene.deleteEnemy(data.id);
                        break;
                    case 'mob_status':
                        (this.scene.children.getByName(data.id) as Enemy).updateEnemy(
                            data.coordinates.x,
                            data.coordinates.y,
                            data.coordinates.directionX
                        );
                        break;
                    case 'game_master':
                        this.scene.setGameMaster(true);
                        break;
                    case 'user_health':
                        if (data.id === this.gamePlayerData.id) {
                            (this.scene.children.getByName(data.id) as Player).updateHealth(data.health);
                        } else {
                            (this.scene.children.getByName(data.id) as OtherPlayer).updateHealth(data.health);
                        }

                        break;
                    case 'user_destroy':
                        if (data.id === this.gamePlayerData.id) {
                            // Player
                            window.game.pause();
                            this.socket.close();
                            const restart = confirm('You died. Restart?');
                            if (restart) {
                                window.game.resume();
                                this.reset();
                            } else {
                                window.location.href = 'about:blank';
                            }
                        } else {
                            // Other player
                            this.scene.deleteOtherPlayer(data.id);
                        }
                        break;
                    case 'user_score':
                        this.scene.updateScore(data.score);
                        break;
                    default:
                        // @ts-ignore
                        console.log(data.messageType, 'not implemented');
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
            this.scene.updateScore(0);
            this.reset();
        };
    }

    reset(keepHealth = false): void {
        if (!keepHealth) {
            this.updateHealth(100);
        }
        this.close();
        this.scene.player = undefined;
        this.scene.setGameMaster(false);
        this.scene.scene.restart();
    }
}
