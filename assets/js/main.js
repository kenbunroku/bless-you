const config = {
  type: Phaser.AUTO,
  width: 1024,
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

const game = new Phaser.Game(config);

function preload(){
    this.load.image('building', './assets/img/background.png');
}

function create(){
    this.add.image(512, -168, 'building')
}

function update(){}
