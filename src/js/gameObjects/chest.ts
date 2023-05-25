import { Physics } from 'phaser';

export class Chest extends Physics.Arcade.Sprite {
    chestId: string;

    constructor(scene: Phaser.Scene, x: number, y: number, chestId: string) {
        super(scene, x, y, 'tiles_spr', 595);
        this.setScale(1.5);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.chestId = chestId;
    }

    deleteChest() {
        this.destroy(true);
    }
}
