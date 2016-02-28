## aframe-layer-component

An Layer component for [A-Frame](https://aframe.io) VR.

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
  <script src="https://raw.githubusercontent.com//master/dist/aframe-layer-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity layer="exampleProp: exampleVal"></a-entity>
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
