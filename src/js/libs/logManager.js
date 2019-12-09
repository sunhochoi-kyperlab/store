const logManager = {
  disable: false,
  info: function (logMessage) {
    if (this.disable === true) return
    const stack = new Error().stack
    const oriStack = stack.split('\n')[2].trim().split(' ')
    const tempArr = oriStack[oriStack.length - 1].split('/')
    const file = tempArr[tempArr.length - 1].replace(')', '')
    console.log('%c[Store][' + file + '] ' + '%c' + logMessage, 'background: #fff; color: blue', 'color: black')
  },
  warn: function (logMessage) {
    if (this.disable === true) return
    const stack = new Error().stack
    const oriStack = stack.split('\n')[2].trim().split(' ')
    const tempArr = oriStack[oriStack.length - 1].split('/')
    const file = tempArr[tempArr.length - 1].replace(')', '')
    console.warn('%c[Store][' + file + '] ' + '%c' + logMessage, 'background: #222; color: #bada55', 'color: black')
  },
  error: function (logMessage) {
    if (this.disable === true) return
    const stack = new Error().stack
    const oriStack = stack.split('\n')[2].trim().split(' ')
    const tempArr = oriStack[oriStack.length - 1].split('/')
    const file = tempArr[tempArr.length - 1].replace(')', '')
    console.error('%c[Store][' + file + '] ' + '%c' + logMessage, 'background: #fff; color: red', 'color: black')
  },
  deactivate: function (isDisable) {
    if (isDisable === true) {
      this.disable = true
    }
  }
}

export default logManager
