import {localProcess, serverProcess} from '../controller'
import {downloadManager, logManager} from '../libs'
import store from '../../store'

function init () {
  return new Promise((resolve, reject) => {
    logManager.info('===== Initialize')
    localProcess.getInstalledData()
      .then((list) => {
        list.forEach(v => pushApplicationData(v))
        return downloadManager.requestToken()
      })
      .then((res) => {
        if (!(res.MSG && res.MSG.TOKEN)) {
          return logManager.error('get not RequestToken')
        }
        return localProcess.getDownloadedData()
      })
      .then((list) => {
        list.forEach(v => pushApplicationData(v))
        return serverProcess.getNewData()
      })
      .then((list) => {
        list.forEach(v => pushApplicationData(v))
        resolve()
      })
      .catch(err => {
        reject('===== Initialize Err: \n' + err)
      })
  })
}

function pushApplicationData (application) { // oldApplication이 LOCAL, DOWNLOADED, SERVER, NEW
  const existingIndex = store.state.appListIndexs[application.id]

  if (existingIndex >= 0) {
    store.commit('changeAppList', application)
  } else {
    store.commit('pushAppList', application)
  }
}

export default {
  init: init,
  pushApplicationData: pushApplicationData
}
