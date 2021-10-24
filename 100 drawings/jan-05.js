// the canvas capturer instance
const fps = 16;
let exportVideo = true;
var capturer = exportVideo && new CCapture({ format: 'png', framerate: fps });
let isRecording = false;

//////////

var bgcolor,
    bgcolor_alpha;

//////////

const g_canvas_size = 400;
const half_width = g_canvas_size / 2;
const boundary = 0.8 * half_width * half_width;
const numPoints = 3;
const theta = 2 * 3.14159265358979 / numPoints;
const PIover4 = 3.14159265358979 / 4;


function setup() {
  colorMode(HSB);
  createCanvas(g_canvas_size, g_canvas_size);
  bgcolor = color(0, 1);
  // bgcolor = color (39, 20, 99, 1.0);
  bgcolor_alpha = color(bgcolor.toString());
  bgcolor_alpha.setAlpha(0.5);

  chkRecordVideo = createCheckbox('Record Video', false);

  // frameRate(30);
  noLoop();
  background(bgcolor);
}

function draw() {
  if (!isRecording && chkRecordVideo.checked()) {
    // start the recording after the animation loop has begun
    capturer.start();
    isRecording = true;
  }
  ////// BEGIN DRAW
  background(bgcolor_alpha);
  stroke(bgcolor_alpha);
  strokeWeight(1);
  // noStroke();
  for (var r = 0, count = 5000; r < count; r++) {
    let x = random(width);
    let y = random(height);
    let xoff = x - half_width;
    let yoff = y - half_width;

    if ((xoff * xoff + yoff * yoff) < boundary) {
      drawShape(
        x,
        y,
        random(10) + 4
      );
    }
  }

  // fill(0);
  // stroke(255);
  // text("FPS: " + frameRate().toFixed(2), 10, height - 10);
  ////// END DRAW

  exportVideo && capturer.capture(document.getElementById('defaultCanvas0'));
}

function drawShape(x, y, r) {
  let ci = makeColourIntensity(x, y);
  
  // if (ci.c < .3) return
  // if (ci.intensity < .4) return

  let colour = (ci.intensity * ci.c) * 220+40;// * 40 + 188;//267;
  fill(colour, 100, (ci.c)*100, 1);
  // circle(x, y, r);
  
  let points = [];

  var a, rnd;
  for (let n = 0; n < numPoints; n++) {
    a = theta*n;
    rnd = random(-1,1);
    points.push({
      x: x + cos(a) * r + rnd,
      y: y + sin(a) * r + rnd,
    })

  }
  
  beginShape();
  curveVertex(points[numPoints-1].x, points[numPoints-1].y);

  for (let n = 0; n < numPoints; n++) {
    curveVertex(points[n].x, points[n].y);
  }
  
  curveVertex(points[0].x, points[0].y);
  curveVertex(points[1].x, points[1].y);
  endShape();
}

function makeColourIntensity(x, y) {
  let _x = x - half_width;
  let _y = y - half_width;

  let c = abs(sin(-PIover4 + 0.025 * frameCount + atan2(_x, _y)));
  return {
    c: c,
    intensity: (_x*_x + _y*_y) / (half_width * half_width)
  };
}

function keyPressed() {
  if (key == 'p' || key == ' ') {
    noLoop();
  } else if (key == 's') {
    loop();
  } else if (key == 'x') {
    noLoop();
    console.log('Done.');
    if (exportVideo) {
      capturer.stop();
      capturer.save();
    }
  }
}
