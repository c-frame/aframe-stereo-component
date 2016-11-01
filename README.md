## aframe-stereo-component

A stereo component for [A-Frame](https://aframe.io) VR.

This component builds on the ['layer' concept of THREE.js] (https://github.com/mrdoob/three.js/issues/6437) and is really two components in one:
- **'stereocam' component**, with tells an aframe camera which 'eye' to render in case of monoscopic display (without 'Entering VR'). The camera will render all entities without the stereo component, but if it encounters an entity with the 'stereo' component active, it will render only those in the same eye as defined here.
- **'stereo' component**, which tells aframe to include an entity in either the 'right' eye or 'left' eye (you can also specify 'both', but this has the same effect as not using the 'stereo' component. *The component also enables stereoscopic video rendering projected on spheres*, so if a sphere (see example below) has the 'stereo' component enabled, if will only project half of the video texture (which one depends on the 'eye' property), so the result is stereoscopic video rendering, if you include two spheres. The component expects videos in side-by-side equirectangular projection (see the video example below).

If a video is used in a sphere with the 'stereo' component active, **the component will also enable playback in mobile devices, by attaching a 'click' event on the rendering canvas**. Thus, in mobile devices you must click on the screen (via cardboard v2.0 button or with your finger) for the video to start playing.

**NOTE: for some reason (?) if the video elment is put inside scene 'assets' tag, a cross-origin issue is raised **

You can see demos for both examples below [here] (http://oscarmarinmiro.github.io/aframe-stereo-component)

### 'stereocam' component properties (only for camera)

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
| eye      |  which eye is enabled in monoscopic display ('left' or 'right')           | 'left               |

### 'stereo' component properties (for other entities)
| Property | Description | Default Value |
| -------- | ----------- | ------------- |
| eye      |  in which eye the entity is render VR mode ('left' or 'right')           | 'left               |
| mode     | this property is for spheres holding a video texture. mode can be 'full' or 'half', depending if the original video is full 360 or only spans 180 degrees horizontally (half-dome)| 'full' |
| split    | this property indicates whether to split the video texture horizontally (left and right hemispheres), or vertically, (top and bottom hemispheres) | 'horizontal'

### Usage

!["Stereoscopic video"](/video_stereo.png?raw=true "Stereoscopic video")

#### Browser Installation. 360 stereoscopic video example

Install and use by directly including the [browser files](dist):

```html
<html>
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/latest/aframe.min.js"></script>
  <script src="aframe-stereo-component.js.min.js"></script>
</head>
<body>
    <a-scene>


<!--
      stereoscopic panoramic render by
      http://pedrofe.com/rendering-for-oculus-rift-with-arnold/
      http://www.meryproject.com/
 -->
      <!-- side by side equirectangular projected video -->
      <video id="Mary" src="examples/basic_development/textures/MaryOculus.webm" loop></video>


      <!-- we tell here the camera to render (outside VR mode, in monoscopic mode) everything without the 'stereo' component active
      and it it's active, only render those entities in the 'left' eye -->

      <a-camera position="0 0 10" cursor-visible="false" stereocam="eye:left;"></a-camera>

      <!-- native sphere, will render on 'left' eye, and will take only the first half of the video for projection -->

      <a-entity geometry="primitive: sphere;
                      radius: 100;
                      segmentsWidth: 64;
                      segmentsHeight: 64;"
              material="shader: flat; src: #Mary;"
              scale="-1 1 1" stereo="eye:left">
      </a-entity>

      <!-- native sphere, will render on 'right' eye, and will take only the second half of the video for projection -->

      <a-entity geometry="primitive: sphere;
                      radius: 100;
                      segmentsWidth: 64;
                      segmentsHeight: 64;"
              material="shader: flat; src: #Mary;"
              scale="-1 1 1" stereo="eye:right">
      </a-entity>


    </a-scene>

 </body>
 </html>


```

!["Two cubes in a scene, each one for each eye"](/cubes_stereo.png?raw=true "Two cubes in a scene, each one for each eye")

#### Browser Installation. Two cubes, each one for each eye

Install and use by directly including the [browser files](dist):

```html
<html>
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/latest/aframe.min.js"></script>
  <script src="aframe-stereo-component.js.min.js"></script>
</head>
<body>
  <a-scene>
      <a-sky color="#FFF"></a-sky>
      <a-light color="#333" position="0 5 0" type="ambient" intensity="0.2"></a-light>
      <a-light type="point" color="#EEE" intensity="1.0" position="3 3 10"></a-light>

      <!-- 'left' eye entities will pass trough the camera in non-VR mode -->

      <a-camera position="0 0 10" cursor-color="black" stereocam="eye:left;"></a-camera>

      <!-- in VR mode, the first box is displayed only in the left eye, the second one in the right eye -->

      <a-entity geometry="primitive: box" material="color: #C03546" stereo="eye:left"></a-entity>
      <a-entity geometry="primitive: box" material="color: #3546C0" position="0 5 0" stereo="eye: right"></a-entity>

  </a-scene>

 </body>
 </html>

```

#### Stereoscopic videos that are split vertically - Top and Bottom

Install and use by directly including the [browser files](dist):

```html
<html>
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/latest/aframe.min.js"></script>
  <script src="aframe-stereo-component.js.min.js"></script>
</head>
<body>
  <a-scene>
  <!-- top and bottom equirectangular projected video -->
  <video id="video" src="path/to/top-bottom/mp4" loop></video>


    <!-- here we tell the camera to render (outside VR mode, in monoscopic mode) everything without the 'stereo' component active
    and if it's active, only render those entities in the 'left' eye -->
    <a-camera position="0 0 10" cursor-visible="false" stereocam="eye:left;"></a-camera>

    <!-- native sphere, will render on 'left' eye, and will take only the first half (top) of the video for projection -->
    <a-entity geometry="primitive: sphere; radius: 100; segmentsWidth: 64; segmentsHeight: 64;"
        material="shader: flat; src: #video;"
        scale="-1 1 1" stereo="eye:left; split: vertical">
    </a-entity>

    <!-- native sphere, will render on 'right' eye, and will take only the second half (bottom) of the video for projection -->
    <a-entity geometry="primitive: sphere; radius: 100; segmentsWidth: 64; segmentsHeight: 64;"
        material="shader: flat; src: #video;"
        scale="-1 1 1" stereo="eye:right; split: vertical">
    </a-entity>
  </a-scene>
 </body>
 </html>
```


#### NPM Installation

Install via NPM:

```bash
npm install aframe-stereo-component
```

Then register and use.

```js
var AFRAME = require('aframe');
var stereoComponent = require('aframe-stereo-component').stereo_component;
var stereocamComponent = require('aframe-stereo-component').stereocam_component;

AFRAME.registerComponent('stereo', stereoComponent);
AFRAME.registerComponent('stereocam', stereocamComponent);
```

#### Credits

The video used in the examples is from http://pedrofe.com/rendering-for-oculus-rift-with-arnold/, from the project http://www.meryproject.com/

Boilerplate code from https://github.com/ngokevin/aframe-component-boilerplate

Code for adjusting sphere face vertex is from https://github.com/mrdoob/three.js/blob/master/examples/webvr_video.html
