<template>
  <textarea name="tagify" rows="3" cols="40" />
</template>
<script>
import Tagify from '@yaireo/tagify/dist/tagify.min.js'

export default {
  name: 'Tagify',
  props: {},
  data() {
    return {
      input: null,
      instance: null
    }
  },
  mounted() {
    this.input = document.querySelector('[name=tagify]')
  },
  methods: {
    instanceInit() {
      this.instance = new Tagify(this.input, {

      })
    }
  }
}
</script>

<style lang="scss">
@import "~@yaireo/tagify/src/tagify.scss";
</style>
