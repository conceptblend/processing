let isRecording = false;
let exportVideo = false;

const g_margin = 20;
const g_drawable_area = 400;
const g_canvas_size = g_drawable_area + 2 * g_margin;

const fps = 24;
const g_scale = 1;

const numParticles = 5000;
const inc = 0.05;
const scale = 5;

var zOff = 0;
var rows, cols;
var particles = [];
var flowfield;

// the canvas capturer instance
// var capturer = exportVideo && new CCapture({ format: 'png', framerate: fps });


function setup() {

  colorMode(HSB, 100);
  // angleMode(DEGREES);
  // pixelDensity(1);

  createCanvas(g_canvas_size, g_canvas_size);
  background(color(201/360*100, 91, 82));

  rows = Math.floor(height / scale);
  cols = Math.floor(width / scale);

  particles = new Array(numParticles);
  flowfield = new Array(rows * cols);
  for (var n=0, len=particles.length; n<len; n++) {
    particles[n] = new Particle();
  }
  
  fr = createP('');
  
  frameRate(fps);
  // noLoop();
  
}

function draw() {
  // if (!isRecording && exportVideo) {
  //   // start the recording after the animation loop has begun
  //   capturer.start();
  //   isRecording = true;
  // }
  ////// BEGIN DRAW
  // background(100, 5);
  let index = 0;
  let yOff = 0;
  for (var y=0; y < rows; y++) {
    
    let xOff = 0;
    for (var x=0; x < cols; x++) {
      
      let c = noise(xOff, yOff, zOff);
      let v = p5.Vector.fromAngle(PI + c * TWO_PI);
      // v.setMag(5);
      // flowfield[x + y * cols] = v;
      flowfield[index++] = v;

      // strokeWeight(1);
      // stroke(color(c * 100, 80, 60, 5));

      // push();
      // translate(x * scale, y * scale);
      // rotate(v.heading());
      // line(0, 0, scale, 0);
      // pop();
    
      xOff += inc;
    }
    yOff += inc;
  }
  zOff += 0.0005;

  for (var p=0, len=particles.length; p<len; p++) {
    let particle = particles[p];

    let px = Math.floor(particle.pos.x / scale);
    let py = Math.floor(particle.pos.y / scale);

    // console.log(px);

    particle.applyForce(flowfield[px + py * cols]);
    particle.update();
    particle.edges();
    particle.show();
  }

  fr.html(Math.floor(frameRate()));
  ////// END DRAW

  // exportVideo && capturer.capture(document.getElementById('defaultCanvas0'));

  // if (!isActive) {
  //   noLoop();
  //   console.log('Done.');
  //   if (exportVideo) {
  //     capturer.stop();
  //     capturer.save();
  //   }
  // }
}

function keyPressed() {
  if (key == 'p' || key == ' ') {
    noLoop();
  } else if (key == 's') {
    loop();
  }
}