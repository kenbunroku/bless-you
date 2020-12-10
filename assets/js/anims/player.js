const createCharacterAnims = (anims) => {
  anims.create({
    key: 'turn',
    frames: [{ key: 'sickHero', frame: 1 }],
    frameRate: 20,
  });

  anims.create({
    key: 'walk',
    frames: anims.generateFrameNumbers('sickHero', {
      start: 8,
      end: 13,
    }),
    frameRate: 10,
    repeat: -1,
  });

  anims.create({
    key: 'jump',
    frames: [{ key: 'sickHero', frame: 16 }],
    frameRate: 10,
    repeat: 0,
  });

  anims.create({
    key: 'sneezeJump',
    frames: [{ key: 'sickHero', frame: 26 }],
    frameRate: 10,
    repeat: -1,
  });

  anims.create({
    key: 'sneezeBar',
    frames: anims.generateFrameNumbers('sneezeBar', { start: 0, end: 3 }),
    frameRate: 2,
    repeat: -1,
  });
};

export { createCharacterAnims };
