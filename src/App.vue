<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    console.log(_.flatMap([1, 2, [3, 4]]))
  }
}
</script>
