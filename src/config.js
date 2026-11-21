import Phaser from "phaser";
import VirtualJoystickPlugin from "phaser4-rex-plugins/plugins/virtualjoystick-plugin.js";

import GameScene from "./scenes/GameScene.js";
import { BACKGROUND_COLOR } from "./settings/gameSettings.js";

const config = {
  type: Phaser.AUTO,
  parent: "app",

  backgroundColor: BACKGROUND_COLOR,

  scale: {
    mode: Phaser.Scale.RESIZE,
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

  scene: [GameScene],
};

export default config;
