import { expect, test } from 'vitest';

test('gravity effect on velocity', () => {
  const gravity = 300;
  let velocityY = 0;
  const deltaTime = 1/60;
  
  // Simulate one frame
  velocityY += gravity * deltaTime;
  
  expect(velocityY).toBeCloseTo(5, 1);
});

test('jump impulse', () => {
  let velocityY = 0;
  const jumpImpulse = -350;
  
  // Simulate jump
  velocityY += jumpImpulse;
  
  expect(velocityY).toBe(-350);
});
