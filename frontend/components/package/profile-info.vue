<template>
  <v-card elevation="0" width="100%" class="pa-4">
    <v-card-title class="text-center font-weight-bold">
      <v-icon color="accent">mdi-account-circle</v-icon>
      <span class="ml-2">ข้อมูลนักเรียน</span>
    </v-card-title>
    <v-card-text class="body-1 accent--text">
      <v-row v-for="(item, index) of data" :key="`${index}-profile`">
        <v-col class="text-right font-weight-bold py-2">
          {{ item.title }} :
        </v-col>
        <v-col class="ml-2 py-2" md="8" cols="6">{{ item.value }}</v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="error" @click="logout()">
        <v-icon>mdi-logout</v-icon>
        <span class="ml-2">ออกจากระบบ</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "PackageProfileInfo",
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  methods: {
    logout() {
      return window.location.reload();
    },
  },
});
</script>