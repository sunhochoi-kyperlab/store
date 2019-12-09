import {logManager} from '../libs'
import {msgType, notifyType, msgFormat, downloadManagerError, loadingStatus, popupType} from '../defines'
import {handler} from '../controller'
import store from '@/store'

var NetworkCount = 3 // eslint-disable-line no-unused-vars
function initNetworkCount () {
  NetworkCount = 3
}

var cacheResolve = {}
const DownloadManager = {
  usingFakeMode: function () { // true  : using fake download manager, false : using download manager
    if (window.applicationFramework) {
      return false
    } else {
      return true
    }
  },
  init: function () {
    try {
      if (this.usingFakeMode()) {
        logManager.info(`===== Load fake download manager(${this.usingFakeMode()})`)
        this.downloadManager = require('../fake/fakeDM').default
      } else {
        logManager.info(`===== Load download manager(${this.usingFakeMode()})`)
        this.downloadManager = window.applicationFramework.downloadManager
      }
      this.registerEvents()
    } catch (err) {
      logManager.error(err)
    }
  },
  requestToken: function () { // 인증 토큰 요청, requestCertification({"SOURCE":"UPDATER","DESTINATION":"DM_CLIENT","MSG_TYPE":"REQUEST_TOKEN","TIME":Date.now(),"SUBTIME":"","MSG":{}})
    return new Promise((resolve, reject) => {
      logManager.info('===== requestToken')
      const msgStr = JSON.stringify(msgFormat.REQUEST_TOKEN())
      logManager.info('requestToken : ' + msgStr)
      initNetworkCount()
      this.getRequest(msgStr, msgType.RESPONSE_TOKEN)
        .then(res => resolve(res))
        .catch(err => reject('requestToken Err: ' + err))
    })
  },
  requestAVNVersion: function (message) { // 설치된 Application list 요청
    return new Promise((resolve, reject) => {
      if (typeof message === 'object') {
        message = JSON.stringify(message)
      }
      initNetworkCount()
      logManager.info('===== Request requestAVNVersion')
      logManager.info('requestAVNVersion : ' + message)
      this.getRequest(message, msgType.RESPONSE_AVN_VERSION)
        .then(res => resolve(res))
        .catch(err => reject('requestAVNVersion Err: ' + err))
    })
  },
  requestVersion: function (message, opt) { // 서버에 Application list 요청 (version)
    return new Promise((resolve, reject) => {
      if (typeof message === 'object') {
        message = JSON.stringify(message)
      }
      initNetworkCount()
      logManager.info('===== Request requestVersion')
      logManager.info('requestVersion : ' + JSON.stringify(message))
      this.getRequest(message, msgType.RESPONSE_VERSION, opt)
        .then(res => resolve(res))
        .catch(err => reject('requestVersion Err: ' + err))
    })
  },
  requestDownload: function (message) { // 서버에 Applicatin Download 요청
    return new Promise((resolve, reject) => {
      if (typeof message === 'object') {
        message = JSON.stringify(message)
      }
      logManager.info('===== Request requestDownload')
      logManager.info('requestDownload : ' + JSON.stringify(message))
      if (cacheResolve[msgType.RESPONSE_DOWNLOAD]) {
        this.downloadManager.requestApplicationDownload(message)
        resolve()
      } else {
        initNetworkCount()
        this.getRequest(message, msgType.RESPONSE_DOWNLOAD)
          .then(res => resolve(res))
          .catch(err => reject('requestDownload Err: ' + err))
      }
    })
  },
  requestDownloadCancel: function (message) { // 다운로드 중인 Application의 다운로드 취소 요청
    return new Promise((resolve, reject) => {
      if (typeof message === 'object') {
        message = JSON.stringify(message)
      }
      logManager.info('===== Request requestDownloadCancel')
      logManager.info('requestDownloadCancel : ' + JSON.stringify(message))
      if (cacheResolve[msgType.RESPONSE_DOWNLOAD]) {
        this.downloadManager.requestApplicationDownloadCancel(message)
        resolve()
      } else {
        initNetworkCount()
        this.getRequest(message, msgType.RESPONSE_DOWNLOAD_CANCEL)
          .then(res => resolve(res))
          .catch(err => reject('requestDownloadCancel Err: ' + err))
      }
    })
  },
  requestIntegrity: function (message) { // before: requestUpdate, Application validation요청
    return new Promise((resolve, reject) => {
      if (typeof message === 'object') {
        message = JSON.stringify(message)
      }

      logManager.info('===== Request requestIntegrity')
      logManager.info('requestIntegrity : ' + JSON.stringify(message))
      initNetworkCount()
      this.getRequest(message, msgType.RESPONSE_INTEGRITY)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject('requestIntegrity Err: ' + err))
    })
  },
  checkDownloadedList: function () { // 다운로드된 Application list 요청
    return new Promise((resolve, reject) => {
      logManager.info('===== Request checkDownloadedList')
      const message = JSON.stringify(msgFormat.REQUEST_DOWNLOADED_LIST())
      logManager.info('checkDownloadedList : ' + JSON.stringify(message))
      initNetworkCount()
      this.getRequest(message, msgType.RESPONSE_DOWNLOADED_LIST)
        .then(res => resolve(res))
        .catch(err => reject('checkDownloadedList Err: ' + err))
    })
  },
  registerEvents: function () { // const handler = (res) => {console.log(JSON.stringify(res))}
    try {
      this.downloadManager.addEventListener('CertificationReceived', this.response, false)
      this.downloadManager.addEventListener('InstalledApplicationListReceived', this.response, false)
      this.downloadManager.addEventListener('ServerApplicationListReceived', this.response, false)
      this.downloadManager.addEventListener('ApplicationDownload', this.response, false)
      this.downloadManager.addEventListener('ApplicationDownloadCanceled', this.response, false)
      this.downloadManager.addEventListener('DownloadedApplicationListReceived', this.response, false)
      this.downloadManager.addEventListener('ApplicationIntegrity', this.response, false)
      this.downloadManager.addEventListener('NotifyError', this.response, false)
    } catch (e) {
      logManager.error(e)
    }
  },
  removeEvents: function () {
    try {
      this.downloadManager.removeEventListener('CertificationReceived', this.response)
      this.downloadManager.removeEventListener('InstalledApplicationListReceived', this.response)
      this.downloadManager.removeEventListener('ServerApplicationListReceived', this.response)
      this.downloadManager.removeEventListener('ApplicationDownload', this.response)
      this.downloadManager.removeEventListener('ApplicationDownloadCanceled', this.response)
      this.downloadManager.removeEventListener('DownloadedApplicationListReceived', this.response)
      this.downloadManager.removeEventListener('ApplicationIntegrity', this.response)
      this.downloadManager.removeEventListener('NotifyError', this.response)
    } catch (e) {
      logManager.error(e)
    }
  },
  getRequest (msg, type, opt) {
    return this.sendRequest(msg, type)
      .then((res) => {
        return res
      })
      .catch(err => {
        if (opt && opt.ignoreError) {
          return Promise.reject(err)
        }
        if (err === 'Network Error') {
          store.commit('setLoadingStatus', loadingStatus.NONE)
          if (NetworkCount > 0) {
            let dispatchType = 'msgNetworkError'
            if (type === msgType.RESPONSE_DOWNLOAD) {
              dispatchType = 'msgAppInstallNetworkError'
            }
            return store.dispatch(dispatchType)
              .then(isRetry => {
                store.commit('setLoadingStatus', loadingStatus.LOADING)
                if (isRetry) {
                  NetworkCount--
                  return delay(1000)
                    .then(() => {
                      return this.getRequest(msg, type)
                    })
                } else {
                  store.commit('setLoadingStatus', loadingStatus.NONE)
                  throw new Error('cancel Network Connection')
                }
              })
          } else {
            let dispatchType = 'msgNetworkLimitTryError'
            if (type === msgType.RESPONSE_DOWNLOAD) {
              dispatchType = 'msgInstallNetworkLimitTryError'
            }
            return store.dispatch(dispatchType)
              .then(() => {
                throw new Error('cancel Network Connection')
              })
          }
        } else {
          if ([msgType.RESPONSE_DOWNLOAD, msgType.RESPONSE_INTEGRITY].indexOf(type) >= 0) {
            const errorNumber = Number.isNaN(Number(err)) ? '' : err
            return store.dispatch('msgInstallEtcError', {code: errorNumber})
          }
          throw err
        }
      })
  },
  sendRequest (msgStr, type) {
    return new Promise((resolve, reject) => {
      let timeout = 90 * 1000
      if (type === msgType.RESPONSE_TOKEN) {
        this.downloadManager.requestCertification(msgStr)
      } else if (type === msgType.RESPONSE_VERSION) {
        this.downloadManager.requestServerApplicationList(msgStr)
      } else if (type === msgType.RESPONSE_AVN_VERSION) {
        this.downloadManager.requestInstalledApplicationList(msgStr)
      } else if (type === msgType.RESPONSE_DOWNLOAD) {
        timeout = 10 * 60 * 1000
        this.downloadManager.requestApplicationDownload(msgStr)
      } else if (type === msgType.RESPONSE_DOWNLOAD_CANCEL) {
        this.downloadManager.requestApplicationDownloadCancel(msgStr)
      } else if (type === msgType.RESPONSE_INTEGRITY) {
        this.downloadManager.requestApplicationIntegrity(msgStr)
      } else if (type === msgType.RESPONSE_DOWNLOADED_LIST) {
        this.downloadManager.requestDownloadedApplicationList(msgStr)
      }
      registerResolve(type, resolve, reject, timeout)
    })
  },
  response: function (message) {
    logManager.info('===== Response: ' + message)
    if (typeof message !== 'string') return logManager.error(new Error('DownloadManager Error: not string message'))
    var resData = JSON.parse(message)
    var errorCode = Number(resData.ERROR || resData.MSG.ERROR || resData.MSG.ERROR_TYPE || (resData.MSG && resData.MSG.SOFTWARELIST && resData.MSG.SOFTWARELIST.find(v => v.ERROR) ? resData.MSG.SOFTWARELIST.find(v => v.ERROR).ERROR : 0) || 0)
    console.log('errorCode', errorCode)
    if (errorCode) {
      let networkErrorList = []
      networkErrorList.push(downloadManagerError.Type.DOWNLOAD_ERROR_NETWORK_UNREACHABLE)
      networkErrorList.push(downloadManagerError.Type.DOWNLOAD_ERROR_CONNECT_FAIL)
      networkErrorList.push(downloadManagerError.Type.DOWNLOAD_ERROR_CONNECT_NOT)
      networkErrorList.push(downloadManagerError.Type.DOWNLOAD_ERROR_CONNECT_LOSS)
      networkErrorList.push(downloadManagerError.Type.DOWNLOAD_ERROR_REQUEST_TIMEOUT)

      if (networkErrorList.indexOf(Number(errorCode)) >= 0) { // 네트워크 에러
        console.log('Network Error')
        return allResolveError('Network Error')
      } else if (resData.MSG_TYPE === notifyType.NOTIFY_DOWNLOAD_END) {
        return allResolveError(errorCode)
      } else {
        logManager.error('ETC ERROR' + message)
        return allResolveError(errorCode)
      }
    }

    if (resData.MSG_TYPE && Object.keys(msgType).indexOf(resData.MSG_TYPE) >= 0 && cacheResolve[resData.MSG_TYPE]) {
      clearTimeout(cacheResolve[resData.MSG_TYPE].timeout)
      cacheResolve[resData.MSG_TYPE].resolve(resData)
      delete cacheResolve[resData.MSG_TYPE]
    } else if (resData.MSG_TYPE && resData.MSG_TYPE === notifyType.NOTIFY_DOWNLOAD_PROGRESS) {
      if (resData.MSG.ID === store.state.appSelectID && store.state.popupData.type !== popupType.PROGRESS) {
        store.dispatch('installApplication', {isOpenStop: true})
      }
      handler.notifyDownloadProgress(resData.MSG.ID, resData.MSG.PERCENT)
    } else if (resData.MSG_TYPE && resData.MSG_TYPE === notifyType.NOTIFY_DOWNLOAD_END && cacheResolve[msgType.RESPONSE_DOWNLOAD]) {
      clearTimeout(cacheResolve[msgType.RESPONSE_DOWNLOAD].timeout)
      cacheResolve[msgType.RESPONSE_DOWNLOAD].resolve(resData)
      delete cacheResolve[msgType.RESPONSE_DOWNLOAD]
    }
  }
}

function registerResolve (responseType, resolve, reject, timeout) {
  cacheResolve[responseType] = {
    resolve: resolve,
    reject: reject,
    timeout: setTimeout(() => {
      delete cacheResolve[responseType]
      console.log('timeout', responseType)
      reject('timeout')
    }, timeout)
  }
}

function allResolveError (err) {
  console.log(cacheResolve)
  for (let i = 0, l = Object.keys(cacheResolve).length; i < l; i++) {
    const eventType = Object.keys(cacheResolve)[i]
    console.log('cacheResolve', eventType)
    clearTimeout(cacheResolve[eventType].timeout)
    cacheResolve[eventType].reject(err)
    delete cacheResolve[eventType]
  }
}

function delay (t, v) {
  return new Promise((resolve) => {
    setTimeout(resolve.bind(null, v), t)
  })
}

export default DownloadManager
