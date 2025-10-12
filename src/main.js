let rect_height;
let rect_width;
let board_edge;
let rect_top;

const GAME = new Game();

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("black");
  init_config(width);
  GAME.board.init(height, width);
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

function select_gnome_class() {
  selecting_class = true;
  fill(200, 200, 200, 75);
  strokeWeight(0);
  rect(0, 0, width, height);

  stroke(180, 180, 180);
  strokeWeight(5);
  fill(200, 200, 200);
  rect_height = height * 0.75;
  rect_width = dimensions.circumradius * 3.5;
  board_edge = width / 2 + 1.5 * dimensions.circumradius * 3 + dimensions.circumradius;
  rect_top = height / 2 - rect_height / 2
  rect((board_edge + width) / 2 - 0.5 * rect_width, rect_top, rect_width, rect_height);

  strokeJoin(BEVEL);
  if (current_player == 1) {
    stroke(HexTile.p1_color);
    fill(HexTile.p1_color);
  } else {
    stroke(HexTile.p2_color);
    fill(HexTile.p2_color); 
  }

  let vert_hat_margin = rect_width / 10;
  let horiz_hat_margin = rect_width / 5;
  for (let i = 1; i < 4; i++) {
    triangle((board_edge + width) / 2, rect_top + (i - 1)/3 * rect_height + vert_hat_margin,
    (board_edge + width) / 2 - rect_width/2 + horiz_hat_margin, rect_top + i/3 * rect_height - vert_hat_margin,
    (board_edge + width) / 2 + rect_width/2 - horiz_hat_margin, rect_top + i/3 * rect_height - vert_hat_margin);
  }
  push();
  beginClip();
  for (let i = 1; i < 4; i++) {
    triangle((board_edge + width) / 2, rect_top + (i - 1)/3 * rect_height + vert_hat_margin,
    (board_edge + width) / 2 - rect_width/2 + horiz_hat_margin, rect_top + i/3 * rect_height - vert_hat_margin,
    (board_edge + width) / 2 + rect_width/2 - horiz_hat_margin, rect_top + i/3 * rect_height - vert_hat_margin);
  }
  endClip()
  let stripe_weight = rect_width / 12;
  strokeWeight(stripe_weight);
  stroke("white");
  for (let i = 1; i < 4; i++) {
    line(board_edge, rect_top + i/3 * rect_height - vert_hat_margin - stripe_weight,
      width, rect_top + i/3 * rect_height - vert_hat_margin - stripe_weight);
    for (let j = 2; j <= i; j++) {
      line(board_edge, rect_top + i/3 * rect_height - vert_hat_margin - (stripe_weight * j * 1.5),
        width, rect_top + i/3 * rect_height - vert_hat_margin - (stripe_weight * j * 1.5));
    }
  }
  pop();
}