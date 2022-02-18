import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { IMessage } from 'interfaces/snackbar'

export const state = () => ({
  message: {}
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  messages: state => Object.values(state.message)
}

export const mutations: MutationTree<RootState> = {
  SET_MESSAGE: (state: any, { message }: { message: IMessage }) => {
    const setMessage = { ...state.message }
    setMessage[message.title] = message
    state.message = setMessage
  },

  REMOVE_MESSAGE: (state: any, title: string) => {
    const newMessage = { ...state.message }
    delete newMessage[title]
    state.message = newMessage
  }
}

export const actions: ActionTree<RootState, RootState> = {
  setMessage ({ commit }, data: IMessage) {
    commit('SET_MESSAGE', { message: data })
  },
  clearMessage ({ commit }, title: string) {
    commit('REMOVE_MESSAGE', title)
  }
}
