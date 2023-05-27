import { Actor } from './actor';
import { Text } from './text';

export class OtherPlayer extends Actor {
    private hpValue: Text;

    private playerId: string;

    get id(): string {
        return this.playerId;
    }

    constructor(scene: Phaser.Scene, x: number, y: number, playerId: string) {
        super(scene, x, y, 'king');

        // PHYSICS
        this.updateSize();
        this.setImmovable(true);

        // HP
        this.hpValue = new Text(this.scene, this.x, this.y - this.height, this.hp.toString())
            .setFontSize(12)
            .setOrigin(0.8, 0.5);

        // Player id
        this.playerId = playerId;
        this.setName(playerId);
    }

    updateSize(): void {
        this.getBody().setSize(30, 30, true);
    }

    updatePlayer(x: number, y: number, directionX: number, hp: number): void {
        // MOVEMENT update
        this.setPosition(x, y);
        this.flipX = directionX === -1;

        // HP update
        this.hpValue.setPosition(this.x, this.y - this.height * 0.4);
        this.hpValue.setOrigin(0.8, 0.5);
    }

    attack(): void {
        this.anims.play('attack', true);
        this.updateSize();
    }

    deletePlayer(): void {
        this.hpValue.destroy(true);
        this.destroy(true);
    }

    updateHealth(hp: number): void {
        if (hp !== this.hp) {
            this.hp = hp;
            this.hpValue.setText(this.hp.toString());
        }
    }

    public getDamage(value?: number): void {
        super.getDamage(value);
        this.hpValue.setText(this.hp.toString());
    }
}
