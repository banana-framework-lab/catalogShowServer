<template>
  <Player
    :debug="true"
    :is-controls-active="true"
    style="width: 100%; --vm-player-theme: #63e2b7"
  >
    <Ui>
      <Spinner />
      <Controls>
        <ControlGroup>
          <ControlSpacer />
          <TimeProgress separator="/" />
        </ControlGroup>
        <ControlGroup>
          <ScrubberControl />
        </ControlGroup>
        <ControlGroup space="bottom">
          <PlaybackControl />
          <VolumeControl />
          <ControlSpacer />
          <PipControl />
          <FullscreenControl />
        </ControlGroup>
      </Controls>
      <ClickToPlay />
      <DblClickFullscreen />
      <Poster fit="contain" />
      <DefaultSettings />
    </Ui>
    <Video :poster="props.cover">
      <source :data-src="props.url" />
    </Video>
  </Player>
</template>
<script lang="ts">
export default { name: 'VideoShow' }
</script>
<script setup lang="ts">
import {
  Player,
  Video,
  Ui,
  ClickToPlay,
  DblClickFullscreen,
  Poster,
  DefaultSettings,
  Controls,
  ControlGroup,
  ScrubberControl,
  PlaybackControl,
  VolumeControl,
  ControlSpacer,
  FullscreenControl,
  PipControl,
  TimeProgress,
  Spinner,
} from '@vime/vue-next' // https://vimejs.com/
import { defineProps } from 'vue'

const props = defineProps({
  url: {
    type: String,
    default: '',
  },
  cover: {
    type: String,
    default: '',
  },
})
</script>
