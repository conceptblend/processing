let qt;
let particles = [];

const exportVideo = !true;
let cnvsrecorder;
const fps = 24;
const maxDuration = 15; // seconds

const presets = {
  play: {
    count: 120,
    coiRadius: 80, // Circle of Influence (COI)
    minSpeed: 1.0,
    maxSpeed: 2.0,
  },
  preset1: {
    count: 100,
    coiRadius: 80, // Circle of Influence (COI)
    minSpeed: 0.1,
    maxSpeed: 1.0,
  },
  preset2: {
    count: 100,
    coiRadius: 80, // Circle of Influence (COI)
    minSpeed: 0.1,
    maxSpeed: 1.0,
  },
};

const settings = presets.play;

class Dot {
  constructor(vPosition, vDirection) {
    this.pos = vPosition;
    this.dir = vDirection;
    this.id = new Date().getTime() + '-' + Math.floor(Math.random() * 1000000);
  }
  tick() {
    this.pos.add(this.dir);
  }
}

function createTexture(w, h, renderer) {
  let pg = createGraphics(w, h, renderer ?? P2D);
  // pg.smooth(0); //0
  pg.blendMode(REPLACE);
  pg.clear();
  // pg.noStroke();
  return pg;
}

let tex;
const g_canvasSize = 540;
function setup() {
  createCanvas(g_canvasSize, g_canvasSize);
  frameRate(fps);
  pixelDensity(2);
  strokeWeight(1);
  // stroke(192);
  noFill();
  noSmooth();

  // tex = createTexture(g_canvasSize, g_canvasSize);
  // tex.background(0);
  // tex.noFill();
  // tex.strokeWeight(2);
  // tex.strokeJoin(ROUND);
  // tex.stroke(255);

  qt = new QuadTree(new Rect(0, 0, width, height), 4);

  for (let n = 0; n < settings.count; n++) {
    particles.push(
      new Dot(
        createVector(random(width), random(height)),
        createVector(
          (n % 2) *
            (settings.minSpeed +
              Math.random() *
                (settings.maxSpeed - settings.minSpeed) *
                Math.sign(Math.random() - 0.5)),
          ((n + 1) % 2) *
            (settings.minSpeed +
              Math.random() *
                (settings.maxSpeed - settings.minSpeed) *
                Math.sign(Math.random() - 0.5))
        )
      )
    );
  }
  particles.forEach((p) => qt.insert(p));

  if (exportVideo) {
    cnvsrecorder = new CanvasRecorder(fps);
    cnvsrecorder.start();
  }

  startTime = Date.now();

}

function draw() {
  background(0);
  // tex.clear();

  // let particles = qt.flatten();
  particles.forEach((p) => {
    // console.log(p);
    // noStroke();
    // circle(p.pos.x, p.pos.y, 4);

    let neighbours = qt.query(
      new Rect(
        p.pos.x - settings.coiRadius,
        p.pos.y - settings.coiRadius,
        2 * settings.coiRadius,
        2 * settings.coiRadius
      )
    );
    if (neighbours.length > 0) {
      neighbours.forEach((n) => {
        let dist = p5.Vector.dist(p.pos, n.pos);
        let frac = dist/settings.coiRadius;
        let fracInv = 1 - frac;

        // Only draw to neighbors since `p` should be within the set.
        // TODO: Still drawing lines twice... I think.
        if (p.id !== n.id && dist < settings.coiRadius) {
          let sign = Math.sign(p.pos.y - n.pos.y);
          stroke(
            255, 
            128 - sign*64, 
            128 + sign*64, 
            255 - (dist / settings.coiRadius) * 255
          );

          // let c = lerpColor(
          //   color(0),
          //   color(
          //     255,
          //     128 - sign*64, 
          //     128 + sign*64
          //   ),
          //   fracInv
          // )
          // stroke(c);

          // stroke(fracInv * 255);

          line(p.pos.x, p.pos.y, n.pos.x, n.pos.y);
        }
      });
    }
  });

  if (exportVideo && ((Date.now() - startTime) / 1000 >= maxDuration)) {
    cnvsrecorder.stop(`${getName()}`);
    noLoop();
  }

  // Reset the QuadTree -- There's definitely a more efficient way to recalculate
  // each not after a tick but I'm being a bit lazy at the moment.
  qt.reset();

  // Advance each particle and bounce of walls
  particles.forEach((p) => {
    if (p.pos.x < 0 || p.pos.x > width) {
      p.dir.x *= -1;
    }
    if (p.pos.y < 0 || p.pos.y > height) {
      p.dir.y *= -1;
    }
    p.tick();

    // Add the updated node to the QuadTree
    qt.insert(p);
  });
}

function keyPressed() {
  if (key == 'p' || key == ' ') {
    noLoop();
  } else if (key == 's') {
    loop();
  } else if (key == 'd') {
    save(`${getName()}.png`);
  } else if (key == 'x') {
    noLoop();
    console.log('Done.');
    if (exportVideo) {
      cnvsrecorder.stop(`${getName()}`);
    }
  }
}

function getName() {
  return `ParticleWeb-count_${settings.count}-coiRadius_${settings.coiRadius}-minSpeed_${settings.minSpeed}-maxSpeed_${settings.maxSpeed}`;
}
