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


//creating a canvas using JS
var canvas = document.querySelector("canvas");

//making the canvas fullscreen
var w = canvas.width = window.innerWidth;
var h = canvas.height = window.innerHeight;
var fov = 250; //pixels are 250px away from us
var ctx = canvas.getContext("2d");
canvas.style.backgroundColor = 'black';

var rectW = 1;
var rectH = 1;

//an array of pixels with 3 dimensional coordinates
//a square sheet of dots separated by 5px
var pixels = [{ x: -1, y: -1, startX: w / 2, startY: h / 2, z: 0, x2d: undefined, y2d: undefined, w: rectW, h: rectH }];
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

//time to draw the pixels
function render(delta) {
    ctx.clearRect(0, 0, w, h);

    //grabbing a screenshot of the canvas using getImageData
    //var imagedata = ctx.getImageData(0,0,w,h);

    //looping through all pixel points
    var i = pixels.length;
    while (i--) {
        var pixel = pixels[i];
        //calculating 2d position for 3d coordinates
        //fov = field of view = denotes how far the pixels are from us.
        //the scale will control how the spacing between the pixels will decrease with increasing distance from us.
        var scale = fov / (fov + pixel.z);
        var x2d = pixel.x * scale + pixel.startX;
        var y2d = pixel.y * scale + pixel.startY;
        var width = pixel.w * scale;
        var height = pixel.h * scale;

        if (delta < 0) {
            pixel.z -= 1;
        } else {
            pixel.z += 1;
        }

        console.log(pixel.x2d + ', ' + pixel.y2d);

        //marking the points green - only if they are inside the screen
        if (x2d >= 0 && x2d <= w && y2d >= 0 && y2d <= h) {

            pixel.x2d = x2d;
            pixel.y2d = y2d;

            ctx.beginPath();
            ctx.rect(x2d, y2d, width, height);
            ctx.fillStyle = 'red';
            ctx.fill();
            ctx.closePath();

            //imagedata.width gives the width of the captured region(canvas) which is multiplied with the Y coordinate and then added to the X coordinate. The whole thing is multiplied by 4 because of the 4 numbers saved to denote r,g,b,a. The final result gives the first color data(red) for the pixel.
            // var c = (Math.round(y2d) * imagedata.width + Math.round(x2d))*4;
            // imagedata.data[c] = 0; //red
            // imagedata.data[c+1] = 255; //green
            // imagedata.data[c+2] = 60; //blue
            // imagedata.data[c+3] = 255; //alpha
        } else {
            console.log(pixel);
        }

        if (pixel.z < -fov) pixel.z += 2 * fov;
    }
    //putting imagedata back on the canvas
    //ctx.putImageData(imagedata, 0, 0);
}

//animation time
//setInterval(render, 1000/30);

/***/ })

/******/ });
//# sourceMappingURL=canvas.bundle.js.map