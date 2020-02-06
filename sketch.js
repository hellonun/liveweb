//timelapse 2 == 428 frames / hour

let sineVal;
let sinVals = []
let ns = [];

let w = 1280/2;
let h = 720/2;
let capture;
let img;
let xnew = 0;
let ynew = 0;
let state = 0;
let nextFrame;

function setup() {
  canvas = createCanvas(2560, 2880);
  canvas.position(0,0);

  for (i = 0; i < 255; i++) {
    n = map(i, 0, 255, 90,270);
    ns.push(n);
  }

  for (i = 0; i < 255; i++) {
    sinVal = sin(radians(ns[i]));
    sinVal = map(sinVal, -1, 1, 255,0)
    sinVals.push(sinVal);
  }

  capture = createVideo('itptimelapse.mp4');
  capture.size(w, h);
  capture.volume(0);
  capture.position(w*4, 0);
  // capture.hide();

  pixelDensity(1);
  img = createImage(w, h);
}

function draw() {
  frameRate(6);
  if (state !=0) {
    capture.play();
    // nextFrame = floor(capture.duration()*6/24); // calculate when to skip
    // nextFrame = floor(capture.duration()*6/3);
    nextFrame = 60*5*6/24;
    drawFrame();
  }
}
function mousePressed() {
  state = state +1;
}

function drawFrame (){
  img.loadPixels();
  for (y = 0; y < h; y++) {
    for (x = 0; x < w; x++) {
      let p = capture.get(x, y);
      let gray = floor((p[0] + p[1] + p[2]) / 3);
      gray = sinVals[gray]
      let index = (x + y * w) * 4;
      if (frameCount > 5) {
        img.pixels[index + 0] = 0;
        img.pixels[index + 1] = 0;
        img.pixels[index + 2] = 0;
        img.pixels[index + 3] = gray/20;
      }
    }
  }
  img.updatePixels();
  image(img, xnew, ynew);

  if (frameCount%nextFrame == 0 ) {
  // if (frameCount%40 == 0 ) {
    xnew = xnew + w;
    if (xnew >= width) {
      xnew = 0;
      ynew = ynew + h;
    }
  }
}
function saveAs() {
  let filename = "hi";
  let buffer = createGraphics(this.width, this.height);

  buffer.loadPixels();
  this.loadPixels();

  for (let i = 0; i < this.pixels.length; i += 4) {
    buffer.pixels[i] = 0;
    buffer.pixels[i + 1] = 0;
    buffer.pixels[i + 2] = 0;
    buffer.pixels[i + 3] = this.pixels[i + 3];
  }
  buffer.updatePixels();
  buffer.save(filename);
}
