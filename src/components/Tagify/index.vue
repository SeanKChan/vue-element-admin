<template>
  <textarea name="mix" rows="3" cols="40" />
</template>
<script>
import Tagify from '@yaireo/tagify/dist/tagify.min.js'

export default {
  name: 'Tagify',
  model: {
    prop: 'output',
    event: 'change'
  },
  props: {
    input: String,
    whiteList: {
      type: Array,
      required: true
    },
    output: String
  },
  data() {
    return {
      content: '',
      instance: null
    }
  },
  mounted() {
    this.instanceInit()
  },
  methods: {
    instanceInit() {
      // 1. 生成实例
      this.instance = new Tagify(document.querySelector('[name=mix]'), {
        mode: 'mix',
        placeholder: '使用@键入变量',
        enforceWhitelist: true,
        pattern: /@/,
        tagTextProp: 'value',
        whitelist: this.transformWhiteList(this.whiteList),
        dropdown: {
          enabled: 1,
          position: 'text',
          mapValueTo: 'value',
          highlightFirst: true
        }
      })
      // 2. 加载输入模板
      this.instance.loadOriginalValues(this.input)
      // 3. 绑定事件
      this.instance.on('input', e => {
        /**
         * prefix 前缀
         * value 前缀后的值
         * textContent 输出值
         */
        const { prefix, value, textContent } = e.detail
        if (prefix === '@') {
          this.instance.dropdown.show.call(this.instance, value)
        }
        this.$emit('change', textContent)
      })
    },
    transformWhiteList(arr) {
      return arr.map(o => {
        if (_.isString(o)) {
          return {
            value: o
          }
        }
        return o
      })
    },
    getOriginalInputValue() {
      let tmp = this.instance.DOM.originalInput.value
      tmp = tmp.replace(/(\[\[.*?\]\])/g, (match) => {
        return match.replace(/(\{.*?\})/g, (m) => {
          try {
            const json = JSON.parse(m)
            return _.get(json, 'value')
          } catch (e) {
            console.warn('模板参数有误: ', m)
          }
          return m
        })
      })
      tmp = tmp.replace(/\s*/, '')
      return tmp
    }
  }
}
</script>

<style lang="scss">
@import "~@yaireo/tagify/src/tagify.scss";
</style>
