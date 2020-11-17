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
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

let player;
let hearts;
let sneezeBar;

const game = new Phaser.Game(config);

function preload() {
  this.load.image('building', './assets/img/background.png');
  this.load.image('heart', './assets/img/heart.png');
  this.load.image('sneezeBar', './assets/img/sneeze-bar.gif');
}

function create() {
  this.add.image(512, -168, 'building');

  hearts = this.physics.add.staticGroup({
    key: 'heart',
    repeat: 2,
    setXY: { x: 50, y: 30, stepX: 40 },
  });

  sneezeBar = this.physics.add.staticGroup();
  sneezeBar.create(240, 30, 'sneezeBar')
}

function update() {}
