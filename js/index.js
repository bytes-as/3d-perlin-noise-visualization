var scale;
var inc;
var cols, rows;
var xoff;
var yoff;
var foff;
// var fr;
var particles = [];

var flowfield;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // createCanvas(200,200);
  scale = 10;
  inc = 0.1;
  foff = 0;
  rows = floor(height/scale);
  cols = floor(width/scale);
  // fr = createP('');
  for(var i=0; i<15000; i++){
    particles[i] = new particle();
  }
  flowfield = new Array(cols * rows);
}

function draw() {
  // background(255);
  yoff = 0;
  for(var y=0; y<rows; y++) {
    xoff = 0;
    for(var x=0; x<cols; x++){
      var index = x + y * cols;
      var angle = noise(xoff, yoff, foff) * TWO_PI * 4;
      var v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      flowfield[index] = v;
      // rect(x*scale, y*scale, scale,scale);
      // stroke(0, 50);
      // strokeWeight(1);
      // push();
      // translate(x*scale, y*scale);
      // rotate(v.heading());
      // line(0, 0, scale, 1);
      // pop();
      xoff += inc;
    }
    yoff += inc;
  }
  for(var i=0; i<particles.length; i++){
    particles[i].show();
    particles[i].update();
    particles[i].follow(flowfield);
  }
  foff += inc/10;
  // fr.html("width: " + width + " height: " + height+ " frame rate: " + floor(frameRate()));
}

function particle() {
  this.pos = createVector(random(width), random(height));
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.maxspeed = 2;
  this.previous = this.pos.copy();

  this.update = function() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.edge();
    this.vel.limit(this.maxspeed);
  }

  this.applyForce = function(force) {
    this.acc.add(force);
  }

  this.show = function() {
    stroke(0, 5);
    strokeWeight(1);
    point(this.pos.x, this.pos.y);
    stroke(0, 5);
    strokeWeight(1);
    line(this.pos.x, this.pos.y, this.previous.x, this.previous.y);
    this.updatePrevious();
  }

  this.updatePrevious = function() {
    this.previous.x = this.pos.x;
    this.previous.y = this.pos.y;
  }

  this.edge = function() {
    if(this.pos.x > width){
      this.pos.x = 0;
      this.updatePrevious();
    }
    if(this.pos.x < 0) {
      this.pos.x = width;
      this.updatePrevious();
    }
    if(this.pos.y > height){
      this.pos.y = 0;
      this.updatePrevious();
    }
    if(this.pos.y < 0){
      this.pos.y = height;
      this.updatePrevious();
    }
  }

  this.follow = function(vectors) {
    var x = floor(this.pos.x / scale)
    var y = floor(this.pos.y / scale)
    var index = x + y * cols;
    var force = vectors[index];
    this.applyForce(force);

  }
}
