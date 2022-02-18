<template>
  <v-app>
    <v-main class="layout__default-screen__background">
      <layout-navbar />
      <v-container
        fluid
        fill-height
        class="d-flex flex-column justify-center align-center px-md-12"
      >
        <!-- Message | Snackbar -->
        <layout-snackbar
          v-for="(data, index) in messages"
          :key="`message-${data.title}`"
          :data="data"
          :index="index"
        />
        <layout-loader />
        <nuxt class="layout__default-screen__main" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";

export default Vue.extend({
  name: "DefaultLayout",
  computed: {
    ...mapGetters("message", ["messages"]),
  },
});
</script>

<style lang="scss" scoped>
#app{
  font-family: 'Sarabun', sans-serif;
}

.layout__default-screen__background {
  background-color: #f0f0f0;
}
.layout__default-screen__main {
  z-index: 1;
}
</style>
