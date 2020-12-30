let isRecording = false;
let exportVideo = true;

const g_canvas_size = 400;

const fps = 30;

const numParticles = 250;
const inc = 0.05;
const scale = 10;
const half_scale = scale / 2;
/**
 * 500, 0.05, 5
 * 500, 0.05, 10
 * 250, 0.05, 20
 */

var zOff = 0;
var rows, cols;
var particles = [];
var flowfield;

var isActive = true;



// the canvas capturer instance
var capturer = exportVideo && new CCapture({ format: 'png', framerate: fps });

function setup() {

  colorMode(HSB, 100);
  // angleMode(DEGREES);
  // pixelDensity(1);

  createCanvas(g_canvas_size, g_canvas_size);

  rows = Math.floor(height / scale);
  cols = Math.floor(width / scale);

  particles = new Array(numParticles);
  flowfield = new Array(rows * cols);
  for (var n=0, len=particles.length; n<len; n++) {
    particles[n] = new Particle();
  }
  

  controlPanel = createDiv('');

  let blue = color(201/360*100, 91, 82);
  let purple = color(253/360*100, 79,51);

  background(purple);
  colorPicker = createColorPicker(purple);
  // colorPicker.position(0, height + 5);

  fr = createP('');

  knob1 = createSlider(0, 100, 0, 5);
  knob1.style('width', '100px');
  lblKnob = createP('');

  chkEraseOnRedraw = createCheckbox('Erase on Redraw', false);
  chkShowFlowField = createCheckbox('Show Flow Field', true);
  chkShowParticles = createCheckbox('Show Particles', true);
  chkRecordVideo = createCheckbox('Record Video', false);

  controlPanel.child(colorPicker);
  controlPanel.child(fr);
  controlPanel.child(knob1);
  controlPanel.child(lblKnob);
  controlPanel.child(chkEraseOnRedraw);
  controlPanel.child(chkShowFlowField);
  controlPanel.child(chkShowParticles);
  controlPanel.child(chkRecordVideo);
  
  frameRate(fps);
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
  }
  
  /**
   * Prep the drawing tools for the flow field (if it's being rendered)
   */
  strokeWeight(1);
  // stroke(color(c * 100, 80, 60, 5));
  // stroke(color(0, 0, 100));
  stroke(color(201/360*100, 91, 50));
  /**
   * Done prepping drawing tools.
   */

  let index = 0;
  let yOff = 0;
  for (var y=0; y < rows; y++) {
    
    let xOff = 0;
    for (var x=0; x < cols; x++) {
      
      let c = noise(xOff, yOff, zOff);
      let v = p5.Vector.fromAngle(PI + (c * TWO_PI));
      // v.setMag(5);
      // flowfield[x + y * cols] = v;
      flowfield[index++] = v;

      if (chkShowFlowField.checked()) {
        push();
        translate(x * scale + half_scale, y * scale + half_scale);
        rotate(v.heading());
        line(0, 0, scale * .66, 0);
        pop();
      }
    
      xOff += inc;
    }
    yOff += inc;
  }
  zOff += 0.015;

  if (chkShowParticles.checked()) {
    for (var p=0, len=particles.length; p<len; p++) {
      let particle = particles[p];

      let px = Math.floor(particle.pos.x / scale);
      let py = Math.floor(particle.pos.y / scale);

      particle.applyForce(flowfield[px + py * cols]);
      particle.update();
      particle.edges();
      particle.show();
    }
  }

  fr.html(Math.floor(frameRate()));
  lblKnob.html(knob1.value());
  ////// END DRAW

  exportVideo && capturer.capture(document.getElementById('defaultCanvas0'));
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