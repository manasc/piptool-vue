<template>
  <div>
    <v-row>
      <v-col cols="12" md="3" class="order-2 order-md-1">
        <v-select
          outlined
          label="Base Drink"
          :items="drinksArr"
          :value="customerData.baseDrink ? customerData.baseDrink.name : null"
          @change="chooseDrink"
        ></v-select>
        <template v-if="customerData.baseDrink">
          <v-main class="mt-2 mb-10">
            <div class="overline">Description</div>
            <v-divider class="mb-2"></v-divider>
            <div class="body-1">{{ customerData.baseDrink.description }}</div>
          </v-main>

          <!-- Main Options -->
          <div class="overline">Main Customizations</div>
          <v-divider class="mb-2"></v-divider>
          <v-expansion-panels accordion>
            <template
              v-for="type in customerData.baseDrink.customizations.options"
            >
              <v-expansion-panel :key="type" v-if="type == 'size'">
                <!-- Sizes -->
                <v-expansion-panel-header>
                  {{ type | capitalize }}
                  <span class="red--text font-weight-bold ml-2">{{
                    customerData.size
                  }}</span>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-chip-group
                    column
                    active-class="red--text"
                    mandatory
                    v-model="customerData.size"
                  >
                    <v-chip
                      v-for="size in customerData.baseDrink.customizations
                        .sizes"
                      :value="size"
                      :key="size"
                    >
                      {{ size }}
                    </v-chip>
                  </v-chip-group>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel :key="type" v-else-if="type == 'temperature'">
                <!-- temperature -->
                <v-expansion-panel-header>
                  {{ type | capitalize }}
                  <span class="red--text font-weight-bold ml-2">{{
                    customerData.temperature
                  }}</span>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-chip-group
                    column
                    active-class="red--text"
                    mandatory
                    v-model="customerData.temperature"
                  >
                    <v-chip
                      v-for="temp in customerData.baseDrink.customizations
                        .temperatures"
                      :value="temp"
                      :key="temp"
                    >
                      {{ temp }}
                    </v-chip>
                  </v-chip-group>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel :key="type" v-else-if="type == 'milk'">
                <!-- milk -->
                <v-expansion-panel-header>
                  {{ type | capitalize }}
                  <span class="red--text font-weight-bold ml-2">{{
                    customerData.baseDrink.config.milkType
                  }}</span>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-chip-group
                    column
                    active-class="red--text"
                    mandatory
                    v-model="customerData.baseDrink.config.milkType"
                  >
                    <v-chip
                      v-for="milkType in appData.options.milk.types"
                      :value="milkType"
                      :key="milkType"
                    >
                      {{ milkType }}
                    </v-chip>
                  </v-chip-group>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel :key="type" v-else-if="type == 'espresso'">
                <v-expansion-panel-header>
                  {{ type | capitalize }}
                  <span class="red--text font-mono font-weight-bold ml-2">
                    {{
                      customerData.baseDrink.config[type]
                        ? customerData.baseDrink.config[type] + " mL"
                        : null
                    }}
                  </span>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-main class="mb-2">
                    <v-slider
                      v-model="customerData.baseDrink.config[type]"
                      :max="32"
                      class="mx-0"
                      color="red"
                      hide-details
                      thumb-label
                      thumb-size="24"
                    ></v-slider>
                  </v-main>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </template>
          </v-expansion-panels>
        </template>
      </v-col>
      <v-col cols="12" md="6" class="order-1 order-md-2">
        <v-main v-if="customerData.baseDrink" class="mb-5 text-center">
          <span class="overline mr-3"> Tags:</span>
          <v-chip
            v-for="tag in customerData.baseDrink.tags"
            :color="chipStyle(tag).background"
            :dark="chipStyle(tag).dark"
            class="mr-1"
            small
            :key="tag"
          >
            {{ tag }}
          </v-chip>
        </v-main>
        <v-main :style="threeBoxStyle"><three-box></three-box></v-main>
      </v-col>
      <v-col cols="12" md="3" class="order-3 order-md-3">
        <v-main v-if="customerData.baseDrink">
          <template
            v-for="type in customerData.baseDrink.customizations.ingredients"
          >
            <div class="mb-5" :key="type">
              <div class="overline">{{ type }}</div>
              <v-divider class="mb-2"></v-divider>
              <v-expansion-panels accordion>
                <v-expansion-panel
                  v-for="(val, sub) in customerData.baseDrink.config[type]"
                  :key="sub"
                >
                  <v-expansion-panel-header>
                    {{ sub | capitalize }}
                    <span class="red--text font-weight-bold ml-2">
                      {{ val ? val + " mL" : null }}
                    </span>
                  </v-expansion-panel-header>

                  <v-expansion-panel-content>
                    <v-main class="mb-2">
                      <v-slider
                        v-model="customerData.baseDrink.config[type][sub]"
                        :max="32"
                        class="mx-0"
                        color="red"
                        hide-details
                        thumb-label
                        thumb-size="24"
                      ></v-slider>
                    </v-main>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </template>
        </v-main>
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-main class="d-flex mt-10">
        <span class="mr-2 headline">Everything looks perfect?</span>
        <v-btn
          rounded
          outlined
          color="red"
          text
          pill
          x-large
          class="ml-3"
          @click="$router.push({ name: 'name-it' })"
        >
          Name Your Drink
          <v-icon right dark class="ml-3">mdi-arrow-right</v-icon>
        </v-btn>
      </v-main>
    </v-row>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import ThreeBox from "../components/ThreeBox";

export default {
  name: "Customize",
  components: { ThreeBox },
  computed: {
    drinksArr: function () {
      var arr = [];
      var drinks = this.$store.state.drinks;

      for (var i = 0; i < drinks.length; i++) {
        arr.push({
          text: drinks[i].name,
          value: drinks[i].name,
        });
      }

      return arr;
    },
    ...mapState(["appData", "customerData", "drinks"]),
  },
  data: () => ({
    threeBoxStyle: {
      border: "solid 1px #cccccc",
      borderRadius: "5px",
      overflow: "hidden",
    },
  }),
  methods: {
    ...mapActions(["updateBaseDrink", "updateSize"]),
    chooseDrink: function (e) {
      this.updateBaseDrink(e);
    },
    chipStyle: function (e) {
      var drk, bg;

      switch (e) {
        case "caffeinated":
          bg = "brown";
          drk = true;
          break;
        case "less hot":
          bg = "red lighten-1";
          drk = false;
          break;
        case "hot":
          bg = "red";
          drk = true;
          break;
        default:
          bg = "gray";
          drk = false;
      }

      return {
        background: bg,
        dark: drk,
      };
    },
  },
};
</script>
