<template>
  <div class="components-container">
    <aside>
      SQL-Editor is base on
      <a
        href="https://github.com/codemirror/CodeMirror"
        target="_blank"
      >CodeMirrorr</a>
      <p>1、F10全屏，ESC退出全屏</p>
      <p>2、F9格式化代码</p>
      <p>3、支持配置远程格式化代码，调用接口模糊匹配表名、字段名</p>
    </aside>
    <div class="editor-container">
      <el-button-group class="sql-editor__buttons">
        <el-button type="primary" size="mini" @click="isFullScreenEdit=true">全屏</el-button>
        <el-button type="primary" size="mini" @click="isFormatSql=true">格式化</el-button>
      </el-button-group>
      <sql-editor
        ref="sqlEditor"
        :sql-text.sync="editStatement"
        :full-screen-edit.sync="isFullScreenEdit"
        :format-sql="isFormatSql"
        :ds-name="editDsName"
        :engine="editEngine"
        :system-vars="systemVars"
        :theme-key="themeKey"
      />
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
      isFullScreenEdit: false,
      isFormatSql: false,
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
  height: 540px;
}

.sql-editor__buttons {
  margin-bottom: 20px;
}
</style>
