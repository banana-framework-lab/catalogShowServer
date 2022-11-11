<template>
  <div>
    <div>
      <n-icon size="155" color="#63e2b7">
        <MusicVideoOutlined />
      </n-icon>
    </div>
    <div style="width: 100%">
      <Player loop>
        <DefaultUi />
        <Audio>
          <source :data-src="props.url" />
        </Audio>
      </Player>
    </div>
  </div>
  >
</template>
<script lang="ts">
export default { name: 'AudioShow' }
</script>
<script setup lang="ts">
import { Player, Audio, DefaultUi } from '@vime/vue-next' // https://vimejs.com/
import { defineProps } from 'vue'
import { MusicVideoOutlined } from '@vicons/material'

const props = defineProps({
  url: {
    type: String,
    default: '',
  },
})
</script>
