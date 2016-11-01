var AFRAME = require('aframe');
var stereoComponent = require('../index.js').stereo_component;
var stereocamComponent = require('../index.js').stereocam_component;

AFRAME.registerComponent('stereo', stereoComponent);
AFRAME.registerComponent('stereocam', stereocamComponent);

require('aframe');
