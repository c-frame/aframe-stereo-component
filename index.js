module.exports = {

   // Put an object into left, right or both eyes.
   // If it's a video sphere, take care of correct stereo mapping for both eyes (if full dome)
   // or half the sphere (if half dome)

  'stereo_component' : {
      schema: {
        eye: { type: 'string', default: "left"},
        mode: { type: 'string', default: "full"}
      },
       init: function(){
          var object3D = this.el.object3D;


          // Check if it's a sphere w/ video material, and if so

          if(object3D.geometry instanceof THREE.SphereGeometry
                   && 'map' in object3D.material
                   && object3D.material.map instanceof THREE.VideoTexture) {


              // hold video element for play on click (mobile)

              var self = this;

              // attach video element onclick to scene canvas

              this.videoEl = document.querySelector(this.el.components.material.textureSrc);

               this.el.sceneEl.canvas.onclick = function () {
                    self.videoEl.play();
               };

              // if half-dome mode, rebuild geometry (with default 100, radius, 64 width segments and 64 height segments)

              if(this.data.mode === "half"){

                var geo_def = this.el.getAttribute("geometry");
                var geometry = new THREE.SphereGeometry(geo_def.radius || 100, geo_def.segmentsWidth || 64, geo_def.segmentsHeight || 64,  Math.PI/2, Math.PI, 0, Math.PI);

                object3D.geometry = geometry;

                // Rotate to put center of half panorama in front

                object3D.rotation.y = -Math.PI / 2;

                }

                // If left eye, take first horizontal half of texture from video

                if(this.data.eye === "left"){

                      var uvs = object3D.geometry.faceVertexUvs[ 0 ];
                      for (var i = 0; i < uvs.length; i++) {
                          for (var j = 0; j < 3; j++) {
                              uvs[ i ][ j ].x *= 0.5;
                          }
                      }

                }

                // If right eye, take last horizontal half of texture from video

                if(this.data.eye === "right"){
                      var uvs = object3D.geometry.faceVertexUvs[ 0 ];
                      for (var i = 0; i < uvs.length; i++) {
                          for (var j = 0; j < 3; j++) {
                              uvs[ i ][ j ].x *= 0.5;
                              uvs[ i ][ j ].x += 0.5;
                          }
                      }

                }


          }

       },
       // On element update, put in the correct layer, 0:both, 1:left, 2:right (spheres or not)

       update: function(oldData){

            var object3D = this.el.object3D;
            var data = this.data;

            var childrenTypes = [];

            this.el.object3D.children.forEach( function (item, index, array) {
                childrenTypes[index] = item.type;
            });

            // Retrieve the Mesh object
            var rootIndex = childrenTypes.indexOf("Mesh");
            var rootMesh = this.el.object3D.children[rootIndex];
            console.log(rootMesh);

            if(data.eye === "both"){
              rootMesh.layers.set(0);
              this.layer_changed = true;
            }
            else{
              rootMesh.layers.set(data.eye === 'left' ? 1:2);
              this.layer_changed = true;
            }

       }
     },

  // Sets the 'default' eye viewed by camera in non-VR mode

  'stereocam_component':{

      schema: {
        eye: { type: 'string', default: "left"}
      },

       // Since layer enabling for cam should be done on the right object down this object hierarchy,
       // Use update every tick if flagged as 'not changed yet'

       init: function(){
            this.layer_changed = false;
       },

       update: function(oldData){


            var originalData = this.data;

            // If layer never changed

            if(!this.layer_changed){

            // because stereocam component is a child of an a-camera element,
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
