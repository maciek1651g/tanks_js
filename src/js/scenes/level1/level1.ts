import { Scene, Tilemaps } from 'phaser';
import { Player } from '../../gameObjects/player';
import { EVENTS_NAME } from '../../../consts';
import { Enemy } from '../../gameObjects/enemy';
import { Chest } from '../../gameObjects/chest';
import { OtherPlayer } from '../../gameObjects/otherPlayer';
import Group = Phaser.GameObjects.Group;
import { UserDamage } from '../../helpers/types';

export interface BaseScene extends Scene {
    otherPlayers: Group;
    chests: Group;
    enemies: Group;
    player: Player;
    spawnChest: (chestId: string, x: number, y: number) => void;
    spawnOtherPlayer: (otherPlayerId: string, x: number, y: number, hp: number) => void;
    spawnEnemy: (enemyId: string, x: number, y: number, health: number) => void;
    deleteOtherPlayer: (otherPlayerId: string) => void;
    deleteChest: (chestId: string) => void;
    deleteEnemy: (enemyId: string) => void;
    gameMaster: boolean;
    setGameMaster: (value: boolean) => void;
    updateScore: (score: number) => void;
    initPlayer: (player: Player) => void;
}

export class Level1 extends Scene implements BaseScene {
    public player!: Player;

    private map!: Tilemaps.Tilemap;
    private tileset!: Tilemaps.Tileset;
    private wallsLayer!: Tilemaps.TilemapLayer;
    private groundLayer!: Tilemaps.TilemapLayer;

    public otherPlayers = new Group(this);
    public chests = new Group(this);
    public enemies = new Group(this);

    public gameMaster = false;

    constructor() {
        super('level1-scene');
    }

    create(): void {
        this.initMap();
        window.connection.initScene(this);
    }

    initPlayer(player: Player): void {
        this.player = player;
        this.physics.add.collider(this.player, this.wallsLayer);
        // this.initChests();
        // this.initEnemies();
        this.initCamera();

        this.physics.add.collider(this.player, this.enemies, (obj1, obj2) => {
            const userDamage: UserDamage = {
                id: (obj2 as Enemy).id,
                messageType: 'user_damage',
                damage: 1,
                targetId: (obj1 as Player).id,
            };
            window.connection.send(userDamage);
        });
    }

    update(): void {
        if (this.player) {
            this.player.update();
        }
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

    spawnOtherPlayer(otherPlayerId: string, x: number, y: number, hp: number): OtherPlayer {
        const otherPlayer = new OtherPlayer(this, x, y, otherPlayerId, hp);
        this.otherPlayers.add(otherPlayer);
        return otherPlayer;
    }

    spawnChest(chestId: string, x: number, y: number): Chest {
        const chest = new Chest(this, x, y, chestId);
        this.chests.add(chest);

        this.physics.add.overlap(this.player, chest, (obj1, obj2) => {
            // this.game.events.emit(EVENTS_NAME.chestLoot);
            obj2.destroy();
            window.connection.send({ id: chest.chestId, messageType: 'chest_grab', playerId: (obj1 as Player).id });
        });

        return chest;
    }

    spawnEnemy(enemyId: string, x: number, y: number, health: number): Enemy {
        const enemy = new Enemy(this, x, y, enemyId, health, 'tiles_spr', this.player, 503);
        this.enemies.add(enemy);
        return enemy;
    }

    deleteOtherPlayer(otherPlayerId: string): void {
        const otherPlayer = this.children.getByName(otherPlayerId) as OtherPlayer;
        if (otherPlayer) {
            this.otherPlayers.remove(otherPlayer);
            otherPlayer.deletePlayer();
        }
    }

    deleteChest(chestId: string): void {
        const chest = this.children.getByName(chestId) as Chest;
        if (chest) {
            this.chests.remove(chest);
            chest.deleteChest();
        }
    }

    deleteEnemy(enemyId: string): void {
        const enemy = this.children.getByName(enemyId) as Enemy;
        if (enemy) {
            this.enemies.remove(enemy);
            enemy.deleteEnemy();
        }
    }

    setGameMaster(gameMaster: boolean): void {
        if (gameMaster) {
            this.physics.add.collider(this.enemies, this.wallsLayer);
            this.physics.add.collider(this.enemies, this.enemies);
            this.physics.add.collider(this.enemies, this.otherPlayers);

            // this.physics.add.collider(this.enemies, this.otherPlayers, (obj1, obj2) => {
            //     const userDamage: UserDamage = {
            //         id: (obj1 as Enemy).id,
            //         messageType: 'user_damage',
            //         damage: 1,
            //         targetId: (obj2 as OtherPlayer).id,
            //     };
            //     window.connection.send(userDamage);
            // });
        }
        this.gameMaster = gameMaster;
    }

    updateScore(score: number): void {
        this.game.events.emit(EVENTS_NAME.scoreChange, score);
    }
}
