<template>
  <v-dialog :value="visible" persistent width="340px">
    <v-card color="secondary">
      <v-card-text class="pa-4">
        {{ text }}
        <v-progress-linear
          indeterminate
          color="white"
          class="my-2"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  name: 'LoaderLayout',
  computed: {
    ...mapState('loader', ['text', 'visible'])
  }
})
</script>
