<template>
  <div
    class="app-container documentation-container"
    :style="{
      height: containerH
    }"
  />
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Documentation',
  computed: {
    ...mapState({
      needTagsView: state => state.settings.tagsView,
      needFixedHeader: state => state.settings.fixedHeader
    }),
    containerH() {
      let tmpH = 0
      this.needTagsView && ~(tmpH += 34)
      this.needFixedHeader && ~(tmpH += 50)
      return `calc(100vh - ${tmpH}px)`
    }
  }
}
</script>

<style lang="scss" scoped>
.documentation-container{
  width: 100%;
  height: 100%;
  background-image: url("~@/assets/images/welcome.jpeg");
  background-repeat: no-repeat;
  background-size: 100% auto;
}
</style>
