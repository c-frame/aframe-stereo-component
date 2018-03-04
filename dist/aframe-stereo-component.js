/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	// Browser distrubution of the A-Frame component.
	(function () {
	  if (!AFRAME) {
	    console.error('Component attempted to register before AFRAME was available.');
	    return;
	  }

	  // Register all components here.
	  var components = {
	    stereo: __webpack_require__(1).stereo_component,
	    stereocam: __webpack_require__(1).stereocam_component
	  };

	  Object.keys(components).forEach(function (name) {
	    if (AFRAME.aframeCore) {
	      AFRAME.aframeCore.registerComponent(name, components[name]);
	    } else {
	      AFRAME.registerComponent(name, components[name]);
	    }
	  });
	})();



/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = {

	   // Put an object into left, right or both eyes.
	   // If it's a video sphere, take care of correct stereo mapping for both eyes (if full dome)
	   // or half the sphere (if half dome)

	  'stereo_component' : {
	      schema: {
	        eye: { type: 'string', default: "left"},
	        mode: { type: 'string', default: "full"},
	        split: { type: 'string', default: "horizontal"},
	        playOnClick: { type: 'boolean', default: true },
	      },
	       init: function(){

	          // Flag to acknowledge if 'click' on video has been attached to canvas
	          // Keep in mind that canvas is the last thing initialized on a scene so have to wait for the event
	          // or just check in every tick if is not undefined

	          this.video_click_event_added = false;

	          this.material_is_a_video = false;

	          // Check if material is a video from html tag (object3D.material.map instanceof THREE.VideoTexture does not
	          // always work

	          if(this.el.getAttribute("material")!==null && 'src' in this.el.getAttribute("material") && this.el.getAttribute("material").src !== "") {
	            var src = this.el.getAttribute("material").src;

	            // If src is an object and its tagName is video...

	            if (typeof src === 'object' && ('tagName' in src && src.tagName === "VIDEO")) {
	              this.material_is_a_video = true;
	            }
	          }

	          var object3D = this.el.object3D.children[0];

	          // In A-Frame 0.2.0, objects are all groups so sphere is the first children
	          // Check if it's a sphere w/ video material, and if so
	          // Note that in A-Frame 0.2.0, sphere entities are THREE.SphereBufferGeometry, while in A-Frame 0.3.0,
	          // sphere entities are THREE.BufferGeometry.

	          var validGeometries = [THREE.SphereGeometry, THREE.SphereBufferGeometry, THREE.BufferGeometry];
	          var isValidGeometry = validGeometries.some(function(geometry) {
	            return object3D.geometry instanceof geometry;
	          });

	          if (isValidGeometry && this.material_is_a_video) {

	              // if half-dome mode, rebuild geometry (with default 100, radius, 64 width segments and 64 height segments)

	              if (this.data.mode === "half") {

	                  var geo_def = this.el.getAttribute("geometry");
	                  var geometry = new THREE.SphereGeometry(geo_def.radius || 100, geo_def.segmentsWidth || 64, geo_def.segmentsHeight || 64, Math.PI / 2, Math.PI, 0, Math.PI);

	              }
	              else {
	                  var geo_def = this.el.getAttribute("geometry");
	                  var geometry = new THREE.SphereGeometry(geo_def.radius || 100, geo_def.segmentsWidth || 64, geo_def.segmentsHeight || 64);
	              }

	              // Panorama in front

	              object3D.rotation.y = Math.PI / 2;

	              // If left eye is set, and the split is horizontal, take the left half of the video texture. If the split
	              // is set to vertical, take the top/upper half of the video texture.

	              if (this.data.eye === "left") {
	                var uvs = geometry.faceVertexUvs[ 0 ];
	                var axis = this.data.split === "vertical" ? "y" : "x";
	                for (var i = 0; i < uvs.length; i++) {
	                    for (var j = 0; j < 3; j++) {
	                        if (axis == "x") {
	                            uvs[ i ][ j ][ axis ] *= 0.5;
	                        }
	                        else {
	                            uvs[ i ][ j ][ axis ] *= 0.5;
	                            uvs[ i ][ j ][ axis ] += 0.5;
	                        }
	                    }
	                }
	              }

	              // If right eye is set, and the split is horizontal, take the right half of the video texture. If the split
	              // is set to vertical, take the bottom/lower half of the video texture.

	              if (this.data.eye === "right") {
	                var uvs = geometry.faceVertexUvs[ 0 ];
	                var axis = this.data.split === "vertical" ? "y" : "x";
	                for (var i = 0; i < uvs.length; i++) {
	                    for (var j = 0; j < 3; j++) {
	                        if (axis == "x") {
	                            uvs[ i ][ j ][ axis ] *= 0.5;
	                            uvs[ i ][ j ][ axis ] += 0.5;
	                        }
	                        else {
	                            uvs[ i ][ j ][ axis ] *= 0.5;
	                        }
	                    }
	                }
	              }

	              // As AFrame 0.2.0 builds bufferspheres from sphere entities, transform
	              // into buffergeometry for coherence

	              object3D.geometry = new THREE.BufferGeometry().fromGeometry(geometry);

	          }
	          else{

	              // No need to attach video click if not a sphere and not a video, set this to true

	              this.video_click_event_added = true;

	          }


	       },

	       // On element update, put in the right layer, 0:both, 1:left, 2:right (spheres or not)

	       update: function(oldData){

	            var object3D = this.el.object3D.children[0];
	            var data = this.data;

	            if(data.eye === "both"){
	              object3D.layers.set(0);
	            }
	            else{
	              object3D.layers.set(data.eye === 'left' ? 1:2);
	            }

	       },

	       tick: function(time){

	           // If this value is false, it means that (a) this is a video on a sphere [see init method]
	           // and (b) of course, tick is not added

	           if(!this.video_click_event_added && this.data.playOnClick){
	                if(typeof(this.el.sceneEl.canvas) !== 'undefined'){

	                   // Get video DOM

	                   this.videoEl = this.el.object3D.children[0].material.map.image;

	                   // On canvas click, play video element. Use self to not lose track of object into event handler

	                   var self = this;

	                   this.el.sceneEl.canvas.onclick = function () {
	                      self.videoEl.play();
	                   };

	                   // Signal that click event is added
	                   this.video_click_event_added = true;

	                }
	           }

	       }
	     },

	  // Sets the 'default' eye viewed by camera in non-VR mode

	  'stereocam_component':{

	      schema: {
	        eye: { type: 'string', default: "left"}
	      },

	       // Cam is not attached on init, so use a flag to do this once at 'tick'

	       // Use update every tick if flagged as 'not changed yet'

	       init: function(){
	            // Flag to register if cam layer has already changed
	            this.layer_changed = false;
	       },

	       tick: function(time){

	            var originalData = this.data;

	            // If layer never changed

	            if(!this.layer_changed){

	            // because stereocam component should be attached to an a-camera element
	            // need to get down to the root PerspectiveCamera before addressing layers

	            // Gather the children of this a-camera and identify types

	            var childrenTypes = [];

	            this.el.object3D.children.forEach( function (item, index, array) {
	                childrenTypes[index] = item.type;
	            });

	            // Retrieve the PerspectiveCamera
	            var rootIndex = childrenTypes.indexOf("PerspectiveCamera");
	            var rootCam = this.el.object3D.children[rootIndex];

	            if(originalData.eye === "both"){
	                rootCam.layers.enable( 1 );
	                rootCam.layers.enable( 2 );
	              }
	              else{
	                rootCam.layers.enable(originalData.eye === 'left' ? 1:2);
	              }
	            }
	       }

	  }
	};


/***/ })
/******/ ]);