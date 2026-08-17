# Game Development Plan: JumpUp

## 1. Overview
"JumpUp" is a vertical platformer game where the player controls a character jumping on platforms to ascend as high as possible. The goal is to achieve the highest score by avoiding enemies and collecting powerups while continuously climbing.

## 2. Core Gameplay Mechanics
- **Player Movement**: 
  - Automatic upward jump when hitting a platform.
  - Gravity pulling the player down.
  - Horizontal movement (Left/Right) via keyboard or touch.
- **Procedural Generation**:
  - Platforms are generated continuously above the viewport as the player climbs.
  - Difficulty increases as the score increases (platforms become fewer or more sparse).
- **Collision System**:
  - Detection for Player $\leftrightarrow$ Platform (upward bounce).
  - Detection for Player $\leftrightarrow$ Enemy (game over).
  - Detection for Player $\leftrightarrow$ Powerup (activation).
- **Scoring**:
  - Score is tied to the maximum height reached.
  - Bonus points for hitting specific powerups.

## 3. Features
### Enemies
- **Patroller**: Moves horizontally on a fixed platform.
- **Stinger**: Dives towards the player when they are within range.

### Powerups
- **Spring**: Increases jump height significantly for one bounce.
- **Shield**: Provides temporary invulnerability to enemies.
- **Jetpack**: Briefly propels the player upward automatically.

### UI/HUD
- Current Score Display.
- High Score Display.
- Game Over Screen (with Restart option).

## 4. Technical Stack
- **Language**: TypeScript
- **Game Engine**: Phaser 3 (or Vanilla Canvas for a lightweight approach)
- **Bundler**: Vite
- **Unit Testing**: Vitest (for logic, physics, and state transitions)
- **End-to-End (E2E) Testing**: Playwright (for simulating user input and verifying game state/score)

## 5. Architecture
- **Core Engine**: Man la game loop, physics integration, and rendering.
- **Entity Component System (ECS)**:
  - `Player`: Handles movement and input.
  - `Platform`: Handles position and generation logic.
  - `Enemy`: Handles AI patterns.
  - `Powerup`: Handles effect application.
- **State Management**: Tracking score, game state (Playing, Paused, GameOver), and active powerups.

## 6. Development Roadmap

### Phase 1: Prototype (Foundation)
- [ ] Setup project structure with Vite and TypeScript.
- [ ] Implement basic physics (gravity and jumping).
- [ ] Implement basic platform generation.
- [ ] Unit tests for basic physics calculations.

### Phase 2: Gameplay Expansion
- [ ] Implement horizontal player movement.
- [ ] Implement Enemy logic and collision detection.
- [ ] Implement Powerup system and effects.
- [ ] Implement scoring system.
- [ ] Unit tests for enemies, powerups, and scoring.

### Phase 3: Polishing & UI
- [ ] Develop HUD (Score, High Score).
- [ ] Create Game Over and Restart flow.
- [ ] Add basic visuals/animations.
- [ ] Implement E2E test suite with Playwright.

## 7. Testing Strategy

### Unit Tests (Vitest)
- **Physics**: Verify gravity, velocity, and jump impulse calculations.
- **Collision**: Test collision detection between various entity types.
- **Score**: Ensure score increments correctly based on height/events.
- **AI**: Validate enemy movement patterns and state transitions.

### End-to-End Tests (Playwright)
- **Game Start**: Verify the game loads and the player is initialized.
- **Input Simulation**: Simulate key presses (Left/Right) and verify player position change in the DOM/Canvas context.
- **Progression**: Ensure score increases as the player "ascends".
- **Game Over Condition**: Trigger an enemy collision and verify the Game Over screen appears.
- **Powerup Usage**: Verify that interacting with a powerup modifies game state (e.g., shield active).
