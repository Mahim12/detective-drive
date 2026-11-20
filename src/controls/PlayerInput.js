import JoystickControls from "./JoystickControls.js";
import KeyboardControls from "./KeyboardControls.js";

export default class PlayerInput {
  constructor(scene) {
    this.joystick = new JoystickControls(scene);
    this.keyboard = new KeyboardControls(scene);
  }

  getInput() {
    const joystickInput = this.joystick.getInput();
    const keyboardInput = this.keyboard.getInput();

    const throttle = Math.max(
      -1,
      Math.min(1, joystickInput.throttle + keyboardInput.throttle),
    );

    const steering = Math.max(
      -1,
      Math.min(1, joystickInput.steering + keyboardInput.steering),
    );

    return { throttle, steering };
  }
}
