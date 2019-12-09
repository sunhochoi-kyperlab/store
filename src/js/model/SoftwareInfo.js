import {appStatus} from '../defines'

class SoftwareInfo {
  constructor (data, status) {
    this.id = data.ID
    this.name = data.NAME
    this.icon = data.ICON
    this.version = data.VERSION
    this.newDesc = data.DESCRIPTION
    this.fileSize = data.FILE_SIZE
    this.blacklist = data.BLACKLIST
    this.remove = data.REMOVE
    this.required = data.REQUIRED
    this.shortName = data.SHORT_NAME
    this.blacklistDesc = data.BLACKLIST_DESCRIPTION
    this.status = Object.keys(appStatus).indexOf(status) >= 0 ? status : appStatus.SERVER
    this.software = data
  }

  toApplicationClassData () {
    let names = {}
    if (this.name) {
      names['default'] = this.name
    }
    return {
      id: this.id,
      names: names,
      iconSrc: this.icon || '',
      status: this.status,
      newDesc: this.newDesc,
      version: this.version,
      installTime: this.installTime,
      fileSize: this.fileSize,
      software: this.software,
      required: this.required || false,
      remove: this.remove || false,
      blacklist: this.blacklist || false,
      blacklistDesc: this.blacklistDesc || ''
    }
  }
}

export default SoftwareInfo
