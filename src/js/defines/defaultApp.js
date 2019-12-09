const defaultApp = {
  ids: [
    'http://www.obigo.com/posco/C300/store',
    'http://www.obigo.com/posco/C300/launcher',
    'http://www.obigo.com/posco/C300/calendar',
    'http://www.obigo.com/posco/C300/news',
    'http://www.obigo.com/posco/C300/deezer',
    'http://www.obigo.com/posco/C300/telematicssimulation',
    'http://www.obigo.com/posco/C300/foreca'
  ],
  names: ['store', 'launcher', 'calendar', 'news', 'deezer', 'telematicssimulation', 'foreca'],
  isDefault: function (id) {
    if (!id) return false
    if (this.ids.indexOf(id) >= 0) {
      return true
    }
    for (let i = 0, l = this.names.length; i < l; i++) {
      const name = this.names[i]
      if (id.indexOf(name) >= 0) {
        return true
      }
    }
    return false
  }
}

export default defaultApp
