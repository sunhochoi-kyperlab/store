import {appStatus} from '../defines'
import {logManager} from '../libs'
import store from '../../store'

class Application {
  constructor (data) {
    this.id = data.id
    this.names = data.names
    this.iconSrc = data.iconSrc
    this.status = Object.keys(appStatus).indexOf(data.status) >= 0 ? data.status : appStatus.LOCAL
    this.desc = data.desc || ''
    this.newDesc = data.newDesc || ''
    this.version = data.version || ''
    this.installTime = data.installTime || 0
    this.fileSize = data.fileSize || 0
    this.percent = 0
    this.badge = false
    this.widget = data.widget || {}
    this.software = data.software || {}
    this.required = data.required || false
    this.remove = data.remove || false
    this.blacklist = data.blacklist || false
    this.blacklistDesc = data.blacklistDesc || ''
  }

  injectApplication (application) {
    if ([appStatus.DOWNLOADED, appStatus.NEW].indexOf(application.status) < 0) {
      return
    }
    this.names = application.names || this.names

    if ([appStatus.LOCAL, appStatus.DOWNLOADED].indexOf(this.status) >= 0 && application.status === appStatus.NEW) {
      if (this.isVersionUpdate(application.version)) {
        this.status = appStatus.SERVER
        this.version = application.version
      }
    } else if (this.status === appStatus.LOCAL && application.status === appStatus.DOWNLOADED) {
      if (this.isVersionUpdate(application.version)) {
        this.status = appStatus.DOWNLOADED
        this.version = application.version
      }
    }

    if (this.status !== appStatus.LOCAL) {
      this.iconSrc = application.iconSrc || this.iconSrc
      this.desc = application.desc || this.application
      this.fileSize = application.fileSize || this.fileSize
    }
    if (application.widget) {
      this.widget = application.widget
    }
    if (application.software) {
      this.software = application.software
    }
    if (application.newDesc) {
      this.newDesc = application.newDesc
    }
    if (application.required) {
      this.required = application.required
    }
    if (application.remove) {
      this.remove = application.remove
    }
    if (application.blacklist) {
      this.blacklist = application.blacklist
    }
    if (application.blacklistDesc) {
      this.blacklistDesc = application.blacklistDesc
    }
  }

  isVersionUpdate (newVersion) {
    if (!this.version || !newVersion) {
      logManager.info(`local version is: ${this.version} newVersion: ${newVersion}`)
      logManager.info('one of them does not exist here')
      return false
    }
    const oldVersionArray = this.version.split('.')
    const newVersionArray = newVersion.split('.')
    for (let i = 0; i < oldVersionArray.length; i++) {
      oldVersionArray[i] = parseInt(oldVersionArray[i])
      newVersionArray[i] = parseInt(newVersionArray[i])
      if (newVersionArray[i] > oldVersionArray[i]) {
        console.log(`id: ${this.id}, new: ${newVersion}, old: ${this.version}`)
        return true
      } else if (newVersionArray[i] < oldVersionArray[i]) {
        return false
      }
    }
    return false
  }
  getData () {
    return {
      id: String(this.id),
      names: Object.assign({}, this.names),
      iconSrc: String(this.iconSrc),
      status: String(this.status),
      desc: String(this.desc),
      version: String(this.version),
      installTime: Number(this.installTime) || 0,
      fileSize: Number(this.fileSize) || 0,
      percent: Number(this.percent) || 0,
      badge: Boolean(this.badge) || false,
      required: Boolean(this.required) || false,
      remove: Boolean(this.remove) || false,
      blacklist: Boolean(this.blacklist) || false,
      blacklistDesc: String(this.blacklistDesc) || '',
      software: Object.assign({}, this.software),
      widget: Object.assign({}, this.widget),
      newDesc: String(this.newDesc)
    }
  }
  getName () {
    if (this.names) {
      const keys = Object.keys(this.names)
      return this.names[store.state.lang] || this.names['default'] || (keys.length > 0 ? this.names[keys[0]] : '') || ''
    } else {
      return ''
    }
  }
  getPercent () {
    return `${this.percent}%` || '0%'
  }
  setPercent (num) {
    this.percent = Number.parseInt(num)
  }
  getDesc () {
    if ([appStatus.NEW, appStatus.DOWNLOADED].indexOf(this.status) >= 0) {
      return this.newDesc || ''
    } else {
      return this.desc || ''
    }
  }
  setDesc (desc) {
    this.desc = desc
  }
  getNewDesc () {
    if ([appStatus.NEW, appStatus.DOWNLOADED, appStatus.LOCAL].indexOf(this.status) >= 0) {
      return ''
    } else {
      return this.newDesc || ''
    }
  }
  getFileSize () {
    if (this.fileSize && this.fileSize > (1024 * 1024)) {
      return `${Number(this.fileSize / (1024 * 1024)).toFixed(2)}MB`
    } else if (this.fileSize && this.fileSize > 1024) {
      return `${Number(this.fileSize / 1024).toFixed(2)}KB`
    } else {
      return ''
    }
  }
  getPercentSize () {
    if (this.fileSize && this.fileSize > (1024 * 1024)) {
      return `${Number((this.fileSize * (this.percent / 100)) / (1024 * 1024)).toFixed(2)}`
    } else if (this.fileSize && this.fileSize > 1024) {
      return `${Number((this.fileSize * (this.percent / 100)) / 1024).toFixed(2)}`
    } else {
      return 0
    }
  }
  getVersion () {
    return this.version
  }
  getStatus () {
    return this.status
  }
  setStatus (status) {
    this.status = status
  }
  getBadge () {
    return this.badge
  }
  setBadge (badge) {
    this.badge = badge
  }
  getIconSrc () {
    return this.iconSrc
  }
}

export default Application
