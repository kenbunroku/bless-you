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
let cursors;
let platforms;
let spike;

const game = new Phaser.Game(config);

function preload() {
  this.load.image('building', './assets/img/background.png');
  this.load.image('ground', './assets/img/platform.png');
  this.load.image('spike', './assets/img/spike.png');
  this.load.image('heart', './assets/img/heart.png');
  this.load.spritesheet('sneezeBar', './assets/img/sneeze-bar.png', {
    frameWidth: 150,
    frameHeight: 50,
  });
  this.load.spritesheet('sickHero', './assets/img/sick-hero.png', {
    frameWidth: 32,
    frameHeight: 32,
  });
  this.load.spritesheet('villain', './assets/img/villain.png', {
    frameWidth: 32,
    frameHeight: 32,
  });
}

function create() {
  this.add.image(512, -168, 'building');

  platforms = this.physics.add.staticGroup();
  platforms.create(512, -168, 'ground');

  spike = this.physics.add.staticGroup();
  spike.create(512, -168, 'spike');

  hearts = this.physics.add.staticGroup({
    key: 'heart',
    repeat: 2,
    setXY: { x: 50, y: 30, stepX: 40 },
  });

  sneezeBar = this.physics.add.staticGroup();
  sneezeBar.create(250, 30, 'sneezeBar');

  player = this.physics.add.sprite(400, 600, 'sickHero');

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  this.anims.create({
    key: 'turn',
    frames: [{ key: 'sickHero', frame: 1 }],
    frameRate: 20,
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('sickHero', { start: 7, end: 10 }),
    frameRate: 10,
    repeat: -1,
  });

  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if (cursors.right.isDown) {
    player.setVelocityX(50);
    player.anims.play('right', true);
  } else {
    player.setVelocityX(0);
    player.anims.play('turn');
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-120);
  }
}
