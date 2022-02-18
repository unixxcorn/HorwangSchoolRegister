<template>
  <v-card class="overflow-hidden d-flex justify-space-between">
    <v-app-bar
      tile
      fixed
      flat
      app
      height="120"
      elevation="2"
      color="#332723"
      dark
      :class="`${
        $vuetify.breakpoint.mdAndUp
          ? 'px-12'
          : $vuetify.breakpoint.smOnly
          ? 'px-6'
          : 'px-0'
      }`"
    >
      <!-- Logo -->
      <v-toolbar-title style="min-width:60px;">
        <img
          :src="require('~/assets/logo_horwang.png')"
          alt="logo"
          class="layout__navbar__logo"
        />
      </v-toolbar-title>
      <div class="ml-4 white--text">
        <p
          :class="`${
            !$vuetify.breakpoint.mdAndDown ? 'headline' : 'title'
          } font-weight-bold`"
        >
          {{ title }}
        </p>
        <p
          :class="`${
            !$vuetify.breakpoint.mdAndDown ? 'title' : 'subtitle-1'
          } font-weight-bold`"
        >
          {{ subtitle }}
        </p>
      </div>
    </v-app-bar>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "NavbarLayout",
  data() {
    return {
      title: "การคัดเลือกนักเรียนชั้น ม.3 (เดิม) เข้าศึกษาต่อ ม.4 โรงเรียนหอวัง",
      subtitle: "โรงเรียนหอวัง",
    };
  },
});
</script>

<style lang="scss" scoped>
p {
  padding: 0px;
  margin: 0px;
}
.layout__navbar__logo {
  max-width: 175px;
  max-height: 71.62px;
}

</style>
