import store from '@/store'

function notifyDownloadProgress (id, percent) {
  const index = store.state.appListIndexs[id]
  const application = store.state.appList[index]
  if (!application) { return console.log(`notifyDownloadProgress Err: Not find application (id: ${id})`) }
  if (percent % 10 === 0) {
    store.commit('setPercent', {id: id, percent: percent})
  }
}

export default {
  notifyDownloadProgress
}
