/* 代码示例
browser.chrome();        // 49
browser.firefox();       // undefined
browser.ie();            // undefined
browser.safari();        // undefined
browser.isGecko();       // false
browser.isStandard();    // true
browser.isWebkit();      // true
browser.os();            // windows 10_64bit
browser.kernel();        // chrome_49
*/

const ua = navigator.userAgent

export default {
  chrome: function() {
    return /\b(?:Chrome|CriOS)\/(\d+)/i.test(ua) ? +RegExp.$1 : undefined
  },
  firefox: function() {
    return /\bFirefox\/(\d+)/i.test(ua) ? +RegExp.$1 : undefined
  },
  ie: function() {
    return /\b(?:MSIE |rv:|Edge\/)(\d+)/i.test(ua) && !this.firefox() ? (document.documentMode || +RegExp.$1) : undefined // Firefox 某些版本的 ua 中含有和 IE 11 一样的 'rv:' 字段。
  },
  edge: function() {
    return /\bEdge\/(\d+)/i.test(ua) ? (document.documentMode || +RegExp.$1) : undefined
  },
  safari: function() {
    return /\bSafari\/?(\d+)?/i.test(ua) && !/chrome/i.test(ua) ? +(RegExp.$1 || RegExp.$2) : undefined
  },
  isStandard: function() {
    return document.compatMode === 'CSS1Compat'
  },
  isGecko: function() {
    return /gecko/i.test(ua) && !/like gecko/i.test(ua)
  },
  isWebkit: function() {
    return /webkit/i.test(ua)
  },
  os: function() {
    let os = 'other'

    if (/\bMac/i.test(ua)) {
      if (/iPhone/i.test(ua)) {
        os = 'iphone os_' + (/iPhone OS (\d+(?:_\d+)?)/i.test(ua) ? RegExp.$1.replace('_', '.') : 'unknown')
      } else if (/iPad/i.test(ua)) {
        os = 'ipad os_' + (/iPad.*OS (\d+(?:_\d+)?)/i.test(ua) ? RegExp.$1.replace('_', '.') : 'unknown')
      } else {
        os = 'mac os_' + (/Mac OS X (\d+(?:_\d+)?)/i.test(ua) ? RegExp.$1.replace('_', '.') : 'unknown')
      }
    } else if (/Android/i.test(ua)) {
      os = 'android os_' + (/Android (\d+(?:\.\d+)?)/i.test(ua) ? RegExp.$1 : 'unknown')
    } else if (/\bWindows/i.test(ua)) {
      os = 'windows os_' + (/Windows NT (\d+)/i.test(ua) ? RegExp.$1 : 'unknown') + '_' + (/win64|x64|wow64/i.test(ua) ? '64' : '32') + 'bit'
    }

    return os
  },
  kernel: function() {
    let browser = 'other'

    if (this.edge()) {
      browser = 'edge_' + this.edge()
    } else if (this.ie()) {
      browser = 'ie_' + this.ie()
    } else if (this.chrome()) {
      browser = 'chrome_' + this.chrome()
    } else if (this.safari()) {
      browser = 'safari_' + this.safari()
    } else if (this.firefox()) {
      browser = 'firefox_' + this.firefox()
    }

    return browser
  }
}
