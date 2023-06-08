import { createStore } from 'vuex'

export default createStore({
  state: {
    loginUser: null
  },
  getters: {
  },
  // 데이터 넣는 함수 생성
  mutations: {
    // 로그인되었을때
    setLoginUser(state, user) {
      state.loginUser = user

    },
    // 로그아웃
    logout(state) {
      state.loginUser = null
    }
  },
  actions: {
  },
  modules: {
  }
})
