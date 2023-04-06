<template>
  <n-config-provider :theme="darkTheme" :locale="zhCN" :date-locale="dateZhCN">
    <n-message-provider>
      <Message />
      <n-watermark
        content="TopV"
        cross
        fullscreen
        :font-size="16"
        :line-height="10"
        :width="184"
        :height="184"
        :x-offset="12"
        :y-offset="60"
        :rotate="-15"
      />
      <router-view />
    </n-message-provider>
  </n-config-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'App',
})
</script>
<script setup lang="ts">
import Message from '@/components/Message.vue'
import { darkTheme, zhCN, dateZhCN } from 'naive-ui'
</script>
