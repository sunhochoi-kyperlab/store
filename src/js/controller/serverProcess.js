import {Application, SoftwareInfo} from '../model'
import {downloadManager, logManager} from '../libs'
import {appStatus, msgFormat} from '../defines'
import store from '../../store'

function getNewData () {
  return new Promise((resolve, reject) => {
    let msg = msgFormat.REQUEST_VERSION()
    let applicationList = store.getters.localApplication
    applicationList.forEach(v => {
      msg.MSG.SOFTWARELIST.push({
        ID: v.id,
        VERSION: v.version
      })
    })
    downloadManager.requestVersion(msg, {ignoreError: true})
      .then(res => {
        let list = []
        if (!(res.MSG && res.MSG.SOFTWARELIST)) {
          return reject('getNewData Err: invalid response format')
        }
        for (let i = 0, l = res.MSG.SOFTWARELIST.length; i < l; i++) {
          const item = res.MSG.SOFTWARELIST[i]
          const softwareInfo = new SoftwareInfo(item, appStatus.NEW)
          const application = new Application(softwareInfo.toApplicationClassData())
          list.push(application)
        }
        resolve(list)
      })
      .catch(err => {
        reject('getNewData Err: ' + err)
      })
  })
}

function downloadApplication () {
  return new Promise((resolve, reject) => {
    const application = store.getters.detailApplication
    let msg = msgFormat.REQUEST_DOWNLOAD()
    msg.MSG.SOFTWARELIST.push({'ID': application.id, 'VERSION': application.version})
    downloadManager.requestDownload(msg)
      .then(res => {
        if (res && res.MSG && res.MSG.FILE_NAME) {
          logManager.info(`Download Complete : ${application.id}`)
          const DownloadedPath = res.MSG.FILE_NAME.replace('.wgt', '')
          return resolve(DownloadedPath)
        } else {
          return resolve()
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}

function IntegrityApplication (downloadedPath) {
  return new Promise((resolve, reject) => {
    const application = store.getters.detailApplication
    let msg = msgFormat.REQUEST_INTEGRITY()
    msg.MSG.SOFTWARELIST.push({
      ID: application.id,
      VERSION: application.version,
      DOWNLOAD: downloadedPath,
      LOCATION: []
    })
    downloadManager.requestIntegrity(msg)
      .then(() => {
        logManager.info(`Integrity Complete : ${application.id}`)
        resolve()
      })
      .catch(err => {
        reject(err)
      })
  })
}

export default {
  getNewData,
  downloadApplication,
  IntegrityApplication
}
