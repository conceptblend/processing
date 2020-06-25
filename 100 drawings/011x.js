class CircleIterator {
    constructor(radius, steps) {
      this.radius = radius;
      this.steps = steps;
      this.currentIndex = 0;
      this.theta = 360 / steps; // Relies on angleMode(DEGREES)
    }
    getIndex() {
      return this.currentIndex;
    }
    getProgress() {
      return this.currentIndex / this.steps;
    }
    next() {
      if (this.currentIndex < this.steps) {
        let x = cos(this.theta * this.currentIndex) * this.radius;
        let y = sin(this.theta * this.currentIndex) * this.radius;
        this.currentIndex++;
        return {
          x: x,
          y: y
        };
      } else {
        return null;
      }
    }
  }
  
  class CurveBall {
    constructor(radius, steps, offset) {
      this.radius = radius;
      this.steps = steps;
      this.offset = offset;
      this.circ1 = new CircleIterator(radius, steps);
      this.circ2 = new CircleIterator(radius * 1.8, steps);
      this.makeMark = function(point1, point2, offset, c) {
        let rp1 = {
          x: point1.x + offset,
          y: point1.y + offset
        };
        let rp2 = {
          x: point2.x + offset,
          y: point2.y + offset
        };
  
        strokeWeight(1);
        stroke(c);
        noFill();
  
        // line(rp1.x, rp1.y, rp2.x, rp2.y);
        bezier(rp1.x, rp1.y, rp1.x + 7, offset, rp1.x - 17, offset, rp2.x, rp2.y);
      }
    }
    step() {
      let p1 = this.circ1.next();
      let p2 = this.circ2.next();
      if (p1 !== null && p2 !== null) {
        let c = color(this.circ1.getProgress() * 255, 255, 128, 128);
        this.makeMark(p1, p2, this.offset, c);
        return true;
      } else {
        return false;
      }
    }
  }
  
  const g_margin = 20;
  const g_drawable_area = 400;
  
  const increment = 2;
  const maxIterations = 360 / increment;
  
  let curvy = new CurveBall(100, maxIterations, g_drawable_area / 2 + g_margin);
  let curvy2 = new CurveBall(120, maxIterations, g_drawable_area / 2 + g_margin);
  let curvy3 = new CurveBall(140, maxIterations, g_drawable_area / 2 + g_margin);
  
  function setup() {
    const canvas_size = g_drawable_area + 2 * g_margin;
  
    colorMode(HSL, 255);
    angleMode(DEGREES);
  
    createCanvas(canvas_size, canvas_size);
    background(0);
  
    frameRate(30);
    //noLoop();
  }
  
  function draw() {
    // ORs do them in series
    let keepGoing = curvy.step() || curvy2.step() || curvy3.step();
    // ANDs do them in parallel
    // let keepGoing = curvy.step() && curvy2.step() && curvy3.step();
  
    if (keepGoing == false) {
      console.log("Done");
      noLoop();
    }
  }