import {
  SPARKLE_DURATION_MS,
  CAR_WIDTH,
  CAR_HEIGHT,
  CAR_Y_OFFSET,
} from './timerConfig.js';

import { createTimerSketch } from './timerSketch.js';

const mount = document.getElementById('sketch');

if (mount && window.p5) {
  const sketch = createTimerSketch({
    sparkleDurationMs: SPARKLE_DURATION_MS,
    carWidth: CAR_WIDTH,
    carHeight: CAR_HEIGHT,
    carYOffset: CAR_Y_OFFSET,
    carImagePath: '../f1car.png',
  });

  mount.innerHTML = '';
  new window.p5(sketch, mount);
}
