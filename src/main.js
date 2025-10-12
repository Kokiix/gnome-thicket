let rect_height;
let rect_width;
let board_edge;
let rect_top;

const GAME = new Game();

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("black");
  init_config(width);
  GAME.init_board(height, width);
}

function draw() {
}

function mouseClicked() {
  if (GAME.class_selection_active) {
    GAME.handle_class_sel_click();
  } else {
    GAME.handle_board_click();
  }
}