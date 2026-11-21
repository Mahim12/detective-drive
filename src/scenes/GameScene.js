import Phaser from "phaser";

import Car from "../vehicles/Car.js";
import PlayerInput from "../controls/PlayerInput.js";

import { carFrames } from "../assets/carFrames.js";

import {
  CAR_TEXTURE,
  CAR_IMAGE_PATH,
  BACKGROUND_COLOR,
} from "../settings/gameSettings.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image(CAR_TEXTURE, CAR_IMAGE_PATH);
  }

  create() {
    const { width, height } = this.scale;

    // Allow two simultaneous touch inputs
    this.input.addPointer(1);

    // Background
    this.background = this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      Phaser.Display.Color.HexStringToColor(BACKGROUND_COLOR).color,
    );

    // Register sprite sheet frames
    const texture = this.textures.get(CAR_TEXTURE);

    carFrames.forEach(([x, y, w, h], index) => {
      texture.add(`car${index}`, 0, x, y, w, h);
    });

    // Create car
    this.car = new Car(this, width / 2, height / 2);

    // Create player controls
    this.playerInput = new PlayerInput(this);

    // Speed display
    this.speedText = this.add.text(20, 20, "Speed: 0", {
      fontSize: "20px",
      color: "#ffffff",
    });

    // Remember dimensions for proportional repositioning
    this.previousWidth = width;
    this.previousHeight = height;

    // Handle viewport changes
    this.scale.on("resize", this.handleResize, this);
  }

  handleResize(gameSize) {
    const { width, height } = gameSize;

    // Resize background
    this.background.setPosition(width / 2, height / 2).setSize(width, height);

    // Preserve the car's relative position
    this.car.x = (this.car.x / this.previousWidth) * width;
    this.car.y = (this.car.y / this.previousHeight) * height;

    this.car.updateBounds();

    // Reposition joysticks and their labels
    this.playerInput.joystick.resize(width, height);

    // Reposition speed display
    this.speedText.setPosition(20, 20);

    // Store new dimensions
    this.previousWidth = width;
    this.previousHeight = height;
  }

  update(time, delta) {
    const dt = delta / 1000;

    const input = this.playerInput.getInput();

    this.car.update(input, dt);

    this.speedText.setText(
      `Speed: ${Math.round(Math.abs(this.car.currentSpeed))}`,
    );
  }
}
