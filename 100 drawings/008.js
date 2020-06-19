const g_margin = 20;
const g_drawable_area = 400;
const g_doFill = false;

let baseAngle = 37; //33, 119, 89, 171, 179/181

let g_jitter = 0;//0.08;

let maxRevolutions = 360 / baseAngle;
let scaleHigh = 1.4;
let scaleLow = 0.7;

let fps = 8;
let isRecording = false;

// the canvas capturer instance
var capturer = new CCapture({ format: 'png', framerate: fps });

function setup() {

  const canvas_size = g_drawable_area + 2 * g_margin;

  colorMode(RGB, 255);

  angleMode(DEGREES);

  let opacityHigh = 255;
  let opacityLow = 255;

  // Purple and yellow
  // gc_start = color(239, 237, 11);
  // gc_end = color(84, 19, 87);

  gc_start = color(255, 251, 137);
  //gc_end = color(0, 135, 38);
  gc_end = color(53, 128, 166);

  createCanvas(canvas_size, canvas_size);

  frameRate(fps);
}

function draw() {
  let originX = g_drawable_area / 2 + g_margin;
  let originY = g_drawable_area / 2 + g_margin; // + 180;
  let scaleDelta = scaleHigh - scaleLow;

  if (!isRecording) {
    // start the recording after the animation loop has begun
    capturer.start();
    isRecording = true;
  }

  if (g_jitter > .5) {
    noLoop();
    console.log('finished recording.');
    capturer.stop();
    capturer.save();
    return;
  }

  background(lerpColor(gc_start, gc_end, .8));

  for (let scale = scaleHigh; scale >= scaleLow; scale -= 0.1) {
    for (let rev = 0; rev < maxRevolutions; rev++) {
      let c = lerpColor(gc_start, gc_end, (scale - scaleLow) / scaleDelta);
      drawLine(originX, originY, -baseAngle * rev, scale, c);
    }
  }

  g_jitter += 0.01;

  capturer.capture(document.getElementById('defaultCanvas0'));
}

/**
 * ox = origin x
 * oy = origin y
 * theta = angle of rotation
 **/
function drawLine(ox, oy, theta, scale, c) {
  let s = !!scale ? scale : 1;
  let a = 40 * s,
    b = 2 * a * s,
    z = 4;

  fill(c);
  strokeWeight(1);
  stroke(255, 64);
  
  push();
  translate(ox, oy);
  rotate(theta);
  beginShape();
  curveVertex(z, z);
  curveVertex(z, z);
  curveVertex(getJitterPoint(b), getJitterPoint(a));
  curveVertex(getJitterPoint(b), getJitterPoint(b));
  curveVertex(getJitterPoint(a), getJitterPoint(b));
  curveVertex(z, z);
  curveVertex(z, z);
  endShape();
  pop();
}

function getJitterPoint(a) {
  let offset = a * g_jitter;
  return a + random(-offset, offset);
}