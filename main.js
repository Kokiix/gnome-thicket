const HEX_GRID = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("white");
  draw_board();
}

function draw() {
}

function draw_board() {
  const CIRCUMRAD = windowWidth / 25;
  const INRADIUS = CIRCUMRAD * sqrt(3) / 2
  const VERT_OFFSET = (windowHeight - INRADIUS * 14) / 2 + INRADIUS;
  console.log(VERT_OFFSET);
  
  
  for (let i = 0; i < 7; i++) {
    let center_x = windowWidth / 2;
    let center_y = VERT_OFFSET + INRADIUS * i * 2;
    beginShape();
    for (let angle = 0; angle < 6.28; angle += PI / 3) {
      vertex(
        round(center_x + CIRCUMRAD * cos(angle)), 
        round(center_y + CIRCUMRAD * sin(angle)));
    }
    endShape(CLOSE);

  }

  // # of tiles in q-dimension goes from 4 to 7 to 4
  // let board_q_grow = true;
  // for (let q_length = 4; 
  //   q_length <= 7 && q_length >=4; 
  //   q_length += board_q_grow ? 1 : -1) {

  //   // draw hexes here      
  // }

}