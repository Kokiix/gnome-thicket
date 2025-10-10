const HEX_GRID = [];
const DIMENSIONS = {"HEX_RADIUS_MAGIC_NUMBER": 20};

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("black");
  DIMENSIONS.circumradius = windowWidth / DIMENSIONS.HEX_RADIUS_MAGIC_NUMBER;
  DIMENSIONS.inradius = DIMENSIONS.circumradius * sqrt(3) / 2;
  DIMENSIONS.board_vert_offset = (windowHeight - DIMENSIONS.inradius * 14) / 2 + DIMENSIONS.inradius;
  draw_board();
}

function draw() {
}

function mouseClicked() {
  let testX = mouseX - windowWidth / 2;
  let testY = mouseY - windowWidth / 2;
  let q_clicked = (2/3 * testX) / DIMENSIONS.circumradius;
  let r_clicked = (-1/3 * testX + sqrt(3)/3 * testY) / DIMENSIONS.circumradius;
  console.log(`${q_clicked}, ${r_clicked}`);
}

function draw_board() {
  strokeWeight(DIMENSIONS.circumradius / DIMENSIONS.HEX_RADIUS_MAGIC_NUMBER * 2);
  stroke(51, 102, 68);
  fill(87, 135, 75);

  // Using axial coordinates https://www.redblobgames.com/grids/hexagons/#coordinates-axial
  // # of tiles on q-axis goes from 4 to 7 to 4
  let col_index = 0;
  let q_grow_amt = 1;
  for (let q_length = 4; 
    q_length <= 7 && q_length >=4; 
    q_length += q_grow_amt) {

    HEX_GRID[col_index] = [];
    
    // Given each length, iterate down q axis
    const col_offset = DIMENSIONS.board_vert_offset + (7 - q_length) * DIMENSIONS.inradius;
    for (let q = 0; q < q_length; q++) {
      HEX_GRID[col_index][q] = new HexTile();

      const center_x = windowWidth / 2 + (7 - q_length) * q_grow_amt * DIMENSIONS.circumradius * 2 * 0.75;
      const center_y = col_offset + DIMENSIONS.inradius * q * 2;
      beginShape();
      for (let angle = 0; angle < 6.28; angle += PI / 3) {
        vertex(
          round(center_x + DIMENSIONS.circumradius * cos(angle)), 
          round(center_y + DIMENSIONS.circumradius * sin(angle)));
      }
      endShape(CLOSE);
    }

    if (q_length == 7) {
      q_grow_amt = -1;
    }
  }
}