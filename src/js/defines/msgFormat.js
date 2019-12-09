const msgFormat = {
  REQUEST_TOKEN: () => {
    return {
      SOURCE: 'UPDATER',
      DESTINATION: 'DM_CLIENT',
      MSG_TYPE: 'REQUEST_TOKEN',
      TIME: Date.now(),
      SUBTIME: '',
      MSG: {}
    }
  },
  REQUEST_AVN_VERSION: () => {
    return {
      SOURCE: 'UPDATER',
      DESTINATION: 'DM_CLIENT',
      MSG_TYPE: 'REQUEST_AVN_VERSION',
      TIME: Date.now(),
      SUBTIME: '',
      MSG: {}
    }
  },
  REQUEST_VERSION: () => {
    return {
      SOURCE: 'APPLICATION',
      DESTINATION: 'UPDATER',
      MSG_TYPE: 'REQUEST_VERSION',
      TIME: Date.now(),
      SUBTIME: '',
      MSG: {
        SOFTWARELIST: [] // {ID: '', VERSION: ''}
      }
    }
  },
  REQUEST_DOWNLOAD: () => {
    return {
      SOURCE: 'UPDATER',
      DESTINATION: 'DM_CLIENT',
      MSG_TYPE: 'REQUEST_DOWNLOAD',
      TIME: Date.now(),
      SUBTIME: '',
      MSG: {
        SOFTWARELIST: [] // {ID: '', VERSION: ''}
      }
    }
  },
  REQUEST_DOWNLOAD_CANCEL: () => {
    return {
      SOURCE: 'UPDATER',
      DESTINATION: 'DM_CLIENT',
      MSG_TYPE: 'REQUEST_DOWNLOAD_CANCEL',
      TIME: Date.now(),
      SUBTIME: '',
      MSG: {
        ID: '' // Web Application ID
      }
    }
  },
  REQUEST_DOWNLOADED_LIST: () => {
    return {
      SOURCE: 'UPDATER',
      DESTINATION: 'DM_CLIENT',
      MSG_TYPE: 'REQUEST_DOWNLOADED_LIST',
      TIME: Date.now(),
      SUBTIME: '',
      MSG: {}
    }
  },
  REQUEST_INTEGRITY: () => {
    return {
      SOURCE: 'UPDATER',
      DESTINATION: 'DM_CLIENT',
      MSG_TYPE: 'REQUEST_INTEGRITY',
      TIME: Date.now(),
      SUBTIME: '',
      MSG: {
        SOFTWARELIST: [] // {"ID":Web Application ID, "VERSION":Update 될 Software Version, "DOWNLOAD":Web Application이 Download 된 Directory, "LOCATION":[Update 될 Software 가 있는 위치]}
      }
    }
  }
}

export default msgFormat
