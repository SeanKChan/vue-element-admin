<template>
  <draggable
    v-model="rows"
    tag="div"
    class="row wrap fill-height align-center sortable-list"
    style="background: grey;"
  >
    <el-row v-for="(row) in rows" :key="row.index" :gutter="40" class="panel-group">
      <draggable
        :list="row.items"
        tag="div"
        draggable=".card-panel-col"
        :group="{ name: 'row' }"
        class="row wrap justify-space-around"
        :on-end="onEnd"
      >
        <el-col v-for="(item, idx) in row.items" :key="idx" :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <CardPanel :message="item.message" />
        </el-col>
      </draggable>
    </el-row>
  </draggable>
</template>
<script>
import draggable from 'vuedraggable'
import CardPanel from './components/CardPanel'

export default {
  name: 'Draggable',
  components: {
    draggable,
    CardPanel
  },
  data() {
    return {
      rows: [
        {
          index: 1,
          items: [
            {
              message: 'msg1'
            },
            {
              message: 'msg4'
            },
            {
              message: 'msg5'
            }
          ]
        },
        {
          index: 2,
          items: [
            {
              message: 'msg2'
            },
            {
              message: 'msg3'
            }
          ]
        }
      ]
    }
  },
  methods: {
    onEnd(evt) {
      console.log(evt.to, evt.from)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }
}
</style>
