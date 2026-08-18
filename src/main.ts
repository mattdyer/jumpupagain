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

  // HUD
  this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#ffffff' });
  this.highScore = 0;

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

  // Enemies group
  this.enemies = this.physics.createGroup({
    allowGravity: false,
    immovable: true
  });

  // Powerups group
  this.powerups = this.physics.createGroup({
    allowGravity: false,
    immovable: true
  });

  // Initial platform
  const initialPlatform = this.add.rectangle(400, 550, 200, 20, 0xffffff);
  this.physics.add.existing(initialPlatform, true);
  this.platforms.add(initialPlatform);
  
  // Track highest platform Y to know when to spawn more
  this.nextPlatformY = 450;
  this.startPlayerY = 500;

  // Collision between player and platforms
  this.physics.add.collider(this.player, this.platforms, (p: any, plat: any) => {
    if (p.body.touching.down) {
      p.body.setVelocityY(-400); // Bounce up
    }
  });

  // Collision between player and powerups (Phase 2)
  this.physics.add.overlap(this.player, this.powerups, (p: any, pow: any) => {
    pow.destroy(); // Consume powerup
    const pBody = p.body as any;
    pBody.setVelocityY(-600); // Super jump!
  });

  // Collision between player and enemies
  this.physics.add.overlap(this.player, this.enemies, (p: any, e: any) => {
    // Logic for death would trigger here
    console.log("Game Over!");
  });

  // Input setup
  this.cursors = this.input.keyboard.createCursorKeys();
}

function update(this: any) {
  if (this.cursors.left.isDown) {
    this.player.body.setVelocityX(-200);
  } else if (this.cursors.right.isDown) {
    this.player.body.setVelocityX(200);
  } else {
    this.player.body.setVelocityX(0);
  }

  // Procedural Generation: Spawn new platforms ahead of the player
  if (this.player.y < this.nextPlatformY + 400) {
    const x = Phaser.Math.Between(100, 700);
    const platform = this.add.rectangle(x, this.nextPlatformY, 150, 20, 0xffffff);
    this.physics.add.existing(platform, true);
    this.platforms.add(platform);
    
    // Randomly spawn an enemy on some platforms (Phase 2)
    if (Math.random() < 0.2) {
      const enemy = this.add.rectangle(x, this.nextPlatformY - 32, 24, 24, 0xff0000);
      this.physics.add.existing(enemy);
      const enemyBody = enemy.body as any;
      enemyBody.setCollideWorldBounds(false);
      
      // Add to a group for collision detection
      if (!this.enemies) this.enemies = this.physics.createGroup({ allowGravity: false, immovable: true });
      this.enemies.add(enemy);

      // Simple Patroller AI: move left and right
      this.tweens.add({
        targets: enemy,
        x: x + 50,
        duration: 1000,
        yoyo: true,
        repeat: -1
      });
    }

    // Randomly spawn a powerup on some platforms (Phase 2)
    if (Math.random() < 0.15) {
      const powerup = this.add.circle(x, this.nextPlatformY - 30, 12, 0xffff00); // Yellow for Spring
      this.physics.add.existing(powerup, true);
      if (!this.powerups) this.powerups = this.physics.createGroup({ allowGravity: false, immovable: true });
      this.powerups.add(powerup);
    }

    // Move the next spawn point up
    this.nextPlatformY -= Phaser.Math.Between(150, 250);
  }

  // Scoring: Update score based on height climbed
  const currentScore = Math.max(0, Math.floor((this.startPlayerY - this.player.y) / 10));
  if (currentScore > this.highScore) {
    this.highScore = currentScore;
  }
  this.scoreText.setText(`Score: ${currentScore} | High as: ${this.highScore}`);

  // Camera follows player vertical movement
  if (this.player.y < this.cameras.main.scrollY + 300) {
    this.cameras.mutableScrollY = this.player.y - 300;
  }
}
