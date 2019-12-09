import {appStatus} from '../defines'

class WidgetInfo {
  constructor (data) {
    this.id = data.id || '' // http://www.obigo.com/ssangyong/C300/launcher
    this.localURI = data.localURI || '' // https://dykappcenter.obigo.com/lge/file/Native_Required_Update/icon/
    this.nameList = data.nameList || `{"widgetName": []}` // `{ "widgetName": [ { "name": "U+ 서비스 메인", "lang": "en-us" } ] }`,
    this.name = data.name || ''
    this.version = data.version || '' // 1.4.4
    this.description = data.description || ''
    this.installTime = data.installTime || 0 // 1528078301
    this.iconSrcPath = data.iconSrcPath || '' // icon_1527813962792.png

    // ETC
    this.activationDate = data.activationDate || 0 // 0
    this.activationStatus = data.activationStatus || true // true
    this.authorEmail = data.authorEmail || '' // ''
    this.authorHref = data.authorHref || '' // ''
    this.authorName = data.authorName || '' // Obigo
    this.autostart = data.autostart || false // false
    this.category = data.category || '' // ''
    this.expirationDate = data.expirationDate || 0 // 0
    this.expired = data.expired || false // false
    this.featureList = data.featureList || '' // { "feature": [ { "name": "http://www.obigo.com/api/applicationmanager", "required": true }] },
    this.group = data.group || '' // launcher
    this.iconHeight = data.iconHeight || 0 // 110
    this.iconWidth = data.iconWidth || 0 // 110
    this.license = data.license || '' // Obigo Licence
    this.licenseHref = data.licenseHref || '' // ''
    this.reserved = data.reserved || true // true,
    this.running = data.running || false
    this.service = data.service || false
    this.shortNameList = data.shortNameList || `{"widgetShortName": []}` // `{ "widgetShortName": [ { "name": "launcher", "lang": "en-us" } ] }`,
    this.subscriptionStatus = data.subscriptionStatus || 0 // 0
    this.widgetHeight = data.widgetHeight || 0 // 650
    this.widgetWidth = data.widgetWidth || 0 // 1280
    this.widget = data
  }

  toApplicationClassData () {
    const iconSrc = this.localURI && this.iconSrcPath ? this.localURI + this.iconSrcPath : ''

    let names = {}
    if (this.nameList) {
      const nameList = JSON.parse(this.nameList)
      const widgetNames = nameList.widgetName || []
      widgetNames.forEach(v => {
        names[v.lang] = v.name
      })
    }
    if (this.name) {
      names['default'] = this.name
    }
    return {
      id: this.id,
      names: names,
      iconSrc: iconSrc,
      status: appStatus.LOCAL,
      desc: this.description,
      version: this.version,
      installTime: this.installTime,
      fileSize: 0,
      widget: this.widget
    }
  }
}

export default WidgetInfo
