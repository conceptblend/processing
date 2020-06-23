const g_margin = 20;
const g_drawable_area = 400;

let wat = 1.6;
const isAnimated = false;

function setup() {
  const canvas_size = g_drawable_area + 2 * g_margin;

  colorMode(HSL, 255);

  createCanvas(canvas_size, canvas_size);

  if (isAnimated) {
    frameRate(8);
  } else {
    noLoop();
  }
}

function draw() {
  background(0);

  for (let n = 0; n < g_drawable_area; n += g_drawable_area / 48) {
    let p1 = {
      x: n,
      y: 32 - n / 12,
    };
    let p2 = {
      x: n,
      y: g_drawable_area * 1.1,
    };
    let p3 = {
      x: g_drawable_area * 0.2,
      y: n,
    };
    let p4 = {
      x: g_drawable_area,
      y: g_drawable_area - n / wat,
    };
    strokeWeight(1);
    stroke((n / g_drawable_area) * 255, 192, 128, 156);
    noFill();

    bezier(
      p1.x + g_margin,
      p1.y + g_margin,
      p2.x + g_margin,
      p2.y + g_margin,
      p3.x + g_margin,
      p3.y + g_margin,
      p4.x + g_margin,
      p4.y + g_margin
    );

    // let x = bezierPoint(p1.x, p2.x, p3.x, p4.x, 0.0);
    // let y = bezierPoint(p1.y, p2.y, p3.y, p4.y, 0.0)
    noStroke();
    fill((n / g_drawable_area) * 255, 192, 128, 156);
    ellipse(p1.x + g_margin, p1.y + g_margin, 3, 3);
    ellipse(p4.x + g_margin, p4.y + g_margin, 3, 3);
  }
  if (isAnimated) {
    wat -= 0.1;
    if (wat <= 0.5) {
      noLoop();
    }
  }
}
