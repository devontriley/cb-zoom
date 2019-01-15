import './../node_modules/svg.js/dist/svg.js';
import './../node_modules/svg.filter.js/dist/svg.filter.js';

var canvas = document.getElementById("animation");
var canvasW = window.innerWidth;
var canvasH = window.innerHeight;
canvas.style.width = canvasW + 'px';
canvas.style.height = canvasH + 'px';

var fov = 100;
var progress = 0;

var svg = canvas.querySelector('svg');
var svgBbox = svg.getBBox();
var svgObj = SVG.adopt(svg);
svg.style.position = 'absolute';
svg.style.left = (canvasW / 2) - (svgBbox.width / 2) + 'px';
svg.style.top = (canvasH / 2) - (svgBbox.height / 2) + 'px';

// Paths
var pathsArr = [];
var paths = svg.querySelectorAll('path');

for (var i = 0; i < paths.length; i++) {
    var p = paths[i];
    var start = i * 30;

    // if(i <= 3) {
    //     start = 0;
    // } else if(i > 3 && i < 6) {
    //     start = 60;
    // } else if(i > 6 && i < 9) {
    //     start = 120;
    // }

    p.style.position = 'relative';
    p.style.transformOrigin = 'center center';
    p.style.zIndex = paths.length - i;

    pathsArr.push({
        ref: p,
        svgObj: svgObj.children()[i],
        startFrame: start,
        scale: 1,
        duration: 30,
        opacity: 1,
        isAnimating: true,
        endFrame: 0,
        direction: -1
        //direction: 1
        //direction: Math.random() < 0.5 ? -1 : 1
    });
}



// window.addEventListener('mousewheel', mouseScroll);
//
// function mouseScroll(e) {
//     e.preventDefault();
//     var deltaY = e.deltaY;
//
//     render(deltaY);
// }

render();

// t: current time
// b: begInnIng value
// c: change In value
// d: duration

function ease(x, t, b, c, d) {
    if (t==0) return b;
    if (t==d) return b+c;
    if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
    return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
}


var progressDir = 1;


function render(delta) {
    //var zoomDirection = (delta < 0) ? 'in' : 'out';
    var zoomDirection = 'in';
    var i = pathsArr.length;

    if(progress == 270) {
        progressDir = -1;
    } else if(progress == 0) {
        progressDir = 1;
    }

    progress += progressDir;

    console.log(progress);

    //progress += (zoomDirection == 'in') ? 1 : -1;

    if(progress < 0) {
        progress = 0;
        return;
    }

    while(i--) {
        var path = pathsArr[i];
        var startFrame = path.startFrame;
        var duration = path.duration;
        var direction = path.direction;

        // Set shape to animating and visible when reaching it's endFrame in reverse
        if(path.endFrame > progress && path.isAnimating == false) {
            path.isAnimating = true;
            path.ref.style.display = 'block';
        }

        // Move to next shape if this one is not animating
        if(!path.isAnimating) continue;

        //console.log(progress);

        // z-indexing
        if(path.startFrame == progress) {
            (direction > 0) ? svg.appendChild(path.ref) : svg.insertBefore(svg.children[0], path.ref);
        }

        // Check if we've hit shape start
        if(progress >= path.startFrame) {

            // time since this shape started animating
            var shapeProgress = (progress - startFrame);

            // % through animation
            //var scale = fov / (fov - (shapeProgress));
            //var scale = shapeProgress / duration;
            //console.log(scale);

            var scale = ease(0, shapeProgress, 0, 1, duration);

            var newScale = (direction > 0) ? 1 + (scale * 3) : 1 - (scale * 0.75) ;

            // New opacity
            var newOpacity = 1 - scale;

            // Shape is finished animating - new scale value == infinity
            // Mark endFrame to track when to resume animation in reverse
            //if(!isFinite(scale)) {
            if(shapeProgress == duration) {
                path.isAnimating = false;
                path.endFrame = progress;
                path.ref.style.display = 'none';
                continue;
            }

            // Adjust scale
            path.ref.style.transform = 'scale(' + newScale + ')';

            // Adjust opacity when moving into background
            //if(scale > 0.75) {
                path.svgObj.attr('fill-opacity', newOpacity);
            //}

            // Adjust blur
            // path.svgObj.filter(function(add) {
            //     add.gaussianBlur(scale * 3);
            // });

        }
    }

    window.requestAnimationFrame(render);

}
