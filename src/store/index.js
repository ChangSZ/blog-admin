import Vue from 'vue'
import Vuex from 'vuex'

import app from './module/app'
import auth from './module/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    auth
  }
})
