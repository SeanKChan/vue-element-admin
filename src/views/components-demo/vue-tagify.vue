<template>
  <div class="components-container">
    <div class="tag-group">
      <el-tag v-for="tag in tags" :key="tag" effect="plain" :color="getRandomColor()">{{ tag }}</el-tag>
    </div>
    <textarea name="mix" />
    <pre>{{ originalInputValue }}</pre>
    <div>
      <el-button size="mini">transform</el-button>
      <pre>{{ transformInputValue }}</pre>
    </div>
  </div>
</template>
<script>
import Tagify from '@yaireo/tagify/dist/tagify.min.js'

const VARIABLE = ['行内客户号', '客户姓名', '交易对手名称', '上游交易数据']

export default {
  name: 'VueTagifyDemo',
  data() {
    return {
      instance: null,
      content: '[[行内客户号]] 你好',
      originalInputValue: '',
      transformInputValue: '',
      tags: VARIABLE
    }
  },
  mounted() {
    const input = document.querySelector('[name=mix]')
    // init Tagify script on the above inputs
    this.instance = new Tagify(input, {
      //  mixTagsInterpolator: ["{{", "}}"],
      mode: 'mix', // <--  Enable mixed-content
      placeholder: '使用@键入变量',
      enforceWhitelist: true,
      pattern: /@/, // <--  Text starting with @ or # (if single, String can be used here)
      tagTextProp: 'value', // <-- the default property (from whitelist item) for the text to be rendered in a tag element.
      // Array for initial interpolation, which allows only these tags to be used
      whitelist: VARIABLE.map(o => {
        return {
          value: o
        }
      }),
      // transformTag: this.transformTag,
      dropdown: {
        enabled: 1,
        position: 'text', // <-- render the suggestions list next to the typed text ("caret")
        mapValueTo: 'value', // <-- similar to above "tagTextProp" setting, but for the dropdown items
        highlightFirst: true // automatically highlights first sugegstion item in the dropdown
      },
      callbacks: {
        // add: console.log, // callback when adding a tag
        // remove: console.log // callback when removing a tag
      }
    })

    this.instance.loadOriginalValues(this.content)
    this.originalInputValue = this.content

    // A good place to pull server suggestion list accoring to the prefix/value
    this.instance.on('input', (e) => {
      const { prefix, value, tagify } = e.detail
      if (prefix === '@') {
        if (value.length >= 1) {
          this.instance.dropdown.show.call(this.instance, value)
        }
      }
      console.log('mix-mode "input" event value: ', e.detail)
      this.originalInputValue = tagify.DOM.originalInput.value
    }
    )
      .on('change', (e) => {
        // console.log('change', e)
      })
      .on('add', function(e) {
        // console.log('add', e)
      })
      .on('dropdown:show', (e) => {
        // console.log('dropdown:show', e)
      })
  },
  methods: {
    getRandomColor() {
      function rand(min, max) {
        return min + Math.random() * (max - min)
      }

      const h = rand(1, 360) | 0
      const s = rand(40, 70) | 0
      const l = rand(65, 72) | 0
      return 'hsl(' + h + ',' + s + '%,' + l + '%)'
    },
    transformTag(tagData) {
      tagData.style = '--tag-bg:' + this.getRandomColor()
      if (tagData.value.toLowerCase() === 'shit') {
        tagData.value = 's✲✲t'
      }
    },
    transfromOriginalValue() {

    }
  }
}

</script>
<style lang="scss">
@import "~@yaireo/tagify/src/tagify.scss";

.tag-group {
  height: 60px;
  width: 100%;
  border: 1px solid gray;
  margin-bottom: 20px;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;

  .el-tag {
    color: #fff;
    margin-left: 15px;
  }
}

</style>
