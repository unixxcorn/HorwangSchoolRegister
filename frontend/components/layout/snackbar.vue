<template>
  <v-snackbar
    :value="true"
    :color="data.color"
    :timeout="3000"
    transition="slide-x-reverse-transition"
    bottom
    right
    :style="{ 'margin-bottom': calcMargin(index) }"
    @input="clearMessage(data.title)"
  >
    <v-chip small light class="body-2">
      {{ data.type }}
    </v-chip>
    <span class="body-2 ml-1">{{ data.title }}</span>
    <template #action="{ attrs }">
      <v-btn icon v-bind="attrs" @click.native="clearMessage(data.title)">
        <v-icon color="white">
          mdi-close
        </v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { mapActions } from 'vuex'
import { IMessage } from 'interfaces/snackbar'

export default Vue.extend({
  name: 'SnackbarLayout',
  props: {
    data: {
      type: Object,
      required: true
    } as PropOptions<IMessage>,
    index: {
      type: Number,
      required: true
    }
  },
  methods: {
    ...mapActions('message', ['clearMessage']),

    calcMargin (index: number) {
      return index * 60 + 'px'
    }
  }
})
</script>
