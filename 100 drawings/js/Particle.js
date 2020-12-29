class Particle {
    constructor() {
        this.pos = createVector(random(width),random(height));
        this.prev = this.pos.copy();
        this.velocity = createVector(0,0);
        this.acceleration = createVector(0,0);
        this.size = 10+random(48);
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
        stroke(100, 40);
        strokeWeight(4);
        // line(this.pos.x, this.pos.y, this.prev.x, this.prev.y);
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.velocity.heading()+90);
        line(0, 0, this.size, 0);
        pop();
        

        // noStroke();
        // fill(100, 20); // white
        // ellipse(this.pos.x, this.pos.y, this.size);
        // this.updatePrevious();
    }
    
    updatePrevious(){
        this.prev.x = this.pos.x;
        this.prev.y = this.pos.y;
    }

    edges() {
        if (this.pos.x > width) {
            this.pos.x = 0;
            this.updatePrevious();
        } else if (this.pos.x < 0) {
            this.pos.x = width;
            this.updatePrevious();
        }
        if (this.pos.y > height) {
            this.pos.y = 0;
            this.updatePrevious();
        } else if (this.pos.y < 0) {
            this.pos.y = height;
            this.updatePrevious();
        }
    }
}