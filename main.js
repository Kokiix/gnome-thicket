const DIMENSIONS = {"HEX_RADIUS_MAGIC_NUMBER": 20};
const hex_grid = [];
let to_deselect;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("black");
  DIMENSIONS.circumradius = width / DIMENSIONS.HEX_RADIUS_MAGIC_NUMBER;
  DIMENSIONS.inradius = DIMENSIONS.circumradius * sqrt(3) / 2;
  DIMENSIONS.board_vert_offset = (height - DIMENSIONS.inradius * 14) / 2 + DIMENSIONS.inradius;
  draw_board();
}

function draw() {
}

function mouseClicked() {
  if (to_deselect) {
    to_deselect.draw();
    to_deselect = undefined;
  }

  let [q, r] = cartesian_to_hex(mouseX, mouseY);
  q = 6 - (q + 3); // TODO: Why are columns are stored RTL?
  r += q < 4 ? 3 : 6 - q;
  if (hex_grid[q] && hex_grid[q][r]) {
    hex_grid[q][r].draw_select();
    to_deselect = hex_grid[q][r];
  }
}

function cartesian_to_hex(in_x, in_y) {
  let x = in_x - width / 2;
  let y = in_y - height / 2;
  let q_fractional = (2/3 * x) / DIMENSIONS.circumradius;
  let r_fractional = (-1/3 * x + sqrt(3)/3 * y) / DIMENSIONS.circumradius;
  let s_fractional = -q_fractional - r_fractional;
  let q_rounded = round(q_fractional);
  let r_rounded = round(r_fractional);
  let s_rounded = round(s_fractional);
  let q_diff = abs(q_rounded - q_fractional);
  let r_diff = abs(r_rounded - r_fractional);
  let s_diff = abs(s_rounded - s_fractional);
  if (q_diff > r_diff && q_diff > s_diff) {
    q_rounded = -r_rounded - s_rounded;
  } else if (r_diff > q_diff && r_diff > s_diff) {
    r_rounded = -q_rounded - s_rounded;
  }
  return [q_rounded, r_rounded];
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

    hex_grid[col_index] = [];
    
    // Given each length, iterate down q axis
    const col_offset = DIMENSIONS.board_vert_offset + (7 - q_length) * DIMENSIONS.inradius;
    for (let q = 0; q < q_length; q++) {

      const center_x = width / 2 + (7 - q_length) * q_grow_amt * DIMENSIONS.circumradius * 2 * 0.75;
      const center_y = col_offset + DIMENSIONS.inradius * q * 2;

      hex_grid[col_index][q] = new HexTile(center_x, center_y, DIMENSIONS.circumradius / DIMENSIONS.HEX_RADIUS_MAGIC_NUMBER * 2);
      hex_grid[col_index][q].draw();
    }

    if (q_length == 7) {
      q_grow_amt = -1;
    }
    col_index += 1;
  }
}