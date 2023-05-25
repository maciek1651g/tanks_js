export type ClientMessage = UpdateMyPlayer | CreateMyPlayer | UserAttack | GrabChest | UserDamage;

export type ClientMessageTypes = 'status' | 'create_player' | 'user_attack' | 'chest_grab' | 'user_damage';

export interface ClientMessageBase {
    id: string;
    messageType: ClientMessageTypes;
}

export interface UpdateMyPlayer extends ClientMessageBase {
    messageType: 'status';
    coordinates: { x: number; y: number; directionX: -1 | 1 };
    health: number;
}

export interface UserAttack extends ClientMessageBase {
    messageType: 'user_attack';
}

export interface UserDamage extends ClientMessageBase {
    messageType: 'user_damage';
    damage: number;
    targetId: string;
}

export interface CreateMyPlayer extends ClientMessageBase {
    messageType: 'create_player';
    coordinates: { x: number; y: number; directionX: -1 | 1 };
    health: number;
}

export interface GrabChest extends ClientMessageBase {
    messageType: 'chest_grab';
}

// TODO

//
// export interface HitEnemy extends ClientMessageBase {
//     messageType: 'hit_enemy';
// }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
export type ServerMessage =
    | UpdateOtherPlayer
    | CreateOtherPlayer
    | UserDisconnected
    | UserAttackServer
    | CreateChest
    | DeleteChest
    | CreateEnemy
    | DeleteEnemy
    | GameMaster;

export interface ServerMessageBase {
    id: string;
    messageType:
        | 'status'
        | 'create_player'
        | 'user_disconnected'
        | 'user_attack'
        | 'create_chest'
        | 'chest_destroy'
        | 'mob_create'
        | 'mob_destroy'
        | 'game_master';
}

export interface UpdateOtherPlayer extends ServerMessageBase {
    messageType: 'status';
    coordinates: { x: number; y: number; directionX: -1 | 1 };
    health: number;
}

export interface CreateOtherPlayer extends ServerMessageBase {
    messageType: 'create_player';
    coordinates: { x: number; y: number; directionX: -1 | 1 };
    health: number;
}

export interface UserDisconnected extends ServerMessageBase {
    messageType: 'user_disconnected';
}

export interface UserAttackServer extends ServerMessageBase {
    messageType: 'user_attack';
}

export interface CreateChest extends ServerMessageBase {
    messageType: 'create_chest';
    coordinates: { x: number; y: number };
}

export interface DeleteChest extends ServerMessageBase {
    messageType: 'chest_destroy';
}

export interface CreateEnemy extends ServerMessageBase {
    messageType: 'mob_create';
    coordinates: { x: number; y: number };
    health: number;
}

export interface DeleteEnemy extends ServerMessageBase {
    messageType: 'mob_destroy';
}

export interface GameMaster extends ServerMessageBase {
    messageType: 'game_master';
}

// TODO

//

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

export interface DTO {
    messageType: ClientMessageTypes;
    data: string; // JSON
}
