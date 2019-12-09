import {ams, downloadManager} from '../libs'
import {Application, SoftwareInfo, WidgetInfo} from '../model'
import {appStatus} from '../defines'
import store from '@/store'

function getInstalledData () {
  return new Promise((resolve, reject) => {
    const installedAppList = ams.getApplicationList()
    let list = []
    for (let i = 0, l = installedAppList.length; i < l; i++) {
      const appItem = installedAppList.item(i)
      const widgetInfo = new WidgetInfo(appItem)
      const toApplicationData = widgetInfo.toApplicationClassData()
      const application = new Application(toApplicationData)
      list.push(application)
    }
    resolve(list)
  })
}

function getDownloadedData () {
  return new Promise((resolve, reject) => {
    downloadManager.checkDownloadedList()
      .then(res => {
        let list = []
        if (!(res.MSG && res.MSG.SOFTWARELIST)) {
          return reject('getDownloadedData Err: invalid response format')
        }
        for (let i = 0, l = res.MSG.SOFTWARELIST.length; i < l; i++) {
          const item = res.MSG.SOFTWARELIST[i]
          const softwareInfo = new SoftwareInfo(item, appStatus.DOWNLOADED)
          const application = new Application(softwareInfo.toApplicationClassData())
          list.push(application)
        }
        resolve(list)
      })
      .catch(err => {
        reject('getDownloadedData Err: ' + err)
      })
  })
}

function downloadedToInstall (widgetID) {
  return new Promise((resolve, reject) => {
    ams.getUpdateDescriptor()
      .then((updateDescriptorList) => {
        let updateDescriptor = {}
        for (let i = 0, l = updateDescriptorList.length; i < l; i++) {
          const updateItem = updateDescriptorList[i]
          if (updateItem.widgetID === widgetID) {
            updateDescriptor = updateItem
            break
          }
        }
        return updateDescriptor
      })
      .then(updateDescriptor => {
        const index = store.state.appListIndexs[updateDescriptor.widgetID]
        const application = store.state.appList[index]
        if (!updateDescriptor) throw new Error('Not find updateDescriptor')
        if (!application) throw new Error('Not find application')
        if (!(application.isVersionUpdate(updateDescriptor.widgetVersion) || application.getVersion() === updateDescriptor.widgetVersion)) {
          throw new Error(`Upgrade is not performed due to version issue.(installed: ${application.version}, downloaded: ${updateDescriptor.widgetVersion})`)
        }
        return ams.upgradeWidget(updateDescriptor)
      })
      .then(() => {
        resolve()
      })
      .catch(err => {
        reject(err)
      })
  })
}

export default {
  getInstalledData,
  getDownloadedData,
  downloadedToInstall
}
