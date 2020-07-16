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

let angle = 0;
const delta = 360 / 8;
let r = 42;

function setup() {
  pixelDensity(1);
  colorMode(RGB, 255);
  angleMode(DEGREES);

  createCanvas(g_drawable_area, g_drawable_area);
  cols = width;
  rows = height;

  background(255);
  frameRate(fps);

  // Load buffers
  previous = new Array(cols * rows).fill(0);
  current = new Array(cols * rows).fill(0);
}

function draw() {
  // background(255);

  // Make plots!
  let r_prime = r + random(-2, 2);
  let x = parseInt((cols >> 1) + cos(angle) * r_prime) % cols;
  let y = parseInt((rows >> 1) + sin(angle) * r_prime) % rows;
  angle += delta % 360;
  r = (r + 1) % (cols >> 1);
  previous[x + y * cols] = 512;

  // Do the pixel magic
  loadPixels();

  for (let i = cols, len = (rows - 1) * cols; i < len; i++) {
    // Rougher
    // let c =
    //   ((previous[i - 1] +
    //     previous[i + 1] +
    //     previous[i - cols] +
    //     previous[i + cols]) >>
    //     1) -
    //   current[i];

    // Smoother
    let c =
      ((previous[i - 1] +
        previous[i + 1] +
        previous[i - cols] +
        previous[i + cols] +
        previous[i - cols - 1] +
        previous[i - cols + 1] +
        previous[i + cols - 1] +
        previous[i + cols + 1]) >>
        2) -
      current[i];

    // END Options
    current[i] = c * damping;

    let index = i << 2;
    let h = 255 - current[i];
    pixels[index] = h >> 2;
    pixels[index + 1] = h >> 1;
    pixels[index + 2] = h;
    // pixels[index + 3] = current[i];
  }

  updatePixels();

  let temp = previous;
  previous = current;
  current = temp;
}

function mouseDragged() {
  previous[mouseX + mouseY * cols] = 700;
}

function keyPressed() {
  if (key == 'p' || key == ' ') {
    noLoop();
  } else if (key == 's') {
    loop();
  }
}
