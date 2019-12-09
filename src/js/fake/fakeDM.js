// import temp from './temp'

const DM = {
  requestCertification: function (message) {
    const res = '{"DESTINATION":"UPDATER","MSG":{"TOKEN":"BQGCgcbXtmx4HF3YUCZj4bmdVcdDGdobg+6+/0DE4EOWmDNuABUB5OvNFJb0OrGw"},"MSG_TYPE":"RESPONSE_TOKEN","SOURCE":"APDS","SUBTIME":"1528696562896","TIME":"1528696563509"}'
    this.cbs['CertificationReceived'](res)
  },
  requestInstalledApplicationList: function (message) {
    const res = '{"DESTINATION":"APPLICATION","MSG":{"SOFTWARELIST":[{"DESCRIPTION":"Home for various applications. You can enjoy and explore the variety of apps in your car!","ICON":"/home/oad/OAD/OAF/AFAsset/apps/contents/private/launcher/icon.png","ID":"http://www.obigo.com/ssangyong/C300/launcher","LOCATION":["/home/oad/OAD/OAF/AFAsset/apps/contents/private/launcher"],"NAME":"U+ 서비스 메인","NEW":"OPTION","SHORT_NAME":"launcher","VERSION":"1.4.3"},{"DESCRIPTION":"홈IoT 서비스를 제공합니다.","ICON":"/home/oad/OAD/OAF/AFAsset/apps/contents/private/http___www_obigo_com_ssangyong_c300_homeiot_1529458712/icon.png","ID":"http://www.obigo.com/ssangyong/C300/homeiot","LOCATION":["/home/oad/OAD/OAF/AFAsset/apps/contents/private/http___www_obigo_com_ssangyong_c300_homeiot_1529458712"],"NAME":"홈IoT","NEW":"OPTION","SHORT_NAME":"홈IoT","VERSION":"1.4.5"},{"DESCRIPTION":"국내 최다 음원 보유, FLAC 고음질, 지니차트, 최신음악, 앨범, 뮤직비디오, 오늘의 선곡, TV속음악, 시대별음악, 지니라이프 등 제공.","ICON":"/home/oad/OAD/OAF/AFAsset/apps/contents/private/http___www_obigo_com_ssangyong_c300_genie_music_1529608008/icon.png","ID":"http://www.obigo.com/ssangyong/C300/genie-music","LOCATION":["/home/oad/OAD/OAF/AFAsset/apps/contents/private/http___www_obigo_com_ssangyong_c300_genie_music_1529608008"],"NAME":"지니뮤직 플레이어","NEW":"OPTION","SHORT_NAME":"지니뮤직","VERSION":"1.4.10"},{"DESCRIPTION":"팟빵은 오디오 콘텐츠 플랫폼 팟빵에서 출시한 공식 앱입니다. 내가 원하는 오디오 방송을 검색하여 구독할 수 있으며, 신규 에피소드에 대한 알림을 받을 수 있습니다. ","ICON":"/home/oad/OAD/OAF/AFAsset/apps/contents/private/http___www_obigo_com_ssangyong_c300_podcast_1529759810/icon.png","ID":"http://www.obigo.com/ssangyong/C300/podcast","LOCATION":["/home/oad/OAD/OAF/AFAsset/apps/contents/private/http___www_obigo_com_ssangyong_c300_podcast_1529759810"],"NAME":"팟캐스트 플레이어","NEW":"OPTION","SHORT_NAME":"팟빵","VERSION":"1.4.10"},{"DESCRIPTION":"현재 위치의 날씨와 시간별 날씨, 주간 날씨 정보를 제공합니다.","ICON":"/home/oad/OAD/OAF/AFAsset/apps/contents/private/http___www_obigo_com_ssangyong_c300_weather_1529893729/icon.png","ID":"http://www.obigo.com/ssangyong/C300/weather","LOCATION":["/home/oad/OAD/OAF/AFAsset/apps/contents/private/http___www_obigo_com_ssangyong_c300_weather_1529893729"],"NAME":"날씨 모음","NEW":"OPTION","SHORT_NAME":"날씨","VERSION":"1.4.8"},{"DESCRIPTION":"사용자의 SMS 메시지 수신 목록을 제공 합니다.","ICON":"/home/oad/OAD/OAF/AFAsset/apps/contents/private/http___www_obigo_com_ssangyong_c300_sms_1530099726/icon.png","ID":"http://www.obigo.com/ssangyong/C300/sms","LOCATION":["/home/oad/OAD/OAF/AFAsset/apps/contents/private/http___www_obigo_com_ssangyong_c300_sms_1530099726"],"NAME":"메시지","NEW":"OPTION","SHORT_NAME":"메시지","VERSION":"1.4.7"},{"DESCRIPTION":"앱 스토어는 나의앱과 신규앱 메뉴를 제공합니다. 나의앱은 설치되어 있는 앱 확인 및 업데이트가 가능하며, 신규앱은 설치되어 있지 않은 앱을 다운로드 및 설치가 가능합니다.","ICON":"/home/oad/OAD/OAF/AFAsset/apps/contents/private/http___www_obigo_com_ssangyong_c300_store_1531427150/icon.png","ID":"http://www.obigo.com/ssangyong/C300/store","LOCATION":["/home/oad/OAD/OAF/AFAsset/apps/contents/private/http___www_obigo_com_ssangyong_c300_store_1531427150"],"NAME":"앱 스토어","NEW":"OPTION","SHORT_NAME":"앱 스토어","VERSION":"1.4.5"},{"DESCRIPTION":"Voice Tutorial","ICON":"/home/oad/OAD/OAF/AFAsset/apps/contents/private/http___www_obigo_com_ssangyong_c300_voice_tutorial_1531427502/icon.png","ID":"http://www.obigo.com/ssangyong/C300/voice-tutorial","LOCATION":["/home/oad/OAD/OAF/AFAsset/apps/contents/private/http___www_obigo_com_ssangyong_c300_voice_tutorial_1531427502"],"NAME":"음성 튜토리얼","NEW":"OPTION","SHORT_NAME":"tutorial","VERSION":"1.2.4"}]},"MSG_TYPE":"RESPONSE_AVN_VERSION","SOURCE":"UPDATER","SUBTIME":"1528697159681","TIME":"1528697159"}'
    this.cbs['InstalledApplicationListReceived'](res)
  },
  requestServerApplicationList: function (message) {
    const res = '{"DESTINATION":"UPDATER","MSG":{"SOFTWARELIST":[{"BACKGROUND":false,"BLACKLIST":false,"DESCRIPTION":"Ver 1.4.10","FILE_SIZE":4847929,"ICON":"https://dykappcenter.obigo.com/lge/file/weather/icon/icon_1528449111830.png","ID":"http://www.obigo.com/ssangyong/C300/weather","NAME":"Weather","REMOVE":false,"REQUIRED":false,"SHORT_NAME":"Weather","VERSION":"1.4.10"}]},"MSG_TYPE":"RESPONSE_VERSION","SOURCE":"APDS","SUBTIME":"1528697160248","TIME":"1528772948824"}'
    this.cbs['ServerApplicationListReceived'](res)
  },
  requestApplicationDownload: function (message) {
    this.cbs['ApplicationDownload']
  },
  requestApplicationDownloadCancel: function (message) {
    this.cbs['ApplicationDownloadCanceled']
  },
  requestApplicationIntegrity: function (message) {
    this.cbs['ApplicationIntegrity']
  },
  requestDownloadedApplicationList: function (message) {
    const res = '{"DESTINATION":"APPLICATION","MSG":{"SOFTWARELIST":[]},"MSG_TYPE":"RESPONSE_DOWNLOADED_LIST","SOURCE":"UPDATER","SUBTIME":"1528794399424","TIME":"1528794399"}'
    this.cbs['DownloadedApplicationListReceived'](res)
  },
  addEventListener: function (key, cb) {
    this.cbs[key] = cb
  },
  removeEventListener: function (key) {
    delete this.cbs[key]
  },
  cbs: {}
}

export default DM
