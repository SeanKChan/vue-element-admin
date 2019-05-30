<template>
  <div class="components-container">
    <aside>
      SQL-Editor is base on
      <a
        href="https://github.com/codemirror/CodeMirror"
        target="_blank"
      >CodeMirrorr</a>
    </aside>
    <div class="editor-container">
      <el-row :gutter="20">
        <el-col :span="6">
          数据源：
          <el-select
            v-model="editDsName"
            placeholder="选择数据源"
            size="small"
          >
            <el-option
              v-for="(dataSourse, index) in DATA_SOURCE_LIST"
              :key="index"
              :value="dataSourse"
              :label="dataSourse"
            />
          </el-select>
        </el-col>
        <el-col :span="6">
          查询引擎：
          <el-select
            v-model="editEngine"
            placeholder="选择查询引擎"
            size="small"
          >
            <el-option
              v-for="(engine, index) in ENGINE_LIST"
              :key="index"
              :value="index"
              :label="engine"
            />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-radio-group v-model="themeKey">
            <el-radio label="xq-light">经典白色</el-radio>
            <el-radio label="xq-dark">经典黑色</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="6">
          <el-button-group>
            <el-button type="primary" size="mini" @click="isFullScreenEdit=true">全屏</el-button>
            <el-button type="primary" size="mini" @click="isFormatSql=true">格式化</el-button>
          </el-button-group>
        </el-col>
      </el-row>
      <el-row>
        <sql-editor
          ref="sqlEditor"
          class="sql-editor-demo"
          :sql-text.sync="editStatement"
          :full-screen-edit.sync="isFullScreenEdit"
          :format-sql="isFormatSql"
          :ds-name="editDsName"
          :engine="editEngine"
          :system-vars="systemVars"
          :theme-key="themeKey"
        />
      </el-row>
    </div>
  </div>
</template>
<script>
import SqlEditor from '@/components/SqlEditor'

const DATA_SOURCE_LIST = ['数据源1', '数据源2']
const ENGINE_LIST = [
  'oracle',
  'mysql',
  'hive',
  'presto',
  'druid',
  'gp'
]

export default {
  name: 'SqlEditorDemo',
  components: {
    SqlEditor
  },
  data() {
    return {
      DATA_SOURCE_LIST,
      ENGINE_LIST,
      editStatement: '',
      isFullScreenEdit: false,
      isFormatSql: false,
      editDsName: '数据源1',
      editEngine: 0,
      systemVars: [],
      themeKey: 'xq-light'
    }
  }
}
</script>
<style lang="scss" scoped>
.editor-container {
  position: relative;

  .el-row {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .sql-editor-demo {
    height: 540px;
  }
}

</style>
