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

    p.style.position = 'relative';
    p.style.transformOrigin = 'center center';
    p.style.zIndex = paths.length - i;

    pathsArr.push({
        ref: p,
        svgObj: svgObj.children()[i],
        startFrame: i * 60,
        scale: 1,
        duration: 420,
        opacity: 1,
        isAnimating: true,
        endFrame: 0,
        direction: 1
        //direction: Math.random() < 0.5 ? -1 : 1
    });
}



// window.addEventListener('mousewheel', mouseScroll);
//
// function mouseScroll(e) {
//     e.preventDefault();
//     var deltaY = e.deltaY;
//     console.log(deltaY);
//     render(deltaY);
// }

render();



// function isShapeOnScreen(position) {
//     return (position.bottom <= 0 || position.top >= window.innerHeight || position.left >= window.innerWidth || position.right <= 0) ? false : true;
// }

function render(delta) {
    //var zoomDirection = (delta < 0) ? 'in' : 'out';
    var zoomDirection = 'in';
    var i = pathsArr.length;

    progress += (zoomDirection == 'in') ? 1 : -1;

    if(progress < 0) {
        progress = 0;
        return;
    }

    while(i--) {
        var path = pathsArr[i];
        var startFrame = path.startFrame;
        var duration = path.duration;

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
            (path.direction > 0) ? svg.appendChild(path.ref) : svg.insertBefore(svg.children[0], path.ref);
        }

        // Check if we've hit shape start
        if(progress >= path.startFrame) {

            // time since this shape started animating
            var shapeProgress = (progress - startFrame) * path.direction;

            // % through animation
            //var scale = fov / (fov - (shapeProgress));
            var scale = shapeProgress / duration;

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
            path.ref.style.transform = 'scale(' + (scale + 1) + ')';

            // Adjust opacity when moving into background
            path.svgObj.attr('fill-opacity', newOpacity);
            if(scale > (duration / 60) / 1.1) {
                path.svgObj.attr('fill-opacity', newOpacity);
            }

            // Adjust blur
            path.svgObj.filter(function(add) {
                add.gaussianBlur(scale * 3);
            });

        }
    }

    if(progress < 800) {
        window.requestAnimationFrame(render);
    }

}
