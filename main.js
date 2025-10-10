const HEX_GRID = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("black");
  draw_board();
}

function draw() {
}

function draw_board() {
  const VERTICAL_MARGIN = windowWidth / 5;
  const RADIUS = windowWidth / 5;

  console.log(windowWidth, windowHeight);

  let center_x = windowWidth / 2;
  let center_y = VERTICAL_MARGIN + RADIUS;
  beginShape();
  for (let angle = 0; angle < 6.28; angle += Math.PI / 3) {

    // console.log(angle);
    console.log(Math.round(center_x + Math.cos(angle)), Math.round(center_y + Math.sin(angle)));
    vertex(Math.round(center_x + RADIUS * Math.cos(angle)), Math.round(center_y + RADIUS * Math.sin(angle)));
  }
  endShape(CLOSE);


  // # of tiles in q-dimension goes from 4 to 7 to 4
  // let board_q_grow = true;
  // for (let q_length = 4; 
  //   q_length <= 7 && q_length >=4; 
  //   q_length += board_q_grow ? 1 : -1) {

  //   // draw hexes here      
  // }

}