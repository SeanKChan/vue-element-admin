<template>
  <textarea name="mix" rows="3" cols="40"/>
</template>
<script>
import Tagify from '@yaireo/tagify/dist/tagify.min.js'

export default {
  name: 'Tagify',
  model: {
    prop: 'input',
    event: 'tagify:input'
  },
  props: {
    input: String,
    whiteList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      // tagify输出的值，包括tagData.value + text
      output: '',
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
        const { prefix, value } = e.detail
        if (prefix === '@') {
          if (value.length > 0) {
            this.instance.dropdown.show.call(this.instance, value)
          }
        }
        this.$emit('tagify:input', this.getOriginalInputValue())
        this.output = this.getOutput()
      })
        .on('change', e => {
          // FIXME input事件无法监听标签变化，导致无法同步到value
          this.$emit('tagify:input', this.getOriginalInputValue())
          this.output = this.getOutput()
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
    getOutput() {
      return this.instance.DOM.input.innerText.replace(/\s/g, '')
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
      tmp = tmp.replace(/\s/g, '')
      return tmp
    }
  }
}
</script>

<style lang="scss">
@import "~@yaireo/tagify/src/tagify.scss";
</style>
