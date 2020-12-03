import Preloader from './scenes/preloader.js';

import { debugDraw } from './utils/debug.js';

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
  // scale: {
  //   zoom: 0.8,
  // },
};

const game = new Phaser.Game(config);

function preload() {
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
  this.load.audio('bgm', ['./assets/audio/bgm.ogg', './assets/audio/bgm.mp3']);
  this.load.audio('jump', [
    './assets/audio/jump.ogg',
    './assets/audio/jump.mp3',
  ]);
  this.load.audio('sneeze', [
    './assets/audio/sneeze.ogg',
    './assets/audio/sneeze.mp3',
  ]);
}

function create() {
  this.cameras.main.setBounds(0, -932, 1024, 1532);
  // this.physics.world.setBounds(0, -932, 1024, 1532);

  const map = this.make.tilemap({ key: 'map' });
  const tileset = map.addTilesetImage(
    'bless-you-tileset',
    'tiles',
    32,
    32,
    1,
    2
  );

  const background = map.createStaticLayer('background', tileset, 0, -932);
  const ground = map.createStaticLayer('ground', tileset, 0, -932);
  spike = map.createStaticLayer('spike', tileset, 0, -932);

  ground.setCollisionByProperty({ collides: true });
  background.setCollisionByProperty({ collides: true });
  spike.setCollisionByProperty({ collides: true });

  // spike.setSize(spike.width, spike.height *  0.8);

  console.log(spike);

  // Add sound effects
  this.music = this.sound.add('bgm');
  this.jump = this.sound.add('jump');
  this.sneeze = this.sound.add('sneeze');

  const musicConfig = {
    mute: false,
    volume: 0.1,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: true,
    delay: 0,
  };
  this.music.play(musicConfig);

  // Below code is to check collision setting
  debugDraw(spike, this);

  // Create status elements on left top
  let heartCount = 2;

  hearts = this.add.group({
    key: 'heart',
    repeat: heartCount,
    setXY: { x: 50, y: 30, stepX: 40 },
  });

  hearts.children.entries.forEach((heart) => {
    heart.setScrollFactor(0);
  });

  sneezeBar = this.add.sprite(250, 30, 'sneezeBar');
  sneezeBar.setScrollFactor(0);

  player = this.physics.add.sprite(150, 100, 'sickHero');

  this.cameras.main.startFollow(player, true, 0.09, 0.09);
  this.cameras.main.setZoom(1);

  // Create player animations
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('sickHero', { start: 6, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: 'turn',
    frames: [{ key: 'sickHero', frame: 1 }],
    frameRate: 20,
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('sickHero', { start: 9, end: 11 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: 'jumpRight',
    frames: [{ key: 'sickHero', frame: 16 }],
    frameRate: 10,
    repeat: 0,
  });

  this.anims.create({
    key: 'jumpLeft',
    frames: [{ key: 'sickHero', frame: 20 }],
    frameRate: 10,
    repeat: 0,
  });

  this.anims.create({
    key: 'sneezeJump',
    frames: [{ key: 'sickHero', frame: 26 }],
    frameRate: 10,
    repeat: -1,
  });

  // Create sneezeBar animation
  this.anims.create({
    key: 'sneezeBar',
    frames: this.anims.generateFrameNumbers('sneezeBar', { start: 0, end: 3 }),
    frameRate: 2,
    repeat: -1,
  });

  sneezeBar.anims.play('sneezeBar', true);
  // Keyboard setting
  keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

  // spike = this.physics.add.image();

  this.physics.add.collider(player, ground);
  this.physics.add.collider(player, background);
  this.physics.add.collider(player, spike);

  // TODO Add damage function to spike
  this.physics.add.overlap(player, spike, hitSpike, null, this);

  timedJump = this.time.addEvent({
    delay: 2000,
    callback: sneezeJump,
    callbackScope: this,
    loop: true,
  });
}

function update() {
  let onGround = player.body.blocked.down;

  if (keyA.isDown) {
    player.setVelocityX(-100);

    player.anims.play('left', true);
  } else if (keyD.isDown) {
    player.setVelocityX(100);

    player.anims.play('right', true);
  } else {
    player.setVelocityX(0);

    player.anims.play('turn');
  }

  if (keyW.isDown && player.body.blocked.down) {
    player.setVelocityY(-200);
    const musicConfig = {
      mute: false,
      volume: 0.1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0,
    };
    this.jump.play(musicConfig);
  }

  if (onGround == false && player.body.velocity.x >= 0) {
    player.anims.play('jumpRight', 10);
  } else if (onGround == false && player.body.velocity.x < 0) {
    player.anims.play('jumpLeft', 10);
  }
}

function sneezeJump() {
  let onGround = player.body.blocked.down;

  player.setVelocityY(-225);
  this.sneeze.play();
  // TODO Add sneezeJump anims
  // if (onGround == false) {
  //   player.anims.stop();
  //   player.anims.play('sneezeJump', 10);
  // }
}

function hitSpike(player, spike) {
  player.setTint(0xff0000);
  player.anims.play('turn');
}
