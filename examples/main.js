var AFRAME = require('aframe');
var stereoComponent = require('../src/index.js').stereo_component;
var stereocamComponent = require('../src/index.js').stereocam_component;

AFRAME.registerComponent('stereo', stereoComponent);
AFRAME.registerComponent('stereocam', stereocamComponent);
