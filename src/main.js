const hex_grid = [];
let highlighted_tiles = [];
let current_player = 1;
let selecting_class = false;

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
  if (!selecting_class) {
    handle_board_click();
  } else {
    let margin_size = (width - board_edge - rect_width) / 2;
    if (mouseX > board_edge + margin_size && mouseX < width - margin_size) {
      if (mouseY > rect_top && mouseY < rect_top + rect_height/3) {
        highlighted_tiles[0].gnome = new Gnome(current_player, "gardener");
      } else if (mouseY > rect_top + rect_height/3 && mouseY < rect_top + rect_height * 2/3) {
        highlighted_tiles[0].gnome = new Gnome(current_player, "ruffian");
      } else if (mouseY > rect_top + rect_height * 2/3 && mouseY < rect_top + rect_height) {
        highlighted_tiles[0].gnome = new Gnome(current_player, "salt");
      } else {return;}

      reset_canvas();
      highlighted_tiles[0].draw();
      highlighted_tiles = [];
      current_player = current_player == 1 ? 2 : 1;
      selecting_class = false;
    }
  }
}

function handle_board_click() {
  let [q, r] = cartesian_to_hex(mouseX, mouseY);
  q = 6 - (q + 3); // TODO: Why are columns are stored RTL?
  let y = r + (q < 4 ? 3 : 6 - q);

  if (hex_grid[q] && hex_grid[q][y]) {
    let chosen_tile = hex_grid[q][y];
    // Select gnome
    if (hex_grid[q][y].gnome && chosen_tile.gnome.owner == current_player) {
      clear_highlighted();
      hex_grid[q][y].draw_select();
      highlighted_tiles.push(chosen_tile);
      if (!chosen_tile.gnome.type) {
        highlight_hidden_moves(q, y);
      } else {
        highlight_revealed_moves(q, y);
      }
      return;
    // Select location to move to
    } else if (chosen_tile.is_hilighted) {
      if (!highlighted_tiles[0].gnome.type && !chosen_tile.has_thicket) {
        highlighted_tiles[0].gnome = undefined;
        clear_highlighted();
        select_gnome_class(chosen_tile);
        highlighted_tiles.push(chosen_tile);
        return;
      } else {
        hex_grid[q][y].gnome = highlighted_tiles[0].gnome
        hex_grid[q][y].draw_gnome_for_player();
        current_player = current_player == 1 ? 2 : 1;
      }
      highlighted_tiles[0].gnome = undefined;
    }
    clear_highlighted();
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

function highlight_hidden_moves(init_q, init_y) {
  let draw_on_top = [];
  const highlightTile = (tile) => {
    if (tile && !tile.gnome) {
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
    let y = init_y;
    for (let i = start; i !== end; i += step) {
      y += incrementY(i);
      if (!highlightTile(hex_grid[i][y])) {
        break;
      }
    }
  };

  // Highlight vertical bushes
  traverseAndHighlight(init_q, -1, 0, q => -1);
  traverseAndHighlight(init_q, -1, 0, q => 1);

  // Highlight diagonal bushes
  traverseAndHighlight(init_q - 1, -1, -1, q => ((q < 3) ? -1 : 0));
  traverseAndHighlight(init_q - 1, -1, -1, q => ((q >= 3) ? 1 : 0));

  traverseAndHighlight(init_q + 1, hex_grid.length, 1, q => (q > 3) ? -1 : 0);
  traverseAndHighlight(init_q + 1, hex_grid.length, 1, q => (q <= 3) ? 1 : 0);

  for (let i in draw_on_top) {
    draw_on_top[i].draw_select([255, 0, 0]);
  }
}

function highlight_revealed_moves(q, y) {
  let draw_on_top = [];
  const select = (tile) => {
    if (tile && !tile.gnome) {
      highlighted_tiles.push(tile);
      if (tile.has_thicket) {
        draw_on_top.push(tile);
      } else {
        tile.draw_select();
      }
    }
  };
  select(hex_grid[q][y + 1]);
  select(hex_grid[q][y - 1]);

  q -= 1;
  select(hex_grid[q][y + ((q < 3) ? -1 : 0)]);
  select(hex_grid[q][y + ((q >= 3) ? 1 : 0)]);
  q += 2;
  select(hex_grid[q][y + ((q > 3) ? -1 : 0)]);
  select(hex_grid[q][y + ((q <= 3) ? 1 : 0)]);
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