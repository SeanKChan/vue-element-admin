<template>
  <div class="components-container">
    <div class="tag-group">
      <el-tag v-for="tag in whiteList" :key="tag" effect="plain" :color="getRandomColor()">{{ tag }}</el-tag>
    </div>
    <div>
      <el-switch
        v-model="isReadOnly"
        active-text="只读"
        inactive-text="可编辑"
      />
    </div>
    <TagifyInput
      ref="tagify"
      v-model="content"
      :white-list="whiteList"
      :read-only="isReadOnly"
      @change="onChange"
    />
    <pre>组件模板值: {{ content }}</pre>
    <pre>组件输出值: {{ output }}</pre>
  </div>
</template>
<script>
import TagifyInput from '@/components/TagifyInput'

export default {
  name: 'TagifyDemo',
  components: {
    TagifyInput
  },
  data() {
    return {
      content: '[[行内客户号]] 你好',
      whiteList: ['行内客户号', '客户姓名', '交易对手名称', '上游交易数据'],
      output: '',
      isReadOnly: false
    }
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
      // if (tagData.value.toLowerCase() === '行内客户号') {
      //   tagData.value = '行内客户号✲*'
      // }
    },
    onChange(output) {
      this.output = output
    }
  }
}

</script>
<style lang="scss">

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
