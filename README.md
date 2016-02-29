## aframe-stereo-component

An Stereo component for [A-Frame](https://aframe.io) VR.

### Properties

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
|          |             |               |

### Usage

#### Browser Installation

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/latest/aframe.min.js"></script>
  <script src="aframe-stereo-component.js.min.js"></script>
</head>
<body>
    <a-assets>

<!--
      stereoscopic panoramic render by
      http://pedrofe.com/rendering-for-oculus-rift-with-arnold/
      http://www.meryproject.com/
 -->

      <video id="Mary" src="../basic_development/textures/MaryOculus.webm" loop></video>

    </a-assets>
    <a-scene>


      <a-camera position="0 0 10" cursor-visible="false" stereocam="eye:left;"></a-camera>

      <a-entity geometry="primitive: sphere;
                      radius: 100;
                      segmentsWidth: 64;
                      segmentsHeight: 64;"
              material="shader: flat; src: #Mary;"
              scale="-1 1 1" rotation="0 180 0" stereo="eye:left">
      </a-entity>

      <a-entity geometry="primitive: sphere;
                      radius: 100;
                      segmentsWidth: 64;
                      segmentsHeight: 64;"
              material="shader: flat; src: #Mary;"
              scale="-1 1 1" rotation="0 180 0" stereo="eye:right">
      </a-entity>


    </a-scene>

 </body>


```

#### NPM Installation

Install via NPM:

```bash
npm install aframe-layer-component
```

Then register and use.

```js
require('aframe');
require('aframe-layer-component');
```
# aframe-stereo-component
