let countryLatLong
let selector
let flagPositions
let flags
let color1, color2

function preload() {
    // preload data and images
    countryLatLong = loadTable('countries.csv', 'csv', 'header')
    flagPositions = loadJSON('flags32-iso-3166-1-alpha-2.json')
    flags = loadImage('flags32.png');
}

function setup() {
    createCanvas(windowWidth, windowHeight)
    selector = new CountrySelector(windowWidth/2, windowHeight/2)
    color1 = color('#16BFFD')
    color2 = color('#CB3066')
}
function draw() {
    setGradient(color1, color2)
    selector.display()
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
    selector.position(windowWidth/2, windowHeight/2)
}

function setGradient(c1, c2) {
    noFill()
    for (var y = 0; y < height; y++) {
        var inter = map(y, 0, height, 0, 1);
        var c = lerpColor(c1, c2, inter)
        stroke(c)
        line(0, y, width, y);
    }
}

class CountrySelector {
    constructor(X,Y) {
        textSize(20)
        textFont('Helvetica')
        this.x = X
        this.y = Y
        this.lat= 47
        this.long = 8
        this.countryCode = 'unknown'
        this.country = this.getCountryName(this.lat,this.long)
        this.pickFlag()
        this.dimensions = {
            w:textWidth(this.country)+180,
            h:60
        }
    }
    pickFlag() {
        let position = flagPositions[this.countryCode]
        console.log(position)
        if (position == undefined) {
            position = 0;
        }
        position = abs(position)
        this.flag = flags.get(0, position, 32,30)

    }
    display() {
        push()
        translate(this.x, this.y)
        strokeWeight(2)
        rectMode(CENTER)
        noStroke()
        fill(255)
        textSize(15)
        text("Please select country",-this.dimensions.w/2,-this.dimensions.h/2-10)
        textSize(20)
        stroke(255)
        noFill()
        rect(0, 0,  this.dimensions.w,  this.dimensions.h)
        noStroke()
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
        // gui element to select a latitude and longitude
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
        let newCountry =  this.getCountryName(lat, long)
        if ( this.country = newCountry) {
            this.country = newCountry
            this.pickFlag()
        }
        fill(255)
        textAlign(CENTER)
        text(this.deg_to_dms(abs(lat))+NS+", "+this.deg_to_dms(abs(long))+EW,0,8)
    }
    displayCountry() {
        // display name of country with flag
        TweenLite.to(this.dimensions,0.1, {
            w:textWidth(this.country)+160,
            h:60,
        })
        fill(255)
        textAlign(LEFT)
        text(this.country , -this.dimensions.w/2+100,8)
        image(this.flag,-this.dimensions.w/2+60,-this.flag.height/2)
    }

    position(x, y) {
        this.x = x
        this.y = y
    }
    getCountryName(lat, long) {
        // find country name based on lat and long
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
            m++
            s=0
        }
        if (m==60) {
            d++
            m=0
        }
         let dFormated = ("0" + d).slice(-2)
        if (d>100) {
             dFormated = d
        }
         let mFormated = ("0" + m).slice(-2)
         let sFormated = ("0" + s).slice(-2)
        return ("" + dFormated + "°" + mFormated + "\'" + sFormated+"\"")
    }
}
