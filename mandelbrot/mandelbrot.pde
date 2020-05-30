// Settings
boolean useFullscreen = true;

// z = z^2 + c
int power = 8;
int iterations = int(pow(2, power));
int threshold_radius = 2^4;

int canvasWidth, canvasHeight;

// These are global so they can be shared
float frame_left, frame_top, frame_width, frame_height;

int downX, downY;

//
// Set up color palette
//
color[] colors = new color[iterations > 256 ? iterations : 256];

// Calculates the base-2 logarithm of a number
float log2 (int x) {
  return (log(x) / log(2));
}

void settings() {
  if (useFullscreen == true) {  
    // For fullscreen
    fullScreen();
    //canvasWidth = width;
    //canvasHeight = height;
  } else {
    // For fixed dimensions
    canvasWidth = 1200;
    canvasHeight = 800;
    size(canvasWidth, canvasHeight);
  }
  pixelDensity(displayDensity());
}

void setup() {
  colorMode(HSB, 255);
  background(255, 0, 255);
  //noFill();
  noStroke();
  //noLoop();

  //
  // Set up color palette
  //
  int val = 0;
  int max = 255;
  colors[colors.length-1] = color(0,0, 255);
  int len = colors.length;
  for (int i = 0; i < len-1; i++) {
    val = round(log2(i) / power * max);
    //colors[i] = color((3*val) % max, 210, val);
    //colors[i] = color(64, 210, val);
    //colors[i] = color(78, 210, val);
    colors[i] = color(0,i/4,i);
  }


  resetMandelbrot();
}

float getFrameHeightFromWidth(float w) {
  return w * (float)height / (float)width;
}

void resetMandelbrot() {
  // Initial setup
  frame_width = 3.25;
  frame_height = getFrameHeightFromWidth(frame_width);
  float frame_center_x = -0.5;//(-2.5 + .75) / 2;
  float frame_center_y = 0;

  renderMandelbrot(frame_center_x, frame_center_y, frame_width, frame_height);
}

void renderMandelbrot(float cx, float cy, float w, float h) {
  frame_left = cx - w/2;
  frame_top = cy + h/2;
  frame_width = w;
  frame_height = h;

  double x_inc = frame_width / (double)pixelWidth;
  double y_inc = frame_height / (double)pixelHeight;

  loadPixels();

  for (int y = 0; y < pixelHeight; y++) {
    double y0 = frame_top - y * y_inc;
    for (int x = 0; x < pixelWidth; x++) {
      int i = 0;
      double x0 = frame_left + x * x_inc;
      double x_temp = 0, zx = 0, zy = 0;

      while (i < iterations && zx * zx + zy * zy < threshold_radius) {
        x_temp = zx * zx - zy * zy + x0;
        zy = 2 * zx * zy + y0;
        zx = x_temp;

        i++;
      }
      pixels[x + y * pixelWidth] = colors[i-1];
    }
  }

  updatePixels();
}

void draw () {
  if (mousePressed) {
    updatePixels();
    stroke(0, 255, 255);
    noFill();
    rect(downX, downY, mouseX-downX, mouseY-downY);
  }
}

void keyPressed() {
  if (key == 'r') {
    resetMandelbrot();
  } else if (key == 's') {
    save("frame-"+year()+"-"+month()+"-"+day()+"-"+hour()+"h"+minute()+"m"+second()+"s.png");
  }
}
void mousePressed() {
  downX = mouseX;
  downY = mouseY;
}

void mouseReleased() {
  float[] coordsA = mapCoord(downX, downY);
  float[] coordsB = mapCoord(mouseX, mouseY);
  float cx = (coordsA[0] + coordsB[0])/2;
  float cy = (coordsA[1] + coordsB[1])/2;
  float w = abs(coordsA[0] - coordsB[0]);

  println("New position:", cx, cy, w, getFrameHeightFromWidth(w));

  renderMandelbrot(cx, cy, w, getFrameHeightFromWidth(w));
}


float[] mapCoord(int x, int y) {
  // mouse points don't respect the pixel density so don't use pixelWidth or pixelHeight
  float nx = frame_left + ((float)x / width) * frame_width;
  float ny = frame_top - ((float)y / height) * frame_height;
  float[] retval = { nx, ny };
  return retval;
}
