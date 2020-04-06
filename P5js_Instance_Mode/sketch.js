const sketch = (p) => {
    p.setup = function() {
        p.createCanvas(p.windowWidth, p.windowHeight)
    }
    p.draw = function() {
      // put drawing code here
        p.background(255,0,0)
        p.ellipse(50, 50, 80, 80)
    }
    p.windowResized = function()  {
        p.resizeCanvas(p.windowWidth, p.windowHeight)
        console.log("resize")
    }
}
let myp5 = new p5(sketch)
