import { Actor } from './actor';
import { Text } from './text';
import { EVENTS_NAME } from '../../consts';
import { ClientMessage, UserAttack } from '../helpers/types';

export class Player extends Actor {
    private keyW: Phaser.Input.Keyboard.Key;
    private keyA: Phaser.Input.Keyboard.Key;
    private keyS: Phaser.Input.Keyboard.Key;
    private keyD: Phaser.Input.Keyboard.Key;
    private keyShift: Phaser.Input.Keyboard.Key;
    private keySpace: Phaser.Input.Keyboard.Key;

    private hpValue: Text;

    private lastSendMessage: ClientMessage;
    public readonly playerId: string;

    get id(): string {
        return this.playerId;
    }

    constructor(scene: Phaser.Scene, x: number, y: number, playerId: string, hp: number) {
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
            this.sendAttack();
            this.updateSize();
        });

        // PHYSICS
        this.updateSize();

        // HP
        this.hp = hp;
        this.hpValue = new Text(this.scene, this.x, this.y - this.height, this.hp.toString())
            .setFontSize(12)
            .setOrigin(0.8, 0.5);

        // Player id
        this.playerId = playerId;
        this.setName(playerId);

        this.initAnimations();
    }

    updateSize(): void {
        this.getBody().setSize(35, 30, true);
    }

    update(): void {
        // MOVEMENT update
        this.getBody().setVelocity(0);
        const speed = this.keyShift?.isDown ? this.speed + this.speedUp : this.speed;

        if (this.keyW?.isDown) {
            this.body.velocity.y = -speed;
        }
        if (this.keyA?.isDown) {
            this.body.velocity.x = -speed;
            this.checkFlip();
        }
        if (this.keyS?.isDown) {
            this.body.velocity.y = speed;
        }
        if (this.keyD?.isDown) {
            this.body.velocity.x = speed;
            this.checkFlip();
        }

        // HP update
        this.hpValue.setPosition(this.x, this.y - this.height * 0.4);
        this.hpValue.setOrigin(0.8, 0.5);

        //Sync with server
        this.sendUpdate();
    }

    public getDamage(value?: number): void {
        super.getDamage(value);
        this.hpValue.setText(this.hp.toString());
    }

    private sendUpdate(): void {
        const newMessage: ClientMessage = {
            id: this.playerId,
            messageType: 'status',
            coordinates: { x: Math.round(this.x), y: Math.round(this.y), directionX: this.flipX ? -1 : 1 },
        };
        if (JSON.stringify(newMessage) !== JSON.stringify(this.lastSendMessage)) {
            this.lastSendMessage = newMessage;
            window.connection.send(newMessage);
        }
    }

    updateHealth(hp: number): void {
        if (hp !== this.hp) {
            this.hp = hp;
            this.hpValue.setText(this.hp.toString());
            window.connection.updateHealth(this.hp);
        }
    }

    private sendAttack(): void {
        const newMessage: UserAttack = {
            id: this.playerId,
            messageType: 'user_attack',
        };
        window.connection.send(newMessage);
    }

    private initAnimations(): void {
        this.scene.anims.create({
            key: 'attack',
            frames: this.scene.anims.generateFrameNames('a-king', {
                prefix: 'attack-',
                end: 2,
            }),
            frameRate: 8,
        });
    }
}
