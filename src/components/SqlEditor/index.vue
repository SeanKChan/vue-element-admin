<template>
  <div class="sql-editor">
    <codemirror ref="codeEditor" v-model="code" :options="editorOptions" />
  </div>
</template>
<script>
import { codemirror, CodeMirror } from 'vue-codemirror'
import sqlFormatter from './sqlFormatter'

// active-line.js
import 'codemirror/addon/selection/active-line.js'
// styleSelectedText
import 'codemirror/addon/selection/mark-selection.js'
import 'codemirror/addon/search/searchcursor.js'
// hint
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/show-hint.css'
// highlightSelectionMatches
import 'codemirror/addon/scroll/annotatescrollbar.js'
import 'codemirror/addon/search/matchesonscrollbar.js'
import 'codemirror/addon/search/match-highlighter.js'
// keyMap
import 'codemirror/mode/clike/clike.js'
import 'codemirror/keymap/sublime.js'
// foldGutter
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/brace-fold.js'
import 'codemirror/addon/fold/comment-fold.js'
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/indent-fold.js'
import 'codemirror/addon/fold/markdown-fold.js'
import 'codemirror/addon/fold/xml-fold.js'
// theme css
import 'codemirror/theme/xq-dark.css'
import 'codemirror/theme/xq-light.css'
// fullScreen
import 'codemirror/addon/display/fullscreen.css'
import 'codemirror/addon/display/fullscreen.js'

import { FUNCTIONS, KEYWORDS } from './editor-box'
// import api from '../../api/interface'
// 匹配 （from || join）关键字
const TABLE_SUGGESET_POS_REG = /(^|\s+)(from|join)\s+(\S*)$/i

// 匹配表名 别名
const TABLES_PATTENS = [
  /\sjoin\s+([\w._`]+)\s*(?:as)?\s*([\w_`]+)?/gi,
  /\sfrom\s+([\w._`]+)\s*(?:as)?\s*([\w_`]+)?/gi
]

export default {
  components: {
    codemirror
  },
  props: {
    sqlText: String,
    themeKey: {
      type: String,
      default: 'xq-light'
    },
    fullScreenEdit: Boolean,
    dsName: String,
    systemVars: Array,
    engine: Number,
    remoteSqlFormatFunc: {
      type: Function,
      default: null
    },
    remoteGetTableList: {
      type: Function,
      default: null
    },
    remoteGetColNames: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      editorOptions: {
        // codemirror options
        tabSize: 4,
        mode: 'text/x-mysql',
        theme: 'xq-light',
        fullScreen: false,
        lineNumbers: true,
        lineWrapping: true,
        // line: true,
        // 代码折叠
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],

        // 高级配置（需要引入对应的插件包）,codemirror advanced options(You need to manually introduce the corresponding codemirror function script code)
        // sublime、emacs、vim三种键位模式，支持你的不同操作习惯
        keyMap: 'sublime',
        // 按键映射，比如Ctrl键映射autocomplete，autocomplete是hint代码提示事件
        extraKeys: {
          F10: cm => {
            this.fullScreenFun()
          },
          Esc: cm => {
            this.fullScreenFun(false)
          },
          F9: () => {
            this.formatSqlFun()
          },
          'Ctrl-space': 'autocomplete'
        },
        showHitObj: null, // 延迟显示联想列表
        currentWord: '', // 关键字记录
        updateTimer: null,
        sqlSuggestList: [],
        // 联想功能
        // hint: （cm) => {
        //   return this.Hint();
        // }
        // hint.js options
        hintOptions: {
          // 当匹配只有一项的时候是否自动补全
          completeSingle: false
        },
        // 联想表名
        sqlSuggestTableNameLists: [],
        // 联想表
        sqlSuggestTableLists: [],
        // 联想列名
        sqlSuggestColumns: [],
        runCur: null
        // 选中文本自动高亮，及高亮方式
        // styleSelectedText: true,
        // highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
        // more codemirror options...
        // 如果有hint方面的配置，也应该出现在这里
      }
    }
  },
  computed: {
    editor() {
      return this.$refs.codeEditor.editor
    },
    code: {
      get() {
        return this.sqlText
      },
      set(value) {
        this.$emit('update:sqlText', value)
      }
    }
  },
  watch: {
    fullScreenEdit(val) {
      this.fullScreenFun(val)
    },
    themeKey: 'changeTheme',
    hintList: 'showHintList'
  },
  mounted() {
    if (this.$refs.codeEditor) {
      // 绑定键盘事件
      this.$refs.codeEditor.editor.on('keyup', this.handleEditorKeyUp)
    }
  },
  methods: {
    hintSort(arr, key) {
      for (let i = 0; i < arr.length; i++) {
        for (let j = i; j < arr.length; j++) {
          const a = arr[i].toLowerCase()
          const b = arr[j].toLowerCase()
          if (a.indexOf(key) > b.indexOf(key)) {
            const temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
          }
        }
      }
    },
    // 全屏事件
    fullScreenFun(type) {
      if (typeof type === 'boolean') {
        if (this.editorOptions.fullScreen === type) {
          return
        }
        this.editorOptions.fullScreen = type
      } else {
        this.editorOptions.fullScreen = !this.editorOptions.fullScreen
      }
      this.$emit('update:fullScreenEdit', this.editorOptions.fullScreen)
      // 全屏时做窗口按键监听，以取消全屏
      if (this.editorOptions.fullScreen) {
        window.addEventListener('keyup', this.keyupEvent, false)
      } else {
        window.removeEventListener('keyup', this.keyupEvent)
      }
    },
    // 格式化
    async formatSqlFun() {
      if (this.code.length > 50000) {
        this.$message({
          type: 'warning',
          message: 'sql格式化不支持大于50000个字符'
        })
        return
      }
      try {
        if (_.isFunction(this.remoteSqlFormatFunc)) {
          // 远程格式化
          this.code = await this.remoteSqlFormatFunc(this.code)
          return
        }
        // 使用本地格式化
        this.code = sqlFormatter.format(this.code, {
          language: 'n1ql', // Defaults to "sql"
          indent: '    ' // Defaults to two spaces
        })
      } catch (ex) {
        console.error('[sql-editor error]', ex)
      }

      // TODO: 调用接口格式化
      // const params = {
      //   engine: this.engine,
      //   sql: this.code
      // }
      // api.formatSql(params).then(result => {
      //   if (result) {
      //     this.code = result
      //   }
      // })
    },
    // 更换主题
    changeTheme() {
      this.editorOptions.theme = this.themeKey
    },
    // 窗口监听事件
    keyupEvent(event) {
      const key = event.key
      if (key === 'Escape') {
        this.editorOptions.fullScreen = false
        this.$emit('update:fullScreenEdit', false)
        window.removeEventListener('keyup', this.keyupEvent)
      }
    },
    sqlChange() {
      if (this.showHitObj) {
        clearTimeout(this.showHitObj)
      }
      // this.showHitObj = setTimeout(() => {
      if (this.$refs.codeEditor && this.$refs.codeEditor.editor) {
        CodeMirror.showHint(this.$refs.codeEditor.editor, this.autoComplete)
      }
      // }, 300);
    },
    // 键盘事件监听
    handleEditorKeyUp(editor, e) {
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        const value = editor.getValue().trim() // 输入的所有sql
        const cur = editor.getCursor()
        const token = this.getToken(editor, cur)
        const word = token.string.toLowerCase().trim() // 关键字

        if (
          e.key === 'Enter' ||
          e.key === 'Tab' ||
          e.key === 'Escape' ||
          word === ''
        ) {
          this.currentWord = ''
          return true
        }
        if (
          this.currentWord === word &&
          (e.key === 'ArrowUp' || e.key === 'ArrowDown')
        ) {
          return true
        }
        this.currentWord = word
        // 复位
        this.sqlSuggestList = []
        this.sqlSuggestColumns = []
        this.runCur = cur
        this.getSuggestFromServer(editor, value, word)
      }, 100)
    },
    // 获取远程接口数据
    async getSuggestFromServer(editor, value, word) {
      const cur = editor.getCursor()
      // 记录当前查询关键词
      if (word.trim() === '') {
        return
      }
      const tablesAlias = this.getTablesAndAlias(value)
      const leftValue = editor.getRange({ line: 0, ch: 0 }, cur)
      if (TABLE_SUGGESET_POS_REG.test(leftValue) && this.dsName) {
        // from join 后请求表名
        await this.getTableNames({ dsName: this.dsName, q: word })
      } else if (tablesAlias.length && this.dsName) {
        // 是否有表 表是否有别名
        this.fetchColumns(tablesAlias, word)
      } else {
        this.showSuggestMenu('local') // 本地联想
      }
    },
    // 获取columns
    fetchColumns(tablesAlias, word) {
      let tables = []
      let table
      const body = {}
      let leftWord
      const idx = word.indexOf('.')
      if (idx !== -1) {
        leftWord = word.substr(0, idx)

        tablesAlias.forEach((item, i) => {
          if (item.alias === leftWord) {
            table = item.name
          }
        })

        if (table) {
          body.tables = [table]
          this.getCols({ body, leftWord: leftWord + '.' })
        }
      } else {
        tablesAlias.forEach((item, i) => {
          if (item.name !== '') {
            tables.push(item.name)
          }
        })

        tables = [...new Set(tables)]
        body.tables = tables

        if (tables.length) {
          this.getCols({ body })
        }
      }
    },
    // 调用联想方法
    showSuggestMenu(hasLocal) {
      let autoFn
      if (this.runCur) {
        const cur = this.editor.getCursor()
        if (!_.isEqual(this.runCur, cur)) {
          return
        }
      }

      if (hasLocal) {
        autoFn = this.autoComplete
      } else {
        autoFn = this.autocompleteTables
      }
      if (this.$refs.codeEditor && this.$refs.codeEditor.editor) {
        CodeMirror.showHint(this.$refs.codeEditor.editor, autoFn)
      }
    },
    // 本地关键字联想
    autoComplete(editor) {
      const COMBINED_KEYWORDS = KEYWORDS.concat(FUNCTIONS)
      const cur = editor.getCursor()
      const token = this.getToken(editor, cur)
      const word = token.string.toLowerCase()
      let list = []
      // const sql = editor.getValue()

      // 关键字,函数
      if (word.indexOf('.') < 0) {
        const a = this.getSuggestListByLocal(COMBINED_KEYWORDS, word)
        list = list.concat(a)
      }
      // 联想列名
      const sqlSuggestColumns = this.getSuggestListByRequest(
        this.sqlSuggestColumns,
        word
      )
      list = list.concat(sqlSuggestColumns)
      // 变量
      if (word.indexOf('.') < 0) {
        if (this.systemVars && this.systemVars.length) {
          const arr = this.getSuggestListByLocal(this.systemVars, word)
          list = list.concat(arr)
        }
      }
      this.hintSort(list, word)
      // if (list.length < 10) { // 加入已经输入的单词联想关键字
      //     let words = sql.split(/[^\w_\u4e00-\u9fa5]/);
      //     let nwords = [];
      //     for (let i = 0; i < words.length; i++) {
      //         if ((!words[i]) || (word === words[i])) {
      //             continue;
      //         }
      //         nwords.push(words[i]);
      //     }
      //     list = list.concat(this.getSuggestListByLocal(nwords, word));
      // }
      list = [...new Set(list)]

      return {
        list: list,
        from: CodeMirror.Pos(cur.line, token.start),
        to: CodeMirror.Pos(cur.line, token.end)
      }
    },
    // 联想表名
    autocompleteTables(editor) {
      const cur = editor.getCursor()
      const token = this.getToken(editor, cur)
      const word = token.string.toLowerCase()
      let list = []

      list = this.getSuggestListByRequest(this.sqlSuggestTableNameLists, word)
      this.hintSort(list, word)
      return {
        list: list,
        from: CodeMirror.Pos(cur.line, token.start),
        to: CodeMirror.Pos(cur.line, token.end)
      }
    },
    // 获取光标的位置
    getToken(e, cur) {
      const t = e.getTokenAt(cur)

      if (
        t.string &&
        (t.string.indexOf('.') >= 0 || t.string.indexOf('$') >= 0)
      ) {
        if (cur.ch > 0) {
          const before = e.getTokenAt({
            line: cur.line,
            ch: t.start
          })
          t.string = (before.string + t.string).trim()
          t.start = before.start
        }
      }
      return t
    },
    // 别名是否合法
    isLegalAlias(alias) {
      const keywords = {
        where: 1,
        on: 1,
        using: 1,
        join: 1,
        group: 1,
        order: 1,
        limit: 1
      }
      return !keywords[alias.toLowerCase()]
    },
    // 拿到sql 输入的所有表和对应的别名
    getTablesAndAlias(sql) {
      const COMBINED_KEYWORDS = KEYWORDS.concat(FUNCTIONS)
      const names = []
      for (let i = 0; i < TABLES_PATTENS.length; i++) {
        const reg = TABLES_PATTENS[i]
        for (;;) {
          const found = reg.exec(sql)
          if (!found) {
            break
          }

          reg.lastIndex = found.index + 1
          const t = found[1]

          let alias = ''
          if (found[2]) {
            alias = found[2].toLowerCase()
            if (!this.isLegalAlias(alias)) {
              alias = ''
            }
          }
          if (COMBINED_KEYWORDS.indexOf(t.toUpperCase()) !== -1) {
            continue
          }

          names.push({
            name: t,
            alias: alias
          })
        }
      }
      return names
    },
    // 通过关键字 匹配获取suggest列表
    getSuggestListByLocal(list, word) {
      if (word.trim() === '') {
        return []
      }

      const map = {}
      const listArr = []
      for (let i = 0, localL = list.length; i < localL; i++) {
        const a = list[i].toLowerCase()
        if (a.indexOf(word.trim()) !== -1) {
          // if (isSelf && (word === a)) {
          //     continue;
          // }
          if (!map[list[i]]) {
            listArr.push(list[i])
            map[list[i]] = true
          }
        }
      }

      return listArr
    },
    // 联想表名|列名处理
    getSuggestListByRequest(list, word) {
      // const listArr = []
      // const map = {}
      // for (let i = 0, len = list.length; i < len; i++) {
      //   const item = list[i].toLowerCase()
      //   if (item.indexOf(word.trim()) !== -1) {
      //     // if (word === item) {
      //     //     continue;
      //     // }
      //     if (!map[list[i]]) {
      //       listArr.push(list[i])
      //       map[list[i]] = true
      //     }
      //   }
      // }
      const tmpArr = list.filter(o => o.includes(word))
      return [...new Set(tmpArr)]
    },
    // 获取表名列表
    async getTableNames(params) {
      params = { ...params, sn: 100 }
      // TODO: 调用接口获取表名
      // api.getTableNames(params).then(result => {
      //   if (result) {
      //     this.sqlSuggestTableLists = result
      //     this.sqlSuggestTableNameLists = this.sqlSuggestTableLists.map((item) => {
      //       return item.tableName
      //     })
      //     this.showSuggestMenu()
      //   }
      // })
      /* {
        tableName: String,
        tableId: Number
      }*/
      if (_.isFunction(this.remoteGetTableList)) {
        return
      }
      this.sqlSuggestTableLists = await this.remoteGetTableList(params)
      this.sqlSuggestTableNameLists = this.sqlSuggestTableLists.map(
        o => o.tableName
      )
      this.showSuggestMenu()
    },
    getTableIdByName(name) {
      let id
      this.sqlSuggestTableLists &&
        this.sqlSuggestTableLists.forEach(table => {
          if (table.tableName === name) {
            id = table.tableId
          }
        })
      return id
    },
    // 获取列名列表
    async getCols({ body, leftWord = '' }) {
      const params = { body, sn: 100 }
      params.body.tables = params.body.tables.map(table => {
        return this.getTableIdByName(table)
      })
      // TODO: 调用接口获取列名
      // api.getCols(params).then(result => {
      //   const attrArray = Object.keys(result)
      //   let list = []
      //   if (attrArray.length > 0) {
      //     for (const [k, v] of Object.entries(result)) {
      //       list = list.concat(v)
      //     }
      //     list = list.map(item => {
      //       return leftWord + item
      //     })
      //     this.sqlSuggestColumns = list
      //     this.showSuggestMenu(true)
      //   } else {
      //     this.showSuggestMenu('local')
      //   }
      // })
      // [String]
      if (_.isFunction(this.remoteGetColNames)) {
        const response = await this.remoteGetColNames(params)
        if (response.length) {
          this.sqlSuggestColumns = response.map(o => leftWord + o)
          this.showSuggestMenu(true)
        } else {
          this.showSuggestMenu('local')
        }
      }
    },
    Hint() {},
    // 获取选中内容
    getSelectedContent() {
      return this.editor ? this.editor.getSelection() : ''
    }
  }
}
</script>
<style lang="scss" scoped>
.sql-editor {
  height: 100%;
  box-sizing: border-box;
  border: 1px solid #dde2e8;
  border-radius: 1px;
  margin-right: 20px;

  ::v-deep .CodeMirror {
    font-family: Monaco, Consolas, "Andale Mono", "Ubuntu Mono", monospace;
    height: 100%;

    &.CodeMirror-fullscreen {
      z-index: 2000;
    }
  }

  .cm-s-xq-dark.CodeMirror {
    background: #28324b;
    box-shadow: 0 2px 5px 0 rgba(25, 36, 46, 0.11);
    border-radius: 1px;
  }

  .CodeMirror-wrap pre {
    padding: 0 14px;
  }

  .cm-s-xq-dark .CodeMirror-gutters {
    background: #252f47;
    border-right: none;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.4);
  }

  .cm-s-xq-dark .CodeMirror-linenumber {
    color: #929db8;
  }

  .CodeMirror-lines {
    padding: 12px 0;
  }
}

ul.CodeMirror-hints {
  z-index: 2000;
  box-shadow: 0 0 4px 0 rgba(52, 88, 124, 0.26);
  border-radius: 1px;
  border: none;
  padding: 0;

  .CodeMirror-hint {
    height: 34px;
    line-height: 34px;
    font-size: 12px;
    color: #666;
    padding: 0 10px;

    &:hover {
      color: #333;
    }
  }

  li.CodeMirror-hint-active {
    background-color: #f3f4f6;
    color: #666;
  }
}
</style>
