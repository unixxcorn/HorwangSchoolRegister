<template>
  <v-container class="d-flex flex-column justify-center align-center">
    <!-- Form -->
    <login-form @isAuth="$emit('update:user', $event)" />

    <!-- Contact -->
    <login-contact />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "LoginPage",
});
</script>
