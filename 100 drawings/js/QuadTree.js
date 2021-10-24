class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Rect {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    // Sugar ;)
    this.l = x;
    this.t = y;
    this.r = x + w;
    this.b = y + h;
    this.mx = x + w / 2;
    this.my = y + h / 2;
  }
  contains(point) {
    return (
      point.x >= this.l &&
      point.x < this.r &&
      point.y >= this.t &&
      point.y < this.b
    );
  }
}

/**
 * QuadTree for custom, simple Point{x,y}.
 */
class QuadTree {
  constructor(region, capacity) {
    this.region = region;
    this.capacity = capacity;
    this.points = [];
    this.divided = false;
    this.subregions = {
      nw: null,
      ne: null,
      sw: null,
      se: null,
    };
  }

  hasCapacity() {
    return this.points.length < this.capacity;
  }

  subdivide() {
    let halfW = this.region.w / 2;
    let halfH = this.region.h / 2;

    this.subregions.nw = new QuadTree(
      new Rect(this.region.x, this.region.y, halfW, halfH),
      this.capacity
    );
    this.subregions.ne = new QuadTree(
      new Rect(this.region.mx, this.region.y, halfW, halfH),
      this.capacity
    );
    this.subregions.sw = new QuadTree(
      new Rect(this.region.x, this.region.my, halfW, halfH),
      this.capacity
    );
    this.subregions.se = new QuadTree(
      new Rect(this.region.mx, this.region.my, halfW, halfH),
      this.capacity
    );
    this.divided = true;
  }

  insert(point) {
    if (!this.region.contains(point)) return false; // not in my region

    if (this.hasCapacity() && !this.divided) {
      // finish insert
      this.points.push(point);
      return true;
    } else {
      // subdivide and insert
      if (!this.divided) {
        this.subdivide();

        // insert all previous points
        let n = this.points.length;
        for (var p = 0; p < n; p++) {
          // attempt to insert into child regions
          this.insertIntoRegion(this.points.pop());
        }
      }

      // attempt to insert into child regions
      return this.insertIntoRegion(point);
    }
    return false;
  }
  insertIntoRegion(point) {
    if (this.subregions.nw.insert(point)) return true;
    if (this.subregions.ne.insert(point)) return true;
    if (this.subregions.sw.insert(point)) return true;
    if (this.subregions.se.insert(point)) return true;
  }

  query(range) {
    let found = [];

    if (!this.region.intersects(range)) return found; // empty array

    if (this.divided) {
      found = found.concat(
        this.subregions.nw.query(range),
        this.subregions.ne.query(range),
        this.subregions.sw.query(range),
        this.subregions.se.query(range)
      );
    } else {
      this.points.forEach((p) => {
        if (range.contains(p)) {
          found.push(p);
        }
      });
    }
    return found;
  }

  flatten() {
    let found = [];

    if (this.divided) {
      found = found.concat(
        this.subregions.nw.flatten(),
        this.subregions.ne.flatten(),
        this.subregions.sw.flatten(),
        this.subregions.se.flatten()
      );
    } else {
      found = found.concat(this.points);
    }
    return found;
  }

  print() {
    console.log('== == == == ==\n');
    console.log('QuadTree Print ==');
    console.log(`  > Points: ${this.points.length}`);
    console.log(`  > Divided: ${this.divided}`);
    console.log(this);
    if (this.points.length > 0) {
      console.log(this.points);
    }

    // console.log(`  > Subregion: NW`);
    // if (this.subregions.nw !== null) this.subregions.nw.print();
    // console.log(`  > Subregion: NE`);
    // if (this.subregions.ne !== null) this.subregions.ne.print();
    // console.log(`  > Subregion: SW`);
    // if (this.subregions.sw !== null) this.subregions.sw.print();
    // console.log(`  > Subregion: SE`);
    // if (this.subregions.se !== null) this.subregions.se.print();
  }
}

let w = 200;
let h = 200;
let r = new Rect(0, 0, w, h);

let qt = new QuadTree(r, 4);

for (var n = 0, len = 5; n < len; n++) {
  qt.insert(
    new Point(Math.floor(Math.random() * w), Math.floor(Math.random() * h))
  );
}

// qt.print();
console.log('- - - - - - - - -');
let s = qt.flatten();
console.log(s);
