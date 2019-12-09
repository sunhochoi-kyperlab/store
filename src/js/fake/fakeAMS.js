import tempData from './temp'
const fakeAMS = {
  getOwnerApplication () {
    console.log('[AMS-fake] getOwnerApplication()')
    return {
      getDescriptor: function () {
        return tempData.widgets[0]
      },
      startWidget: function (widget) {
        console.log(`[AMS-fake] start widget! ${widget.id}`)
      }
    }
  },
  checkLatestApplications () {
    console.log('[AMS-fake] checkLatestApplications()')
  },
  installWidget (uri) {
    console.log('[AMS-fake] installWidget()')
  },
  widgets: {
    length: tempData.widgets.length,
    item: (i) => {
      return tempData.widgets[i]
    }
  },
  getApplicationUpdateInfo () {
    console.log('[AMS-fake] getApplicationUpdateInfo()')
    return { BLACKLIST: [], BLACKLIST_UNREG: [], REQUIRED: [], REQUIRED_UNREG: [], REMOVE: [], REMOVE_UNREG: [], NEW_APPS: [], UPDATE_APPS: [], UPDATE_COUNT: 0 }
  },
  systemService (cmd, target) {
    console.log('[AMS-fake] systemService()', cmd, target)
  },
  addEventListener: function (key, cb) {
    this.cbs[key] = cb
  },
  removeEventListener: function (key) {
    delete this.cbs[key]
  },
  cbs:{}
}

export default fakeAMS
