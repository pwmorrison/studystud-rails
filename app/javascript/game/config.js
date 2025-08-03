import Phaser from "phaser";

let unit = 16;
let zoom = 5;
let gameWidth = 8 * unit;
let gameHeight = 8 * unit;
let canvasWidth = gameWidth * zoom;
let canvasHeight = gameHeight * zoom;

export default {
  type: Phaser.AUTO,
  width: canvasWidth,
  height: canvasHeight,
  // width: 800,
  // height: 600,
  physics: { default: "arcade" },
  scale: {
    // Define how the above game (width, height) is scaled to fit he available canvas space on the page.
    //mode: Scale.NONE, // No scaling, the game is displayed in (width, height) pixels.
    mode: Phaser.Scale.NONE, //Scale.FIT, // The game display is scaled to fit the available canvas area, while keeping the aspect ratio.
    //mode: Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    // min: {
    //     width: 100,
    //     height: 100
    // }
    width: gameWidth, // Internal game width
    height: gameHeight, // Internal game height
    zoom: zoom, // Scale internal game resolution by 2x (400x300 * 2 = 800x600)
  },
  // parent: mountElement, // attaches Phaser canvas to this controller's element
  // scene: {
  //   preload,
  //   create,
  //   update,
  // },
};
