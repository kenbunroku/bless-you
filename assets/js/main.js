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
let platforms;
let hearts;
let sneezeBar;
let cursors;
let spike;
let keyA;
let keyD;
let keyW;
let timedJump;

const game = new Phaser.Game(config);

function preload() {
  this.load.image('tiles', './assets/tilesets/tileset.png');
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
}

function create() {
  this.cameras.main.setBounds(0, -932, 1024, 1532);
  this.physics.world.setBounds(0, -932, 1024, 1532);

  const map = this.make.tilemap({ key: 'map' });
  const tileset = map.addTilesetImage('bless-you-tileset', 'tiles');

  const background = map.createStaticLayer('background', tileset, 0, -932);
  const ground = map.createStaticLayer('ground', tileset, 0, -932);
  const spike = map.createStaticLayer('spike', tileset, 0, -932);

  ground.setCollisionByProperty({ collides: true });
  background.setCollisionByProperty({ collides: true });

  // Below code is to check collision setting
  // const debugGraphics = this.add.graphics().setAlpha(0.75);
  // background.renderDebug(debugGraphics, {
  //   tileColor: null, // Color of non-colliding tiles
  //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
  //   faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
  // });

  // Create status elements on left top
  hearts = this.physics.add.staticGroup({
    key: 'heart',
    repeat: 2,
    setXY: { x: 50, y: 30, stepX: 40 },
  });
  sneezeBar = this.add.sprite(250, 30, 'sneezeBar');
  // TODO Change game element position according to the player position

  player = this.physics.add.sprite(400, 550, 'sickHero');

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
    key: 'jump',
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
    frames: [{ key: 'sickHero', frame: 23 }],
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

  // Keyboard setting
  keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

  this.physics.add.collider(player, ground);
  this.physics.add.collider(player, background);

  // TODO Add physics to spike
  // TODO Add damage function to spike

  sneezeBar.anims.play('sneezeBar', true);

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
    // TODO Attach jump sound
  }

  if (onGround == false && player.body.velocity.x >= 0) {
    player.anims.play('jump', 10);
  } else if (onGround == false && player.body.velocity.x < 0) {
    player.anims.play('jumpLeft', 10);
  }
}

function sneezeJump() {
  player.setVelocityY(-200);
  // TODO Attach jump sound
  // TODO Add sneezeJump anims
}
