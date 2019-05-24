<template>
  <div class="components-container">
    <aside>
      SQL-Editor is base on
      <a
        href="https://github.com/codemirror/CodeMirror"
        target="_blank"
      >CodeMirrorr</a>. Lint
      base on
      <a
        href="https://github.com/codemirror/CodeMirror/blob/master/addon/lint/json-lint.js"
        target="_blank"
      >json-lint</a>.
    </aside>
    <div class="editor-container">
      <sql-editor ref="sqlEditor" />
    </div>
  </div>
</template>
<script>
import SqlEditor from '@/components/SqlEditor'
export default {
  name: 'SqlEditorDemo',
  components: {
    SqlEditor
  },
  data() {
    return {
      editStatement: '',
      fullScreenEdit: false,
      formatSql: false,
      editDsName: '',
      editEngine: 0,
      systemVars: [],
      themeKey: ''
    }
  }
}
</script>
<style scoped>
.editor-container {
  position: relative;
  height: 100%;
}
</style>
