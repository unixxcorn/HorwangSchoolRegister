<template>
  <v-dialog
    :value="value"
    scrollable
    :fullscreen="fullScreen ? (width ? $vuetify.breakpoint.xsOnly : true) : false"
    :width="width"
    @input="$emit('input', $event)"
  >
    <v-card>
      <v-card-title>
        <span class="title">{{ title }}</span>
        <v-spacer />
        <v-btn elevation="0" color="primary" fab @click="$emit('input', false)">
          <v-icon color="white" size="36">
            mdi-close-circle
          </v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="my-4">
        <slot />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'DialogLayout',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    width: {
      type: String,
      default: ''
    },
    fullScreen: {
      type: Boolean,
      default: true
    }
  }
})
</script>
