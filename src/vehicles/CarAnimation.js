export default class CarAnimation {
  constructor(car) {
    this.car = car;
    this.currentFrame = 0;
  }

  update(heading) {
    let angle = heading;

    if (angle < 0) {
      angle += Math.PI * 2;
    }

    const frameIndex = Math.round(angle / ((Math.PI * 2) / 24)) % 24;

    if (frameIndex !== this.currentFrame) {
      this.currentFrame = frameIndex;
      this.car.setFrame(`car${frameIndex}`);
    }
  }
}
