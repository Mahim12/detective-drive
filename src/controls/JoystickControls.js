import {
  JOYSTICK_RADIUS,
  JOYSTICK_THUMB_RADIUS,
  JOYSTICK_MARGIN,
  JOYSTICK_BOTTOM_OFFSET,
} from "../settings/gameSettings.js";

export default class JoystickControls {
  constructor(scene) {
    this.scene = scene;

    const { width, height } = scene.scale;

    const joystickPlugin = scene.plugins.get("rexVirtualJoystick");

    // LEFT JOYSTICK: STEERING
    this.directionJoystick = joystickPlugin.add(scene, {
      x: JOYSTICK_MARGIN,
      y: height - JOYSTICK_BOTTOM_OFFSET,
      radius: JOYSTICK_RADIUS,

      base: scene.add.circle(0, 0, JOYSTICK_RADIUS, 0x888888, 0.45),

      thumb: scene.add.circle(0, 0, JOYSTICK_THUMB_RADIUS, 0xffffff, 0.8),

      dir: "left&right",
      forceMin: 0,
      fixed: true,
    });

    // RIGHT JOYSTICK: SPEED
    this.speedJoystick = joystickPlugin.add(scene, {
      x: width - JOYSTICK_MARGIN,
      y: height - JOYSTICK_BOTTOM_OFFSET,
      radius: JOYSTICK_RADIUS,

      base: scene.add.circle(0, 0, JOYSTICK_RADIUS, 0x888888, 0.45),

      thumb: scene.add.circle(0, 0, JOYSTICK_THUMB_RADIUS, 0xffffff, 0.8),

      dir: "up&down",
      forceMin: 0,
      fixed: true,
    });

    scene.add.text(
      JOYSTICK_MARGIN - 55,
      height - JOYSTICK_BOTTOM_OFFSET - 85,
      "STEERING",
      { fontSize: "14px", color: "#ffffff" },
    );

    scene.add.text(
      width - JOYSTICK_MARGIN - 35,
      height - JOYSTICK_BOTTOM_OFFSET - 85,
      "SPEED",
      { fontSize: "14px", color: "#ffffff" },
    );
  }

  getInput() {
    const throttle =
      (this.speedJoystick.up ? 1 : 0) - (this.speedJoystick.down ? 1 : 0);

    const steering =
      (this.directionJoystick.right ? 1 : 0) -
      (this.directionJoystick.left ? 1 : 0);

    return { throttle, steering };
  }
}
