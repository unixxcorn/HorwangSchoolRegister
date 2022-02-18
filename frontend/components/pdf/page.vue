<template>
  <v-container class="d-flex flex-column justify-center align-center">
    <v-card elevation="1" height="70vh" width="100%">
      <object :data="data" type="application/pdf" width="100%" height="100%" />
      <v-card-actions>
        <v-spacer />
        <v-btn color="error" @click="logout()">
          <v-icon>mdi-logout</v-icon>
          <span class="ml-2">ออกจากระบบ</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "PDFPage",
  props: {
    data: {
      type: String,
      default: "",
    },
  },
  methods: {
    logout() {
      return window.location.reload();
    },
  },
});
</script>