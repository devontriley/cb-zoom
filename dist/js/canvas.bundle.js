/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/canvas.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/canvas.js":
/*!***********************!*\
  !*** ./src/canvas.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var canvas = document.querySelector("canvas");
var canvasW = canvas.width = window.innerWidth;
var canvasH = canvas.height = window.innerHeight;
var fov = 250; //pixels are 250px away from us
var totalZoom = 0;
var ctx = canvas.getContext("2d");
canvas.style.backgroundColor = 'black';

var pixels = [{
    start: { z: 0 },
    x: 20,
    y: -20,
    z: 0,
    depth: 0,
    startFrame: 0,
    x2d: 0,
    y2d: 0,
    w: 1,
    h: 1
    //animationEnd: false
}];

window.addEventListener('mousewheel', mouseScroll);
function mouseScroll(e) {
    e.preventDefault();
    var deltaY = e.deltaY;

    render(deltaY);
}

function pixelOnScreen(x, y, w, h) {
    var p = { x: x, y: y, w: w, h: h };

    return p.x > 0 && p.x + p.w < canvasW && p.y > 0 && p.y + p.h < canvasH ? true : false;
}

//time to draw the pixels
function render(delta) {
    ctx.clearRect(0, 0, canvasW, canvasH);

    //looping through all pixel points
    var i = pixels.length;
    while (i--) {
        var pixel = pixels[i];
        var zoomDirection = delta < 0 ? 'in' : 'out';

        // Check if pixel should being animating yet
        if (totalZoom < pixel.startFrame) continue;

        // Since we know we're moving this pixel, we can update its depth value
        pixel.depth += zoomDirection == 'in' ? 1 : -1;

        // Pixel depth should never go below 0: the start position
        if (pixel.depth < 0) {
            pixel.depth = 0;
        }

        // TODO: Need to check if pixel if offsreen, if it is, then we don't want to update the pixel.z value or move it's position anymore
        // TODO: At this point it should only be increasing the pixel.depth to track it's position while it's offscreen

        pixel.z += zoomDirection == 'in' ? -5 : 5;
        if (pixel.z > pixel.start.z) {
            pixel.z = pixel.start.z;
        }

        var scale = fov / (fov + pixel.z);
        var w = pixel.w * scale;
        var h = pixel.h * scale;
        var x2d = pixel.x * scale + canvasW / 2;
        var y2d = pixel.y * scale + canvasH / 2;

        if (!pixelOnScreen(x2d, y2d, w, h)) continue;

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
    ctx.rect(canvasW / 2 - 2, canvasH / 2 - 2, 4, 4);
    ctx.fill();
    ctx.closePath();
}

render(false);

//animation time
//setInterval(render, 1000/30);

/***/ })

/******/ });
//# sourceMappingURL=canvas.bundle.js.map