<template>
  <el-submenu :index="nav.path" :popper-append-to-body="false">
    <template slot="title">
      <span slot="title">{{ nav.title }}</span>
    </template>
    <el-menu-item v-for="(child, childIndex) in nav.children" :key="childIndex" :route="{path: child.path}" :index="child.path">
      <!-- <router-link v-if="!child.children" :key="child.key" :route="{path: child.path}" :to="child.path">{{ child.title }}</router-link>
      <nav-sub v-else :key="child.key" :nav="child" /> -->
      {{child.title}}
    </el-menu-item>
  </el-submenu>
</template>

<script>
export default {
  name: 'NavSub',
  props: {
    nav: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
