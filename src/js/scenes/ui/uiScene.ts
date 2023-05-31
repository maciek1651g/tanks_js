import { Scene } from 'phaser';
import { Score, ScoreOperations } from '../../gameObjects/score';
import { EVENTS_NAME } from '../../../consts';

export class UIScene extends Scene {
    private score!: Score;
    private chestLootHandler: (score: number) => void;

    constructor() {
        super('ui-scene');
        this.chestLootHandler = (score: number) => {
            this.score.setNeWScore(score);
        };
    }

    create(): void {
        this.score = new Score(this, 20, 20, 0);
        this.initListeners();
    }

    private initListeners(): void {
        this.game.events.on(EVENTS_NAME.scoreChange, this.chestLootHandler, this);
    }
}
