var canvas = document.getElementById("animation");
var canvasW = window.innerWidth;
var canvasH = window.innerHeight;
canvas.style.width = canvasW + 'px';
canvas.style.height = canvasH + 'px';

var fov = 100; //pixels are 250px away from us
var progress = 0;
//var speed = 1;

// SVG
var svg = canvas.querySelector('svg');
var svgBbox = svg.getBBox();
svg.style.position = 'absolute';
svg.style.left = (canvasW / 2) - (svgBbox.width / 2) + 'px';
svg.style.top = (canvasH / 2) - (svgBbox.height / 2) + 'px';

// Paths
var pathsArr = [];
var paths = svg.querySelectorAll('path');

for (var i = 0; i < paths.length; i++) {
    var p = paths[i];
    var boundingRect = p.getBoundingClientRect();
    var bbox = p.getBBox();

    p.style.position = 'relative';
    p.style.transformOrigin = 'center center';

    pathsArr.push({
        ref: p,
        bbox: bbox,
        //w: bbox.height,
        //h: bbox.width,
        //x: bbox.x + svgBbox.width / 2,
        //y: bbox.y + svgBbox.height / 2,
        //z: 0,
        //start: {z: 0},
        //offscreenDepth: 0,
        startFrame: i * 10,
        direction: 1
        //direction: Math.random() < 0.5 ? -1 : 1
    });
}

window.addEventListener('mousewheel', mouseScroll);

function mouseScroll(e) {
    e.preventDefault();
    var deltaY = e.deltaY;

    render(deltaY);
}

function isShapeOnScreen(position) {
    return (position.bottom <= 0 || position.top >= window.innerHeight || position.left >= window.innerWidth || position.right <= 0) ? false : true;
}

// function pixelOnScreen(x, y, w, h) {
//     return (x > 0 - w && x + w < canvasW + w && y > 0 - h && y + h < canvasH + h) ? true : false;
// }

function render(delta) {

    var zoomDirection = (delta < 0) ? 'in' : 'out';
    var i = pathsArr.length;

    progress += (zoomDirection == 'in') ? 1 : -1;

    if(progress < 0) {
        progress = 0;
        return;
    }

    while(i--) {
        var path = pathsArr[i];
        var startFrame = path.startFrame;
        var dir = path.direction;
        var position = path.ref.getBoundingClientRect();

        // Don't animate the shape if it's not on the screen
        if(!isShapeOnScreen(position)) {
            continue;
        }

        // Check if shape is on screen
        if(progress >= startFrame) {

            var shapeProgress = progress - startFrame; // time since this shape started animating

            // TODO: better way to do this
            if(zoomDirection == 'in') {
                if(dir > 0) {
                    path.z += -5;
                } else {
                    path.z += 5;
                }
            } else {
                if(dir > 0) {
                    path.z += 5;
                } else {
                    path.z += -5;
                }
            }

            var scale = fov / (fov + -(shapeProgress * 5));

            if(!isFinite(scale)) continue;

            //console.log(path.z, fov, (fov + path.z), scale);

            path.ref.style.transform = 'scale(' + scale + ')';

            // if (path.z >= path.start.z) {
            //     path.z = path.start.z;
            // }

        }

        // Check if pixel should being animating yet
        //if(progress < path.startFrame) continue;

        // Increase z while pixel is on screen
        // if (path.offscreenDepth == 0) {
        //     path.z += (zoomDirection == 'in') ? -5 : 5;
        //     progress += (zoomDirection == 'in') ? -1 : 1;
        //     if (path.z > path.start.z) {
        //         path.z = path.start.z;
        //     }
        // }

        // var radians = Math.atan2(svgBbox.height / 2 - (path.bbox.height / 2 + path.bbox.y), svgBbox.width / 2 - (path.bbox.width / 2 + path.bbox.x));
        // var angle = radians * 180 / Math.PI;
        // var a = svgBbox.height / 2 - (bbox.height / 2 - bbox.y / 2);
        // var b = svgBbox.width / 2 - (bbox.width / 2 - bbox.x / 2);
        // var c = Math.sqrt(a * a + b * b);
        // console.log('radians: ' + radians + '\nangle: ' + angle);
        // console.log('x: ' + -(speed * Math.sin(angle)));
        // console.log('y: ' + -(speed * Math.cos(angle)));
        // console.log('c: '+c);


        // var w = path.w * scale;
        // var h = path.h * scale;
        // var x2d = (path.x * scale) + canvasW / 2;
        // var y2d = (path.y * scale) + canvasH / 2;

        // If pixel is off screen
        //if(pixel.z == fov - fov*2) {
        // if (!pixelOnScreen(x2d, y2d, w, h)) {
        //
        //     path.offscreenDepth += (zoomDirection == 'in') ? 1 : -1;
        //
        //     // Pixel depth should never go below 0: the start position
        //     if (path.offscreenDepth < 0) {
        //         path.offscreenDepth = 0;
        //     }
        //
        //     if (path.offscreenDepth != 0) continue;
        //
        // } else {
        //
        //     if (!pixelOnScreen(x2d, y2d, w, h)) continue;
        //
        //     path.animationEnd = false;
        // }
    }

}


// var canvas = document.querySelector("canvas");
// var canvasW = canvas.width = window.innerWidth;
// var canvasH = canvas.height = window.innerHeight;
// var fov = 100; //pixels are 250px away from us
// var progress = 0;
// var ctx = canvas.getContext("2d");
// canvas.style.backgroundColor = 'black';
//
// var pixels = [
//     {
//         start: {w: 10, h: 10, z: 0},
//         x: -20,
//         y: -20,
//         z: 0,
//         offscreenDepth: 0,
//         startFrame: 0,
//         duration: 10
//     },
//     {
//         start: {w: 10, h: 10, z: 0},
//         x: 100,
//         y: 20,
//         z: 0,
//         offscreenDepth: 0,
//         startFrame: 0,
//         duration: 10
//     },
//     {
//         start: {w: 5, h: 5, z: 0},
//         x: -30,
//         y: 40,
//         z: -20,
//         offscreenDepth: 0,
//         startFrame: 0,
//         duration: 10
//     },
//     {
//         start: {w: 10, h: 10, z: 0},
//         x: 30,
//         y: -40,
//         z: -20,
//         offscreenDepth: 0,
//         startFrame: 0,
//         duration: 10
//     },
//     {
//         start: {w: 5, h: 5, z: 0},
//         x: -50,
//         y: -40,
//         z: 0,
//         offscreenDepth: 0,
//         startFrame: 0,
//         duration: 10
//     }
// ];
//
// window.addEventListener('mousewheel', mouseScroll);
// function mouseScroll(e) {
//     e.preventDefault();
//     var deltaY = e.deltaY;
//
//     render(deltaY);
// }
//
// function pixelOnScreen(x, y, w, h) {
//     return (x > 0 - w && x + w < canvasW + w && y > 0 - h && y + h < canvasH + h) ? true : false;
// }
//
// //time to draw the pixels
// function render(delta)
// {
//     ctx.clearRect(0,0,canvasW,canvasH);
//
//     //looping through all pixel points
//     var i = pixels.length;
//     var incrementer = 1;
//     while(i--) {
//         var pixel = pixels[i];
//         var zoomDirection = (delta < 0) ? 'in' : 'out';
//
//         // Check if pixel should being animating yet
//         if(progress < pixel.startFrame) continue;
//
//         // Increase z while pixel is on screen
//         if(pixel.offscreenDepth == 0) {
//             pixel.z += (zoomDirection == 'in') ? -5 : 5;
//             progress += (zoomDirection == ' in') ? -1 : 1;
//             if(pixel.z > pixel.start.z) {
//                 pixel.z = pixel.start.z;
//             }
//         }
//
//         var scale = fov/(fov+pixel.z);
//         var w = pixel.start.w * scale;
//         var h = pixel.start.h * scale;
//         var x2d = (pixel.x * scale) + canvasW/2;
//         var y2d = (pixel.y * scale) + canvasH/2;
//
//         // If pixel is off screen
//         //if(pixel.z == fov - fov*2) {
//         if(!pixelOnScreen(x2d, y2d, w, h)) {
//
//             pixel.offscreenDepth += (zoomDirection == 'in') ? 1 : -1;
//
//             // Pixel depth should never go below 0: the start position
//             if(pixel.offscreenDepth < 0) {
//                 pixel.offscreenDepth = 0;
//             }
//
//             if(pixel.offscreenDepth != 0) continue;
//
//         } else {
//
//             if(!pixelOnScreen(x2d, y2d, w, h)) continue;
//
//             // Skip to next pixel - this one is done animating
//             //if(pixel.animationEnd && delta < 0) continue;
//
//             pixel.animationEnd = false;
//             ctx.beginPath();
//             ctx.rect(x2d, y2d, w, h);
//             ctx.fillStyle = 'white';
//             ctx.fill();
//             ctx.closePath();
//         }
//     }
//
//     ctx.beginPath();
//     ctx.fillStyle = 'yellow';
//     ctx.rect(canvasW/2 - 2, canvasH/2 - 2, 4, 4);
//     ctx.fill();
//     ctx.closePath();
//
// }
//
// render(false);
