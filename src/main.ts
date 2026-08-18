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
      debug: false
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
  // Initialize fundamental state
  this.isGameOver = false;
  this.highScore = 0;
  this.nextPlatformY = 450;
  this.startPlayerY = 500;

  // UI Elements
  this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#ffffff' });
  this.highScoreText = this.add.text(16, 40, 'High Score: 0', { fontSize: '24px', fill: '#ffffff' });
  this.gameOverText = this.add.text(400, 300, 'GAME OVER\nClick to Restart', { 
    fontSize: '48px', 
    color: '#ff0000', 
    align: 'center', 
    fontWeight: 'bold' 
  }).setOrigin(0.5).setVisible(false);

  // Physics Groups
  this.platforms = this.physics.createGroup({ allowGravity: false, immovable: true });
  this.enemies = this.physics.createGroup({ allowGravity: false, immovable: true });
  this.powerups = this.physics.createGroup({ allowGravity: false, immovable: true });

  // Start life cycle
  this.initGameplay();

  // Global Listeners
  this.input.on('pointerdown', () => {
    if (this.isGameOver) {
      this.restartGame();
    }
  });

  this.events.on('game-over', () => {
    this.isGameOver = true;
    this.gameOverText.setVisible(true);
  });

  // Input setup
  this.cursors = this.input.keyboard.createCursorKeys();
}

function initGameplay(this: any) {
  // Create Player
  this.player = this.add.rectangle(400, 500, 32, 32, 0x00ff00);
  this.physics.add.existing(this.player);
  const pBody = this.player.body as any;
  pBody.setCollideWorldBounds(true);

  // Initial Platform
  const initialPlatform = this.add.rectangle(400, 550, 200, 20, 0xffffff);
  this.physics.add.existing(initialPlatform, true);
  this.platforms.add(initialPlatform);

  // Collision: Player vs Platforms (Bounce)
  this.physics.add.collider(this.player, this.platforms, (p: any, plat: any) => {
    if (p.body.touching.down) {
      p.body.setVelocityY(-400);
      // Squash animation on landing
      this.tweens.add({
        targets: p,
        scaleX: 1.3,
        scaleY: 0.7,
        duration: 100,
        yoyo: true
      });
    }
  });

  // Collision: Player vs Powerups (Spring Jump)
  this.physics.add.overlap(this.player, this.powerups, (p: any, pow: any) => {
    pow.destroy();
    const pBody = p.body as any;
    pBody.setVelocityY(-600);
    // Stretch animation on super jump
    this.tweens.add({
      targets: p,
      scaleX: 0.7,
      scaleY: 1.5,
      duration: 200,
      yoyo: true
    });
  });

  // Collision: Player vs Enemies (Death)
  this.physics.add.overlap(this.player, this.enemies, () => {
    this.events.emit('game-over');
  });
}

function update(this: any) {
  if (this.isGameOver) return;

  // Player Input
  if (this.cursors.left.isDown) {
    this.player.body.setVelocityX(-200);
  } else if (this.cursors.right.isDown) {
    this.player.body.setVelocityX(200);
  } else {
    this.player.body.setVelocityX(0);
  }

  // Procedural Platform Generation
  if (this.player.y < this.nextPlatformY + 400) {
    const x = Phaser.Math.Between(100, 700);
    const platform = this.add.rectangle(x, this.nextPlatformY, 150, 20, 0xffffff);
    this.physics.add.existing(platform, true);
    this.platforms.add(platform);

    // Random Enemy Spawn (20% chance)
    if (Math.random() < 0.2) {
      const enemyColor = Math.random() > 0.5 ? 0xff0000 : 0x8800ff; // Red or Purple enemies
      const enemy = this.add.rectangle(x, this.nextPlatformY - 32, 24, 24, enemyColor);
      this.physics.add.existing(enemy);
      this.enemies.add(enemy);
      this.tweens.add({
        targets: enemy,
        x: x + 50,
        duration: 1000,
        yoyo: true,
        repeat: -1
      });
    }

    // Random Powerup Spawn (15% chance)
    if (Math.random() < 0.15) {
      const powerup = this.add.circle(x, this.nextPlatformY - 30, 12, 0xffff00);
      this.physics.add.existing(powerup, true);
      this.powerups.add(powerup);
    }

    // Advance spawn point up
    this.nextPlatformY -= Phaser.Math.Between(150, 250);
  }

  // Score Tracking
  const currentScore = Math.max(0, Math.floor((this.startPlayerY - this.player.y) / 10));
  if (currentScore > this.highScore) {
    this.highScore = currentScore;
    this.highScoreText.setText(`High Score: ${this.highScore}`);
  }
  this.scoreText.setText(`Score: ${currentScore}`);

  // Camera Follow
  if (this.player.y < this.cameras.main.scrollY + 300) {
    this.cameras.mutableScrollY = this.player.y - 300;
  }
}

function restartGame(this: any) {
    // Re-dispatching a fresh scene to reset state correctly
  this.scene.restart();
}
