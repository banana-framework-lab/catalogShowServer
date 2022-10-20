<template>
  <div>
    <n-config-provider
      :theme="darkTheme"
      :locale="zhCN"
      :date-locale="dateZhCN"
    >
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
                @keyup.enter="searchFunction()"
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
              style="margin: 0.2rem"
              @click="clickHistory(item)"
            >
              <n-ellipsis
                line-clamp="1"
                :tooltip="false"
                style="max-width: 7rem"
              >
                {{ item }}
              </n-ellipsis>
            </n-tag>
            <n-gradient-text
              style="margin-left: 0.5rem"
              :gradient="{
                from: 'rgb(85, 85, 85)',
                to: 'rgb(255, 255, 255)',
              }"
              @click="deleteHistory()"
            >
              清除历史
            </n-gradient-text>
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
            <n-spin :show="search.loading" size="large">
              <template #description> 正在加载。。。 </template>
              <template #icon>
                <n-icon><Reload /></n-icon>
              </template>
              <div v-if="search.list.length > 0">
                <n-scrollbar
                  :style="
                    search.history.length > 0
                      ? 'max-height: calc(100vh - 23rem)'
                      : 'max-height: calc(100vh - 18rem)'
                  "
                  trigger="none"
                >
                  <n-grid
                    cols="1 s:2 m:4 l:5 xl:6 2xl:7"
                    responsive="screen"
                    :x-gap="15"
                    :y-gap="12"
                  >
                    <n-grid-item
                      v-for="(item, index) in search.list"
                      :key="index"
                    >
                      <n-card>
                        <template #cover>
                          <div style="text-align: center">
                            <n-image
                              v-if="
                                picFileTypeList.indexOf(
                                  item.file_type.toLowerCase()
                                ) > -1
                              "
                              style="height: 16.8rem"
                              object-fit="fill"
                              lazy
                              :src="baseUrl + item.url"
                            />
                            <div
                              v-if="
                                videoFileTypeList.indexOf(
                                  item.file_type.toLowerCase()
                                ) > -1
                              "
                              style="height: 16.8rem; text-align: center"
                            >
                              <video-player
                                class="video-js vjs-default-skin vjs-big-play-centered"
                                :options="getPlayerOption(baseUrl + item.url)"
                                :volume="0.6"
                              />
                            </div>
                          </div>
                        </template>
                        <div style="word-break: break-all">
                          <n-ellipsis
                            expand-trigger="click"
                            line-clamp="1"
                            :tooltip="false"
                          >
                            文件名称：{{ item.name }}
                          </n-ellipsis>
                          <br />
                          <n-ellipsis
                            expand-trigger="click"
                            line-clamp="1"
                            :tooltip="false"
                          >
                            文件目录：{{ item.src }}
                          </n-ellipsis>
                        </div>
                      </n-card>
                    </n-grid-item>
                  </n-grid>
                </n-scrollbar>
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
              <div style="margin-top: 1rem">
                <n-pagination
                  :item-count="search.total"
                  show-quick-jumper
                  style="justify-content: center"
                  :page="search.conditon.page"
                  :page-size="search.conditon.rows"
                  :page-slot="5"
                  @update:page="
                    (page:number) => {
                      search.conditon.page = page
                      getListByName(search.conditon.name)
                    }
                  "
                >
                  <template #goto> 跳转 </template>
                </n-pagination>
              </div>
            </n-spin>
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
import { Reload } from '@vicons/ionicons5'
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
import { darkTheme, zhCN, dateZhCN } from 'naive-ui'
import { reactive, ref } from 'vue'
import Cookies from 'js-cookie'
import { VideoPlayer } from '@videojs-player/vue'
import { VideoJsPlayerOptions } from 'video.js'

const baseUrl = import.meta.env.VITE_APP_BASE_API

const picFileTypeList = reactive<string[]>(['.jpg'])
const videoFileTypeList = reactive<string[]>(['.mp4'])

const search = reactive<{
  history: string[]
  list: FileInfo[]
  total: number
  loading: boolean
  conditon: {
    name?: string
    placeholder: string
    fileType: string | null
    catalog: string | null
    page: number
    rows: number
  }
}>({
  history: [],
  list: [],
  loading: false,
  total: 0,
  conditon: {
    placeholder: '输入文件名字',
    fileType: null,
    catalog: null,
    page: 1,
    rows: 20,
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
      if (search.history.length >= 5) {
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

function clickHistory(tag: string) {
  search.conditon.name = tag
  searchFunction()
}

function deleteHistory() {
  search.history = []
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
  search.loading = true
  search.conditon.catalog = null
  search.conditon.fileType = null
  search.conditon.page = 1
  new GetListByName()
    .setParam({
      name: name,
      page: search.conditon.page,
      rows: search.conditon.rows,
    })
    .request()
    .then((res) => {
      search.list = res.data.list
      search.total = res.data.total
    })
    .finally(() => {
      search.loading = false
    })
}

function getListByType() {
  search.loading = true
  search.conditon.name = ''
  search.conditon.catalog = null
  search.conditon.page = 1
  new GetListByType()
    .setParam({
      type: String(search.conditon.fileType),
      page: search.conditon.page,
      rows: search.conditon.rows,
    })
    .request()
    .then((res) => {
      search.list = res.data.list
      search.total = res.data.total
    })
    .finally(() => {
      search.loading = false
    })
}

function getListByCatalog() {
  search.loading = true
  search.conditon.name = ''
  search.conditon.fileType = null
  search.conditon.page = 1
  new GetListByCatalog()
    .setParam({
      catalog: String(search.conditon.catalog),
      page: search.conditon.page,
      rows: search.conditon.rows,
    })
    .request()
    .then((res) => {
      search.list = res.data.list
      search.total = res.data.total
    })
    .finally(() => {
      search.loading = false
    })
}

function seeOther() {
  search.conditon.name = ''
  getListByName('')
}

function getPlayerOption(url: string): VideoJsPlayerOptions {
  const option: VideoJsPlayerOptions = {
    height: 16.8 * 14,
    controls: true,
    playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
    autoplay: false, //如果true,浏览器准备好时开始回放。
    muted: false, // 默认情况下将会消除任何音频。
    loop: true, // 导致视频一结束就重新开始。
    preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
    language: 'zh-CN',
    aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
    fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
    html5: { hls: { withCredentials: false } }, // 可以使用m3u8视频
    sources: [
      {
        type: '',
        src: url, // 路径
      },
    ],
    poster: '', //你的封面地址
    // width: document.documentElement.clientWidth,
    notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
    controlBar: {
      // timeDivider: true,
      // durationDisplay: true,
      remainingTimeDisplay: true, // 是否显示剩余时间
      fullscreenToggle: true, //全屏按钮
    },
  }
  return option
}
</script>

<style scoped>
:deep(.vjs-paused .vjs-big-play-button, .vjs-paused
    .vjs-has-started
    .vjs-big-play-button) {
  display: block !important;
}
</style>
