<template>
  <div>
    <n-layout>
      <n-layout-content content-style="padding: 1rem">
        <div
          style="
            display: flex;
            justify-content: center;
            text-align: center;
            height: calc(100vh - 10rem);
            align-items: center;
          "
        >
          <div style="width: 520px">
            <div style="margin-bottom: 2rem">
              <n-gradient-text
                :gradient="{
                  to: 'rgb(255, 255, 255)',
                  from: 'rgb(99 226 183)',
                }"
                size="1.8rem"
              >
                CatalogShow
              </n-gradient-text>
              <n-gradient-text type="success" size="1.8rem">
                Server
              </n-gradient-text>
            </div>
            <n-form ref="formRef" :model="form" :rules="rules">
              <n-form-item-row path="password" label="密码">
                <n-input
                  v-model:value="form.password"
                  show-password-on="click"
                  clearable
                  round
                  type="password"
                  placeholder="请输入密码"
                  @keydown.enter.prevent
                >
                  <template #prefix>
                    <n-icon :component="Keyboard12324Filled" />
                  </template>
                  <template #password-visible-icon>
                    <n-icon :size="16" :component="GlassesOutline" />
                  </template>
                  <template #password-invisible-icon>
                    <n-icon :size="16" :component="Glasses" />
                  </template>
                </n-input>
              </n-form-item-row>
            </n-form>
            <n-button type="primary" block secondary strong @click="login">
              登录
            </n-button>
          </div>
        </div>
      </n-layout-content>
    </n-layout>
  </div>
</template>

<script lang="ts">
export default { name: 'Show' }
</script>
<script setup lang="ts">
import { GlassesOutline, Glasses } from '@vicons/ionicons5'
import { Keyboard12324Filled } from '@vicons/fluent'
import { ref, computed, watch } from 'vue'
import { Login } from '@/api/login'
import { setToken, isLogin } from '@/util/token'
import { NForm, FormRules, FormItemRule } from 'naive-ui'
import router from '@/router'

const form = ref<{ password: string }>({
  password: '',
})
const formRef = ref<InstanceType<typeof NForm>>()
const rules: FormRules = {
  password: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (!value) {
          return new Error('请输入密码')
        }
        return true
      },
      trigger: ['input', 'blur'],
    },
  ],
}

const isLoginStatus = computed(() => {
  return isLogin()
})

watch(
  isLoginStatus,
  (value) => {
    if (value && value !== '[]') {
      router.push('/')
    }
  },
  { immediate: true }
)

function login(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate((errors) => {
    if (!errors) {
      new Login()
        .setParam({
          password: form.value.password,
        })
        .request()
        .then((res) => {
          setToken(res.data.token)
          router.push('/')
        })
    }
  })
}
</script>
