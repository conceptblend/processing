const fps = 8;
const g_margin = 20;
const g_drawable_area = 400;

let l;

function setup() {
  let canvas_size = g_drawable_area + 2 * g_margin;
  colorMode(HSB, 255);
  angleMode(DEGREES);

  createCanvas(canvas_size, canvas_size);

  background(0);
  frameRate(16);
  noLoop();

  const lineLength = 3;
  const lineScale = 1.0;
  const angle = 90;
  const rules = [
    ['X', 'X+YF+'],
    ['Y', '-FX-Y']
  ];
  //(X → X+YF+), (Y → −FX−Y)
  //const fnDraw = Lindenmayer.defaultFnDraw();
  const fnDraw = function(x1, y1, x2, y2) {
    // ICE
    stroke(random(122, 165), 255, 255, 48);
    // FIRE
    // stroke(random(0, 34), 255, 255, 48);

    noFill();
    circle(x2, y2, 1);
    // line(x1, y1, x2, y2);
  }
  l = new Lindenmayer(rules, fnDraw, angle, lineLength, lineScale);
  l.setAxiom('FX');
  let iterations = 14;

  for (let i = 0; i < iterations; i++) {
    l.iterate();
  }
}

function draw() {
  // ICE
  background(185, 255, 16);
  // FIRE
  // background(34, 255, 16);

  push();
  translate(g_margin + g_drawable_area*.625, g_drawable_area * 0.35 + g_margin);
  l.draw();
  for (let n=0; n<7; n++) {
    rotate(-7);
    l.draw();
  }
  pop();
}

function keyPressed () {
  if (key == 'p') {
    noLoop();
  } else if (key == 's') {
    loop();
  }
}