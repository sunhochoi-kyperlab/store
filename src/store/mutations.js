import {loadingStatus, installStatus} from '../js/defines'

const mutations = {
  setPageShow (state, payload) {
    state.pageShow = payload
  },
  setAppList (state, payload) {
    state.appListIndexs = {}
    payload.forEach(v => {
      state.appListIndexs[v.id] = state.appList.push(v) - 1
    })
  },
  pushAppList (state, payload) {
    state.appListIndexs[payload.id] = state.appList.push(payload) - 1
  },
  removeAppList (state, payload) {
    console.log(`Delete Application (id: ${payload})`)
    const index = state.appListIndexs[payload]
    state.appList.splice(index, 1)

    state.appListIndexs = {}
    for (let i = 0, l = state.appList.length; i < l; i++) {
      const id = state.appList[i].id
      state.appListIndexs[id] = i
    }
  },
  changeAppList (state, payload) {
    const index = state.appListIndexs[payload.id]
    const getData = payload.getData()
    state.appList[index].injectApplication(getData)
  },
  clearAppList (state, payload) {
    state.appListIndexs = {}
    state.appList = []
  },
  setAppStatus (state, payload) {
    const index = state.appListIndexs[payload.id]
    state.appList[index].setStatus(payload.status)
  },
  setAppBadge (state, payload) {
    const index = state.appListIndexs[payload.id]
    state.appList[index].setBadge(payload.badge)
  },
  setAppPercent (state, payload) {
    const index = state.appListIndexs[payload.id]
    state.appList[index].setPercent(payload.percent)
  },
  setAppDesc (state, payload) {
    const index = state.appListIndexs[payload.id]
    state.appList[index].setDesc(payload.desc)
  },
  setAppSelectID (state, payload) {
    state.appSelectID = payload
  },
  showProgressPopup (state, payload) {
    state.progressShow = true
    state.popupData.title = payload.title || ''
    state.popupData.content = payload.content || ''
    state.popupData.buttons = payload.buttons || []
    state.popupData.onOpen = payload.onOpen
    state.popupData.type = payload.type
  },
  closeProgressPopup (state, payload) {
    // state.progressShow = false
  },
  setPercent (state, payload) {
    const index = state.appListIndexs[payload.id]
    state.appList[index].setPercent(payload.percent)
  },
  setLoadingStatus (state, payload) {
    if (Object.keys(loadingStatus).indexOf(payload) < 0) return
    state.loadingStatus = payload
  },
  setInstallStatus (state, payload) {
    if (Object.keys(installStatus).indexOf(payload) < 0) return
    state.installStatus = payload
  },
  pushNewInstalledIDList (state, payload) {
    state.newInstalledIDList.push(payload)
  },
  clearNewInstalledIDList (state, payload) {
    state.newInstalledIDList = []
  }
}

export default mutations
