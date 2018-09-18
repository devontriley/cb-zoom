//creating a canvas using JS
var canvas = document.querySelector("canvas");

//making the canvas fullscreen
var canvasW = canvas.width = window.innerWidth;
var canvasH = canvas.height = window.innerHeight;
var fov = 250; //pixels are 250px away from us
var ctx = canvas.getContext("2d");
canvas.style.backgroundColor = 'black';

//an array of pixels with 3 dimensional coordinates
//a square sheet of dots separated by 5px
var pixels = [
    {
        start: {w: 10, h: 10, z: 0},
        x: 0,
        y: 0,
        z: 0,
        x2d: 0,
        y2d: 0,
        w: 10,
        h: 10,
        animationEnd: false
    }
];
// var pixels = [];
// for(var x = -250; x < 250; x+=10)
//     for(var z = -250; z < 250; z+=10)
//         pixels.push({x: x, y: 100, z: z});

window.addEventListener('mousewheel', mouseScroll);
function mouseScroll(e) {
    e.preventDefault();
    var deltaY = e.deltaY;

    render(deltaY);
}

function checkIfOnScreen(x, y, w, h) {
    if(x >= -(w/2) && x <= (canvasW + w/2) && y >= -(h/2) && y <= (canvasH + y/2)) {
        return true;
    }
}

//time to draw the pixels
function render(delta)
{
    ctx.clearRect(0,0,canvasW,canvasH);

    //looping through all pixel points
    var i = pixels.length;
    while(i--) {
        var pixel = pixels[i];

        if(pixel.animationEnd && delta < 0) continue;

        // Check mousewheel event to determine zoom direction
        if(delta) {
            if(delta < 0 && !pixel.animationEnd) {
                // scroll up - zoom in
                pixel.z -= 5;
            } else {
                // scroll down - zoom out
                pixel.animationEnd = false;
                pixel.z += 5;
            }

            if(pixel.z > pixel.start.z) {
                pixel.z = pixel.start.z;
            }
        }

        //calculating 2d position for 3d coordinates
        //fov = field of view = denotes how far the pixels are from us.
        var scale = fov/(fov+pixel.z);
        var width = pixel.w * scale;
        var height = pixel.h * scale;
        var x2d = (pixel.x * scale) + canvasW/2;
        var y2d = (pixel.y * scale) + canvasH/2;

        console.log('canvasW: ' + canvasW + '\n' + 'canvasH: ' + canvasH + '\n' + 'x2d: ' + x2d + '\n' + 'y2d: ' + y2d + '\n' + 'z: ' + pixel.z + '\n' + 'w: ' + width + '\n' + 'h: ' + height);

        // If pixel is in the window, continue updated position
        if(!checkIfOnScreen(x2d, y2d, width, height) || pixel.z > 0) {
            pixel.animationEnd = true;
            continue;
        } else {
            pixel.animationEnd = false;
            ctx.beginPath();
            ctx.rect(x2d, y2d, width, height);
            ctx.fillStyle = 'red';
            ctx.fill();
            ctx.closePath();
        }

        // Reset fov to start when off screen
        // if(pixel.z < -fov) {
        //     pixel.z = fov;
        // }
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



