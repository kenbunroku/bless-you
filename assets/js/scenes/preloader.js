export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader');
  }

  preload() {
    this.load.image('tiles', './assets/tilesets/tileset_extruded.png');
    this.load.tilemapTiledJSON('map', './assets/tilemaps/bless-you.json');
    this.load.image('heart', './assets/img/heart.png');
    this.load.spritesheet('sneezeBar', './assets/img/sneeze-bar.png', {
      frameWidth: 128,
      frameHeight: 32,
    });
    this.load.spritesheet('sickHero', './assets/img/sick-hero.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('villain', './assets/img/villain.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.audio('bgm', [
      './assets/audio/bgm.ogg',
      './assets/audio/bgm.mp3',
    ]);
    this.load.audio('jump', [
      './assets/audio/jump.ogg',
      './assets/audio/jump.mp3',
    ]);
    this.load.audio('sneeze', [
      './assets/audio/sneeze.ogg',
      './assets/audio/sneeze.mp3',
    ]);
  }
  create() {
    this.scene.start('game');
  }
}
