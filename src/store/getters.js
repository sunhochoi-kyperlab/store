import {appStatus} from '../js/defines'

const getters = {
  localApplication (state) {
    return state.appList.filter(v => {
      return v.status === appStatus.LOCAL
    })
  },
  serverApplication (state) {
    return state.appList.filter(v => {
      return v.status === appStatus.SERVER
    }).sort((a, b) => {
      const aName = a.getName()
      const bName = b.getName()
      return aName > bName
    })
  },
  newLocalApplication (state) {
    return state.appList.filter(v => {
      if (!v.badge) return false
      return v.status === appStatus.LOCAL
    }).sort((a, b) => {
      const aName = a.getName()
      const bName = b.getName()
      return aName > bName
    })
  },
  orginLocalApplication (state) {
    return state.appList.filter(v => {
      if (v.badge) return false
      return v.status === appStatus.LOCAL
    }).sort((a, b) => {
      const aName = a.getName()
      const bName = b.getName()
      return aName > bName
    })
  },
  newAppsApplication (state) {
    return state.appList.filter(v => {
      if (state.newInstalledIDList.indexOf(v.id) >= 0) return true
      return [appStatus.NEW, appStatus.DOWNLOADED].indexOf(v.status) >= 0 && v.remove === false
    }).sort((a, b) => {
      const aName = a.getName()
      const bName = b.getName()
      return aName > bName
    })
  },
  detailApplication (state) {
    const id = state.appSelectID
    const index = state.appListIndexs[id]
    return state.appList[index] || state.appList[0]
  },
  // isNewBadge (state) {
  //   return state.appList.find(v => v.badge === true)
  // },
  updateBadgeCount (state) {
    const applist = state.appList.filter(v => {
      return v.status === appStatus.SERVER
    }).sort((a, b) => {
      const aName = a.getName()
      const bName = b.getName()
      return aName > bName
    })
    if (applist.length >= 1000) {
      return '999+'
    } else {
      return applist.length || ''
    }
  }
}

export default getters
