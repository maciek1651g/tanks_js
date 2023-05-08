import { Scene } from 'phaser';

export class LoadingScene extends Scene {
    constructor() {
        super('loading-scene');
    }

    preload(): void {
        this.load.baseURL = './../../assets/';
        this.load.image('king', 'sprites/king.png');
    }

    create(): void {
        this.scene.start('level1-scene');
    }
}
