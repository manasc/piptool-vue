<template>
  <div id="visualizer" v-bind:style="style.canvas"></div>
</template>

<script>
import { mapState } from "vuex";
import * as THREE from "three";

export default {
  name: "ThreeBox",
  data: function () {
    return {
      animationDuration: 1000,
      drinks: this.allDrinks,
      meshGroup: null,
      meshArr: null,
      canvas: null,
      plane: null,
      modifier: null,
      renderer: null,
      scene: null,
      camera: null,
      multiplier: 10,
      currentTween: null,

      // for interactivity
      fallBackColor: null,
      raycaster: null,
      pointer: null,
      currentObject: null,
      currentObjectColor: null,
    };
  },
  computed: {
    style: function () {
      return {
        canvas: {
          height: "30rem",
          width: "100%",
          margin: "0 auto",
          backgroundColor: "rgba(0, 0, 0, 0.87)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      };
    },
    chosenDrink: function () {
      var that = this;
      var drinkID = that.customerData.base;

      return that.drinks[drinkID];
    },
    ...mapState(["appData", "customerData"]),
  },
  watch: {
    "customerData.baseDrink.config": {
      deep: true,
      handler: function (val, old) {
        this.createStack();
      },
    },
    "customerData.temperature": {
      handler: function (val, old) {
        this.createStack();
      },
    },
  },
  mounted: function () {
    /*
     *  KEEP THIS ORDER
     */

    // set up canvas
    this.canvas = document.querySelector("#visualizer");
    var canvasHeight = this.canvas.offsetHeight;
    var canvasWidth = this.canvas.offsetWidth;

    // set up renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(canvasWidth, canvasHeight, true);
    this.renderer.setClearColor(0xffffff, 1);
    this.renderer.shadowMap.enabled = true;

    // add to dom
    this.canvas.appendChild(this.renderer.domElement);

    // set up scene
    this.scene = new THREE.Scene();
    // this.scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

    // init scene
    this.createStack(false);

    // set up lights
    const light1 = new THREE.SpotLight(0xffffff);
    light1.castShadow = true;
    light1.intensity = 1;
    light1.position.set(0, 2000, 2000);

    // set up shadow
    light1.castShadow = true;
    light1.shadow.mapSize.width = 10000;
    light1.shadow.mapSize.height = 10000;
    light1.shadow.camera.near = 500;
    light1.shadow.camera.far = 4000;
    light1.shadow.camera.fov = 30;
    light1.shadow.camera.focus = 30;
    light1.lookAt(this.meshArr[0].position);

    this.scene.add(light1);
    // this.scene.add(new THREE.SpotLightHelper(light1, 5));

    const light2 = new THREE.SpotLight(0xffffff);
    light2.position.set(2000, 2000, 1000);
    light2.intensity = 0.5;

    this.scene.add(light2);
    // this.scene.add(new THREE.SpotLightHelper(light2, 5));

    // create a plane
    var planeGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
    var planeMaterial = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = THREE.Math.degToRad(90);
    // plane.castShadow = true;
    plane.receiveShadow = true;
    this.scene.add(plane);

    // set up camera
    // this.camera = new THREE.PerspectiveCamera(
    //   40,
    //   canvasWidth / canvasHeight,
    //   0.1,
    //   10000,
    // );
    // this.camera.position.set(1000, 1000, 1000);
    this.camera = new THREE.OrthographicCamera(
      canvasWidth / -1.25,
      canvasWidth / 1.25,
      canvasHeight / 1,
      canvasHeight / -1.5,
      0,
      6000,
    );
    this.camera.position.set(3000, 3000, 3000);
    this.camera.lookAt(this.meshArr[0].position);

    // helpers
    // this.scene.add(new THREE.AxesHelper(250));

    // init scene & render
    this.renderer.render(this.scene, this.camera);
    this.initRayCaster();

    window.addEventListener("resize", this.onWindowResize);
    document.addEventListener("mousemove", this.onPointerMove, false);
  },
  destroyed() {
    window.removeEventListener("resize", this.onWindowResize);
  },
  methods: {
    initRayCaster: function () {
      // set up interactivity
      this.raycaster = new THREE.Raycaster();
      this.pointer = new THREE.Vector2();
    },
    onPointerMove: function (event) {
      event.preventDefault();

      this.pointer.x = (event.offsetX / this.canvas.offsetWidth) * 2 - 1;
      this.pointer.y = -(event.offsetY / this.canvas.offsetHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.pointer, this.camera);
      this.intersect = this.raycaster.intersectObjects(this.meshArr);

      if (this.intersect.length > 0) {
        if (this.intersect[0].object !== this.currentObject) {
          // remove current object styling
          if (this.currentObject) {
            this.currentObject.material.emissive.setHex(this.fallBackColor);
            this.currentObject.material.emissiveIntensity =
              this.fallBackIntensity;
          }

          // set new object as current
          this.currentObject = this.intersect[0].object;
          this.currentObject.material.emissive.setHex(0xffffff);
          this.currentObject.material.emissiveIntensity = 0.2;

          this.renderer.render(this.scene, this.camera);
        }
      } else {
        // clear
        if (this.currentObject) {
          this.currentObject.material.emissive.setHex(this.fallBackColor);
          this.currentObject.material.emissiveIntensity =
            this.fallBackIntensity;

          this.currentObject = null;
          this.currentObjectColor = null;

          this.renderer.render(this.scene, this.camera);
        }
      }
    },
    calcVolume: function (callback = false) {
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
      for (let type in ingredients) {
        if (type == "flavors" || type == "sweeteners") {
          for (let subtype in ingredients[type]) {
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
    animate: function () {
      var that = this;

      requestAnimationFrame(that.animate);
      TWEEN.update();
      that.renderer.render(that.scene, that.camera);
    },
    getCylID: function (cylName) {
      var id = this.meshArr.findIndex(function (item) {
        return item.name == cylName;
      });

      return id;
    },
    onWindowResize: function () {
      this.canvas = document.querySelector("#visualizer");

      this.renderer.setSize(
        this.canvas.offsetWidth,
        this.canvas.offsetHeight,
        true,
      );

      this.camera.left = this.canvas.offsetWidth / -1.25;
      this.camera.right = this.canvas.offsetWidth / 1.25;
      this.camera.top = this.canvas.offsetHeight / 1;
      this.camera.bottom = this.canvas.offsetHeight / -1.5;
      this.camera.updateProjectionMatrix();

      this.renderer.render(this.scene, this.camera);
    },
    makeCyl: function (cylName, cylHeight, cylColor = "#FFFFFF") {
      var that = this;

      if (cylHeight > 0) {
        var geo = new THREE.CylinderGeometry(150, 150, cylHeight, 40);
        var mat = new THREE.MeshPhongMaterial({
          color: cylColor,
        });

        mat.emissiveIntensity = 0.25;

        if (this.customerData.temperature === "hot") {
          mat.emissive.setHex(0xf44336);
          this.fallBackColor = 0xf44336;
          this.fallBackIntensity = 0.25;
        }

        if (this.customerData.temperature === "less hot") {
          mat.emissive.setHex(0xf06292);
          this.fallBackColor = 0xf06292;
          this.fallBackIntensity = 0.25;
        }

        if (this.customerData.temperature === "cold") {
          mat.emissive.setHex(0x2196f3);
          this.fallBackColor = 0x2196f3;
          this.fallBackIntensity = 0.25;
        }

        var mesh = new THREE.Mesh(geo, mat);

        mesh.castShadow = true;
        // mesh.receiveShadow = true;

        mesh.name = cylName;
        mesh.position.y = cylHeight / 2;

        return mesh;
      } else {
        return null;
      }
    },
    createStack: function (render = true) {
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
            that.appData.options.water.color,
          ),
        );
      } else {
        arr.push(
          that.makeCyl(
            "milk",
            that.customerData.baseDrink.config.espresso * 3,
            that.appData.options.milk.color,
          ),
        );
      }

      arr.push(
        that.makeCyl(
          "espresso",
          that.customerData.baseDrink.config.espresso * 1.5,
          ingredients.espresso.color,
        ),
        that.makeCyl(
          "chocolate",
          that.customerData.baseDrink.config.flavors.chocolate,
          ingredients.flavors[0].color,
        ),
        that.makeCyl(
          "caramel",
          that.customerData.baseDrink.config.flavors.caramel,
          ingredients.flavors[1].color,
        ),
        that.makeCyl(
          "vanilla",
          that.customerData.baseDrink.config.flavors.vanilla,
          ingredients.flavors[2].color,
        ),
        that.makeCyl(
          "sugarFreeVanilla",
          that.customerData.baseDrink.config.flavors.sugarFreeVanilla,
          ingredients.flavors[3].color,
        ),
        that.makeCyl(
          "sugar",
          that.customerData.baseDrink.config.sweeteners.sugar,
          ingredients.sweeteners[0].color,
        ),
        that.makeCyl(
          "stevia",
          that.customerData.baseDrink.config.sweeteners.stevia,
          ingredients.sweeteners[1].color,
        ),
      );

      var newArr = arr.filter((x) => x != null);

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
  },
};
</script>
