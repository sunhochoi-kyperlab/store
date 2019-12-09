const appStatus = {
  NEW: 'NEW', // 설치 되지 않은 앱, Install 할 수 있다.
  // NEW_DOWNLOADING: 'NEW_DOWNLOADING', // 다운로드 중
  // NEW_INSTALLED: 'NEW_INSTALLED', // AF 설치 준비 된 앱, 설치 할 수 있다.
  // INSTALLING: 'INSTALLING', // AF에 설치 중

  SERVER: 'SERVER', // 서버에 새로운 버전이 있을 경우 업데이트가 가능한 앱, 업데이트 요청 할 수 있다.
  // SERVER_DOWNLOADING: 'SERVER_DOWNLOADING',

  DOWNLOADED: 'DOWNLOADED', // AF 설치 준비 된 앱, 설치 할 수 있다.
  // UPDATING: 'UPDATING', // AF에 설치 중

  LOCAL: 'LOCAL' // 이미 설치되어 있는 앱, 앱을 오픈 할 수 있다.
}

export default appStatus

// LOCAL
// BLACKLIST
// REMOVE
// REQUIRED
// NEW => NEW_DOWNLOADING => NEW_DOWNLOADED => INSTALLING => LOCAL
// SERVER => SERVER_DOWNLOADING => DOWNLOADED => UPDATING => LOCAL
// DOWNLOADED => UPDATING => LOCAL
