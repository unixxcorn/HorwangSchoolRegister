import { ActionTree, MutationTree } from 'vuex'

export const state = () => ({
  text: '' as string,
  visible: false as boolean
})

export type RootState = ReturnType<typeof state>

export const mutations: MutationTree<RootState> = {
  SET_LOADER: (state: any, data: any) => {
    for (const key in data) {
      state[key] = data[key]
    }
  }
}

export const actions: ActionTree<RootState, RootState> = {
  show ({ commit }, { text }: { text: string }) {
    commit('SET_LOADER', {
      text: !text ? 'Loading ...' : text,
      visible: true
    })
  },

  hide ({ commit }) {
    commit('SET_LOADER', {
      text: '',
      visible: false
    })
  }
}
