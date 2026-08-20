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
  this.score = 0;
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
  this.platforms = this.physics.add.group({ allowGravity: false, immovable: true });
  this.enemies = this.physics.add.group({ allowGravity: false, immovable: true });
  this.powerups = this.physics.add.group({ allowGravity: false, immovable: true });

  // Initial setup
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
    this.cameras.main.shake(500, 0.02); // Screen shake on death!
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

  // Add first set of platforms
  for (let i = 1; i < 5; i++) {
    this.spawnPlatform(400 + (i * 20 - 40), 550 - (i * 100));
  }

  // Collision detection: Player vs Platforms (Bounce)
  this.physics.add.collider(this.player, this.platforms, (p: any, plat: any) => {
    if (p.body.velocity.y > 0 && p.y <= plat.y + 10) {
      p.body.setVelocityY(-400); // Bounce!

      // Add "juice": Squash and stretch effect on impact
      this.tweens.add({
        targets: p,
        scaleX: 1.2,
        scaleY: 0.8,
        duration: 50,
        yoyo: true,
        repeat: 0
      });
    }
  }, undefined, this);

  // Collision detection: Player vs Enemies (Game Over or Bounce if Shielded)
  this.physics.add.overlap(this.player, this.enemies, (p: any, e: any) => {
    if ((p as any).isShielded) {
      e.destroy(); // Shield absorbs the hit!
      this.score += 50;
    } else {
      this.events.emit('game-over');
    }
  }, undefined, this);

  // Collision detection: Player vs Powerups (Activation)
  this.physics.add.overlap(this.player, this.powerups, (p: any, pw: any) => {
     const type = (pw as any).type;
     
     // Add "juice": Scale effect on collection
     this.tweens.add({
       targets: pw,
       scale: 1.5,
       duration: 100,
       onComplete: () => {
         if (type === 'spring') {
           p.body.setVelocityY(-600); // Massive bounce!
         } else if (type === 'shield') {
           (p as any).isShielded = true;
           setTimeout(() => { (p as any).isShielded = false; }, 5000);
         }
         pw.destroy();
         this.score += 100;
         this.scoreText.setText(`Score: ${this.score}`);
       }
     });
  }, undefined, this);
}

function spawnPlatform(this: any, x: number, y: number) {
  const width = 150;
  const platform = this.add.rectangle(x, y, width, 20, 0xffffff);
  this.physics.add.existing(platform, true);
  this.platforms.add(platform);

  // Randomly vary platform color (Phase 3)
  const colors = [0xffffff, 0xcccccc, 0xe6e6e6, 0xdddddd];
  const selectedColor = Phaser.Utils.Array.GetRandom(colors);
  platform.setFillStyle(selectedColor);

  // Random Enemy Spawn (20% chance) - Phase 2
  if (Math.random() < 0.2) {
    const enemyColor = Math.random() > 0.5 ? 0xff0000 : 0x8800ff;
    const enemy = this.add.rectangle(x, y - 32, 24, 24, enemyColor);
    this.physics.add.existing(enemy);
    this.enemies.add(enemy as any);
    enoughEnemyLogic.call(this, enemy, x);
  }
  // Random Powerup Spawn (10% chance) - Phase 2
  if (Math.random() < 0.1) {
    const pwType = Math.random() > 0.5 ? 'spring' : 'shield';
    const color = pwType === 'spring' ? 0xffff00 : 0x00ffff;
    const pw = this.add.circle(x, y - 40, 10, color);
    this.physics.add.existing(pw, true);
    (pw as any).type = pwType; // Attach type to the object
    this.powerups.add(pw as any);
  }

  this.nextPlatformY = y;
}

function enoughEnemyLogic(this: any, enemy: any, x: number) {
    // Temporary placeholder for the patrol movement implementation
    this.tweens.add({
        targets: enemy,
        x: x + 60,
        duration: 2000,
        yoyo: true,
        repeat: -1
    });
    return enemy;
}

function update(this: any) {
  if (this.isGameOver) return;

  // Horizontal Movement
  const speed = 200;
  if (this.cursors.left.isDown) {
    this.player.body.setVelocityX(-speed);
  } else if (this.cursors.right.isDown) {
    this.player.body.setVelocityX(speed);
  } else {
    this.player.body.setVelocityX(0);
  }

  // Camera/Scrolling logic: Spawn platforms as player ascends
  if (this.player.y < 300) {
    const newY = this.nextPlatformY - 100;
    const targetX = Phaser.Math.Between(250, 550);
    this.spawnPlatform(targetX, newY);
  }

  // Score calculation based on height
  const currentScore = Math.floor(Math.max(0, 500 - this.player.y));
  if (currentScore > this.score) {
    this.score = currentScore;
    this.scoreText.setText(`Score: ${this.score}`);
  }

  // Check for death by falling out of bounds
  if (this.player.y > 600) {
    this.events.emit('game-over');
  }

  // Visual feedback for shield
  if ((this.player as any).isShielded) {
    this.player.setTint(0x00ffff); // Cyan glow when shielded
  } else {
    this.player.clearTint(); // Reset tint
  }
}

function restartGame(this: any) {
  this.scene.restart();
}
