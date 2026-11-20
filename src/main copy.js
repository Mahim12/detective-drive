import Phaser from "phaser";
import VirtualJoystickPlugin from "phaser4-rex-plugins/plugins/virtualjoystick-plugin.js";

const carFrames = [
  [11, 36, 308, 153],
  [339, 30, 307, 169],
  [670, 21, 302, 193],
  [1012, 14, 279, 208],

  [45, 253, 247, 219],
  [394, 249, 203, 226],
  [744, 250, 167, 225],
  [1045, 250, 201, 226],

  [40, 498, 244, 220],
  [351, 500, 283, 210],
  [670, 508, 308, 192],
  [991, 516, 320, 170],

  [9, 766, 319, 155],
  [338, 767, 318, 166],
  [675, 770, 306, 177],
  [1013, 765, 285, 193],

  [45, 1006, 256, 202],
  [396, 1003, 211, 207],
  [745, 1002, 162, 208],
  [1050, 1003, 194, 206],

  [41, 1249, 239, 202],
  [352, 1253, 276, 193],
  [665, 1258, 302, 176],
  [993, 1257, 308, 162],
];

const CAR_SCALE = 0.42;

const MAX_FORWARD_SPEED = 250;
const MAX_REVERSE_SPEED = 100;

const ACCELERATION = 220;
const BRAKING = 400;
const FRICTION = 100;
const TURN_RATE = 2.2;

class GameScene extends Phaser.Scene {
  preload() {
    this.load.image("carSheet", "/car-sheet.png");
  }

  create() {
    const { width, height } = this.scale;

    // Allow two simultaneous touch inputs
    this.input.addPointer(1);

    this.add.rectangle(width / 2, height / 2, width, height, 0x263238);

    // Register sprite sheet frames
    const texture = this.textures.get("carSheet");

    carFrames.forEach(([x, y, w, h], index) => {
      texture.add(`car${index}`, 0, x, y, w, h);
    });

    // Car
    this.car = this.add.image(width / 2, height / 2, "carSheet", "car0");

    this.car.setScale(CAR_SCALE);

    // Frame 0 faces right
    this.carHeading = 0;
    this.carSpeed = 0;
    this.currentFrame = 0;

    const joystickPlugin = this.plugins.get("rexVirtualJoystick");

    // LEFT JOYSTICK: DIRECTION / STEERING
    this.speedJoystick = joystickPlugin.add(this, {
      x: width - 100,
      y: height - 110,
      radius: 65,

      base: this.add.circle(0, 0, 65, 0x888888, 0.45),

      thumb: this.add.circle(0, 0, 28, 0xffffff, 0.8),

      dir: "up&down",
      forceMin: 0,
      fixed: true,
    });

    // RIGHT JOYSTICK: SPEED
    this.directionJoystick = joystickPlugin.add(this, {
      x: 100,
      y: height - 110,
      radius: 65,

      base: this.add.circle(0, 0, 65, 0x888888, 0.45),

      thumb: this.add.circle(0, 0, 28, 0xffffff, 0.8),

      dir: "left&right",
      forceMin: 0,
      fixed: true,
    });

    // Keyboard controls
    this.keys = this.input.keyboard.createCursorKeys();
  }

  update(time, delta) {
    const dt = delta / 1000;

    // --------------------------------
    // 1. Read the two joysticks
    // --------------------------------

    // Left joystick controls acceleration/reverse
    const joystickThrottle =
      (this.speedJoystick.up ? 1 : 0) - (this.speedJoystick.down ? 1 : 0);

    // Right joystick controls steering
    const joystickSteering =
      (this.directionJoystick.right ? 1 : 0) -
      (this.directionJoystick.left ? 1 : 0);

    // Keyboard fallback
    const keyboardThrottle =
      (this.keys.up.isDown ? 1 : 0) - (this.keys.down.isDown ? 1 : 0);

    const keyboardSteering =
      (this.keys.right.isDown ? 1 : 0) - (this.keys.left.isDown ? 1 : 0);

    const throttle = Math.max(
      -1,
      Math.min(1, joystickThrottle + keyboardThrottle),
    );

    const steering = Math.max(
      -1,
      Math.min(1, joystickSteering + keyboardSteering),
    );

    // --------------------------------
    // 2. Acceleration and braking
    // --------------------------------

    if (throttle > 0) {
      if (this.carSpeed < 0) {
        // Brake before moving forward
        this.carSpeed = Math.min(0, this.carSpeed + BRAKING * dt);
      } else {
        this.carSpeed += ACCELERATION * throttle * dt;
      }
    } else if (throttle < 0) {
      if (this.carSpeed > 0) {
        // Brake before reversing
        this.carSpeed = Math.max(0, this.carSpeed - BRAKING * dt);
      } else {
        this.carSpeed += ACCELERATION * throttle * dt;
      }
    } else {
      // Friction when speed joystick is released
      if (this.carSpeed > 0) {
        this.carSpeed = Math.max(0, this.carSpeed - FRICTION * dt);
      } else if (this.carSpeed < 0) {
        this.carSpeed = Math.min(0, this.carSpeed + FRICTION * dt);
      }
    }

    this.carSpeed = Phaser.Math.Clamp(
      this.carSpeed,
      -MAX_REVERSE_SPEED,
      MAX_FORWARD_SPEED,
    );

    // --------------------------------
    // 3. Steering
    // --------------------------------

    const speedRatio = Math.abs(this.carSpeed) / MAX_FORWARD_SPEED;

    this.carHeading +=
      steering * TURN_RATE * speedRatio * Math.sign(this.carSpeed) * dt;

    this.carHeading = Phaser.Math.Angle.Wrap(this.carHeading);

    // --------------------------------
    // 4. Select sprite orientation
    // --------------------------------

    let angle = this.carHeading;

    if (angle < 0) {
      angle += Math.PI * 2;
    }

    const frameIndex = Math.round(angle / ((Math.PI * 2) / 24)) % 24;

    if (frameIndex !== this.currentFrame) {
      this.currentFrame = frameIndex;
      this.car.setFrame(`car${frameIndex}`);
    }

    // --------------------------------
    // 5. Move car
    // --------------------------------

    this.car.x += Math.cos(this.carHeading) * this.carSpeed * dt;

    this.car.y += Math.sin(this.carHeading) * this.carSpeed * dt;

    // --------------------------------
    // 6. Screen boundaries
    // --------------------------------

    const halfWidth = (this.car.frame.width * CAR_SCALE) / 2;

    const halfHeight = (this.car.frame.height * CAR_SCALE) / 2;

    this.car.x = Phaser.Math.Clamp(
      this.car.x,
      halfWidth,
      this.scale.width - halfWidth,
    );

    this.car.y = Phaser.Math.Clamp(
      this.car.y,
      halfHeight,
      this.scale.height - halfHeight,
    );

    // --------------------------------
    // 7. Speed display
    // --------------------------------
  }
}

const config = {
  type: Phaser.AUTO,

  width: 800,
  height: 600,

  backgroundColor: "#263238",

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  plugins: {
    global: [
      {
        key: "rexVirtualJoystick",
        plugin: VirtualJoystickPlugin,
        start: true,
      },
    ],
  },

  scene: GameScene,
};

new Phaser.Game(config);
