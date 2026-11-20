import Phaser from "phaser";
import VirtualJoystickPlugin from "phaser4-rex-plugins/plugins/virtualjoystick-plugin.js";

import GameScene from "./scenes/GameScene.js";

import {
  GAME_WIDTH,
  GAME_HEIGHT,
  BACKGROUND_COLOR,
} from "./settings/gameSettings.js";

const config = {
  type: Phaser.AUTO,

  width: GAME_WIDTH,
  height: GAME_HEIGHT,

  backgroundColor: BACKGROUND_COLOR,

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

  scene: [GameScene],
};

export default config;
