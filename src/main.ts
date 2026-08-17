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

function preload(this: Phaser.Scene) {
  // Preload assets here
}

function create(this: Phaser.Scene) {
  this.add.text(400, 300, 'JumpUp Engine Loading...', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);

  // Physics group for platforms
  this.physics.world.setBounds(0, 0, 800, 600);

  // Create a player
  const player = this.add.rectangle(400, 500, 32, 32, 0x00ff00);
  this.physics.add.existing(player);
  const playerBody = player.body as Phaser.Physics.Arcade.Body;
  playerBody.setCollideWorldBounds(true);

  // Create a platform
  const platform = this.add.rectangle(400, 550, 200, 20, 0xffffff);
  this.physics.add.existing(platform, true); // static body

  // Collision detection
  this.physics.add.collider(player, platform);

  // Input
  this.input.keyboard?.on('keydown', (event: any) => {
    if (event.code === 'Space') {
      if (playerBody.touching.down) {
        playerBody.setVelocityY(-350);
      }
    }
  });
}

function update(this: Phaser.Scene) {
  // Game loop logic here
}
