import Vue from 'vue'
import i18n from './i18n'
import App from './App'
import router from './router'
import store from './store'

import './styles/store.css'

import ObigoUI from 'obigo-js-ui'

Vue.use(ObigoUI)

/* Native Title */
let app
if (window.applicationFramework && window.applicationFramework.applicationManager) {
  app = window.applicationFramework.applicationManager.getOwnerApplication(window.document)
}

if (app) {
  app.addEventListener('ApplicationShown', function () {
    let a = window.applicationFramework.applicationManager.getOwnerApplication(window.document)
    let d = a.getDescriptor()
    if (a && d) {
      if (d.localURI && d.iconSrcPath) {
        a.setStatusBarTitle(d.getWidgetName('en-us'), (d.localURI + d.iconSrcPath))
      }
    }
  })
}
/* Native Title - End */

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
