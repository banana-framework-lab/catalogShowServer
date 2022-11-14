<template>
  <div style="width: 100%">
    <div style="display: flex; justify-content: center; align-items: center">
      <n-icon size="155" color="#63e2b7">
        <Music />
      </n-icon>
    </div>
    <div style="width: 100%">
      <Player loop style="--vm-controls-z-index: 0; --vm-player-theme: #63e2b7">
        <DefaultUi />
        <Audio>
          <source :data-src="props.url" />
        </Audio>
      </Player>
    </div>
  </div>
</template>
<script lang="ts">
export default { name: 'AudioShow' }
</script>
<script setup lang="ts">
import { Player, Audio, DefaultUi } from '@vime/vue-next' // https://vimejs.com/
import { defineProps } from 'vue'
import { Music } from '@vicons/carbon'

const props = defineProps({
  url: {
    type: String,
    default: '',
  },
})
</script>
