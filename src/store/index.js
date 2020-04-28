import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import appData from "../assets/appData.json";
import drinks from "../assets/drinks.json";

export default new Vuex.Store({
  state: {
    appData,
    drinks,
    customerData: {
    //   baseDrink: drinks[3],
    //   size: "medium",
    //   temperature: "hot"
      baseDrink: null,
      size: null,
      temperature: null
    }
  },
  mutations: {
    updateBaseDrink({ customerData, drinks }, val) {
      var baseDrink = drinks.find(drink => drink.name == val);
      customerData.baseDrink = baseDrink;
      customerData.size = baseDrink.customizations.sizes[0];
      customerData.temperature = baseDrink.customizations.temperatures[0];
    },
    updateSize({ customerData }, val) {
      customerData.size = val;
    }
  },
  actions: {
    updateBaseDrink({ commit }, val) {
      return new Promise((resolve, reject) => {
        commit("updateBaseDrink", val);
        resolve();
      });
    },
    updateSize({ commit }, val) {
      return new Promise((resolve, reject) => {
        commit("updateSize", val);
        resolve();
      });
    }
  },
  modules: {}
});
