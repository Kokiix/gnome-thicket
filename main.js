const HEX_GRID = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("white");
  draw_board();
}

function draw() {
}

function draw_board() {
  const HEX_RADIUS_MAGIC_NUMBER = 20;
  const circumradius = windowWidth / HEX_RADIUS_MAGIC_NUMBER;
  const inradius = circumradius * sqrt(3) / 2;
  const board_vert_offset = (windowHeight - inradius * 14) / 2 + inradius;

  // # of tiles in q-dimension goes from 4 to 7 to 4
  let board_q_grow_amt = 1;
  for (let q_length = 4; 
    q_length <= 7 && q_length >=4; 
    q_length += board_q_grow_amt) {
    
    // Iterate down the q axis
    const col_offset = board_vert_offset + (7 - q_length) * inradius;
    for (let q = 0; q < q_length; q++) {
      const center_x = windowWidth / 2 + (7 - q_length) * board_q_grow_amt * circumradius * 2 * 0.75;
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
      board_q_grow_amt = -1;
    }
  }
}