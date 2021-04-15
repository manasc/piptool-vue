<template>
  <v-app>
    <v-main>
      <v-container class="py-10 my-10">
        <h1 class="headline red--text">Perfect is Personal</h1>
        <v-divider class="mt-2 mb-10"></v-divider>
        <router-view></router-view>
      </v-container>
      <!-- <v-container
        v-if="$store.state.customerData.baseDrink"
        class="py-10 my-10"
      >
        <v-row>
          <v-col>
            <v-card class="pa-5">
              <pre>{{ $store.state.customerData.size }}</pre>
              <pre>{{ $store.state.customerData.temperature }}</pre>
              <pre>{{ $store.state.customerData.baseDrink.config }}</pre>
            </v-card>
          </v-col>
        </v-row>
      </v-container> -->
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    //
  }),
};
</script>
