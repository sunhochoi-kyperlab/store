import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'
import mutations from './mutations'
import actions from './actions'

import createLogger from './util/logger'
import {loadingStatus, installStatus} from '../js/defines'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const state = {
  lang: 'en-us',
  progressShow: false,
  pageShow: 'apps',
  newBadge: false,
  installStatus: installStatus.PAUSE,
  loadingStatus: loadingStatus.NONE,
  newInstalledIDList: [],
  appList: [],
  appListIndexs: {},
  appSelectID: '',
  popupData: {
    title: '',
    type: '',
    content: '',
    onOpen: () => {},
    buttons: []
  }
}

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})

export default store
