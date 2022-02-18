<template>
  <v-dialog
    scrollable
    persistent
    :value="value"
    width="550"
    @input="$emit('input', $event)"
  >
    <v-card>
      <v-card-title>
        <span class="title">{{ title }}</span>
      </v-card-title>

      <v-card-text>
        <p
          v-if="description"
          :class="`${description.color}--text confirm_dialog__text mb-2`"
        >
          {{ description.text }}
        </p>
        <slot />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          color="inactive_text"
          elevation="0"
          @click="$emit('close', $event)"
          v-if="!noCancel"
        >
          <span class="confirm_dialog__text">ยกเลิก</span>
        </v-btn>
        <v-btn
          :color="color"
          elevation="0"
          :loading="loading"
          @click="$emit('submit', $event)"
        >
          <span class="confirm_dialog__text">ยืนยัน</span>
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";

interface IDescription {
  text: String;
  color: String;
}

export default Vue.extend({
  name: "ConfirmLayout",
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: Object,
      default: () => null,
    } as PropOptions<IDescription>,
    color: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    noCancel: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped>
.confirm_dialog__text {
  font-size: 16px;
  line-height: 23px;
  text-decoration: none;
}
</style>
