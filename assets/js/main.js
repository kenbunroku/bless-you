import Preloader from './scenes/preloader.js';
import Game from './scenes/game.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: [Preloader, Game],
};

new Phaser.Game(config);
