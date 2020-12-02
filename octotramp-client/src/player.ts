import { Image } from "p5";
import {
  CHARACTER_WIDTH,
  CHARACTER_HEIGHT,
  GAME_HEIGHT,
  GAME_WIDTH,
} from "./constants";

export default class Player {
  translateX: number;
  xpos: number;
  jumpDuration: number;
  jumpTheta: number;
  characterImage: Image;

  constructor(characterImage: Image) {
    this.translateX = 0;
    this.xpos = GAME_WIDTH / 2;
    // Number of frames per jump
    this.jumpDuration;
    // Current theta of the jump height used in a sin function
    this.jumpTheta = 0.1;
    this.characterImage = characterImage;
  }
  drawPlayer() {
    // Increase the y
    this.jumpTheta += Math.PI / this.jumpDuration;
    // Lerp the x position
    this.xpos += this.translateX * 0.25;
    this.translateX *= 0.75;
    // calculate the player's height
    var yPos =
      GAME_HEIGHT - Math.abs(sin(this.jumpTheta)) * (GAME_HEIGHT - 200);
    // player sprite
    image(
      this.characterImage,
      this.xpos,
      yPos - 100,
      CHARACTER_WIDTH,
      CHARACTER_HEIGHT
    );
  }
}
