<template>
  <div style="width: calc(16 * (100vh - 8rem) / 9); height: calc(100vh - 8rem)">
    <div :id="'video' + props.index"></div>
  </div>
</template>
<script lang="ts">
export default { name: 'VideoShow' }
</script>
<script setup lang="ts">
import { defineProps, onMounted, ref, nextTick } from 'vue'
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

const player = ref<Player>()

onMounted(() => {
  nextTick(() => {
    player.value = new Player({
      id: 'video' + props.index,
      url: props.url,
      autoplay: false,
      volume: 0.6,
      playsinline: false,
      fluid: true,
      loop: true,
      videoInit: true,
      playbackRate: [0.5, 0.75, 1, 1.5, 2],
      download: true,
      'x5-video-player-type': 'h5',
      'x5-video-player-fullscreen': true,
    })
  })
})

function destory() {
  player.value?.destroy(true)
}
</script>
