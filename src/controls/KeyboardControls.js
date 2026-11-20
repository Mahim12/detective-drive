export default class KeyboardControls {
  constructor(scene) {
    this.keys = scene.input.keyboard.createCursorKeys();
  }

  getInput() {
    const throttle =
      (this.keys.up.isDown ? 1 : 0) - (this.keys.down.isDown ? 1 : 0);

    const steering =
      (this.keys.right.isDown ? 1 : 0) - (this.keys.left.isDown ? 1 : 0);

    return { throttle, steering };
  }
}
