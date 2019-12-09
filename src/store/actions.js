import popup from 'obigo-js-ui/components/popup'
import i18n from '../i18n'
import {serverProcess, localProcess, app} from '../js/controller'
import {ams, downloadManager, logManager} from '../js/libs'
import {popupType, appStatus, loadingStatus, msgFormat, installStatus, widgetError} from '../js/defines'
import router from '../router'

const actions = {
  initialize ({commit, state, dispatch}) {
    return new Promise((resolve, reject) => {
      commit('setLoadingStatus', loadingStatus.LOADING)
      ams.init()
      downloadManager.init()
      app.init()
        .then((res) => {
          resolve()
        })
        .catch((err) => {
          logManager.error(err)
          reject(err)
        })
        .finally(() => {
          commit('setLoadingStatus', loadingStatus.NONE)
        })
    })
  },
  openApplication ({commit, state, dispatch}, payload) {
    return new Promise((resolve, reject) => {
      ams.startApplication(payload)
    })
  },
  installApplication ({commit, state, dispatch, getters}, payload) {
    return new Promise((resolve, reject) => {
      commit('setInstallStatus', installStatus.PAUSE)
      commit('showProgressPopup', {
        type: popupType.PROGRESS,
        title: 'DOWNLOADING',
        onOpen: () => {
          if (payload && payload.isOpenStop) return
          serverProcess.downloadApplication()
            .then((downloadedPath) => {
              console.log('IntegrityApplication', downloadedPath)
              return serverProcess.IntegrityApplication(downloadedPath)
            })
            .then(() => {
              commit('closeProgressPopup')
              commit('setLoadingStatus', loadingStatus.INSTALLING)

              return localProcess.downloadedToInstall(state.appSelectID)
            })
            .then(() => {
              logManager.info(`Install Compleate : ${state.appSelectID}`)
              commit('setAppStatus', {id: state.appSelectID, status: appStatus.LOCAL})
              commit('setAppBadge', {id: state.appSelectID, badge: true})
              commit('setAppPercent', {id: state.appSelectID, percent: 0})
              if (getters.detailApplication.newDesc) {
                commit('setAppDesc', {id: state.appSelectID, desc: getters.detailApplication.newDesc})
              }
              commit('pushNewInstalledIDList', state.appSelectID)
              commit('setLoadingStatus', loadingStatus.NONE)
              resolve()
            })
            .catch((err) => {
              logManager.error('installApplication Err: ' + err)
              commit('setLoadingStatus', loadingStatus.NONE)
              commit('closeProgressPopup')
              if (err === widgetError.Type.WIDGET_ERROR_STORAGE_AREA_FULL) {
                dispatch('msgAppFullSizeError')
              }
            })
        },
        buttons: [
          {
            label: 'INSTALL',
            onClick: () => {
              if (state.installStatus === installStatus.PAUSE) {
                let msg = msgFormat.REQUEST_DOWNLOAD_CANCEL()
                msg.MSG.ID = state.appSelectID
                downloadManager.requestDownloadCancel(msg)
                commit('setInstallStatus', installStatus.RESUME)
              } else {
                serverProcess.downloadApplication()
                commit('setInstallStatus', installStatus.PAUSE)
              }
            }
          },
          {
            label: 'Cancel',
            onClick: () => {
              let msg = msgFormat.REQUEST_DOWNLOAD_CANCEL()
              msg.MSG.ID = state.appSelectID
              downloadManager.requestDownloadCancel(msg)
              commit('closeProgressPopup')
              resolve(true)
            }
          }
        ]
      })
    })
  },
  uninstallApplication ({commit, state, getters, dispatch}, payload) {
    return new Promise((resolve, reject) => {
      let title, content
      if (payload && payload.type === 'remove') {
        const appName = getters.detailApplication.getName()
        content = `${appName} is not available any more.\nWould you like to delete?`
        title = 'FORCED DELETE'
      } else {
        content = 'Do you really want to delete this app?'
        if (ams.isRunningWidget(state.appSelectID)) {
          content = 'This app is currently running. Do you really want to delete this app?'
        }
        title = 'DELETE'
      }

      commit('showProgressPopup', {
        type: popupType.APPINFO,
        title: title,
        content: content,
        buttons: [
          {
            label: 'OK',
            onClick: () => {
              const id = state.appSelectID
              ams.removeWidget(id)
                .then((widgetInfo) => {
                  commit('closeProgressPopup')
                  commit('setLoadingStatus', loadingStatus.DELETING)
                  commit('removeAppList', widgetInfo.id)
                  dispatch('backward')
                  logManager.warn('Uninstall Application from Backward')
                  commit('setLoadingStatus', loadingStatus.LOADING)
                  return serverProcess.getNewData()
                })
                .then((list) => {
                  list.forEach(v => app.pushApplicationData(v))
                  resolve(true)
                })
                .catch(err => {
                  logManager.error(err)
                })
                .finally(() => {
                  commit('setLoadingStatus', loadingStatus.NONE)
                })
            }
          },
          {
            label: 'Cancel',
            onClick: () => {
               // cancelDownload를 수행한다.
              commit('closeProgressPopup')
              resolve(true)
            }
          }
        ]
      })
    })
  },
  disUninstallApplication ({commit, state}) {
    return new Promise((resolve, reject) => {
      commit('showProgressPopup', {
        type: popupType.APPINFO,
        title: 'NONDELETABLE',
        content: 'This is the default application so you can not delete it.',
        buttons: [
          {
            label: i18n.t('button_ok'),
            onClick: () => {
               // cancelDownload를 수행한다.
              commit('closeProgressPopup')
              resolve(true)
            }
          }
        ]
      })
    })
  },
  msgNetworkError ({commit, state}) {
    return new Promise((resolve, reject) => {
      const pop = popup.show({
        title: 'NO NETWORK',
        content: 'Network Unavailable \n Would you like to retry?',
        buttons: [
          {
            label: i18n.t('button_retry'),
            onClick: () => {
              pop.close()
              resolve(true)
            }
          },
          {
            label: i18n.t('button_cancel'),
            onClick: () => {
              pop.close()
              resolve(false)
            }
          }
        ]
      })
    })
  },
  msgNetworkLimitTryError ({commit, state}) {
    return new Promise((resolve, reject) => {
      const pop = popup.show({
        title: 'RETRY FAILED',
        content: 'You have exceeded 3 attempts.\nPlease restart the application.',
        buttons: [
          {
            label: i18n.t('button_ok'),
            onClick: () => {
              pop.close()
              resolve()
            }
          }
        ]
      })
    })
  },
  msgAppFullSizeError ({commit, state}) {
    return new Promise((resolve, reject) => {
      commit('showProgressPopup', {
        type: popupType.APPINFO,
        title: 'INSTALL FAILED',
        content: 'Not enough storage. Please make enough space and try again.',
        buttons: [
          {
            label: 'OK',
            onClick: () => {
              commit('closeProgressPopup')
              resolve(true)
            }
          }
        ]
      })
    })
  },
  msgAppInstallNetworkError ({commit, state}, payload) {
    return new Promise((resolve, reject) => {
      commit('showProgressPopup', {
        type: popupType.APPINFO,
        title: 'FAIL TO LOAD',
        content: 'Network Unavailable Would you like to retry?',
        buttons: [
          {
            label: 'Retry',
            onClick: () => {
              commit('closeProgressPopup')
              resolve(true)
            }
          },
          {
            label: i18n.t('button_cancel'),
            onClick: () => {
              commit('closeProgressPopup')
              resolve(false)
            }
          }
        ]
      })
    })
  },
  msgInstallNetworkLimitTryError ({commit, state}, payload) {
    return new Promise((resolve, reject) => {
      commit('showProgressPopup', {
        type: popupType.APPINFO,
        title: 'RETRY FAILED',
        content: 'You have exceeded 3 attempts. Please try later.',
        buttons: [
          {
            label: 'OK',
            onClick: () => {
              commit('closeProgressPopup')
              resolve()
            }
          }
        ]
      })
    })
  },
  msgBlacklist ({commit, state, getters}, payload) {
    return new Promise((resolve, reject) => {
      const appName = getters.detailApplication.getName()
      const blacklistDesc = getters.detailApplication.blacklistDesc
      const content = `${appName} is under maintenance (untill ${blacklistDesc || 'DD-MM-YY'}). Please try later.`
      commit('showProgressPopup', {
        type: popupType.APPINFO,
        title: 'BLACKLIST',
        content: content,
        buttons: [
          {
            label: 'OK',
            onClick: () => {
              commit('closeProgressPopup')
              resolve()
            }
          }
        ]
      })
    })
  },
  msgInstallEtcError ({commit, state}, payload) {
    return new Promise((resolve, reject) => {
      commit('showProgressPopup', {
        type: popupType.APPINFO,
        title: 'INSTALL FAILED',
        content: 'There was an error while installing the application. Please try again later.',
        buttons: [
          {
            label: 'OK',
            onClick: () => {
              commit('closeProgressPopup')
              resolve()
            }
          }
        ]
      })
    })
  },
  backward ({commit, state, getters}) {
    if (['/', '/new'].indexOf(router.currentRoute.path) >= 0) {
      if (window.applicationFramework) {
        window.applicationFramework.applicationManager.getOwnerApplication(window.document).back()
        window.applicationFramework.applicationManager.getOwnerApplication(window.document).destroyApplication()
      }
    } else {
      router.go(-1)
      if (router.currentRoute.path === '/') {
        commit('clearNewInstalledIDList')
        commit('setPageShow', 'apps')
      } else if (router.currentRoute.path === '/new') {
        if (getters.newAppsApplication.length > 0) {
          commit('setPageShow', 'apps')
        } else {
          commit('setPageShow', 'noapp')
        }
      } else if (router.currentRoute.path === '/detail') {
        commit('setPageShow', 'detail')
      }
    }
  }
}

export default actions
