let countryLatLong
let selector
let flagPositions
let flags

function preload() {
    countryLatLong = loadTable('countries.csv', 'csv', 'header')
    flagPositions = loadJSON('flags32-iso-3166-1-alpha-2.json')
    flags = loadImage('flags32.png');
}

function setup() {
  // put setup code here
    createCanvas(windowWidth, windowHeight)
    selector = new CountrySelector(windowWidth/2, windowHeight/2)
    console.log(flagPositions["unknown"])
}
function draw() {
    background(15, 76, 129)
  // put drawing code here
    selector.display()
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
    selector.position(windowWidth/2, windowHeight/2)
    console.log("resize");
}


function mousePressed() {

}

class CountrySelector {
    constructor(X,Y) {
        textSize(20);
        textFont('Helvetica');
        this.x = X
        this.y = Y
        this.lat= 47
        this.long = 8
        this.countryCode = 'unknown'
        this.country = this.getCountryName(this.lat,this.long)
        this.flag =  flags.get(0, abs(flagPositions[this.countryCode]), 32,30)
        this.dimensions = {
            w:textWidth(this.country)+160,
            h:60
        }
    }
    display() {
        push()
        translate(this.x, this.y)
        strokeWeight(2)
        rectMode(CENTER)
        noStroke()
        fill(255,255,255)
        textSize(15);
        text("Please select country",-this.dimensions.w/2,-this.dimensions.h/2-10)
        textSize(20);
        rect(0, 0,  this.dimensions.w,  this.dimensions.h)
        if (mouseX > this.x-this.dimensions.w/2 && mouseX < this.x+this.dimensions.w/2 && mouseY > this.y-this.dimensions.h/2 && mouseY < this.y+this.dimensions.h/2 ) {
            cursor(HAND)
            if (mouseIsPressed) {
                this.coordinateFinder()
            } else {
                this.displayCountry()
            }
        } else {
            cursor(ARROW)
          this.displayCountry()
        }
        pop()
    }

    coordinateFinder() {
        TweenLite.to(this.dimensions,0.6, {
            w:350,
            h:350,
            ease: Quint.easeOut
        });
        let lat = map(mouseY, this.y -  this.dimensions.w/2, this.y +  this.dimensions.w/2, 90, -90)
        let long = map(mouseX, this.x -  this.dimensions.w/2, this.x +  this.dimensions.w/2, -180, 180)
        let NS = 'S'
        let EW = 'W'
        if (lat>0) {
            NS = 'N'
        }
        if (long>0) {
            EW = 'E'
        }
        let newCountry =  this.getCountryName(lat, long);
        if ( this.country = newCountry) {
            this.country = newCountry
            this.flag =  flags.get(0, abs(flagPositions[this.countryCode]), 32,30)
        }
        fill('black')
        textAlign(CENTER)
        text(this.deg_to_dms(abs(lat))+NS+", "+this.deg_to_dms(abs(long))+EW,0,8)
    }
    displayCountry() {
        TweenLite.to(this.dimensions,0.1, {
            w:textWidth(this.country)+160,
            h:60,
        });
        fill('black')
        textAlign(LEFT)
        text(this.country , -this.dimensions.w/2+80,8)
        push()
        translate(this.dimensions.w/2-50, 0)
        triangle(0, 0, 10, 10, 20, 0)
        pop()
        image(this.flag,-this.dimensions.w/2+30,-this.flag.height/2)
    }

    position(x, y) {
        this.x = x
        this.y = y
    }
    getCountryName(lat, long) {
        let nearestCountry = ""
        let distance = dist(-90,-180,90,180)
        for (let r = 0; r < countryLatLong.getRowCount(); r++) {
            let newLat =  float(countryLatLong.getString(r, 'Latitude'))
            let newLong = float(countryLatLong.getString(r, 'Longitude'))
            let newDistance = dist(lat, long, newLat, newLong)
            if (newDistance < distance) {
                distance = newDistance
                nearestCountry = countryLatLong.getString(r, 'Country')
                this.countryCode = countryLatLong.getString(r, 'ISO 3166 Country Code')
                this.countryCode = this.countryCode.toLowerCase()
            }
        }
        return nearestCountry
    }
     deg_to_dms(deg) {
         // converts decimal degrees to degrees-minutes-seconds
        let d = Math.floor (deg)
        let minfloat = (deg-d)*60
        let m = Math.floor(minfloat)
        let secfloat = (minfloat-m)*60
        let s = Math.round(secfloat)
        if (s==60) {
            m++;
            s=0;
        }
        if (m==60) {
            d++;
            m=0;
        }
        // add zero before single digits
         let dFormated = ("0" + d).slice(-2)
         let mFormated = ("0" + m).slice(-2)
         let sFormated = ("0" + s).slice(-2)
        return ("" + dFormated + "°" + mFormated + "\'" + sFormated+"\"")
    }
}
