<template>
  <div>
    <n-config-provider :theme="darkTheme">
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
      <n-space vertical size="large">
        <n-layout>
          <n-layout-header>
            <n-gradient-text
              :gradient="{
                to: 'rgb(255, 255, 255)',
                from: 'rgb(99 226 183)',
              }"
              size="25"
            >
              CatalogShow
            </n-gradient-text>
            <n-gradient-text type="success" size="25"> Server </n-gradient-text>
          </n-layout-header>
          <n-layout-content content-style="padding: 1rem;text-align: center;">
            <n-input-group>
              <n-button type="primary"> 搜索 </n-button>
              <n-input
                v-model:value="search.conditon.name"
                clearable
                default-value=""
                :placeholder="search.conditon.placeholder"
                @change="
                  () => {
                    search.conditon.name
                      ? (search.conditon.placeholder = search.conditon.name)
                      : ''
                  }
                "
                @clear="search.conditon.placeholder = '输入文件名字'"
              />
              <n-button type="primary" ghost @click="searchFunction()">
                模糊搜索
              </n-button>
            </n-input-group>
          </n-layout-content>
          <n-layout-content
            v-if="search.history.length > 0"
            content-style="padding-left: 1rem;padding-right: 1rem;"
          >
            <n-tag
              v-for="(item, index) in search.history"
              :key="index"
              type="success"
              closable
              round
              style="margin-left: 0.2rem; margin-right: 0.2rem"
              @close="
                () => {
                  deleteHistory(index)
                }
              "
            >
              <n-ellipsis
                line-clamp="1"
                :tooltip="false"
                style="max-width: 10rem"
              >
                {{ item }}
              </n-ellipsis>
            </n-tag>
          </n-layout-content>
          <n-layout-content content-style="padding: 1rem;text-align: center;">
            <n-grid :x-gap="12" :y-gap="8" :cols="2">
              <n-grid-item>
                <n-select
                  v-model:value="search.conditon.fileType"
                  clearable
                  filterable
                  :options="fileTypeOption"
                  placeholder="文件类型"
                  @update:value="getListByType"
                />
              </n-grid-item>
              <n-grid-item>
                <n-select
                  v-model:value="search.conditon.catalog"
                  clearable
                  filterable
                  :options="catalogOption"
                  placeholder="文件目录"
                  @update:value="getListByCatalog"
                />
              </n-grid-item>
            </n-grid>
          </n-layout-content>
          <n-layout-content content-style="padding: 1rem;">
            <div v-if="search.list.length > 0">
              <n-card
                v-for="(item, index) in search.list"
                :key="index"
                style="max-width: 40rem; margin-bottom: 0.8rem"
              >
                <template #cover>
                  <div
                    style="
                      background-color: rgba(81, 81, 81, 1);
                      height: 23rem;
                      margin-bottom: 1rem;
                      text-align: center;
                    "
                  >
                    <n-image
                      object-fit="contain"
                      lazy
                      src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                    />
                  </div>
                </template>
                <div>
                  <n-ellipsis
                    expand-trigger="click"
                    line-clamp="2"
                    :tooltip="false"
                  >
                    文件名称：{{ item.name }}
                  </n-ellipsis>
                  <br />
                  <n-ellipsis
                    expand-trigger="click"
                    line-clamp="2"
                    :tooltip="false"
                  >
                    文件目录：{{ item.src }}
                  </n-ellipsis>
                </div>
              </n-card>
              <div style="margin-top: 1rem">
                <n-pagination
                  :page-count="20"
                  show-quick-jumper
                  style="width: 100%"
                  :page-slot="5"
                >
                  <template #goto> 跳转 </template>
                </n-pagination>
              </div>
            </div>
            <div v-if="search.list.length <= 0">
              <n-empty description="没有文件，随机看看别的">
                <template #icon>
                  <n-icon>
                    <ios-airplane />
                  </n-icon>
                </template>
                <template #extra>
                  <n-button size="small" @click="seeOther()">
                    看看别的
                  </n-button>
                </template>
              </n-empty>
            </div>
          </n-layout-content>
        </n-layout>
      </n-space>
    </n-config-provider>
  </div>
</template>

<script lang="ts">
export default { name: 'App' }
</script>
<script setup lang="ts">
import { IosAirplane } from '@vicons/ionicons4'
import {
  GetListByName,
  FileInfo,
  GetListByType,
  GetListByCatalog,
} from '@/api/list'
import {
  GetFiletypeOption,
  FileTypeOption,
  GetCatalogOption,
  CatalogOption,
} from '@/api/option'
import { darkTheme } from 'naive-ui'
import { reactive, ref } from 'vue'
import Cookies from 'js-cookie'

const search = reactive<{
  history: string[]
  list: FileInfo[]
  conditon: {
    name?: string
    placeholder: string
    fileType?: string
    catalog?: string
    page: number
    rows: number
  }
}>({
  history: [],
  list: [],
  conditon: {
    placeholder: '输入文件名字',
    page: 1,
    rows: 10,
  },
})

function searchFunction() {
  if (!search.conditon.name && search.conditon.placeholder !== '输入文件名字') {
    search.conditon.name = search.conditon.placeholder
  }

  if (search.conditon.name) {
    const history = String(Cookies.get('search.history') || '[]')
    search.history = JSON.parse(history)
    if (search.history.indexOf(search.conditon.name) < 0) {
      if (search.history.length >= 4) {
        search.history.shift()
      }
      search.history.push(search.conditon.name)
      Cookies.set('search.history', JSON.stringify(search.history))
    }
  }
  getListByName(search.conditon.name)
}
searchFunction()

function initHistory() {
  const history = String(Cookies.get('search.history') || '[]')
  search.history = JSON.parse(history)
}

initHistory()

function deleteHistory(index: number) {
  search.history.splice(index, 1)
  Cookies.set('search.history', JSON.stringify(search.history))
}

const fileTypeOption = ref<FileTypeOption[]>([])

function getFiletypeOption() {
  new GetFiletypeOption().request().then((res) => {
    fileTypeOption.value = res.data.options
  })
}
getFiletypeOption()

const catalogOption = ref<CatalogOption[]>([])

function getCatalogOption() {
  new GetCatalogOption().request().then((res) => {
    catalogOption.value = res.data.options
  })
}
getCatalogOption()

function getListByName(name = '') {
  new GetListByName()
    .setParam({ name })
    .request()
    .then((res) => {
      search.list = res.data.list
    })
}

function getListByType() {
  console.log(search.conditon.fileType)
  new GetListByType()
    .setParam({ type: search.conditon.fileType })
    .request()
    .then((res) => {
      search.list = res.data.list
    })
}

function getListByCatalog() {
  new GetListByCatalog()
    .setParam({ catalog: search.conditon.catalog })
    .request()
    .then((res) => {
      search.list = res.data.list
    })
}

function seeOther() {
  getListByName('')
}
</script>

<style scoped></style>
