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

const game = new Phaser.Game(config);

function preload() {
  this.load.image('tiles', './assets/tilesets/tileset.png');
  this.load.tilemapTiledJSON('map', './assets/tilemaps/bless-you.json');
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
  const map = this.make.tilemap({ key: 'map' });
  const tileset = map.addTilesetImage('bless-you-tileset', 'tiles');

  const background = map.createStaticLayer('background', tileset, 0, -932);
  const ground = map.createStaticLayer('ground', tileset, 0, -932);
  const spike = map.createStaticLayer('spike', tileset, 0, -932);

  ground.setCollisionByProperty({ collides: true });

  // const debugGraphics = this.add.graphics().setAlpha(0.75);
  // ground.renderDebug(debugGraphics, {
  //   tileColor: null, // Color of non-colliding tiles
  //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
  //   faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
  // });

  hearts = this.physics.add.staticGroup({
    key: 'heart',
    repeat: 2,
    setXY: { x: 50, y: 30, stepX: 40 },
  });

  sneezeBar = this.physics.add.staticGroup();
  sneezeBar.create(250, 30, 'sneezeBar');

  player = this.physics.add.sprite(400, 550, 'sickHero');

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

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
    key: 'sneezeBar',
    frames: this.anims.generateFrameNumbers('sneezeBar', { start: 0, end: 4 }),
    frameRate: 10,
    repeat: -1,
  });

  cursors = this.input.keyboard.createCursorKeys();

  this.physics.add.collider(player, ground);
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-100);

    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(100);

    player.anims.play('right', true);
  } else {
    player.setVelocityX(0);

    player.anims.play('turn');
  }

  if (cursors.up.isDown && player.body.onFloor()) {
    player.setVelocityY(-200);
  }
}
