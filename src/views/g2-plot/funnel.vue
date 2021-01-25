<template>
  <div class="app-container">
    <div ref="funnel" class="funnel-container" />
  </div>
</template>
<script>
import { Funnel } from '@antv/g2plot'

export default {
  name: 'FunnelDemo',
  data() {
    return {
      data: [
        { stage: '下发商机', number: 15534 },
        { stage: '分发商机', number: 7890 },
        { stage: '商机拜访', number: 1000 }
      ],
      funnelPlot: null
    }
  },
  mounted() {
    this.initPlot()
  },
  methods: {
    initPlot() {
      this.funnelPlot = new Funnel(this.$refs['funnel'], {
        data: this.data,
        xField: 'stage',
        yField: 'number',
        dynamicHeight: true,
        legend: false
      })
      this.funnelPlot.render()
    }

  }
}
</script>
<style lang="scss" scoped>

</style>
