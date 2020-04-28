<template>
  <div id="visualizer" v-bind:style="style.canvas"></div>
</template>

<script>
import { mapState } from "vuex";
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";

export default {
  name: "ThreeBox",

  data: function() {
    return {
      animationDuration: 1000,
      drinks: this.allDrinks,
      meshGroup: null,
      meshArr: null,
      canvas: null,
      plane: null,
      modifier: null,
      lights: {
        spot: null,
        hemi: null
      },
      renderer: null,
      scene: null,
      camera: null,
      multiplier: 10,
      currentTween: null
    };
  },
  computed: {
    style: function() {
      return {
        canvas: {
          height: "30rem",
          width: "100%",
          margin: "0 auto",
          backgroundColor: "rgba(0, 0, 0, 0.87)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }
      };
    },
    chosenDrink: function() {
      var that = this;
      var drinkID = that.customerData.base;

      return that.drinks[drinkID];
    },
    ...mapState(["appData", "customerData"])
  },
  watch: {
    "customerData.baseDrink.config": {
      deep: true,
      handler: function(val, old) {
        this.createStack();

        // console.log(val.sweeteners.sugar);
        // that.createStack(this.meshArr);
      }
    }
  },
  mounted: function() {
    /*
     *  KEEP THIS ORDER
     */
    var that = this;

    // set up canvas
    that.canvas = document.querySelector("#visualizer");
    var canvasHeight = that.canvas.offsetHeight;
    var canvasWidth = that.canvas.offsetWidth;

    // set up renderer
    that.renderer = new THREE.WebGLRenderer({
      antialias: true
    });

    // set up camera
    that.camera = new THREE.PerspectiveCamera(
      40,
      canvasWidth / canvasHeight,
      0.1,
      10000
    );

    // set up scene
    that.scene = new THREE.Scene();

    // set up lights
    that.lights.spot = new THREE.SpotLight(0xffffff, 0.2, 0, 0.25);
    that.lights.spot.castShadow = true;
    that.lights.hemi = new THREE.HemisphereLight(0xffffff, 0xff3300);

    // init scene
    that.createStack(false);

    // create a plane
    var planeGeometry = new THREE.PlaneBufferGeometry(3000, 3000);
    var planeMaterial = new THREE.MeshStandardMaterial({ color: 0xf9f9f9 });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotateX(-1.5708);
    // plane.translateY(-100);
    plane.receiveShadow = true;
    that.scene.add(plane);

    that.renderer.setSize(canvasWidth, canvasHeight, true);
    that.renderer.setClearColor(0xf9f9f9, 1);
    that.canvas.appendChild(that.renderer.domElement);

    // set up camera
    that.camera.position.set(700, 700, 500);
    that.camera.lookAt(that.meshArr[that.meshArr.length - 1].position);
    that.camera.position.set(700, 750, 500);
    // that.camera.position.set(600, 600, 500);
    // console.log(that.meshArr[that.meshArr.length - 1].position)

    // create light
    that.lights.spot.position.set(300, 1200, 1400);

    that.scene.add(that.lights.spot, that.lights.hemi);

    that.renderer.render(that.scene, that.camera);
  },
  methods: {
    calcVolume: function(callback = false) {
      /*
       * 1. Get drink size
       * 2. Get pump-size
       * 3. Find ratio to drink size
       *
       * USE ML
       */
      var info = this.appData;
      // var drinkSize = info.drinkSize[this.customerData.size].ml;
      var pumpSize = info.pumpSize.ml;

      var ingredients = this.customerData.ingredients;

      // general ingredients
      for (var type in ingredients) {
        if (type == "flavors" || type == "sweeteners") {
          for (var subtype in ingredients[type]) {
            ingredients[type][subtype].volume =
              ingredients[type][subtype].quantity * pumpSize;
          }
        } else {
          ingredients[type].volume = ingredients[type].quantity * pumpSize;
        }
      }

      if (callback) {
        callback();
      }
    },
    animate: function() {
      var that = this;

      requestAnimationFrame(that.animate);
      TWEEN.update();
      that.renderer.render(that.scene, that.camera);
    },
    getCylID: function(cylName) {
      var id = this.meshArr.findIndex(function(item) {
        return item.name == cylName;
      });

      return id;
    },
    makeCyl: function(cylName, cylHeight, cylColor = "#FFFFFF") {
      var that = this;

      if (cylHeight > 0) {
        var geo = new THREE.CylinderGeometry(150, 150, cylHeight, 40);
        var mat = new THREE.MeshPhongMaterial({
          color: cylColor
        });

        // mat.flatShading = true;

        var mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        mesh.receiveShadow = false;

        mesh.name = cylName;
        mesh.position.y = cylHeight / 2;

        return mesh;
      } else {
        return null;
      }
    },
    createStack: function(render = true) {
      var that = this;
      var arr = [];

      this.scene.remove(this.scene.getObjectByName("thisGroup"));

      var ingredients = that.appData.ingredients;

      if (
        that.customerData.baseDrink.tags.includes("americano") ||
        that.customerData.baseDrink.tags.includes("black_coffee")
      ) {
        arr.push(
          that.makeCyl(
            "water",
            that.customerData.baseDrink.config.espresso * 3,
            that.appData.options.water.color
          )
        );
      } else {
        arr.push(
          that.makeCyl(
            "milk",
            that.customerData.baseDrink.config.espresso * 3,
            that.appData.options.milk.color
          )
        );
      }
      arr.push(
        that.makeCyl(
          "espresso",
          that.customerData.baseDrink.config.espresso * 1.5,
          ingredients.espresso.color
        ),
        that.makeCyl(
          "chocolate",
          that.customerData.baseDrink.config.flavors.chocolate,
          ingredients.flavors[0].color
        ),
        that.makeCyl(
          "caramel",
          that.customerData.baseDrink.config.flavors.caramel,
          ingredients.flavors[1].color
        ),
        that.makeCyl(
          "vanilla",
          that.customerData.baseDrink.config.flavors.vanilla,
          ingredients.flavors[2].color
        ),
        that.makeCyl(
          "sugarFreeVanilla",
          that.customerData.baseDrink.config.flavors.sugarFreeVanilla,
          ingredients.flavors[3].color
        ),
        that.makeCyl(
          "sugar",
          that.customerData.baseDrink.config.sweeteners.sugar,
          ingredients.sweeteners[0].color
        ),
        that.makeCyl(
          "stevia",
          that.customerData.baseDrink.config.sweeteners.stevia,
          ingredients.sweeteners[1].color
        )
      );

      var newArr = arr.filter(x => x != null);

      var count = newArr.length;
      var group = new THREE.Group();
      group.name = "thisGroup";

      // loop through for respective heights
      for (var i = 0; i < count; i++) {
        if (i == 0) {
          group.add(newArr[i]);
          continue;
        }

        for (var x = 0; x < i; x++) {
          // console.log(newArr[i].name, newArr[x].name);
          newArr[i].position.y += newArr[x].geometry.parameters.height;
        }

        group.add(newArr[i]);
      }

      this.scene.add(group);
      if (render) {
        // that.camera.lookAt(that.meshArr[that.meshArr.length - 1].position);
        that.renderer.render(that.scene, that.camera);
      }
      this.meshArr = newArr;

      return group;
    },
    scaleCyl: function(cylID, cylHeight, callback = false) {
      var meshes, renderer, scene, camera;
      var that = this;

      meshes = that.meshArr;
      renderer = that.renderer;
      scene = that.scene;
      camera = that.camera;

      /*
       *
       *  Order of Operation
       *  1. Get current scale
       *  2. Get current height
       *  3. use new height to find new scale
       *
       *  Visual of Ratio
       *
       *
       *	oldScale     oldHeight
       *	--------  =  ---------
       *	newScale     newHeight
       *
       *  newScale = (oldScale / oldHeight) * newHeight
       *  newHeight = newScale / (oldScale / oldHeight)
       *
       *
       */

      var oldHeight = meshes[cylID].geometry.parameters.height;
      var newHeight = cylHeight > 0 ? cylHeight : 0.000001;
      var ogScale = meshes[cylID].scale.y;
      var newScale = (ogScale / oldHeight) * newHeight;
      // var tween;

      if (newHeight != oldHeight) {
        meshes[cylID].scale.y = newScale;
        meshes[cylID].position.y = newHeight / 2;
        meshes[cylID].geometry.parameters.height = newHeight;
        that.renderer.render(that.scene, that.camera);
      }
    }
  }
};
</script>
