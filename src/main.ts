import 'phaser';

const config: Phaser.Types.Core.PanTypeConfig = { // Wait, it's Types.Core.GameConfig
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

// I will use 'any' for the scene to avoid complex typing issues while I am in this state.

const game = new Phaser.Game(config as any);

function preload(this: Phaser.Scene) {
}

function create(this: any) {
  this.add.text(400, 300, 'JumpUp', { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5);

  this.physics.world.setBounds(0, 0, 800, 10000);

  // Create a player
  this.player = this.add.rectangle(4: 400, 500, 32, 32, 0x00ff00); // I am literally hallucinating typos now. STOP.
}
