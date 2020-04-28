<template>
  <div>
    <v-row>
      <v-col cols="4">
        <v-select
          outlined
          label="Base Drink"
          :items="drinksArr"
          :value="customerData.baseDrink ? customerData.baseDrink.name : null"
          @change="chooseDrink"
        ></v-select>
      </v-col>
      <v-col cols="8">
        <div class="display-1 red--text d-flex pt-2">
          <v-icon class="mr-3">mdi-arrow-left</v-icon>
          Pick a Drink to get started!
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "Base",
  computed: {
    drinksArr: function() {
      var arr = [];
      var drinks = this.$store.state.drinks;

      for (var i = 0; i < drinks.length; i++) {
        arr.push({
          text: drinks[i].name,
          value: drinks[i].name
        });
      }

      return arr;
    },
    ...mapState(["customerData"])
  },
  methods: {
    ...mapActions(["updateBaseDrink"]),
    chooseDrink: function(e) {
      this.updateBaseDrink(e).then(() => {
        this.$router.push({ name: "customize" });
      });
    }
  }
};
</script>
