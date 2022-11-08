<template>
  <div></div>
</template>

<script lang="ts">
export default { name: 'Message' }
</script>
<script setup lang="ts">
import { useMessage } from 'naive-ui'
window.$message = useMessage()
</script>
