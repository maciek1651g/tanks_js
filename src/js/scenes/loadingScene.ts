import { Scene } from 'phaser';

export class LoadingScene extends Scene {
    constructor() {
        super('loading-scene');
    }

    preload(): void {
        if (window.location.hostname.includes('github.io')) {
            this.load.baseURL = 'https://maciek1651g.github.io/tanks_js/assets/';
        } else {
            this.load.baseURL = './../../assets/';
        }

        // Loading king sprite
        this.load.image('king', 'sprites/king.png');
        // Our king atlas
        this.load.atlas('a-king', 'spritesheets/a-king.png', 'spritesheets/a-king_atlas.json');

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
