const g_margin = 20;
const g_drawable_area = 400;

//
// L-System initiation
//
const lineLength = 6;
const lineScale = 1.8;
let angle = 0;
const rules = [
  ["F", "F+F-F-F+F"]
];

let direction = 1;


function setup() {
  let canvas_size = g_drawable_area + 2 * g_margin;
  colorMode(HSL, 255);
  angleMode(DEGREES);
  
  createCanvas(canvas_size, canvas_size);

  background(0);
  frameRate(16);
}



function draw() {
  
  
  let l = new Lindenmayer();
  let axiom = "F";
  let s = axiom;
  let iterations = 4;

  for (let i = 0; i < iterations; i++) {
    s = l.iterate(s);
  }
  push();
  translate(g_margin, g_drawable_area + g_margin);
  rotate(-45);
  l.draw(s);
  rotate(45);
  l.draw(s);
  pop();

  angle += direction;
  if (angle <= 0 || angle >= 90) {
    direction = -direction;
  }
  l.setAngle(angle);
  if (angle == 80) {
    noLoop();
  }
}

//
//  s <string>: The string defining the system
//
class Lindenmayer {
  constructor() {
    this.lineLength = lineLength;
    this.lineScale = lineScale;
    this.angle = angle;
    this.rules = rules;
  }

  iterate(s) {
    let len = s.length;
    let _s = "";
    for (let n = 0; n < len; n++) {
      let c = s[n];
      let r = this.getSymbolReplacement(c);

      if (r !== null) {
        _s += r;
      } else {
        _s += c;
      }
    }
    return _s;
  }

  draw(s) {
    // console.log(s);

    let theta = 0;
    let x = 0;
    let y = 0;
    let _x, _y;

    for (let n = 0, len = s.length; n < len; n++) {
      let c = s[n];
      // console.log(c);
      switch (c) {
        case "F":
          _x = x + cos(theta) * this.lineLength;
          _y = y + sin(theta) * this.lineLength;
          stroke(random(32, 108), 255, 128, 128);
          // circle(_x, _y, 2);
          line(x, y, _x, _y);
          x = _x;
          y = _y;
          break;
        case "+":
          theta -= this.angle;
          break;
        case "-":
          theta += this.angle;
          break;
        default:
          break;
      }
    }
  }
  setAngle(a) {
    this.angle = a;
  }

  getSymbolReplacement(symbol) {
    let found = false;
    let index = 0;
    let replacement = null;
    while (index < this.rules.length && !found) {
      if (this.rules[index][0] === symbol) {
        replacement = this.rules[index][1];
        found = true;
      }
      index++;
    }
    return replacement;
  }

}