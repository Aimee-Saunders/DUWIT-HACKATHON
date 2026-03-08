export const createTimerSketch = ({
  sparkleDurationMs,
  carWidth,
  carHeight,
  carYOffset,
  carImagePath,
}) => {
  return (p) => {
    let f1Car;
    let sparkles = [];
    let finished = false;
    let finishedAt = 0;
    const barY = 140;
    const startX = 50 + carWidth / 2;
    const endX = 850 - carWidth / 2;

    p.preload = () => {
      f1Car = p.loadImage(carImagePath);
    };

    p.setup = () => {
      p.createCanvas(900, 220);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(32);
    };
    const createSparkles = (x, y, count = 12) => {
      for (let i = 0; i < count; i++) {
        sparkles.push({
          x,
          y,
          vx: p.random(-3, 3),
          vy: p.random(-3, 3),
          life: p.random(45, 85),
        });
      }
    };

    const drawSparkles = () => {
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const sparkle = sparkles[i];
        sparkle.x += sparkle.vx;
        sparkle.y += sparkle.vy;
        sparkle.vy += 0.05;
        sparkle.life -= 1;

        p.noStroke();
        p.fill(255, 215, 0, sparkle.life * 3);
        p.circle(sparkle.x, sparkle.y, 6);

        if (sparkle.life <= 0) sparkles.splice(i, 1);
      }
    };

    p.draw = () => {
      p.background(247, 240, 230);

      const now = new Date();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      const remaining = 3600 - (minutes * 60 + seconds);
      const progress = remaining / 3600;

      const currentX = p.map(progress, 0, 1, startX, endX);

      const minsLeft = Math.floor(remaining / 60);
      const secsLeft = remaining % 60;

      p.noStroke();
      p.fill(0);
      p.text(
        `Time left in hour: ${minsLeft}:${secsLeft
          .toString()
          .padStart(2, "0")}`,
        p.width / 2,
        50
      );

      p.stroke(232, 137, 114);
      p.strokeWeight(10);
      p.line(startX, barY, endX, barY);
      p.stroke(180);
      p.strokeWeight(10);
      p.line(currentX, barY, endX, barY); 

      if (f1Car) {
        p.imageMode(p.CENTER);
        p.image(f1Car, currentX, barY - carYOffset, carWidth, carHeight);
      } else {
        p.noStroke();
        p.fill(232, 137, 114);
        p.circle(currentX, barY - carYOffset, carHeight * 0.8);
      }

      if (remaining <= 0 && !finished) {
        finished = true;
        finishedAt = p.millis();
        createSparkles(currentX, barY - carYOffset, 60);
      }

      if (finished) {
        if (p.millis() - finishedAt <= sparkleDurationMs) {
          createSparkles(startX, barY - carYOffset, 3);
        }
        drawSparkles();
        if (p.millis() - finishedAt > sparkleDurationMs && sparkles.length === 0) {
          finished = false;
        }
      }
    };
  };
};
