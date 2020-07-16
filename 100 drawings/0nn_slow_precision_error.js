// Algorithm: https://web.archive.org/web/20160418004149/http://freespace.virgin.net/hugo.elias/graphics/x_water.htm

const fps = 30;
const g_margin = 20;
const g_drawable_area = 400;

let previous, current;
let rows, cols;

const damping = 0.99;

function setup() {

  pixelDensity(1);
  colorMode(RGB, 255);


  createCanvas(g_drawable_area, g_drawable_area);
  cols = width;
  rows = height

  background(255);
  frameRate(fps);

  // Load buffers
  previous = new Array(cols).fill(0).map(n => new Array(rows).fill(0));
  current = new Array(cols).fill(0).map(n => new Array(rows).fill(0));

  previous[200][200] = 255;
}

function draw() {
  background(255);

  loadPixels();

  // Update buffers
  for (let x = 1; x < cols - 1; x++) {
    for (let y = 1; y < rows - 1; y++) {
      let c =
        (previous[x - 1][y] +
          previous[x + 1][y] +
          previous[x][y - 1] +
          previous[x][y + 1]) >>> 1 - current[x][y];
      current[x][y] = c * damping;
      
      let index = (x + y * cols) * 4;      
      pixels[index + 0] = current[x][y];
      pixels[index + 1] = current[x][y];
      pixels[index + 2] = current[x][y];
      //pixels[index + 3] = 255;
    }
  }

  updatePixels();

  let temp = previous;
  previous = current;
  current = temp;
}

function mouseDragged() {
  previous[mouseX][mouseY] = 400;
}

function keyPressed() {
  if (key == 'p' || key == ' ') {
    noLoop();
  } else if (key == 's') {
    loop();
  }
}