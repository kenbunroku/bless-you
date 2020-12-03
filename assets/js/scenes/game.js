import { createCharacterAnims } from '../anims/player.js';

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    createCharacterAnims(this.anims);

    this.cameras.main.setBounds(0, -932, 1024, 1532);
    this.physics.world.setBounds(0, -932, 1024, 1532);

    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('bless-you-tileset', 'tiles');

    const background = map.createStaticLayer('background', tileset, 0, -932);
    const ground = map.createStaticLayer('ground', tileset, 0, -932);
    const spike = map.createStaticLayer('spike', tileset, 0, -932);

    ground.setCollisionByProperty({ collides: true });
    background.setCollisionByProperty({ collides: true });
    spike.setCollisionByProperty({ collides: true });

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

    let heartCount = 2;

    let hearts = this.add.group({
      key: 'heart',
      repeat: heartCount,
      setXY: { x: 50, y: 30, stepX: 40 },
    });

    hearts.children.entries.forEach((heart) => {
      heart.setScrollFactor(0);
    });

    const sneezeBar = this.add.sprite(250, 30, 'sneezeBar');
    sneezeBar.setScrollFactor(0);
    sneezeBar.anims.play('sneezeBar', true);

    this.player = this.physics.add.sprite(150, 100, 'sickHero');

    this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
    this.cameras.main.setZoom(1);

    this.physics.add.collider(this.player, ground);
    this.physics.add.collider(this.player, background);
    this.physics.add.collider(this.player, spike);

    // timedJump = this.time.addEvent({
    //   delay: 2000,
    //   callback: sneezeJump(),
    //   callbackScope: this,
    //   loop: true,
    // });
  }

  update() {
    let onGround = this.player.body.blocked.down;
    let keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    let keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    let keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    if (keyA.isDown) {
      this.player.setVelocityX(-100);

      this.player.anims.play('left', true);
    } else if (keyD.isDown) {
      this.player.setVelocityX(100);

      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);

      this.player.anims.play('turn');
    }

    if (keyW.isDown && this.player.body.blocked.down) {
      this.player.setVelocityY(-200);
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

    if (onGround == false && this.player.body.velocity.x >= 0) {
      this.player.anims.play('jumpRight', 10);
    } else if (onGround == false && this.player.body.velocity.x < 0) {
      this.player.anims.play('jumpLeft', 10);
    }
  }
  sneezeJump() {
    let onGround = player.body.blocked.down;

    player.setVelocityY(-225);
    this.sneeze.play();
    // TODO Add sneezeJump anims
    // if (onGround == false) {
    //   player.anims.stop();
    //   player.anims.play('sneezeJump', 10);
    // }
  }
}
