let isRecording = false;
let exportVideo = false;

const g_canvas_size = 600;

const fps = 30;

var inc = 0.17; //0.05;
const scale = 10;
const half_scale = scale / 2;
/**
 * 500, 0.05, 5
 * 500, 0.05, 10
 * 250, 0.05, 20
 */

var zOff = 0;
var rows, cols;
var field;

var isActive = true;

// the canvas capturer instance
var capturer = exportVideo && new CCapture({ format: 'png', framerate: fps });

function setup() {
  colorMode(HSB, 100);
  createCanvas(g_canvas_size, g_canvas_size);

  rows = Math.floor(height / scale);
  cols = Math.floor(width / scale);

  field = new Array(rows * cols);

  controlPanel = createDiv('');

  let blue = color((201 / 360) * 100, 91, 82);
  let purple = color((253 / 360) * 100, 79, 51);
  let altblue = color('#54B8EE');
  let teal = color(205/360 * 100, 93, 59);

  let chosenColour = teal;

  background(chosenColour);
  colorPicker = createColorPicker(chosenColour);

  fr = createP('');

  knob1 = createSlider(1, 100, 6, 1);
  knob1.style('width', '100px');
  lblKnob = createP('');

  chkLerp = createCheckbox('Use Linear Interpolation', true);
  chkEraseOnRedraw = createCheckbox('Erase on Redraw', false);
  chkShowField = createCheckbox('Show Field', false);
  chkRecordVideo = createCheckbox('Record Video', false);

  controlPanel.child(colorPicker);
  controlPanel.child(fr);
  controlPanel.child(knob1);
  controlPanel.child(lblKnob);
  controlPanel.child(chkLerp);
  controlPanel.child(chkEraseOnRedraw);
  controlPanel.child(chkShowField);
  controlPanel.child(chkRecordVideo);

  // frameRate(fps);
  noLoop();
}

function draw() {
  if (!isRecording && chkRecordVideo.checked()) {
    // start the recording after the animation loop has begun
    capturer.start();
    isRecording = true;
  }
  ////// BEGIN DRAW
  if (chkEraseOnRedraw.checked()) {
    background(colorPicker.color());
  } else {
    let cx = colorPicker.color();
    background(hue(cx), saturation(cx), brightness(cx), knob1.value());
  }
  // inc = knob1.value() / 500;

  let index = 0;
  let yOff = 0;

  noStroke();
  fill(color(0, 100, 80));
  for (var y = 0; y < rows + 1; y++) {
    let xOff = 0;
    let yScale = y * scale;
    for (var x = 0; x < cols + 1; x++) {
      let c = noise(xOff, yOff, zOff);
      // field[index] = round(c);
      field[index] = c;

      if (chkShowField.checked()) {
        
        // fill(color(0, 100, field[index] * 100));
        rect(x * scale, yScale, 4, 4);
      }

      xOff += inc;
      index++;
    }
    yOff += inc;
  }
  zOff += 0.015;

  index = 0;
  var interpA,
      interpB,
      interpC,
      interpD;
  var x1, y1;
  var a, b, c, d;
  var NW, NE, SE, SW;
  var val;

  stroke(100, 10);
  strokeWeight(1);

  let checked = chkLerp.checked();

  for (var y = 0; y < rows; y++) {
    y1 = y * scale;
    for (var x = 0; x < cols; x++) {
      x1 = x * scale;

      NW = field[index];
      NE = field[index + 1];
      SE = field[index + 1 + (cols + 1)];
      SW = field[index + (cols + 1)];

      val = cellValue(
        NW,
        NE,
        SE,
        SW
      );

      
      interpA = checked ? _lerp(NW, NE, 0, scale, 0.5) : half_scale;
      interpB = checked ? _lerp(NE, SE, 0, scale, 0.5) : half_scale;
      interpC = checked ? _lerp(SW, SE, 0, scale, 0.5) : half_scale;
      interpD = checked ? _lerp(NW, SW, 0, scale, 0.5) : half_scale;

      a = createVector(x1 + interpA, y1);
      b = createVector(x1 + scale, y1 + interpB);
      c = createVector(x1 + interpC, y1 + scale);
      d = createVector(x1, y1 + interpD);

      switch (val) {
        case 1:
          lazyLine(c, d);
          break;
        case 2:
        case 13:
          lazyLine(b, c);
          break;
        case 3:
        case 12:
          lazyLine(b, d);
          break;
        case 4:
        case 11:
          lazyLine(a, b);
          break;
        case 5:
          lazyLine(a, b);
          lazyLine(c, d);
          break;
        case 6:
        case 9:
          lazyLine(a, c);
          break;
        case 7:
        case 8:
          lazyLine(a, d);
          break;
        case 10:
          lazyLine(a, d);
          lazyLine(b, c);
          break;
        case 14:
          lazyLine(c, d);
          break;
      }

      index++;
    }
    index++; // account for the skipped column
  }

  // CIRCLE MASK
  // drawingContext.globalCompositeOperation = 'destination-in';
  // fill(0,99,88,100);
  // noStroke();
  // circle(width/2, height/2, width*.98);
  // drawingContext.globalCompositeOperation = 'source-over';

  fill(0);
  stroke(255);
  text("FPS: " + frameRate().toFixed(2), 10, height - 10);
  // fr.html(Math.floor(frameRate()));
  // lblKnob.html(knob1.value());
  ////// END DRAW

  exportVideo && capturer.capture(document.getElementById('defaultCanvas0'));
}

function _lerp (x0, x1, y0, y1, x) {
  if (x0 === x1) {
    return null;
  }

  return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
};
function lazyLine(vec_a, vec_b) {
  line(vec_a.x, vec_a.y, vec_b.x, vec_b.y);
}
function cellValue(a, b, c, d) {
  return (round(a) << 3) + (round(b) << 2) + (round(c) << 1) + round(d);
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
