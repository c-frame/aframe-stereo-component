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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./browser.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./browser.js":
/*!********************!*\
  !*** ./browser.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n// Browser distrubution of the A-Frame component.\n(function () {\n  if (!AFRAME) {\n    console.error('Component attempted to register before AFRAME was available.');\n    return;\n  }\n\n  // Register all components here.\n  var components = {\n    stereo: __webpack_require__(/*! ./index */ \"./index.js\").stereo_component,\n    stereocam: __webpack_require__(/*! ./index */ \"./index.js\").stereocam_component\n  };\n\n  Object.keys(components).forEach(function (name) {\n    if (AFRAME.aframeCore) {\n      AFRAME.aframeCore.registerComponent(name, components[name]);\n    } else {\n      AFRAME.registerComponent(name, components[name]);\n    }\n  });\n})();\n\n//# sourceURL=webpack:///./browser.js?");

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\nexports.default = {\n\n  // Put an object into left, right or both eyes.\n  // If it's a video sphere, take care of correct stereo mapping for both eyes (if full dome)\n  // or half the sphere (if half dome)\n\n  'stereo_component': {\n    schema: {\n      eye: { type: 'string', default: \"left\" },\n      mode: { type: 'string', default: \"full\" },\n      split: { type: 'string', default: \"\" },\n      playOnClick: { type: 'boolean', default: true }\n    },\n    init: function init() {\n      // Flag to acknowledge if 'click' on video has been attached to canvas\n      // Keep in mind that canvas is the last thing initialized on a scene so have to wait for the event\n      // or just check in every tick if is not undefined\n\n      this.video_click_event_added = false;\n\n      this.material_is_a_video = false;\n      this.material_is_a_image = false;\n\n      var object3D = this.el.object3D.children[0];\n\n      transformGeometry(object3D, this.el, this.data);\n\n      if (!this.material_is_a_video) {\n        // No need to attach video click if not a sphere and not a video, set this to true\n        this.video_click_event_added = true;\n      }\n    },\n\n    // On element update, put in the right layer, 0:both, 1:left, 2:right (spheres or not)\n\n    update: function update(oldData) {\n\n      var object3D = this.el.object3D.children[0];\n      var data = this.data;\n\n      if (data.eye === \"both\") {\n        object3D.layers.set(0);\n      } else {\n        object3D.layers.set(data.eye === 'left' ? 1 : 2);\n      }\n\n      if (data.split !== oldData.split) transformGeometry(object3D, this.el, this.data);\n    },\n\n    tick: function tick(time) {\n\n      // If this value is false, it means that (a) this is a video on a sphere [see init method]\n      // and (b) of course, tick is not added\n\n      if (!this.video_click_event_added && this.data.playOnClick) {\n        if (typeof this.el.sceneEl.canvas !== 'undefined') {\n\n          // Get video DOM\n\n          this.videoEl = this.el.object3D.children[0].material.map.image;\n\n          // On canvas click, play video element. Use self to not lose track of object into event handler\n\n          var self = this;\n\n          this.el.sceneEl.canvas.onclick = function () {\n            self.videoEl.play();\n          };\n\n          // Signal that click event is added\n          this.video_click_event_added = true;\n        }\n      }\n    }\n  },\n\n  // Sets the 'default' eye viewed by camera in non-VR mode\n\n  'stereocam_component': {\n\n    schema: {\n      eye: { type: 'string', default: \"left\" }\n    },\n\n    // Cam is not attached on init, so use a flag to do this once at 'tick'\n\n    // Use update every tick if flagged as 'not changed yet'\n\n    init: function init() {\n      // Flag to register if cam layer has already changed\n      this.layer_changed = false;\n    },\n\n    tick: function tick(time) {\n\n      var originalData = this.data;\n\n      // If layer never changed\n\n      if (!this.layer_changed) {\n\n        // because stereocam component should be attached to an a-camera element\n        // need to get down to the root PerspectiveCamera before addressing layers\n\n        // Gather the children of this a-camera and identify types\n\n        var childrenTypes = [];\n\n        this.el.object3D.children.forEach(function (item, index, array) {\n          childrenTypes[index] = item.type;\n        });\n\n        // Retrieve the PerspectiveCamera\n        var rootIndex = childrenTypes.indexOf(\"PerspectiveCamera\");\n        var rootCam = this.el.object3D.children[rootIndex];\n\n        if (originalData.eye === \"both\") {\n          rootCam.layers.enable(1);\n          rootCam.layers.enable(2);\n        } else {\n          rootCam.layers.enable(originalData.eye === 'left' ? 1 : 2);\n        }\n      }\n    }\n\n  }\n};\n\n\nvar transformGeometry = function transformGeometry(object3D, element, data) {\n\n  var material_is_a_video = false;\n  var material_is_a_image = false;\n\n  if (element.getAttribute(\"material\") !== null && 'src' in element.getAttribute(\"material\") && element.getAttribute(\"material\").src !== \"\") {\n    var src = element.getAttribute(\"material\").src;\n\n    // If src is an object and its tagName is video...\n    if ((typeof src === 'undefined' ? 'undefined' : _typeof(src)) === 'object' && 'tagName' in src && src.tagName === \"VIDEO\") {\n      material_is_a_video = true;\n    } else if ((typeof src === 'undefined' ? 'undefined' : _typeof(src)) === 'object' && 'tagName' in src && src.tagName === \"IMG\") {\n      material_is_a_image = true;\n    }\n  }\n\n  // In A-Frame 0.2.0, objects are all groups so sphere is the first children\n  // Check if it's a sphere w/ video material, and if so\n  // Note that in A-Frame 0.2.0, sphere entities are THREE.SphereBufferGeometry, while in A-Frame 0.3.0,\n  // sphere entities are THREE.BufferGeometry.\n\n  var validGeometries = [THREE.SphereGeometry, THREE.SphereBufferGeometry, THREE.BufferGeometry];\n  var isValidGeometry = validGeometries.some(function (geometry) {\n    return object3D.geometry instanceof geometry;\n  });\n\n  if (isValidGeometry && (material_is_a_video || material_is_a_image && !!data.split)) {\n\n    // if half-dome mode, rebuild geometry (with default 100, radius, 64 width segments and 64 height segments)\n\n    var geo_def = element.getAttribute(\"geometry\");\n    var geometry = null;\n\n    if (data.mode === \"half\") {\n      geometry = new THREE.SphereGeometry(geo_def.radius || 100, geo_def.segmentsWidth || 64, geo_def.segmentsHeight || 64, Math.PI / 2, Math.PI, 0, Math.PI);\n    } else {\n      geometry = new THREE.SphereGeometry(geo_def.radius || 100, geo_def.segmentsWidth || 64, geo_def.segmentsHeight || 64);\n    }\n\n    // Panorama in front\n    object3D.rotation.y = Math.PI / 2;\n\n    // If left eye is set, and the split is horizontal, take the left half of the video texture. If the split\n    // is set to vertical, take the top/upper half of the video texture.\n\n    if (data.eye === \"left\") {\n      var uvs = geometry.faceVertexUvs[0];\n      var axis = data.split === \"vertical\" ? \"y\" : \"x\";\n      for (var i = 0; i < uvs.length; i++) {\n        for (var j = 0; j < 3; j++) {\n          if (axis == \"x\") {\n            uvs[i][j][axis] *= 0.5;\n          } else {\n            uvs[i][j][axis] *= 0.5;\n            uvs[i][j][axis] += 0.5;\n          }\n        }\n      }\n    }\n\n    // If right eye is set, and the split is horizontal, take the right half of the video texture. If the split\n    // is set to vertical, take the bottom/lower half of the video texture.\n\n    if (data.eye === \"right\") {\n      var uvs = geometry.faceVertexUvs[0];\n      var axis = data.split === \"vertical\" ? \"y\" : \"x\";\n      for (var i = 0; i < uvs.length; i++) {\n        for (var j = 0; j < 3; j++) {\n          if (axis == \"x\") {\n            uvs[i][j][axis] *= 0.5;\n            uvs[i][j][axis] += 0.5;\n          } else {\n            uvs[i][j][axis] *= 0.5;\n          }\n        }\n      }\n    }\n\n    // As AFrame 0.2.0 builds bufferspheres from sphere entities, transform\n    // into buffergeometry for coherence\n\n    object3D.geometry = new THREE.BufferGeometry().fromGeometry(geometry);\n  }\n};\n\n//# sourceURL=webpack:///./index.js?");

/***/ })

/******/ });