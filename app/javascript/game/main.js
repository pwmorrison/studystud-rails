import Phaser from "phaser";
import config from "./config";
import GameScene from "./scenes/game_scene";

export default function initGame(mountElement) {
  return new Phaser.Game({
    // type: Phaser.AUTO,
    // width: 800,
    // height: 600,
    ...config,
    parent: mountElement, // attaches Phaser canvas to this controller's element
    scene: [GameScene],
    // scene: {
    //   //GameScene,
    //   preload,
    //   create,
    //   update,
    // },
  });
}

function preload() {
  this.load.setBaseURL("https://labs.phaser.io");
  this.load.image("sky", "assets/skies/space3.png");
}

function create() {
  this.add.image(400, 300, "sky");
}

function update() {
  // Game loop logic
}
