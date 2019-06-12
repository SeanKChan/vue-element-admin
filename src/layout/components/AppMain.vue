<template>
  <section class="app-main" :style="style">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
import WaterMark from '@/utils/waterMark'

export default {
  name: 'AppMain',
  data() {
    return {
      style: null
    }
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    },
    waterMark() {
      return this.$store.state.settings.waterMark
    },
    userName() {
      return this.$store.state.user.name
    },
    waterMarkStyle() {
      return this.$store.state.app.waterMarkStyle
    }
  },
  watch: {
    waterMark: {
      immediate: true,
      handler(val) {
        if (val) {
          if (_.isEmpty(this.waterMarkStyle)) {
            const imgBase64 = WaterMark(this.userName)
            const style = {
              background: `url(${imgBase64})`
            }
            this.$store.dispatch('app/setWaterMarkStyle', style)
          }
          this.style = this.waterMarkStyle
        } else {
          this.style = null
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
