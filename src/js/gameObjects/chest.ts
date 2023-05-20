import { Physics } from 'phaser';
import { EVENTS_NAME } from '../../consts';
import { Level1 } from '../scenes/level1/level1';

export class Chest extends Physics.Arcade.Sprite {
    chestId: string;

    constructor(scene: Phaser.Scene, x: number, y: number, chestId: string) {
        super(scene, x, y, 'tiles_spr', 595);
        this.setScale(1.5);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.chestId = chestId;

        this.initCollision();
    }

    initCollision(): void {
        const player = (this.scene as Level1).player;
        this.scene.physics.add.overlap(player, this, (obj1, obj2) => {
            this.scene.game.events.emit(EVENTS_NAME.chestLoot);
            obj2.destroy();
            window.connection.send({ id: this.chestId, messageType: 'chest_grab' });
        });
    }

    deleteChest() {
        this.destroy(true);
    }
}
