//import { EventBus } from '../EventBus';
import Scene from "phaser";
import { Client, Room, getStateCallbacks } from "colyseus.js";

//import { MyGame } from "../main";

const COLYSEUS_SERVER_URL = "wss://au-syd-d0b58a29.colyseus.cloud";
//const COLYSEUS_SERVER_URL = "ws://localhost:2567";

//const characterNames : readonly string[] = [
const characterNames = [
  "Adam",
  // "Alex",
  // "Amelia",
  // "Ash",
  // "Bob",
  // "Bouncer",
  // "Bruce",
  // "Butcher_2",
  // "Butcher",
  // "Chef_Alex",
  // "Chef_Lucy",
  // "Chef_Molly",
  // "Chef_Pier",
  // "Chef_Rob",
  // "Dan",
  // "Doctor_1",
  // "Doctor_2",
  // "Edward",
  // "Fishmonger_1",
  // "Fishmonger_2",
  // "Halloween_Kid_1",
  // "Halloween_Kid_2",
  // "Kid_Abby",
  // "Kid_Karen",
  // "Kid_Mitty",
  // "Kid_Oscar",
  // "Kid_Romeo",
  // "Kid_Tim",
  // "Lucy",
  // "Molly",
  // "Nurse_1",
  // "Nurse_2",
  // "Old_man_Josh",
  // "Old_woman_Jenny",
  // "Pier",
  // "Prisoner_1",
  // "Prisoner_2",
  // "Prisoner_3",
  // "Rob",
  // "Roki",
  // "Samuel",
];

class GameScene extends Phaser.Scene {
  camera = null; //!: Phaser.Cameras.Scene2D.Camera;
  background = null; //!: Phaser.GameObjects.Image;
  gameText = null; //!: Phaser.GameObjects.Text;
  cursorKeys = null; //! : Phaser.Types.Input.Keyboard.CursorKeys;

  playerEntities = {};
  playerDirections = {};

  // local input cache
  inputPayload = {
    left: false,
    right: false,
    up: false,
    down: false,
  };

  username = null;

  //client = new Client("ws://localhost:2567");
  //client = new Client("wss://au-syd-d0b58a29.colyseus.cloud");
  client = null;
  //var room;
  room = null;

  constructor() {
    super("Game2");
  }

  init() {
    // this.client = null;
    // this.room = null;

    // this.playerEntities = {};
    // this.playerDirections = {};

    this.inputPayload = {
      left: false,
      right: false,
      up: false,
      down: false,
    };
  }

  preload() {
    console.log("SCENE PRELOAD");

    // preload scene
    this.load.image(
      "ship_0001",
      "https://cdn.glitch.global/3e033dcd-d5be-4db4-99e8-086ae90969ec/ship_0001.png",
    );

    // Read the asset URLs from the data attributes
    const gameContainer = document.getElementById("game-container");
    const characterIdlePngUrl = gameContainer.dataset.characterIdlePngUrl;
    const characterRunPngUrl = gameContainer.dataset.characterRunPngUrl;
    const floorPngUrl = gameContainer.dataset.floorPngUrl;
    const floorJsonUrl = gameContainer.dataset.floorJsonUrl;
    const wallsPngUrl = gameContainer.dataset.wallsPngUrl;
    const wallsJsonUrl = gameContainer.dataset.wallsJsonUrl;
    console.log("Floor PNG URL:", floorPngUrl);
    console.log("Floor JSON URL:", floorJsonUrl);

    // Character idle
    // right - [0, 5]
    // up - [6, 11]
    // left - [12, 17]
    // down - [18, 23]
    for (const n of characterNames) {
      this.load.spritesheet(
        `${n}_idle`,
        characterIdlePngUrl,
        { frameWidth: 16, frameHeight: 32 },
      );
    }

    // Character run
    // right - [0, 5]
    // up - [6, 11]
    // left - [12, 17]
    // down - [18, 23]
    for (const n of characterNames) {
      this.load.spritesheet(
        `${n}_run`,
        characterRunPngUrl,
        { frameWidth: 16, frameHeight: 32 },
      );
    }

    console.log("Loading floors_atlas");
    console.log(RAILS_ASSET_URL("game/Room_Builder_Floors_16x16.png"));
    this.load.atlas(
      "floors_atlas",
      floorPngUrl,
      floorJsonUrl,
    );
    console.log("Loading walls_atlas");
    this.load.atlas(
      "walls_atlas",
      wallsPngUrl,
      wallsJsonUrl,
    );

    this.cursorKeys = this.input.keyboard.createCursorKeys();
  }

  async create() {
    console.log("SCENE CREATE");

    const game = this.game; // as MyGame;
    // const username = game.username;
    //const username = "paul";
    const username = Math.random().toString(36).substring(2, 10);
    console.log(`Scene username: ${username}`);

    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x00ff00);

    this.background = this.add.image(512, 384, "background");
    this.background.setAlpha(0.5);

    // this.gameText = this.add
    //   .text(512, 384, "Our Game!!!", {
    //     fontFamily: "Arial Black",
    //     fontSize: 38,
    //     color: "#ffffff",
    //     stroke: "#000000",
    //     strokeThickness: 8,
    //     align: "center",
    //   })
    //   .setOrigin(0.5)
    //   .setDepth(100);

    // EventBus.emit('current-scene-ready', this);

    console.log("gameSize:" + this.scale.gameSize);
    console.log("canvasBounds:" + this.scale.canvasBounds);
    console.log("displaySize:" + this.scale.displaySize);

    let wall_unit = 16;

    // TODO: Add walls to this physics group so the person can't walk through them.
    let walls = this.physics.add.staticGroup();

    let game_width = this.scale.gameSize.width;
    let game_height = this.scale.gameSize.height;
    let width_units = game_width / wall_unit;
    let height_units = game_height / wall_unit;

    console.log(width_units);

    // Floors.
    for (let y = 0; y < height_units; y++) {
      for (let x = 0; x < width_units; x++) {
        this.add
          .image(x * wall_unit, y * wall_unit, "floors_atlas", "floor")
          .setOrigin(0, 0);
      }
    }

    // Walls.
    // Back left corner.
    this.add.image(0, 0, "walls_atlas", "back_left_wall").setOrigin(0, 0);
    // Back right corner.
    this.add
      .image((width_units - 1) * wall_unit, 0, "walls_atlas", "back_right_wall")
      .setOrigin(0, 0);
    // Back wall.
    for (let x = 1; x < width_units - 1; x++) {
      this.add
        .image(x * wall_unit, 0, "walls_atlas", "back_wall")
        .setOrigin(0, 0);
    }
    // Left wall.
    for (let y = 2; y < height_units - 0; y++) {
      this.add
        .image(0, y * wall_unit, "walls_atlas", "left_wall")
        .setOrigin(0, 0);
    }
    // Right wall.
    for (let y = 2; y < height_units - 0; y++) {
      this.add
        .image(
          (width_units - 1) * wall_unit,
          y * wall_unit,
          "walls_atlas",
          "right_wall",
        )
        .setOrigin(0, 0);
    }
    // Front wall.
    for (let x = 1; x < width_units - 1; x++) {
      this.add
        .image(
          x * wall_unit + wall_unit / 2,
          (height_units - 1) * wall_unit + wall_unit / 2,
          "walls_atlas",
          "front_wall",
        )
        .setFlipY(true);
    }
    // Front left corner.
    this.add
      .image(
        0 + wall_unit / 2,
        (height_units - 1) * wall_unit + wall_unit / 2,
        "walls_atlas",
        "front_left_wall",
      )
      .setFlipY(true);
    // Front right corner.
    this.add
      .image(
        (width_units - 1) * wall_unit + wall_unit / 2,
        (height_units - 1) * wall_unit + wall_unit / 2,
        "walls_atlas",
        "front_right_wall",
      )
      .setFlipY(true);

    // The game area
    let x1 = 16;
    let y1 = 32;
    let x2 = this.scale.gameSize.width - 16;
    let y2 = this.scale.gameSize.height - 16 / 3;

    let spriteWidth = 16;
    let spriteHeight = 32;
    let footprintHeight = 8;

    // Get a random character.
    const randomIndex = Math.floor(Math.random() * characterNames.length);
    const n = characterNames[randomIndex];

    // const roomId = `room_${username}`;
    let roomId = 1;

    if (this.client === null) {
      this.client = new Client(COLYSEUS_SERVER_URL);

      try {
        // Attempt to join the room.
        // Will throw an exception if the room doesn't exist.
        console.log(`Attempting to join room with ID: ${roomId}`);
        this.room = await this.client.joinById(roomId, { username });
      } catch (err) {
        //: any) {
        console.log(`Error joining room with ID ${roomId}: ${err.code}`);
        if (true) {
          //(err.code === 421) {
          // Room doesn't exist, so create it
          console.log(`Attempting to create room with ID: ${roomId}`);
          this.room = await this.client.create("user_room", {
            username: username,
            roomId: roomId,
            characterName: n,
            width: this.scale.gameSize.width,
            height: this.scale.gameSize.height,
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            spriteWidth: spriteWidth,
            spriteHeight: spriteHeight,
            footprintHeight: footprintHeight,
          });
          console.log("Room created successfully");
        }
      }

      // try {
      //   this.room = await this.client.create("user_room", {
      //     username: username,
      //     roomId: roomId,
      //     characterName: n,
      //     width: this.scale.gameSize.width,
      //     height: this.scale.gameSize.height,
      //     x1: x1,
      //     y1: y1,
      //     x2: x2,
      //     y2: y2,
      //     spriteWidth: spriteWidth,
      //     spriteHeight: spriteHeight,
      //     footprintHeight: footprintHeight,
      //   });
      //   console.log("Joined successfully!");
      // } catch (e) {
      //   //: any) {
      //   console.error(e);
      //   if (e.code === 412) {
      //     // Already exists — join instead
      //     //const roomId = `room_${username}`; // assumes roomId is predictable
      //     roomId = 1;
      //     this.room = await this.client.joinById(roomId, { username });
      //   } else {
      //     throw e;
      //   }
      // }

      // TODO: Exit here or something if we can't join the room.

      // listen for new players
      const $ = getStateCallbacks(this.room);

      $(this.room.state).players.onAdd((player, sessionId) => {
        //const entity = this.physics.add.image(player.x, player.y, 'ship_0001');
        console.log("Adding player to position" + player);
        console.log(player);

        // Use the sprite associated with the player's character.
        const n = player.characterName;
        const spriteIdle = `${n}_idle`;
        const spriteRun = `${n}_run`;

        const entity = this.physics.add.sprite(player.x, player.y, spriteRun);

        let idle_framerate = 5;
        let run_framerate = 10;
        this.anims.create({
          key: `right_${sessionId}`,
          frames: this.anims.generateFrameNumbers(spriteRun, {
            start: 0,
            end: 5,
          }),
          frameRate: run_framerate,
          repeat: -1,
        });
        this.anims.create({
          key: `up_${sessionId}`,
          frames: this.anims.generateFrameNumbers(spriteRun, {
            start: 6,
            end: 11,
          }),
          frameRate: run_framerate,
          repeat: -1,
        });
        this.anims.create({
          key: `left_${sessionId}`,
          frames: this.anims.generateFrameNumbers(spriteRun, {
            start: 12,
            end: 17,
          }),
          frameRate: run_framerate,
          repeat: -1,
        });
        this.anims.create({
          key: `down_${sessionId}`,
          frames: this.anims.generateFrameNumbers(spriteRun, {
            start: 18,
            end: 23,
          }),
          frameRate: run_framerate,
          repeat: -1,
        });
        this.anims.create({
          key: `turn_${sessionId}`,
          frames: [{ key: spriteIdle, frame: 18 }],
          frameRate: idle_framerate,
        });

        let direction = "turn";
        this.playerDirections[sessionId] = direction;
        entity.anims.play(`${direction}_${sessionId}`);

        this.playerEntities[sessionId] = entity;

        // listening for server updates
        $(player).onChange(() => {
          let prev_direction = this.playerDirections[sessionId];

          // The current direction.
          let direction;
          if (!player.is_moving) {
            direction = "turn";
          } else {
            if (player.x > entity.x) {
              direction = "right";
            } else if (player.x < entity.x) {
              direction = "left";
            } else if (player.y > entity.y) {
              direction = "down";
            } else if (player.y < entity.y) {
              direction = "up";
            } else {
              // This happens the player is standing against a wall when they start to move.
              direction = "turn";
            }
          }

          // Update the animation if the direction has changed.
          if (direction != prev_direction) {
            entity.anims.play(`${direction}_${sessionId}`);
          }

          // Record the current direction.
          this.playerDirections[sessionId] = direction;

          //
          // update local position immediately
          // (WE WILL CHANGE THIS ON PART 2)
          //
          // let footprintX = player.x
          // let footprintY = player.y - 16;
          entity.x = player.x;
          entity.y = player.y;
        });
      });

      // remove local reference when entity is removed from the server
      $(this.room.state).players.onRemove((player, sessionId) => {
        const entity = this.playerEntities[sessionId];
        if (entity) {
          entity.destroy();
          delete this.playerEntities[sessionId];
        }
      });
    }

    // this.cameras.main.startFollow(this.ship, true, 0.2, 0.2);
    // this.cameras.main.setZoom(1);

    // PAUL: This seems to prevent the character from appearing.
    // PAUL: Come back and look into this.
    // let width = 100;
    // let height = 100;
    // this.cameras.main.setBounds(0, 0, width, height);

    // this.scale.displaySize.setAspectRatio( width/height );
    // this.scale.refresh();

    console.log(this.room);
  }

  update() {
    //console.log('SCENE UPDATE');
    // skip loop if not connected with room yet.
    if (!this.room) {
      return;
    }
    // send input to the server
    this.inputPayload.left = this.cursorKeys.left.isDown;
    this.inputPayload.right = this.cursorKeys.right.isDown;
    this.inputPayload.up = this.cursorKeys.up.isDown;
    this.inputPayload.down = this.cursorKeys.down.isDown;
    this.room.send(0, this.inputPayload);
  }

  // changeScene ()
  // {
  //     console.log('SCENE CHANGESCENE');

  //     if (0) {
  //         // When we change scene, reset the game so it is re-initialised.
  //         this.room?.leave();
  //         this.scene.start('GameOver');
  //     } else {
  //         console.log('Switching to GameOver');
  //         this.scene.switch('GameOver');
  //     }

  //     //this.scene.start('GameOver');
  // }
}

export default GameScene;
