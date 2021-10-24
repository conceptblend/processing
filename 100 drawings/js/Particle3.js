class Particle {
    constructor() {
        this.pos = createVector(random(width),random(height));
        this.prev = this.pos.copy();
        this.velocity = createVector(0,0);
        this.acceleration = createVector(0,0);
        this.size = 1+random(48);
    }

    update() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(4);
        this.pos.add(this.velocity);
        this.acceleration.mult(0);
    }

    applyForce(force) {
        this.acceleration.add(force);
    }
    
    show() {
        /** BEGIN WEIRD LINES */
        // stroke(100, 40);
        // strokeWeight(4);
        // // line(this.pos.x, this.pos.y, this.prev.x, this.prev.y);
        // push();
        // translate(this.pos.x, this.pos.y);
        // rotate(this.velocity.heading() + knob1.value()/100*PI);
        // line(0, 0, this.size, 0);
        // pop();
        /** END WEIRD LINES */
        
        /** BEGIN CIRCLES */
        // noStroke();
        // fill(100, 10); // white
        // ellipse(this.pos.x, this.pos.y, this.size + knob1.value()*2);
        /** END CIRCLES */

        /** BEGIN TINY PARTICLES */
        noStroke();
        fill(100); // white
        ellipse(this.pos.x, this.pos.y, 2);
        /** END TINY PARTICLES */


        // this.updatePrevious();
    }
    
    updatePrevious(){
        this.prev.x = this.pos.x;
        this.prev.y = this.pos.y;
    }

    edges() {
        if (this.pos.x > width || this.pos.x < 0) {
            this.pos.x = random(width);
            this.pos.y = random(height);
        }
        if (this.pos.y > height || this.pos.y < 0) {
            this.pos.x = random(width);
            this.pos.y = random(height);
        }
        // if (this.pos.x > width) {
        //     this.pos.x = 0;
        //     this.updatePrevious();
        // } else if (this.pos.x < 0) {
        //     this.pos.x = width;
        //     this.updatePrevious();
        // }
        // if (this.pos.y > height) {
        //     this.pos.y = 0;
        //     this.updatePrevious();
        // } else if (this.pos.y < 0) {
        //     this.pos.y = height;
        //     this.updatePrevious();
        // }
    }
}