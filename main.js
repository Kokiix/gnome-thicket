const dimensions = {"HEX_RADIUS_MAGIC_NUMBER": 20};
const hex_grid = [];
let prev_tile;
let prev_tile_coords;
let current_player = 1;

function setup() {
  // Blank hex board
  createCanvas(windowWidth, windowHeight);
  background("black");
  dimensions.circumradius = width / dimensions.HEX_RADIUS_MAGIC_NUMBER;
  dimensions.inradius = dimensions.circumradius * sqrt(3) / 2;
  dimensions.board_vert_offset = (height - dimensions.inradius * 14) / 2 + dimensions.inradius;
  draw_board();

  // Draw thickets on top and bottom border
  for (let i = 0; i < hex_grid.length; i++) {
    hex_grid[i][0].draw_thicket();
    hex_grid[i][hex_grid[i].length - 1].draw_thicket();
  }

  // Thickets sticking out of center row
  hex_grid[3][1].draw_thicket();
  hex_grid[3][5].draw_thicket();

  hex_grid[2][0].draw_gnome_for_player(1);
  hex_grid[3][0].draw_gnome_for_player(1);
  hex_grid[4][0].draw_gnome_for_player(1);
  hex_grid[2][5].draw_gnome_for_player(2);
  hex_grid[3][6].draw_gnome_for_player(2);
  hex_grid[4][5].draw_gnome_for_player(2);
}

function draw() {
}

function mouseClicked() {
  let [q, r] = cartesian_to_hex(mouseX, mouseY);
  q = 6 - (q + 3); // TODO: Why are columns are stored RTL?
  let y = r + (q < 4 ? 3 : 6 - q);
  
  if (hex_grid[q] && hex_grid[q][y]) {
    if (hex_grid[q][y].has_gnome && hex_grid[q][y].gnome_owner == current_player) {
      if (prev_tile) {
        prev_tile.draw();
      }
      hex_grid[q][y].draw_select();
      prev_tile = hex_grid[q][y];
      prev_tile_coords = [q, y, r];
    } else if (prev_tile && prev_tile.has_gnome && PLACEHOLDER) {
      prev_tile.has_gnome = false;
      prev_tile.draw();
      prev_tile = undefined;
      prev_tile_coords = undefined;

      hex_grid[q][y].draw_gnome_for_player(current_player);
      current_player = current_player == 1 ? 2 : 1;
      return;
    }
  }
}

function draw_board() {
  // Using axial coordinates https://www.redblobgames.com/grids/hexagons/#coordinates-axial
  // # of tiles on q-axis loop from 4 to 7 to 4
  let col_index = 0;
  let q_grow_amt = 1;
  for (let q_length = 4; 
    q_length <= 7 && q_length >=4; 
    q_length += q_grow_amt) {

    hex_grid[col_index] = [];
    
    // Given each length, iterate down q axis
    const col_offset = dimensions.board_vert_offset + (7 - q_length) * dimensions.inradius;
    for (let q = 0; q < q_length; q++) {

      const center_x = width / 2 + (7 - q_length) * q_grow_amt * dimensions.circumradius * 2 * 0.75;
      const center_y = col_offset + dimensions.inradius * q * 2;

      hex_grid[col_index][q] = new HexTile(center_x, center_y, dimensions.circumradius / dimensions.HEX_RADIUS_MAGIC_NUMBER * 1.5);
      hex_grid[col_index][q].draw();
    }

    if (q_length == 7) {
      q_grow_amt = -1;
    }
    col_index += 1;
  }
}

function cartesian_to_hex(in_x, in_y) {
  let x = in_x - width / 2;
  let y = in_y - height / 2;
  let q_fractional = (2/3 * x) / dimensions.circumradius;
  let r_fractional = (-1/3 * x + sqrt(3)/3 * y) / dimensions.circumradius;
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

function neighbors(q1, y1, q2, y2) {
  if (q1 == q2 && abs(y1 - y2) < 2) {return true;}
  if (abs(q1 - q2) > 1) {return false;}
  if (y1 == y2) {return true;}
  if ((q1 == 3 && y1-y2==1) || (q2 == 3 && y2-y1==1)) {return true;}
  if (q1 < 3 && ((q1 > q2 && y1 - y2 == -1) || (q2 > q1 && y2 - y1 == -1))) {return true;}
  if (q1 > 3 && ((q2 > q1 && y2 - y1 == -1) || (q1 > q2 && y1 - y2 == -1))) {return true;}
  return false;
}