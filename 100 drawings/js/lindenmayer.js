class Lindenmayer {
  constructor(rules, fnDraw, angle, lineLength, lineScale) {
    if (rules == undefined) {
      throw new Error(
        "'rules' is undefined. Lindenmayer constructor expects them."
      );
    }
    if (fnDraw == undefined) {
      throw new Error(
        "'fnDraw' is undefined. Lindenmayer constructor expects it."
      );
    }

    this.rules = rules;
    this.fnDraw = fnDraw;
    this.lineLength = lineLength || 10; //default: 10
    this.lineScale = lineScale || 1; //default: 1
    this.angle = angle !== undefined ? angle : 90; //default: 90
    this.axiom = null;
    this.string = '';
  }
  static defaultFnDraw () {
    return function (x1, y1, x2, y2) {
      stroke(255);
      noFill();
      line(x1, y1, x2, y2);
    }
  };

  setAxiom(a) {
    this.axiom = a;
  }

  iterate() {
    if (this.string == '') {
      this.string = this.axiom;
    }
    let s = this.string;
    let len = s.length;
    let _s = '';
    for (let n = 0; n < len; n++) {
      let c = s[n];
      let r = this.getSymbolReplacement(c);

      if (r !== null) {
        _s += r;
      } else {
        _s += c;
      }
    }
    this.string = _s;
    return this.string; // returned in case anyone wants to do anything with it.... not sure this is necessary.
  }

  draw() {
    let theta = 0;
    let x = 0;
    let y = 0;
    let _x, _y;
    let lineLength = this.lineLength;
    let s = this.string;

    for (let n = 0, len = s.length; n < len; n++) {
      let c = s[n];
      switch (c) {
        case 'F':
          _x = x + cos(theta) * lineLength;
          _y = y + sin(theta) * lineLength;
          this.fnDraw(x, y, _x, _y);
          x = _x;
          y = _y;
          break;
        case '+':
          theta -= this.angle;
          break;
        case '-':
          theta += this.angle;
          break;
        default:
          break;
      }
      lineLength *= this.lineScale;
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
