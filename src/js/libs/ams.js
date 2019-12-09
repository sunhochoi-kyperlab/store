import {logManager} from '../libs'
import {WidgetInfo} from '../model'
import {widgetError} from '../defines'
// const WIDGET_UPGRADE_AVAILABLE = 0
// const WIDGET_UPGRADE_UNAVAILABLE = 1

var cacheResolve = {}
const AMS = {
  isServerVersionFirstTimeReady: false,
  updateAgentReady: false,
  usingFakeMode: function () { // true  : using fake app manager, false : using app manager
    if (window.applicationFramework) {
      return false
    } else {
      return true
    }
  },
  init: function () {
    try {
      if (this.usingFakeMode()) {
        logManager.info(`===== Load fake app manager(${this.usingFakeMode()})`)
        this.appmgr = require('../fake/fakeAMS').default
      } else {
        logManager.info(`===== Load app manager(${this.usingFakeMode()})`)
        this.appmgr = window.applicationFramework.applicationManager
        this.registerEvents()
      }
    } catch (err) {
      logManager.info(err.message)
    }
  },
  getOwnerApplication: function () {
    try {
      return this.appmgr.getOwnerApplication(window.document)
    } catch (err) {
      logManager.info(err.message)
    }
  },
  getUpdateDescriptor: function () {
    return new Promise((resolve, reject) => {
      logManager.info('===== getUpdateDescriptor')
      this.appmgr.checkLatestApplications()
      registerResolve('getUpdateDescriptor', resolve, reject)
    })
  },
  upgradeWidget: function (udescriptor) {
    return new Promise((resolve, reject) => {
      logManager.info('===== upgradeWidget')
      logManager.info('App Manager upgradeWidget: ' + udescriptor.widgetID)
      udescriptor.update()
      registerResolve('upgradeWidget', resolve, reject)
    })
  },
  isRunningWidget: function (id) {
    let isRunning = false
    let runningApps = this.appmgr.getRunningApplications(1)
    for (let i = 0, l = runningApps.length; i < l; i++) {
      const descriptor = runningApps.item(i).getDescriptor()
      if (descriptor.id === id) {
        isRunning = true
        break
      }
    }
    return isRunning
  },
  removeWidget: function (id) {
    return new Promise((resolve, reject) => {
      let runningApps = this.appmgr.getRunningApplications(1)
      for (let i = 0; i < runningApps.length; i++) {
        const runningAppID = runningApps.item(i).getDescriptor().id
        if (runningAppID === id) {
          runningApps.item(i).destroyApplication()
          break
        }
      }

      for (let i = 0, l = this.appmgr.widgets.length; i < l; i++) {
        const widgetID = this.appmgr.widgets.item(i).id
        if (widgetID === id) {
          this.appmgr.uninstallWidget(this.appmgr.widgets.item(i))
          break
        }
      }
      registerResolve('removeWidget', resolve, reject)
    })
  },
  getApplicationList: function () {
    try {
      const widgets = this.appmgr.widgets
      logManager.info(`App Manager getApplicationList(${widgets.length})`)
      return widgets || []
    } catch (err) {
      logManager.info(err.message)
    }
  },
  getApplicationUpdateInfo: function () {
    return this.appmgr.getApplicationUpdateInfo(this.appmgr.getOwnerApplication(window.document).getDescriptor().id)
  },
  startApplication: function (id) {
    let isRunning = false
    let runningApps = this.appmgr.getRunningApplications(1)
    for (let i = 0, l = runningApps.length; i < l; i++) {
      const descriptor = runningApps.item(i).getDescriptor()
      if (descriptor.id === id) {
        isRunning = true
        runningApps.item(i).show()
        logManager.info(`Show Running Widget (id: ${id})`)
        break
      }
    }

    if (isRunning === false) {
      for (let i = 0, l = this.appmgr.widgets.length; i < l; i++) {
        const wd = this.appmgr.widgets.item(i)
        if (wd.id === id) {
          this.appmgr.getOwnerApplication(window.document).startWidget(wd, false)
          logManager.info(`Start Widget (id: ${id})`)
          break
        }
      }
    }
  },
  registerEvents: function () {
    this.appmgr.addEventListener('LatestUpdate', handleUpdateDescriptor) // update 리스트 설치 진행, function (updatelist, state)
    this.appmgr.addEventListener('WidgetInstallation', handleUpgradeWidget, false) // 위젯 설치 과정 중 진행 상태가 변경되거나 오류가 발생할 경우, 기 설정된 이벤트 핸들러가호출, function (wd, state, reason, downloadPkg) {
    this.appmgr.addEventListener('WidgetUninstallation', handleUninstallWidget) // 위젯 제거 과정 중 진행 상태가 변경되거나 오류가 발생할 경우, 기 설정된 이벤트 핸들러가 호출된다.
    // this.appmgr.addEventListener('ApplicationUpdateInfo', handleApplicationUpdateInfo) // function (lists) {
    this.appmgr.addEventListener('ApplicationLoaded', (app) => { // Application의 로딩이 완료 되었을 때에
      console.log('ApplicationLoaded')
      const wd = app.getDescriptor()
      if (wd.id !== 'http://www.obigo.com/posco/digen/store' && wd.id !== 'http://www.obigo.com/ssangyong/C300/store') {
        app.show()
      }
    })
  },
  removeEvents: function () {
    this.appmgr.removeEventListener('LatestUpdate')
  }
}

function registerResolve (fnName, resolve, reject, timeout) {
  timeout = timeout || 5000
  cacheResolve[fnName] = {
    resolve: resolve,
    reject: reject,
    timeout: setTimeout(() => {
      delete cacheResolve[fnName]
      reject('timeout')
    }, timeout)
  }
}

function removeResolve (fnName) {
  if (cacheResolve[fnName]) {
    clearTimeout(cacheResolve[fnName].timeout)
    delete cacheResolve[fnName]
  }
}

function handleUpdateDescriptor (updatelist, state) {
  let updateList = []
  for (var i = 0, l = updatelist.length; i < l; i++) {
    let updateDescriptor = updatelist.item(i)
    updateList.push(updateDescriptor)
  }
  if (cacheResolve['getUpdateDescriptor']) {
    cacheResolve['getUpdateDescriptor'].resolve(updateList)
    removeResolve('getUpdateDescriptor')
  }
}

function handleUpgradeWidget (wd, state, reason, downloadPkg) {
  logManager.info(' ==== onWidgetInstallation ' + state)
  logManager.info(' pkg url is : ' + downloadPkg)
  if (state === widgetError.Type.WIDGET_INSTALLATION_COMPLETED) {
    logManager.info('App Manager updateWidget : state ' + state)
    logManager.info('App Manager installWidget Success : ' + wd.widgetID)
    if (cacheResolve['upgradeWidget']) {
      cacheResolve['upgradeWidget'].resolve()
      removeResolve('upgradeWidget')
    }
  } else if (state === widgetError.Type.WIDGET_INSTALLATION_FAILED) {
    logManager.info('App Manager updateWidget : state ' + state)
    logManager.info('App Manager installWidget Failed : reason ' + reason)
    if (cacheResolve['upgradeWidget']) {
      cacheResolve['upgradeWidget'].reject(widgetError.Type.WIDGET_INSTALLATION_FAILED)
      removeResolve('upgradeWidget')
    }
  } else if (state === widgetError.Type.WIDGET_INSTALLATION_UPDATE_COMPLETED) {
    logManager.info('App Manager updateWidget : state ' + state)
    logManager.info('App Manager installWidget Success : ' + wd.widgetID)
    if (cacheResolve['upgradeWidget']) {
      cacheResolve['upgradeWidget'].resolve()
      removeResolve('upgradeWidget')
    }
  } else if (state === widgetError.Type.WIDGET_INSTALLATION_UPDATE_FAILED) {
    logManager.info('App Manager updateWidget : state ' + state)
    logManager.info('App Manager installWidget Failed : ' + wd.widgetID)
    logManager.info('App Manager installWidget Failed : reason ' + reason)
    if (cacheResolve['upgradeWidget']) {
      cacheResolve['upgradeWidget'].reject(widgetError.Type.WIDGET_INSTALLATION_UPDATE_FAILED)
      removeResolve('upgradeWidget')
    }
  } else if (state === widgetError.Type.WIDGET_ERROR_STORAGE_AREA_FULL) {
    if (cacheResolve['upgradeWidget']) {
      cacheResolve['upgradeWidget'].reject(widgetError.Type.WIDGET_ERROR_STORAGE_AREA_FULL)
      removeResolve('upgradeWidget')
    }
  }
}

// function handleApplicationUpdateInfo (lists) {
//   console.log('handleApplicationUpdateInfo:', lists)
// }

function handleUninstallWidget (wd) {
  console.log('handleUninstallWidget: ')
  if (cacheResolve['removeWidget']) {
    console.log('handleUninstallWidget: return')
    cacheResolve['removeWidget'].resolve(new WidgetInfo(wd))
    removeResolve('removeWidget')
  }
}

export default AMS
