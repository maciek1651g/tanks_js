import { Actor } from './actor';
import { Player } from './player';
import { EVENTS_NAME } from '../../consts';
import { UserDamage } from '../helpers/types';
import { BaseScene } from '../scenes/level1/level1';

export class Enemy extends Actor {
    scene: BaseScene;

    private target: Player;
    private AGGRESSOR_RADIUS = 100;
    private attackHandler: () => void;

    private enemyId: string;

    constructor(
        scene: BaseScene,
        x: number,
        y: number,
        enemyId: string,
        health: number,
        texture: string,
        target: Player,
        frame?: string | number
    ) {
        super(scene, x, y, texture, frame);
        this.target = target;
        this.scene = scene;
        this.enemyId = enemyId;
        this.hp = health;
        // ADD TO SCENE
        scene.add.existing(this);
        scene.physics.add.existing(this);
        // PHYSICS MODEL
        this.setName(enemyId);
        this.setScale(1.5);
        this.getBody().setSize(16, 16);
        this.getBody().setOffset(0, 0);

        // ATTACK HANDLER
        this.attackHandler = () => {
            if (
                Phaser.Math.Distance.BetweenPoints({ x: this.x, y: this.y }, { x: this.target.x, y: this.target.y }) <
                this.target.width
            ) {
                const damage = 50;
                this.getDamage();
                this.sendDamage(this.target.playerId, damage);
            }
        };

        // EVENTS
        this.scene.game.events.on(EVENTS_NAME.attack, this.attackHandler, this);
        this.on('destroy', () => {
            this.scene.game.events.removeListener(EVENTS_NAME.attack, this.attackHandler);
        });
    }

    preUpdate(): void {
        if (this.scene.gameMaster) {
            if (
                Phaser.Math.Distance.BetweenPoints({ x: this.x, y: this.y }, { x: this.target.x, y: this.target.y }) <
                this.AGGRESSOR_RADIUS
            ) {
                this.getBody().setVelocityX(this.target.x - this.x);
                this.getBody().setVelocityY(this.target.y - this.y);
            } else {
                this.getBody().setVelocity(0);
            }
        }
    }

    private sendDamage(playerId: string, damage: number): void {
        const newMessage: UserDamage = {
            id: playerId,
            messageType: 'user_damage',
            damage: damage,
            targetId: this.enemyId,
        };
        window.connection.send(newMessage);
    }

    public deleteEnemy(): void {
        this.disableBody(true, false);
        this.scene.time.delayedCall(100, () => {
            this.destroy();
        });
    }

    public setTarget(target: Player): void {
        this.target = target;
    }
}
