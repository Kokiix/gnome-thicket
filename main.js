const dimensions = {"HEX_RADIUS_MAGIC_NUMBER": 20};
const hex_grid = [];
let highlighted_tiles = [];
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
    let chosen_tile = hex_grid[q][y];
    // Select gnome
    if (hex_grid[q][y].has_gnome && chosen_tile.gnome_owner == current_player) {
      clear_highlighted();
      hex_grid[q][y].draw_select();
      highlighted_tiles.push(chosen_tile);
      highlight_move_options(q, y);
      return;
    // Select location to move to
    } else if (chosen_tile.is_hilighted) {
      highlighted_tiles[0].has_gnome = false;
      hex_grid[q][y].draw_gnome_for_player(current_player);
      current_player = current_player == 1 ? 2 : 1;
    }
    clear_highlighted();
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

function highlight_move_options(q, y) {
  let draw_on_top = [];
  const highlightTile = (tile) => {
    if (tile && !tile.has_gnome) {
      highlighted_tiles.push(tile);
      if (!tile.has_thicket) {
        draw_on_top.push(tile);
        return false;
      } else {
        tile.draw_select();
        return true;
      }
    }
    return false;
  };

  const traverseAndHighlight = (start, end, step, incrementY) => {
    let this_y = y;
    for (let i = start; i !== end; i += step) {
      this_y += incrementY(i);
      if (!highlightTile(hex_grid[i][this_y])) {
        break;
      }
    }
  };

  // Highlight vertical bushes
  traverseAndHighlight(q, -1, 0, y => -1);
  traverseAndHighlight(q, -1, 0, y => +1);

  // Highlight diagonal bushes
  traverseAndHighlight(q - 1, -1, -1, y => ((y < 3) ? -1 : 0));
  traverseAndHighlight(q - 1, -1, -1, y => ((y >= 3) ? 1 : 0));

  traverseAndHighlight(q + 1, hex_grid.length, 1, y => (y > 3) ? -1 : 0);
  traverseAndHighlight(q + 1, hex_grid.length, 1, y => (y <= 3) ? 1 : 0);

  for (let i in draw_on_top) {
    draw_on_top[i].draw_select([255, 0, 0]);
  }
}

function clear_highlighted() {
  for (let i = 0; i < highlighted_tiles.length; i++) {
    highlighted_tiles[i].draw();
  }
  highlighted_tiles = [];
  highlighted_tile_coords = [];
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