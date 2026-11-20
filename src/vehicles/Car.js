import Phaser from "phaser";

import CarPhysics from "./CarPhysics.js";
import CarAnimation from "./CarAnimation.js";

import { CAR_TEXTURE, CAR_SCALE } from "../settings/gameSettings.js";

export default class Car {
  constructor(scene, x, y) {
    this.scene = scene;

    // Vehicle state
    this.speed = 0;
    this.heading = 0;

    // Frame 0 faces right
    this.sprite = scene.add.image(x, y, CAR_TEXTURE, "car0");

    this.sprite.setScale(CAR_SCALE);

    this.animation = new CarAnimation(this.sprite);
  }

  update(input, dt) {
    CarPhysics.update(this, input, dt);

    this.animation.update(this.heading);

    this.updateBounds();
  }

  updateBounds() {
    const { width, height } = this.scene.scale;

    const halfWidth = (this.sprite.frame.width * CAR_SCALE) / 2;

    const halfHeight = (this.sprite.frame.height * CAR_SCALE) / 2;

    this.sprite.x = Phaser.Math.Clamp(this.x, halfWidth, width - halfWidth);

    this.sprite.y = Phaser.Math.Clamp(this.y, halfHeight, height - halfHeight);

    // Keep the internal vehicle position synchronized
    this.x = this.sprite.x;
    this.y = this.sprite.y;
  }

  get x() {
    return this.sprite.x;
  }

  set x(value) {
    this.sprite.x = value;
  }

  get y() {
    return this.sprite.y;
  }

  set y(value) {
    this.sprite.y = value;
  }

  get currentSpeed() {
    return this.speed;
  }
}
