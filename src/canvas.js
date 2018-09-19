var canvas = document.querySelector("canvas");
var canvasW = canvas.width = window.innerWidth;
var canvasH = canvas.height = window.innerHeight;
var fov = 250; //pixels are 250px away from us
var totalZoom = 0;
var ctx = canvas.getContext("2d");
canvas.style.backgroundColor = 'black';

var pixels = [
    {
        start: {z: 0},
        x: 20,
        y: -20,
        z: 0,
        depth: 0,
        startFrame: 0,
        x2d: 0,
        y2d: 0,
        w: 1,
        h: 1,
        //animationEnd: false
    }
];

window.addEventListener('mousewheel', mouseScroll);
function mouseScroll(e) {
    e.preventDefault();
    var deltaY = e.deltaY;

    render(deltaY);
}

function pixelOnScreen(x, y, w, h) {
    var p = {x: x, y: y, w: w, h: h};

    return (p.x > 0 && p.x + p.w < canvasW && p.y > 0 && p.y + p.h < canvasH) ? true : false;
}

//time to draw the pixels
function render(delta)
{
    ctx.clearRect(0,0,canvasW,canvasH);

    //looping through all pixel points
    var i = pixels.length;
    while(i--) {
        var pixel = pixels[i];
        var zoomDirection = (delta < 0) ? 'in' : 'out';

        // Check if pixel should being animating yet
        if(totalZoom < pixel.startFrame) continue;

        // Since we know we're moving this pixel, we can update its depth value
        pixel.depth += (zoomDirection == 'in') ? 1 : -1;

        // Pixel depth should never go below 0: the start position
        if(pixel.depth < 0) {
            pixel.depth = 0;
        }

        // TODO: Need to check if pixel if offsreen, if it is, then we don't want to update the pixel.z value or move it's position anymore
        // TODO: At this point it should only be increasing the pixel.depth to track it's position while it's offscreen

        pixel.z += (zoomDirection == 'in') ? -5 : 5;
        if(pixel.z > pixel.start.z) {
            pixel.z = pixel.start.z;
        }

        var scale = fov/(fov+pixel.z);
        var w = pixel.w * scale;
        var h = pixel.h * scale;
        var x2d = (pixel.x * scale) + canvasW/2;
        var y2d = (pixel.y * scale) + canvasH/2;

        if(!pixelOnScreen(x2d, y2d, w, h)) continue;

        // Skip to next pixel - this one is done animating
        //if(pixel.animationEnd && delta < 0) continue;

        console.log('animate');

        pixel.animationEnd = false;
        ctx.beginPath();
        ctx.rect(x2d, y2d, w, h);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    }

    ctx.beginPath();
    ctx.fillStyle = 'yellow';
    ctx.rect(canvasW/2 - 2, canvasH/2 - 2, 4, 4);
    ctx.fill();
    ctx.closePath();

}

render(false);

//animation time
//setInterval(render, 1000/30);



