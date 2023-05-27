import { Physics } from 'phaser';

export class Actor extends Physics.Arcade.Sprite {
    protected hp = 100;
    protected speed = 200;
    protected speedUp = 100;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.getBody().setCollideWorldBounds(true);
    }

    public getDamage(value?: number): void {
        if (value) {
            this.hp = this.hp - value;
        }
    }

    public getHPValue(): number {
        return this.hp;
    }

    protected checkFlip(): void {
        this.flipX = this.getBody().velocity.x < 0;
    }

    protected getBody(): Physics.Arcade.Body {
        return this.body as Physics.Arcade.Body;
    }
}
