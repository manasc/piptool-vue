<template>
  <div>
    <v-row>
      <v-col cols="7">
        <div class="overline">Last Step</div>
        <v-divider class="mb-3"></v-divider>
        <v-content class="mb-10">
          <div class="display-1 red--text mb-3">
            We'll send you an email with your drink image and a little surprise.
          </div>
          <div class="subtitle mb-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. In eligendi
            eum accusantium quae? Reprehenderit eos dignissimos earum alias
            eaque nisi voluptate deserunt libero blanditiis possimus.
            <v-btn @click="briggoLink()" color="red" class="-mx-2" text small>
              Read more
              <v-icon class="md-2" right>mdi-arrow-right</v-icon>
            </v-btn>
          </div>
        </v-content>
        <v-content class="mb-10">
          <div class="overline">Get your drink</div>
          <v-divider class="mb-3"></v-divider>
          <v-sheet elevation="1" class="px-8 pa-5 mb-5">
            <div class="caption"></div>
            <v-text-field
              class="mb-7"
              label="Drink Name"
              hint="Name it something unique!"
              persistent-hint
              color="red"
            ></v-text-field>
            <v-text-field class="mb-7" color="red" label="Name"></v-text-field>
            <v-text-field class="mb-7" color="red" label="Email"></v-text-field>
          </v-sheet>
          <v-btn
            @click="$router.push({ name: 'thank-you' })"
            color="red"
            rounded
            outlined
            dark
            >Submit</v-btn
          >
        </v-content>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="4">
        <div class="overline">Your Config</div>
        <v-divider class="mb-3"></v-divider>

        <v-card class="px-4 py-3">
          <pre>{{ $store.state.customerData.baseDrink.config }}</pre>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  computed: {
    briggoLink: function() {
      return (location.href = "https://briggo.com/about/");
    }
  }
};
</script>
