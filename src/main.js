import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

import * as qs from 'qs'

import browser from '@/utils/browser'

import { isInIcestark } from '@ice/stark-app'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  locale: enLang // 如果使用中文，无需设置，请删除
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function(callback) {
  setTimeout(callback, 1000 / 60)
}

window._ = _

window.browser = browser

window.qs = qs

Vue.config.productionTip = false

let vue

export function mount(props) {
  const { container } = props
  vue = new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
  }).$mount()
  // for vue don't replace mountNode
  container.innerHTML = ''
  container.appendChild(vue.$el)
}

export function unmount() {
  vue && vue.$destroy()
}

if (!isInIcestark()) {
  new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
  })
}

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
