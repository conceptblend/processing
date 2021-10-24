let isRecording = false;
let exportVideo = false;

const g_canvas_size = 250;

const fps = 24;

const numParticles = 5000;
const inc = 0.05;
var scale;
/**
 * 500, 0.05, 5
 * 500, 0.05, 10
 * 250, 0.05, 20
 */

var zOff = 0;
var rows, cols;
var particles = [];
var flowfield;
var brightnessfield;

var isActive = true;

// the canvas capturer instance
var capturer = exportVideo && new CCapture({ format: 'png', framerate: fps });

var img;

function preload() {
  img = loadImage('./cube1.png');
}

function setup() {

  colorMode(HSB, 255);
  // angleMode(DEGREES);
  // pixelDensity(1);

  createCanvas(g_canvas_size, g_canvas_size);
  // background(color(201/360*100, 91, 82));
  // background(img);


  scale = 8; //g_canvas_size / img.width;

  rows = Math.ceil(height/scale);
  cols = Math.ceil(width/scale);

  particles = new Array(numParticles);
  flowfield = new Array(rows * cols);
  brightnessfield = new Array(rows * cols);

  for (var n=0, len=particles.length; n<len; n++) {
    particles[n] = new Particle();
  }
  
  let index = 0;
  for (var y = 0; y < rows; y++) {
    for (var x = 0; x < cols; x++) {
      let c = img.get(x*2*scale, y*2*scale);
      brightnessfield[index] = brightness(c);
      flowfield[index] = p5.Vector.fromAngle(brightnessfield[index]/255 * TWO_PI).normalize();
      index++;
    }
  }
  
  chkShowField = createCheckbox('Show Field', false);
  fr = createP('');
  
  // frameRate(fps);
  // noLoop();
  
}

function draw() {
  // background(color(201/360*100, 91, 82));
  background(0);
  if (!isRecording && exportVideo) {
    // start the recording after the animation loop has begun
    capturer.start();
    isRecording = true;
  }
  ////// BEGIN DRAW
  if (chkShowField.checked()) {
    // let index = 0;

    // let half_scale = scale/2;
    // let third_scale = scale/3;
    // strokeWeight(1);
    // stroke(color(201/360*100, 91, 50));
    // for (var y=0; y < rows; y++) {
    //   let transY = y * scale + half_scale;
    //   for (var x=0; x < cols; x++) {
    //     let v = flowfield[index++]
    //     push();
    //     translate(x * scale + half_scale, transY);
    //     rotate(v.heading());
    //     line(0, 0, third_scale, 0);
    //     point(third_scale, 0);
    //     pop();
    //   }
    // }
    let index = 0;
    
    for (var y=0; y < rows; y++) {
      for (var x=0; x < cols; x++) {
        let v = brightnessfield[index++]
        stroke(color(v));
        point(x*scale, y*scale);
      }
    }
  }

  if (!chkShowField.checked()) {
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