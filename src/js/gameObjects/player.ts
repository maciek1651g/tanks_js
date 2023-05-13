import { Actor } from './actor';
import { Text } from '../../classes/text';
import { EVENTS_NAME } from '../../consts';

export class Player extends Actor {
    private keyW: Phaser.Input.Keyboard.Key;
    private keyA: Phaser.Input.Keyboard.Key;
    private keyS: Phaser.Input.Keyboard.Key;
    private keyD: Phaser.Input.Keyboard.Key;
    private keyShift: Phaser.Input.Keyboard.Key;
    private keySpace: Phaser.Input.Keyboard.Key;

    private hpValue: Text;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'king');
        // KEYS
        this.keyW = this.scene.input.keyboard.addKey('W');
        this.keyA = this.scene.input.keyboard.addKey('A');
        this.keyS = this.scene.input.keyboard.addKey('S');
        this.keyD = this.scene.input.keyboard.addKey('D');
        this.keyShift = this.scene.input.keyboard.addKey('Shift');
        this.keySpace = this.scene.input.keyboard.addKey(32);
        this.keySpace.on('down', (event: KeyboardEvent) => {
            this.anims.play('attack', true);
            this.scene.game.events.emit(EVENTS_NAME.attack);
        });

        // PHYSICS
        this.getBody().setSize(30, 30);
        this.getBody().setOffset(8, 0);

        // HP
        this.hpValue = new Text(
            this.scene,
            this.x,
            this.y - this.height,
            this.hp.toString()
        )
            .setFontSize(12)
            .setOrigin(0.8, 0.5);
    }

    update(): void {
        // MOVEMENT update
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

        // HP update
        this.hpValue.setPosition(this.x, this.y - this.height * 0.4);
        this.hpValue.setOrigin(0.8, 0.5);
    }

    public getDamage(value?: number): void {
        super.getDamage(value);
        this.hpValue.setText(this.hp.toString());
    }
}
