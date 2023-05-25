import { Scene, Tilemaps } from 'phaser';
import { Player } from '../../gameObjects/player';
import { EVENTS_NAME } from '../../../consts';
import { Enemy } from '../../gameObjects/enemy';
import { Chest } from '../../gameObjects/chest';
import { OtherPlayer } from '../../gameObjects/otherPlayer';

export interface BaseScene extends Scene {
    otherPlayers: Map<string, OtherPlayer>;
    chests: Map<string, Chest>;
    enemies: Map<string, Enemy>;
    spawnChest: (chestId: string, x: number, y: number) => void;
    spawnOtherPlayer: (otherPlayerId: string, x: number, y: number) => void;
    spawnEnemy: (enemyId: string, x: number, y: number, health: number) => void;
    deleteOtherPlayer: (otherPlayerId: string) => void;
    deleteChest: (chestId: string) => void;
    deleteEnemy: (enemyId: string) => void;
    gameMaster: boolean;
}

export class Level1 extends Scene implements BaseScene {
    private player!: Player;

    private map!: Tilemaps.Tilemap;
    private tileset!: Tilemaps.Tileset;
    private wallsLayer!: Tilemaps.TilemapLayer;
    private groundLayer!: Tilemaps.TilemapLayer;

    public otherPlayers: Map<string, OtherPlayer> = new Map();
    public chests: Map<string, Chest> = new Map();
    public enemies: Map<string, Enemy> = new Map();

    public gameMaster = false;

    constructor() {
        super('level1-scene');
    }

    create(): void {
        this.initMap();
        this.player = window.connection.initScene(this);
        this.physics.add.collider(this.player, this.wallsLayer);
        // this.initChests();
        // this.initEnemies();
        this.initCamera();
    }

    update(): void {
        this.player.update();
    }

    private initMap(): void {
        this.map = this.make.tilemap({
            key: 'dungeon',
            tileWidth: 16,
            tileHeight: 16,
        });
        this.tileset = this.map.addTilesetImage('dungeon', 'tiles');
        this.groundLayer = this.map.createLayer('Ground', this.tileset, 0, 0);
        this.wallsLayer = this.map.createLayer('Walls', this.tileset, 0, 0);
        this.wallsLayer.setCollisionByProperty({ collides: true });
        this.physics.world.setBounds(0, 0, this.wallsLayer.width, this.wallsLayer.height);

        // this.showDebugWalls();
    }

    private showDebugWalls(): void {
        const debugGraphics = this.add.graphics().setAlpha(0.7);
        this.wallsLayer.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
        });
    }

    // private initChests(): void {
    //     const chestPoints = gameObjectsToObjectPoints(
    //         this.map.filterObjects('Chests', (obj) => obj.name === 'ChestPoint')
    //     );
    //     this.chests = chestPoints.map((chestPoint) =>
    //         this.physics.add.sprite(chestPoint.x, chestPoint.y, 'tiles_spr', 595).setScale(1.5)
    //     );
    //     this.chests.forEach((chest) => {
    //         this.physics.add.overlap(this.player, chest, (obj1, obj2) => {
    //             this.game.events.emit(EVENTS_NAME.chestLoot);
    //             obj2.destroy();
    //             this.cameras.main.flash();
    //         });
    //     });
    // }

    private initCamera(): void {
        this.cameras.main.setSize(this.game.scale.width, this.game.scale.height);
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
        this.cameras.main.setZoom(1);
    }

    // private initEnemies(): void {
    //     const enemiesPoints = gameObjectsToObjectPoints(
    //         this.map.filterObjects('Enemies', (obj) => obj.name === 'EnemyPoint')
    //     );
    //     this.enemies = enemiesPoints.map((enemyPoint) =>
    //         new Enemy(this, enemyPoint.x, enemyPoint.y, '', 10, 'tiles_spr', this.player, 503)
    //             .setName(enemyPoint.id.toString())
    //             .setScale(1.5)
    //     );
    //     this.physics.add.collider(this.enemies, this.wallsLayer);
    //     this.physics.add.collider(this.enemies, this.enemies);
    //     this.physics.add.collider(this.player, this.enemies, (obj1, obj2) => {
    //         (obj1 as Player).getDamage(1);
    //     });
    // }

    spawnOtherPlayer(otherPlayerId: string, x: number, y: number): OtherPlayer {
        const otherPlayer = new OtherPlayer(this, x, y, otherPlayerId);
        this.otherPlayers.set(otherPlayerId, otherPlayer);
        return otherPlayer;
    }

    spawnChest(chestId: string, x: number, y: number): Chest {
        const chest = new Chest(this, x, y, chestId);
        this.chests.set(chestId, chest);

        this.physics.add.overlap(this.player, chest, (obj1, obj2) => {
            this.game.events.emit(EVENTS_NAME.chestLoot);
            obj2.destroy();
            window.connection.send({ id: chest.chestId, messageType: 'chest_grab' });
        });

        return chest;
    }

    spawnEnemy(enemyId: string, x: number, y: number, health: number): Enemy {
        const enemy = new Enemy(this, x, y, enemyId, health, 'tiles_spr', this.player, 503);
        this.enemies.set(enemyId, enemy);

        this.physics.add.collider(enemy, this.wallsLayer);
        this.physics.add.collider(enemy, Array.from(this.enemies.values()));
        this.physics.add.collider(this.player, enemy, (obj1, obj2) => {
            (obj1 as Player).getDamage(1);
        });
        return enemy;
    }

    deleteOtherPlayer(otherPlayerId: string): void {
        this.otherPlayers.get(otherPlayerId)?.deletePlayer();
        this.otherPlayers.delete(otherPlayerId);
    }

    deleteChest(chestId: string): void {
        this.chests.get(chestId)?.deleteChest();
        this.chests.delete(chestId);
    }

    deleteEnemy(enemyId: string): void {
        this.enemies.get(enemyId)?.deleteEnemy();
        this.enemies.delete(enemyId);
    }
}
