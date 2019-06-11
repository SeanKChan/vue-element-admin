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
    }
  },
  watch: {
    waterMark: {
      immediate: true,
      handler(val) {
        if (val) {
          const imgBase64 = WaterMark(this.userName)
          this.style = {
            background: `url(${imgBase64})`
          }
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
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
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
