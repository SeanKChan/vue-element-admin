<template>
  <article-detail :is-edit="false" />
</template>

<script>
import ArticleDetail from './components/ArticleDetail'

export default {
  name: 'CreateForm',
  components: { ArticleDetail },
  created() {
    window.addEventListener('beforeunload', ev => {
      ev.preventDefault()
      ev.returnValue = 'O(∩_∩)O哈哈~'
    })
  },
  destroyed() {
    window.removeEventListener('beforeunload', ev => {
      ev.preventDefault()
      ev.returnValue = 'O(∩_∩)O哈哈~'
    })
  }
}
</script>

