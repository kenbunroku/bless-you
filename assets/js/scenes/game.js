import { debugDraw } from '../utils/debug.js';
import { createCharacterAnims } from '../anims/player.js';

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');

    this.LIVES = 3;
    this.COOL_DOWN_TIMER = 1000;
    this.isHurt = false;

    this.PLAYER_STARTING_LOCATION = {
      x: 500,
      y: 560,
    };
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
  }

  create() {
    createCharacterAnims(this.anims);

    this.cameras.main.setBounds(0, -932, 1024, 1532);
    this.physics.world.setBounds(0, -932, 1024, 1532);

    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage(
      'bless-you-tileset',
      'tiles',
      32,
      32,
      1,
      2
    );

    const background = map
      .createStaticLayer('background', tileset, 0, -932)
      .setCollisionByProperty({ collides: true });

    const ground = map
      .createStaticLayer('ground', tileset, 0, -932)
      .setCollisionByProperty({ collides: true });

    this.spike = map
      .createDynamicLayer('spike', tileset, 0, -932)
      .setCollisionByProperty({ collides: true });

    this.player = this.physics.add.sprite(
      this.PLAYER_STARTING_LOCATION.x,
      this.PLAYER_STARTING_LOCATION.y,
      'sickHero'
    );

    this.villain = this.physics.add.sprite(950, -755, 'villain');
    this.kid = this.add.sprite(1000, -755, 'kid');

    this.spikeGroup = this.physics.add.staticGroup();

    this.spike.forEachTile((tile) => {
      if (tile.index === 11) {
        const x = tile.getCenterX();
        const y = tile.getCenterY();
        const spikeTile = this.spikeGroup.create(x, y, 'spikeTile');

        spikeTile.rotation = tile.rotation;
        if (spikeTile.angle === 0) spikeTile.body.setSize(32, 10);

        this.spike.removeTileAt(tile.x, tile.y);
      }
    });

    this.music = this.sound.add('bgm');
    this.jump = this.sound.add('jump');
    this.sneeze = this.sound.add('sneeze');
    this.heroOuch = this.sound.add('heroOuch');
    this.villainOuch = this.sound.add('villainOuch');
    this.gameClear = this.sound.add('gameClear');

    this.music.play({
      mute: false,
      volume: 0.05,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    });

    this.hearts = this.add.group({
      key: 'heart',
      repeat: this.LIVES - 1,
      setXY: {
        x: 50,
        y: 30,
        stepX: 40,
      },
    });

    this.hearts.getChildren().forEach((heart) => {
      heart.setScrollFactor(0);
    });

    this.sneezeBar = this.add.sprite(250, 30, 'sneezeBar');
    this.sneezeBar.setScrollFactor(0);
    this.sneezeBar.anims.play('sneezeBar', true);

    this.gameClearText = this.add.text(800, -900, 'Game Clear!', {
      fontSize: '32px',
      fill: '#fff',
    });
    this.gameClearText.visible = false;

    this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
    this.cameras.main.setZoom(1);

    this.physics.add.collider(this.player, ground);
    this.physics.add.collider(this.player, background);
    this.physics.add.collider(this.villain, background);
    this.physics.add.collider(
      this.player,
      this.villain,
      this.beatVillain,
      null,
      this
    );

    this.time.addEvent({
      delay: 2000,
      callback: this.sneezeJump,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.collider(
      this.player,
      this.spikeGroup,
      this.hitSpike,
      null,
      this
    );
  }

  update() {
    const onGround = this.player.body.blocked.down;
    const currentPlayerAnim = this.player.anims.getCurrentKey();

    if (this.wasd.left.isDown || this.cursors.left.isDown) {
      this.player.setVelocityX(-100);
      this.player.setFlipX(false);
    } else if (this.wasd.right.isDown || this.cursors.right.isDown) {
      this.player.setVelocityX(100);
      this.player.setFlipX(true);
    } else {
      this.player.setVelocityX(0);
    }

    if ((this.wasd.up.isDown || this.cursors.up.isDown) && onGround) {
      this.player.setVelocityY(-200);
      this.jump.play({
        mute: false,
        volume: 0.1,
        rate: 1,
        detune: 0,
        seek: 0,
        loop: false,
        delay: 0,
      });
    }

    if (onGround) {
      if (
        this.wasd.left.isDown ||
        this.cursors.left.isDown ||
        this.wasd.right.isDown ||
        this.cursors.right.isDown
      ) {
        this.player.anims.play('walk', true);
      } else {
        this.player.anims.play('turn');
      }
    } else if (currentPlayerAnim !== 'sneezeJump') {
      if (this.player.body.velocity.x > 0) {
        this.player.anims.play('jump');
        this.player.setFlipX(true);
      } else if (this.player.body.velocity.x <= 0) {
        this.player.anims.play('jump');
        this.player.setFlipX(false);
      }
    }
  }

  sneezeJump() {
    this.player.setVelocityY(-225);
    this.sneeze.play({
      mute: false,
      volume: 0.3,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0,
    });
    this.player.anims.stop();
    this.player.anims.play('sneezeJump');

    if (this.player.body.velocity.x >= 0) {
      this.player.setFlipX(false);
    } else {
      this.player.setFlipX(true);
    }
  }

  hitSpike() {
    if (this.isHurt) {
      return;
    }
    this.isHurt = true;
    this.player.setTint(0xff0000);
    this.heroOuch.play();

    this.time.addEvent({
      delay: this.COOL_DOWN_TIMER,
      callback: () => {
        this.isHurt = false;
        this.player.clearTint();
      },
    });

    const first = this.hearts.getChildren().pop();
    first.destroy();

    if (this.hearts.getChildren().length == 0) {
      this.music.stop();
      this.scene.start('preloader');
      this.isHurt = false;
    }
  }

  beatVillain() {
    this.villain.setVelocityX(300);
    this.gameClearText.visible = true;
    this.villainOuch.play({
      mute: false,
      volume: 0.5,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0,
    });

    this.time.addEvent({
      delay: 1500,
      callback: () => {
        this.music.stop();
        this.gameClear.play({
          mute: false,
          volume: 0.1,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: false,
          delay: 0,
        });
        gameOver = true;
      },
    });
  }
}
