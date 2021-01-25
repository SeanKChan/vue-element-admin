<template>
  <div class="app-container">
    <div ref="funnel" class="funnel-container" />
  </div>
</template>
<script>
import { Funnel } from '@antv/g2plot'
import { insertCss } from 'insert-css'

export default {
  name: 'FunnelDemo',
  data() {
    return {
      data: [
        { stage: '触达次数', times: 789, uv: 1000, conversionUV: 0 },
        { stage: '响应次数', times: 453, uv: 800, conversionUV: 600 },
        { stage: '分享次数', times: 193, uv: 600, conversionUV: 200 }
      ],
      funnelPlot: null
    }
  },
  mounted() {
    this.insertInternalCss()
    this.initPlot()
  },
  methods: {
    initPlot() {
      this.funnelPlot = new Funnel(this.$refs['funnel'], {
        data: this.data,
        xField: 'stage',
        yField: 'times',
        legend: false,
        conversionTag: false,
        interactions: [
          {
            type: 'element-active'
          }
        ],
        tooltip: {
          follow: true,
          enterable: true,
          offset: 5,
          customContent: (value, items) => {
            if (!items || items.length <= 0) return
            const { data: itemData } = items[0]

            return (
              `<div class='container'>` +
        `<div class='box' style='border-right: 1px solid #c2c2c2'>` +
        `<div class='title'>转化</div>` +
        `<div class='tooltip-item'><span>转化人数</span><span>${itemData.conversionUV}</span></div>` +
        `<div class='tooltip-item'><span>转化率</span><span>${((itemData.conversionUV / itemData.uv) * 100).toFixed(
          0
        )}%</span></div>` +
        `<a class='link'>查看转化详情</a>` +
        `</div>` +
        `<div class='box'>` +
        `<div class='title'>未转化</div>` +
        `<div class='tooltip-item'><span>未转化人数</span><span>${itemData.uv - itemData.conversionUV}</span></div>` +
        `<div class='tooltip-item'><span>未转化率</span><span>${(
          (1 - itemData.conversionUV / itemData.uv) *
          100
        ).toFixed(0)}%</span></div>` +
        `<a class='link'>查看未转化详情</a>` +
        `</div>` +
        `</div>`
            )
          }
        }
      })
      this.funnelPlot.render()
    },
    insertInternalCss() {
      // 我们用 insert-css 演示引入自定义样式
      // 推荐将样式添加到自己的样式文件中
      // 若拷贝官方代码，别忘了 npm install insert-css
      insertCss(`
  .container{
    margin: 16px -8px; display: flex;
  }
  .box{
    padding: 0px 16px;
  }
  .title{
    font-weight: bold;
  }
  .tooltip-item{
    margin-top: 12px;
    display: flex;
    width: 120px;
    justify-content: space-between;
  }
  .link{
    display: inline-block;
    margin-top: 12px;
    color: #5B8FF9;
    text-decoration: none;
    cursor: pointer;
  }
  .link:hover{

    color: #5D7092;
  }
`)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
