<template>
  <el-dropdown v-if="docs.length">
    <i class="el-icon-info" />
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="(item, key) in docs" :key="key">
        <a :href="item.docLink" download>{{ item.docName }}</a>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
export default {
  name: 'HelperGuid',
  props: {
    docs: {
      type: Array,
      default: () => [],
      required: false
    }
  }
}
</script>
