      // the frame rate
      var fps = 24;

      // the canvas capturer instance
      // var capturer = new CCapture({ format: 'png', framerate: fps });

      const margin = 40;
      var iter = 0;

      function setup() {
        const canvas_size = 500 + 2 * margin;
        colorMode(RGB, 255);

        createCanvas(canvas_size, canvas_size);
        angleMode(DEGREES);
        ellipseMode(CORNER);
        // this is optional, but lets us see how the animation will look in browser.
        frameRate(fps);

        // start the recording
        // capturer.start();
      }

      function draw() {
        let base_x = width / 2;
        let base_y = height / 2;

        // if we have passed t=1 then end the animation.
        if (iter > 256) {
          noLoop();
          console.log('finished recording.');
          // capturer.stop();
          // capturer.save();
          return;
        }
        //background(16);
        background('#5A051B');
        //background("#3E5A0F");

        for (let i = 24; i > 0; i--) {
          cycle(5 * i * log(i) + iter, base_x, base_y);
        }

        iter++;

        // capturer.capture(document.getElementById('defaultCanvas0'));
      }

      function cycle(size, cx, cy) {
        let steps = 12;
        let alpha = 360 / steps;
        let center_x = cx || width / 2;
        let center_y = cy || height / 2;
        for (let n = 0; n < steps; n++) {
          drawEllipse(center_x, center_y, 1.6 * size + n * alpha, size);
        }
      }

      function drawEllipse(x, y, theta, size) {
        strokeWeight(1);
        stroke(255, 255, 255, 92);
        noFill();

        push();
        translate(x, y);
        rotate(theta);
        ellipse(0, 0, size, size * 0.4);
        pop();
      }