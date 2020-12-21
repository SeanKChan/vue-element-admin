<template>
  <el-dropdown>
    <span>{{ currentRoleLabel }}</span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="(role, key) in roles" :key="key" :command="role">
        {{ role.roleName }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>

export default {
  name: 'RoleGuid',
  computed: {
    roles: {
      get() {
        return this.$store.state.user.roles
      },
      set(val) {
        this.$store.commit('user/roles', val)
      }
    },
    currentRole() {
      return _.find(this.roles, ['checked', true])
    },
    currentRoleLabel() {
      const roleName = _.get(this.currentRole, 'roleName')
      const orgName = _.get(this.currentRole, 'orgName')
      return `${ roleName } / ${ orgName }`
    }
  },
  async mounted() {
    await this.$store.dispatch('user/getRoles')
  }

}
</script>
<style lang="scss" scoped>

</style>
