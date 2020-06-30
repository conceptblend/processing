const fps = 16;
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

  const lineLength = 4;
  const lineScale = 1.0;
  const angle = 54;
  const rules = [
    ['F', 'F+F-F-F+F']
  ];
  const fnDraw = function(x1, y1, x2, y2) {
    stroke(random(100, 146), 255, 255, 128);
    noFill();
    circle(x2, y2, 2);
    //line(x1, y1, x2, y2);
  }

  l = new Lindenmayer(rules, fnDraw, angle, lineLength, lineScale);
  l.setAxiom('F');
}

function draw() {
  let iterations = 4;

  for (let i = 0; i < iterations; i++) {
    l.iterate();
  }
  push();
  translate(g_margin, g_drawable_area * 0.5 + 2 * g_margin);
  l.draw();
  pop();
}
