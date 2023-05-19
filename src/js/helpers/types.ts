export type ClientMessage = UpdateMyPlayer | CreateMyPlayer;

export interface ClientMessageBase {
    id: string;
    messageType: 'update' | 'create_player';
}

export interface UpdateMyPlayer extends ClientMessageBase {
    messageType: 'update';
    coordinates: { x: number; y: number };
    health: number;
    directionX: -1 | 1; // TODO: add directionX
    playAttack: boolean; // TODO: add playAttack
}

export interface CreateMyPlayer extends ClientMessageBase {
    messageType: 'create_player';
    coordinates: { x: number; y: number };
    health: number;
    directionX: -1 | 1;
}

export type ServerMessage = UpdateOtherPlayer | CreateOtherPlayer | UserDisconnected;

export interface ServerMessageBase {
    id: string;
    messageType: 'update' | 'create_player' | 'user_disconnected';
}

export interface UpdateOtherPlayer extends ServerMessageBase {
    messageType: 'update';
    coordinates: { x: number; y: number };
    health: number; // TODO: add health
    directionX: -1 | 1; // TODO: add directionX
    playAttack: boolean; // TODO: add playAttack
}

export interface CreateOtherPlayer extends ServerMessageBase {
    messageType: 'create_player';
    coordinates: { x: number; y: number };
    health: number; // TODO: add health
    directionX: -1 | 1; // TODO: add directionX
}

export interface UserDisconnected extends ServerMessageBase {
    messageType: 'user_disconnected';
}
