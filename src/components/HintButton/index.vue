<template>
      <a href="##" :title="title" style="margin-right:10px">
          <el-button v-bind="$attrs" v-on="$listeners"/>
      </a>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'HintButton',
  props:['title']
}
</script>

<style scoped lang='less'>

</style>