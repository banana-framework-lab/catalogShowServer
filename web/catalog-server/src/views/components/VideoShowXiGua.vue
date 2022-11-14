<template>
  <div :id-="'video' + index"></div>
</template>
<script lang="ts">
export default { name: 'VideoShow' }
</script>
<script setup lang="ts">
import { defineProps } from 'vue'
import Player from 'xgplayer'

const props = defineProps({
  index: {
    type: Number,
    default: 0,
  },
  url: {
    type: String,
    default: '',
  },
  cover: {
    type: String,
    default: '',
  },
})
new Player({
  id: 'video' + props.index,
  url: '//abc.com/**/*.mp4',
})
</script>
