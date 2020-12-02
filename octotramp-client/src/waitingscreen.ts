import { Image } from "p5";

// Define constants
const GAME_TITLE = "OCTOTRAMP";
const GAME_TITLE_SIZE = 32;
const START_MESSAGE = "press any key to start";
const START_MESSAGE_SIZE = 24;

///@param width  the width of the display
///@param height  the height of the display
///
export default class WaitingScreen {
  characterImage: Image;
  height: number;
  game_title_pos: number;
  logo: Image;
  pos: number;
  start_message_ypos: number;
  width: number;

  constructor(
    width: number,
    height: number,
    characterImage: Image,
    logo: Image
  ) {
    this.characterImage = characterImage;
    this.logo = logo;
    this.width = width;
    this.height = height;
    this.game_title_pos = height / 2 / 25;
    this.start_message_ypos = height / 2 / 2 + height / 2 + 75;
    this.pos = 0;
  }

  drawScreen = function () {
    background(220, 220, 220);
    const sinShenanigans =
      Math.abs(sin((Math.PI * frameCount) / 60)) * (this.height - 300);
    image(this.characterImage, 0, this.height - sinShenanigans);

    fill(50);
    textAlign(CENTER);

    textStyle(BOLD);
    textSize(GAME_TITLE_SIZE);
    //text(GAME_TITLE, this.width/2, this.game_title_pos);
    image(this.logo, this.width / 2.7, this.game_title_pos);

    textSize(START_MESSAGE_SIZE);
    text(
      START_MESSAGE,
      this.width - this.width / 2 / 3,
      this.start_message_ypos
    );
  };
}
