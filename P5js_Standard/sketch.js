function setup() {
  // put setup code here
    createCanvas(windowWidth, windowHeight);
    size = random(20,100)
}
function draw() {
  // put drawing code here
    background(255,0,0)
    ellipse(50, 50, 50, 50);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    console.log("resize");
}
