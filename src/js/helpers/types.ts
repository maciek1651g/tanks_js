export type ClientMessage = UpdateMyPlayer | CreateMyPlayer;

export interface ClientMessageBase {
    id: string;
    messageType: 'status' | 'create_player' | 'grab_chest' | 'hit_enemy';
}

export interface UpdateMyPlayer extends ClientMessageBase {
    messageType: 'status';
    coordinates: { x: number; y: number; directionX: -1 | 1 };
    health: number;
    playAttack: boolean; // TODO: add playAttack
}

export interface CreateMyPlayer extends ClientMessageBase {
    messageType: 'create_player';
    coordinates: { x: number; y: number; directionX: -1 | 1 };
    health: number;
}

// TODO
// export interface GrabChest extends ClientMessageBase {
//     messageType: 'grab_chest';
//     playerId: string;
// }
//
// export interface HitEnemy extends ClientMessageBase {
//     messageType: 'hit_enemy';
// }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
export type ServerMessage = UpdateOtherPlayer | CreateOtherPlayer | UserDisconnected;

export interface ServerMessageBase {
    id: string;
    messageType:
        | 'status'
        | 'create_player'
        | 'user_disconnected'
        | 'create_chest'
        | 'create_enemy'
        | 'delete_enemy'
        | 'delete_chest';
}

export interface UpdateOtherPlayer extends ServerMessageBase {
    messageType: 'status';
    coordinates: { x: number; y: number; directionX: -1 | 1 };
    health: number;
    playAttack: boolean; // TODO: add playAttack
}

export interface CreateOtherPlayer extends ServerMessageBase {
    messageType: 'create_player';
    coordinates: { x: number; y: number; directionX: -1 | 1 };
    health: number;
}

export interface UserDisconnected extends ServerMessageBase {
    messageType: 'user_disconnected';
}

// TODO

// export interface CreateChest extends ServerMessageBase {
//     messageType: 'create_chest';
//     spawnPoint: number; //from 1 to 5
// }
//
// export interface DeleteChest extends ServerMessageBase {
//     messageType: 'delete_chest';
// }
//
// export interface CreateEnemy extends ServerMessageBase {
//     messageType: 'create_enemy';
//     enemyType: 'zombie';
//     spawnPoint: number; //from 1 to 5
// }
//
// export interface DeleteEnemy extends ServerMessageBase {
//     messageType: 'delete_enemy';
// }
