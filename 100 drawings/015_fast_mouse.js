// Algorithm: https://web.archive.org/web/20160418004149/http://freespace.virgin.net/hugo.elias/graphics/x_water.htm

const fps = 30;
const g_margin = 20;
const g_drawable_area = 400;

let previous, current;
let rows, cols;
let g_bgColour;
let g_bgColour_H;
let g_bgColour_S;
let g_bgColour_L;

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
  previous = new Array(cols * rows).fill(0);
  current = new Array(cols * rows).fill(0);

}

function draw() {
  background(255);

  loadPixels();

  // Update buffers
  for (let i = cols, len = (rows - 1) * cols; i < len; i++) {
    let c =
      ((previous[i - 1] +
        previous[i + 1] +
        previous[i - cols] +
        previous[i + cols]) >> 1) - current[i];
    current[i] = c * damping;

    let index = i << 2;
    let h = 255 - current[i];
    pixels[index] = h;
    pixels[index + 1] = h;
    pixels[index + 2] = h;

  }


  updatePixels();

  let temp = previous;
  previous = current;
  current = temp;
}

function mouseDragged() {
  previous[mouseX + mouseY * cols] = 512;
}

function keyPressed() {
  if (key == 'p' || key == ' ') {
    noLoop();
  } else if (key == 's') {
    loop();
  }
}