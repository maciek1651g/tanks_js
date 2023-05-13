import { Actor } from './actor';

export class Player extends Actor {
    private keyW: Phaser.Input.Keyboard.Key;
    private keyA: Phaser.Input.Keyboard.Key;
    private keyS: Phaser.Input.Keyboard.Key;
    private keyD: Phaser.Input.Keyboard.Key;
    private keyShift: Phaser.Input.Keyboard.Key;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'king');
        // KEYS
        this.keyW = this.scene.input.keyboard.addKey('W');
        this.keyA = this.scene.input.keyboard.addKey('A');
        this.keyS = this.scene.input.keyboard.addKey('S');
        this.keyD = this.scene.input.keyboard.addKey('D');
        this.keyShift = this.scene.input.keyboard.addKey('Shift');

        // PHYSICS
        this.getBody().setSize(30, 30);
        this.getBody().setOffset(8, 0);
    }

    update(): void {
        this.getBody().setVelocity(0);
        const speed = this.keyShift?.isDown
            ? this.speed + this.speedUp
            : this.speed;
        if (this.keyShift?.isDown) {
        }
        if (this.keyW?.isDown) {
            this.body.velocity.y = -speed;
        }
        if (this.keyA?.isDown) {
            this.body.velocity.x = -speed;
            this.checkFlip();
            this.getBody().setOffset(48, 15);
        }
        if (this.keyS?.isDown) {
            this.body.velocity.y = speed;
        }
        if (this.keyD?.isDown) {
            this.body.velocity.x = speed;
            this.checkFlip();
            this.getBody().setOffset(15, 15);
        }
    }
}
