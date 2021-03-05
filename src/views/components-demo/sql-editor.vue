<template>
  <div class="components-container">
    <aside>
      SQL-Editor is base on
      <a
        href="https://github.com/codemirror/CodeMirror"
        target="_blank"
      >CodeMirrorr</a>
    </aside>
    <div class="tips">
      <pre>
        1、支持远端获取表名、字段名
        2、暂支持两种主题，xq-light/xq-dark
        3、格式化代，默认采用sqlFormatJs（支持sql、n1ql、db2、pl/sql四种方言），提供钩子函数，实参为当前输入值
        4、remoteGetTableList、remoteGetColNames钩子函数，根据关键字获取对应表、字段信息
        4、支持自定义关键字、函数
        5、支持快捷键，F10：全屏，F9：代码格式化，TAB：代码自动补全
      </pre>
    </div>
    <div class="editor-container">
      <el-row :gutter="20">
        <el-col :span="6">
          数据源：
          <el-select v-model="editDsName" placeholder="选择数据源" size="small">
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
          <el-select v-model="editEngine" placeholder="选择查询引擎" size="small">
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
            <el-button type="primary" size="mini" @click="handleFormatSql">格式化</el-button>
            <el-button type="primary" size="mini" @click="handlerShowSelection">获取选中内容</el-button>
          </el-button-group>
        </el-col>
      </el-row>
      <el-row>
        <sql-editor
          ref="sqlEditor"
          v-model="sqlText"
          class="sql-editor-demo"
          :full-screen-edit.sync="isFullScreenEdit"
          :ds-name="editDsName"
          :engine="editEngine"
          :system-vars="systemVars"
          :theme-key="themeKey"
          :remote-get-table-list="handlerGetTableList"
          :remote-get-col-names="handlerGetColNames"
        />
      </el-row>
    </div>
  </div>
</template>
<script>
import SqlEditor from '@/components/SqlEditor'

// 数据源列表
const DATA_SOURCE_LIST = ['ELK']
// 搜索引擎列表
const ENGINE_LIST = ['oracle', 'mysql', 'hive', 'presto', 'druid', 'gp']
// 模拟数据
const tableList = [
  {
    tableId: 1,
    tableName: 'tb_user'
  },
  {
    tableId: 2,
    tableName: 'tb_company'
  },
  {
    tableId: 3,
    tableName: 'tb_log'
  }
]
const colNames = ['name', 'id', 'content', 'create_time']

export default {
  name: 'SqlEditorDemo',
  components: {
    SqlEditor
  },
  data() {
    return {
      DATA_SOURCE_LIST,
      ENGINE_LIST,
      isFullScreenEdit: false,
      editDsName: 'ELK',
      editEngine: 0,
      systemVars: [],
      themeKey: 'xq-light',
      sqlText: ''
    }
  },
  methods: {
    handleFormatSql() {
      this.code = this.$refs.sqlEditor.formatSqlFun(this.code)
    },
    // 模拟获取表名
    handlerGetTableList(params) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(tableList)
        }, 500)
      })
    },
    // 模拟获取表名
    handlerGetColNames(params) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(colNames)
        }, 500)
      })
    },
    handlerShowSelection() {
      const selectionStr = this.$refs.sqlEditor.getSelectedContent() || ''
      if (_.isEmpty(selectionStr)) {
        return
      }
      this.$notify({
        title: '选中代码片段',
        dangerouslyUseHTMLString: true,
        message: `<pre style="color: teal">${selectionStr}</pre>`
      })
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
