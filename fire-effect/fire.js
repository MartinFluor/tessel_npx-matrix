//TODO try making own frame buffer and send whole frame at once instead of using setPixel

var Npx = require('npx');
var npx = new Npx(64);

var width = 8, height = 8;
var paletteShift = 0;
var fire = [];
var palette = [];

//initialize array with 0
for(var i=0; i<width*height; i++) fire[i]=0;

var aniFrame = npx.newAnimation(1);

//hsvToRgb function from https://gist.github.com/eyecatchup/9536706
function hsvToRgb(h, s, v) {
    var r, g, b;
    var i;
    var f, p, q, t;
// Make sure our arguments stay in-range
    h = Math.max(0, Math.min(360, h));
    s = Math.max(0, Math.min(100, s));
    v = Math.max(0, Math.min(100, v));
// We accept saturation and value arguments from 0 to 100 because that's
// how Photoshop represents those values. Internally, however, the
// saturation and value are calculated from a range of 0 to 1. We make
// That conversion here.
    s /= 100;
    v /= 100;
    if(s == 0) {
// Achromatic (grey)
        r = g = b = v;
        return [
            Math.round(r * 255),
            Math.round(g * 255),
            Math.round(b * 255)
        ];
    }
    h /= 60; // sector 0 to 5
    i = Math.floor(h);
    f = h - i; // factorial part of h
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));
    switch(i) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
        case 1:
            r = q;
            g = v;
            b = p;
            break;
        case 2:
            r = p;
            g = v;
            b = t;
            break;
        case 3:
            r = p;
            g = q;
            b = v;
            break;
        case 4:
            r = t;
            g = p;
            b = v;
            break;
        default: // case 5:
            r = v;
            g = p;
            b = q;
    }
    return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255)
    ];
}


function makePalette() {
    for(var hue = 0; hue < 256; hue++)
    {
        //use HSVtoRGB to vary the Hue of the color through the palette
        //hue/3 -> range from hue 0 to 94 (red to yellow) - val/4 -> lower light intensity on leds
        var val = 255;
        if(hue <= 124) {val = hue}
        palette[hue] = hsvToRgb(hue/3+paletteShift, 255, val/4);
    }
    makeFire();
}

function makeFire(){
    //randomize bottom row
    for(var ex = 0; ex < width; ex++){
        fire[(height-1)*8+ex] = Math.round((Math.abs(32768 + Math.random())%256)*255);
        aniFrame.setPixel(((height-1)*8+ex), palette[fire[(height-1)*8+ex]], 0);
    }

    //draw fire
    for (var y = 0; y < height-1; y++) {
        for (var x = 0; x < width; x++) {
            fire[y*8+x] = Math.round(((fire[((y + 1) % height)*8+((x - 1 + width) % width)] +
            fire[((y + 1) % height)*8+((x) % width)] +
            fire[((y + 1) % height)*8+((x + 1) % width)] +
            fire[((y + 2) % height)*8+((x) % width)]) * 32)/ 129);
            aniFrame.setPixel((y*8+x), palette[fire[y*8+x]], 0);
        }
    }
    //call function again once npx animated the frame
    npx.play(aniFrame, function(){makeFire();});
    //possibility to set a delay between frames:
    //npx.play(aniFrame, function(){setTimeout(function(){makeFire();},50)});
}

makePalette();