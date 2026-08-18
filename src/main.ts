import 'phaser';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 300 },
      debug: true
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

function preload(this: Phaser.Scene) {}

function create(this: any) {
  this.add.text(400, 300, 'JumpUp', { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5);

  this.physics.world.setBounds(0, 0, 800, 10000);

  // Create a player
  this.player = this.add.rectangle(400, 500, 32, 32, 0x00ff00);
  this.physics.add.existing(this.player);
  const pBody = this.player.body as any;
  pBody.setCollideWorldBounds(true);

  // Platforms group
  this.platforms = this.physics.createGroup({
    allowGravity: false,
    immovable: true
  });

  // Initial platform
  const initialPlatform = this.add.rectangle(400, 550, 200, 20, 0xffffff);
  this.physics.add.existing(initialPlatform, true);
  this.platforms.add(initialPlatform);

  // Collision between player and platforms
  this.physics.add.collider(this.player, this.platforms, (p: any, plat: any) => {
    if (p.body.touching.down || p.body.touching.up) {
      p.body.setVelocityY(-400); // Bounce up
    }
  });

  // Initial platform
  const initialPlatform = this.add.rectangle(400, 550, 200, 20, 0xffffff);
  this.physics.add.existing(initialPlatform, true);
  this.platforms.add(initialPlatform);

  // Collision between player and platforms
  this.physics.add.collider(this.player, this.platforms, (p: any, plat: any) => {
    if (p.body.touching.down || p.body.touching.up) {
      p.body.setVelocityY(-400); // Bounce up
    }
  });

  // Input setup
  this.cursors = this.input.keyboard.createCursorKeys();
}

function update(this: any) {
  if (this.cursors.left.isDown) {
    this.player.body.setVelocityX(-200);
  } else if (toThis.cursors.right.isDown) {
    this.player.body.setVelocityX(200);
  } else {
    this.player.body.setVelocityX(0);
  }

  // Camera follows player vertical movement
  if (this.player.y < 300) {
    this.cameras.main.scrollY = -this.player.y + 300;
  }
}
