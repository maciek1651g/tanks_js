import { Scene } from 'phaser';

export class LoadingScene extends Scene {
    constructor() {
        super('loading-scene');
    }

    preload(): void {
        this.load.baseURL = './../../assets/';

        // Loading king sprite
        //this.load.image('king', 'sprites/Tank_top_model.png');
        this.load.image('king', 'sprites/king.png');

        // Loading tilemap
        this.load.image({
            key: 'tiles',
            url: 'tilemaps/tiles/dungeon-16-16.png',
        });
        this.load.tilemapTiledJSON('dungeon', 'tilemaps/json/dungeon.json');

        //Loading spritesheet, we will use it for chest sprite
        this.load.spritesheet('tiles_spr', 'tilemaps/tiles/dungeon-16-16.png', {
            frameWidth: 16,
            frameHeight: 16,
        });
    }

    create(): void {
        this.scene.start('level1-scene');
        this.scene.start('ui-scene');
    }
}
