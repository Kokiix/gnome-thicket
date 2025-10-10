const HEX_GRID = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("black");
  draw_board();
}

function draw() {
}

function draw_board() {
  const HEX_RADIUS_MAGIC_NUMBER = 20;
  // Distance to vertex
  const circumradius = windowWidth / HEX_RADIUS_MAGIC_NUMBER;
  // Distance to edge
  const inradius = circumradius * sqrt(3) / 2;
  const board_vert_offset = (windowHeight - inradius * 14) / 2 + inradius;

  strokeWeight(circumradius / HEX_RADIUS_MAGIC_NUMBER * 2);
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
    const col_offset = board_vert_offset + (7 - q_length) * inradius;
    for (let q = 0; q < q_length; q++) {
      HEX_GRID[col_index][q] = new HexTile();
      
      const center_x = windowWidth / 2 + (7 - q_length) * q_grow_amt * circumradius * 2 * 0.75;
      const center_y = col_offset + inradius * q * 2;
      beginShape();
      for (let angle = 0; angle < 6.28; angle += PI / 3) {
        vertex(
          round(center_x + circumradius * cos(angle)), 
          round(center_y + circumradius * sin(angle)));
      }
      endShape(CLOSE);
    }

    if (q_length == 7) {
      q_grow_amt = -1;
    }
  }
}