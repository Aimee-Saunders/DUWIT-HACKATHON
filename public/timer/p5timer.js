import { useRef, useEffect } from 'react';
import p5 from 'p5';
import {
  TIMER_DURATION_SECONDS,
  SPARKLE_DURATION_MS,
  CAR_WIDTH,
  CAR_HEIGHT,
  CAR_Y_OFFSET,
} from './timerConfig';
import { createTimerSketch } from './timerSketch';

const P5Timer = () => {
  const sketchRef = useRef();

  useEffect(() => {
    const sketch = createTimerSketch({
      durationSeconds: TIMER_DURATION_SECONDS,
      sparkleDurationMs: SPARKLE_DURATION_MS,
      carWidth: CAR_WIDTH,
      carHeight: CAR_HEIGHT,
      carYOffset: CAR_Y_OFFSET,
      carImagePath: '/f1car.png',
    });

    if (sketchRef.current) {
      sketchRef.current.innerHTML = '';
    }

    const p5Instance = new p5(sketch, sketchRef.current);
    return () => p5Instance.remove();
  }, []);

  return <div ref={sketchRef} style={{ width: 900, height: 220 }}></div>;
};

export default P5Timer;
