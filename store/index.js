export const state = () => ({
  isAuth: false,
  cekRole: null,
})

export const mutations = {
  SET_IS_AUTH(state, payload) {
    state.isAuth = payload
  },
  SET_ROLE(state, payload) {
    state.cekRole = payload
  },
}

export const actions = {
  nuxtServerInit({ commit }, context) {
    if (context.app.$auth.$state.loggedIn === true) {
      commit('SET_IS_AUTH', context.app.$auth.$state.loggedIn)
      commit('SET_ROLE', this.$auth.$state.user.role.nama)
    }
  },
}
