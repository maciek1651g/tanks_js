import { Actor } from './actor';
import { Player } from './player';
import { EVENTS_NAME } from '../../consts';
import { EnemyStatus, EnemyDamage } from '../helpers/types';
import { BaseScene } from '../scenes/level1/level1';

export class Enemy extends Actor {
    scene: BaseScene;

    private target: Player;
    private AGGRESSOR_RADIUS = 200;
    private attackHandler: () => void;

    private enemyId: string;
    private lastSendMessage: EnemyStatus;

    get id(): string {
        return this.enemyId;
    }

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

        // PHYSICS MODEL
        this.setName(enemyId);
        this.setScale(1.5);
        this.getBody().setSize(16, 16);

        // ATTACK HANDLER
        this.attackHandler = () => {
            if (
                Phaser.Math.Distance.BetweenPoints({ x: this.x, y: this.y }, { x: this.target.x, y: this.target.y }) <
                this.target.width
            ) {
                const damage = 50;
                // this.getDamage();
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
        this.getBody().setVelocity(0);
        if (this.scene.gameMaster) {
            // if (
            //     Phaser.Math.Distance.BetweenPoints({ x: this.x, y: this.y }, { x: this.target.x, y: this.target.y }) <
            //     this.AGGRESSOR_RADIUS
            // ) {
            //     this.getBody().setVelocityX((this.target.x - this.x) * 2);
            //     this.getBody().setVelocityY((this.target.y - this.y) * 2);
            // } else {
            //     this.getBody().setVelocity(0);
            // }

            const closestPlayer = this.scene.physics.closest(this, [
                ...this.scene.otherPlayers.children.entries,
                this.target,
            ]);
            if (closestPlayer) {
                if (Phaser.Math.Distance.BetweenPoints(this, closestPlayer.body.position) < this.AGGRESSOR_RADIUS) {
                    this.getBody().setVelocityX((closestPlayer.body.position.x - this.x) * 2);
                    this.getBody().setVelocityY((closestPlayer.body.position.y - this.y) * 2);
                } else {
                    this.getBody().setVelocity(0);
                }
            }

            //Sync with server
            this.sendUpdate();
        }
    }

    private sendDamage(playerId: string, damage: number): void {
        const newMessage: EnemyDamage = {
            id: playerId,
            messageType: 'mob_damage',
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

    private sendUpdate(): void {
        const newMessage: EnemyStatus = {
            id: this.enemyId,
            messageType: 'mob_status',
            coordinates: { x: Math.round(this.x), y: Math.round(this.y), directionX: 1 },
        };
        if (JSON.stringify(newMessage) !== JSON.stringify(this.lastSendMessage)) {
            this.lastSendMessage = newMessage;
            window.connection.send(newMessage);
        }
    }

    updateEnemy(x: number, y: number, directionX: number): void {
        // MOVEMENT update
        this.setPosition(x, y);
        // this.scaleX = directionX;
    }

    public setTarget(target: Player): void {
        this.target = target;
    }
}
