import { Scene } from 'phaser';

export class LoadingScene extends Scene {
    constructor() {
        super('loading-scene');
    }

    preload(): void {
        this.load.baseURL = './../../assets/';
        this.load.image('Tank_top_model', 'sprites/Tank_top_model.png');
    }

    create(): void {
        this.scene.start('level1-scene');
    }
}
