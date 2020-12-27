class Particle {
    constructor() {
        this.pos = createVector(random(width),random(height));
        this.prev = this.pos.copy();
        this.velocity = createVector(0,0);
        this.acceleration = createVector(0,0);
    }

    update() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(6);
        this.pos.add(this.velocity);
        this.acceleration.mult(0);
    }

    applyForce(force) {
        this.acceleration.add(force);
    }
    
    show() {
        stroke(0, 5);
        strokeWeight(1);
        line(this.pos.x, this.pos.y, this.prev.x, this.prev.y);
        // noStroke();
        // fill(0, 5);
        // ellipse(this.pos.x, this.pos.y, 2);
        this.updatePrevious();
    }
    
    updatePrevious(){
        this.prev.x = this.pos.x;
        this.prev.y = this.pos.y;
    }

    edges() {
        if (this.prev.x > width) {
            this.pos.x = 0;
            this.updatePrevious();
        } else if (this.prev.x < 0) {
            this.pos.x = width;
            this.updatePrevious();
        }
        if (this.prev.y > height) {
            this.pos.y = 0;
            this.updatePrevious();
        } else if (this.prev.y < 0) {
            this.pos.y = height;
            this.updatePrevious();
        }
    }
}