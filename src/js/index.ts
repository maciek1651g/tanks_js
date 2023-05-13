import { Game, Types } from 'phaser';
import { LoadingScene } from './scenes/loadingScene';
import { Level1 } from './scenes/level1/level1';
import { UIScene } from './scenes/ui/uiScene';

declare global {
    interface Window {
        sizeChanged: () => void;
        game: Phaser.Game;
        socket: WebSocket;
    }
}

const gameConfig: Types.Core.GameConfig = {
    title: 'Phaser game tutorial',
    type: Phaser.WEBGL,
    parent: 'game',
    backgroundColor: '#351f1b',
    scale: {
        mode: Phaser.Scale.ScaleModes.NONE,
        width: window.innerWidth,
        height: window.innerHeight,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
    },
    render: {
        antialiasGL: false,
        pixelArt: true,
    },
    callbacks: {
        postBoot: () => {
            window.sizeChanged();
        },
    },
    canvasStyle: `display: block; width: 100%; height: 100%;`,
    autoFocus: true,
    audio: {
        disableWebAudio: false,
    },
    scene: [LoadingScene, Level1, UIScene],
};

window.sizeChanged = () => {
    if (window.game.isBooted) {
        setTimeout(() => {
            window.game.scale.resize(window.innerWidth, window.innerHeight);
            window.game.canvas.setAttribute(
                'style',
                `display: block; width: ${window.innerWidth}px; height: ${window.innerHeight}px;`
            );
        }, 100);
    }
};
window.onresize = () => window.sizeChanged();

window.game = new Game(gameConfig);

// create new connection using websocket
const socket = new WebSocket('ws://localhost:8080/tanks/objects:exchange');
socket.onopen = () => {
    console.log('connected');
    socket.onmessage = (event) => {
        console.log(event.data);
    };
    window.socket = socket;
};
