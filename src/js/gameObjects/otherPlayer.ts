import { Actor } from './actor';
import { Text } from './text';

export class OtherPlayer extends Actor {
    private hpValue: Text;

    private playerId: string;

    constructor(scene: Phaser.Scene, x: number, y: number, playerId: string) {
        super(scene, x, y, 'king');

        // PHYSICS
        this.getBody().setSize(30, 30);
        this.getBody().setOffset(8, 0);

        // HP
        this.hpValue = new Text(this.scene, this.x, this.y - this.height, this.hp.toString())
            .setFontSize(12)
            .setOrigin(0.8, 0.5);

        // Player id
        this.playerId = playerId;
    }

    update(): void {
        // HP update
        this.hpValue.setPosition(this.x, this.y - this.height * 0.4);
        this.hpValue.setOrigin(0.8, 0.5);
    }

    public getDamage(value?: number): void {
        super.getDamage(value);
        this.hpValue.setText(this.hp.toString());
    }
}
