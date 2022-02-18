import Vue from 'vue'
import { Plugin } from '@nuxt/types'

const loaderPlugin: Plugin = ({ store }, _) => {
  Vue.prototype.$loader = (visible: boolean, text?: string) => {
    if (visible) {
      store.dispatch('loader/show', { text })
    } else {
      store.dispatch('loader/hide')
    }
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $loader(visible: boolean, text?: string): void
  }
}

export default loaderPlugin
