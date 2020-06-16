const g_margin = 20;
const g_min_width = 7;
const g_max_width = 37;
const g_drawable_area = 400;
const g_noise_inc = 0.07;

let g_noise_x = 0;
let gc_start;
let gc_end;

let max_count = 32;
let count = 4;

var fps = 8;

// the canvas capturer instance
var capturer = new CCapture({ format: 'png', framerate: fps });

function setup() {
//   console.log('Setting up...');
  const canvas_size = g_drawable_area + 2 * g_margin;

  colorMode(RGB, 255);

  gc_start = color(0, 210, 217);
  gc_end = color(0, 25, 74);

//   gc_start = color(233,237, 0);
//   gc_end = color(0, 117, 65);

//   gc_start = color(237, 235, 11);
//   gc_end = color(60, 117, 92);

  // Purple and yellow
  // gc_start = color(239, 237, 11);
  // gc_end = color(84, 19, 87);

  createCanvas(canvas_size, canvas_size);

  frameRate(fps);
  // noLoop();

  // start the recording
  capturer.start();
  //console.log('Setup complete.');
}

function draw() {
  //   console.log('Drawing...');
  if (count > max_count) {
    noLoop();
    capturer.stop();
    capturer.save();
    console.log('finished recording.');
  }

  gradientFill(gc_start, gc_end, 64);

  cycle(count);

  capturer.capture(document.getElementById('defaultCanvas0'));

  count++;
//   console.log('Drawing complete.');
}

function cycle(steps_y) {
  let h = g_drawable_area / steps_y;
  let max_vector = sqrt(
    g_drawable_area * g_drawable_area + g_drawable_area * g_drawable_area
  );

  for (let y_inc = 0; y_inc < steps_y; y_inc++) {
    let y = y_inc * h;
    let x = 0;

    while (x < g_drawable_area) {
      let w = parseInt(random(g_min_width, g_max_width));
      if (x + w > g_drawable_area) {
        w = g_drawable_area - x - 1;
      }
      g_noise_x += g_noise_inc;
      let h_off = noise(g_noise_x) * h;

      let position = sqrt(x * x + y * y) / max_vector;
      let c = lerpColor(gc_start, gc_end, position);

      drawRect(x, y + (h - h_off) / 2, w, h_off, c);
      // Transpose rows and columns
      // drawRect(y + (h - h_off) / 2, x, h_off, w, c);
      x += w + 2;
    }
  }
}

function drawRect(x, y, w, h, c) {
  //blendMode(OVERLAY);
  //fill(255, 64);
  fill(c);
  noStroke();
  let corner_radius = 2; //random(3,h);
  rect(x + g_margin, y + g_margin, w, h, corner_radius);
}

function gradientFill(c_start, c_end, scale) {
  let size_x = width / scale;
  let size_y = height / scale;
  let cycles = scale * scale;
  noStroke();
  for (let y = 0; y < scale; y++) {
    for (let x = 0; x < scale; x++) {
      let position = sqrt(x * x + y * y) / sqrt(scale * scale);

      let c = lerpColor(c_start, c_end, position);
      fill(c);
      rect(floor(x * size_x), floor(y * size_y), ceil(size_x), ceil(size_y));
    }
  }
}
