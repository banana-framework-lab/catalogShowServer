<template>
  <div>
    <n-space vertical size="large">
      <n-layout>
        <n-layout-header>
          <n-grid :x-gap="5" :y-gap="0" :cols="8">
            <n-grid-item span="7">
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
            </n-grid-item>
            <n-grid-item
              span="1"
              style="
                align-items: center;
                display: -webkit-flex;
                justify-content: flex-end;
              "
            >
              <n-tooltip
                v-if="neighborUrl === ''"
                placement="bottom"
                trigger="hover"
              >
                <template #trigger>
                  <n-button
                    quaternary
                    circle
                    type="primary"
                    @click="reloadFile()"
                  >
                    <template #icon>
                      <n-icon
                        :component="UpdateNow"
                        size="1.5rem"
                        :depth="1"
                        color="#7fe7c4"
                      />
                    </template>
                  </n-button>
                </template>
                <span>刷新文件列表</span>
              </n-tooltip>
              <n-popselect
                v-model:value="neighborUrl"
                :options="neighborOptions"
                trigger="click"
                :render-label="renderNeighborOptionsIcon"
                scrollable
                :on-update:value="changeNeighor"
              >
                <n-button quaternary circle type="primary">
                  <template #icon>
                    <n-icon
                      :component="Network4"
                      size="1.5rem"
                      :depth="1"
                      color="#7fe7c4"
                    />
                  </template>
                </n-button>
                <template #action>
                  <div>
                    <div style="display: flex; justify-content: space-around">
                      <n-button
                        size="tiny"
                        strong
                        secondary
                        round
                        type="primary"
                        @click="getNeighborList"
                      >
                        <template #icon>
                          <n-icon
                            :component="RefreshCircleOutline"
                            size="1.5rem"
                            :depth="1"
                            color="#7fe7c4"
                          />
                        </template>
                        更新邻居
                      </n-button>
                      <n-switch
                        v-model:value="neighborStatus"
                        style="margin-left: 10px"
                        @update:value="editBroadcastStatus"
                      >
                        <template #checked> 在线 </template>
                        <template #unchecked> 隐身 </template>
                      </n-switch>
                    </div>
                  </div>
                </template>
              </n-popselect>
            </n-grid-item>
          </n-grid>
        </n-layout-header>
        <n-layout-content
          content-style="padding: 1rem 1rem 0rem 1rem;text-align: center;"
        >
          <n-input-group>
            <n-select
              v-model:value="search.condition.fileType"
              style="width: 13rem"
              clearable
              filterable
              :options="fileTypeOption"
              placeholder="类型"
              @update:value="getListByCondition(1)"
            />
            <n-input
              v-model:value="search.condition.name"
              clearable
              default-value=""
              :placeholder="search.condition.placeholder"
              @change="
                () => {
                  search.condition.name
                    ? (search.condition.placeholder = search.condition.name)
                    : ''
                }
              "
              @keyup.enter="searchFunction()"
              @clear="search.condition.placeholder = '输入文件名字'"
            />
            <n-button strong secondary type="primary" @click="searchFunction()">
              搜索
            </n-button>
            <n-button
              v-if="search.mode === 'table'"
              secondary
              type="primary"
              @click="search.mode = 'list'"
            >
              <template #icon>
                <n-icon
                  :component="AppstoreOutlined"
                  size="1.5rem"
                  :depth="1"
                  color="#7fe7c4"
                />
              </template>
            </n-button>
            <n-button
              v-if="search.mode === 'list'"
              secondary
              type="primary"
              @click="search.mode = 'table'"
            >
              <template #icon>
                <n-icon
                  :component="AlignLeftOutlined"
                  size="1.5rem"
                  :depth="1"
                  color="#7fe7c4"
                />
              </template>
            </n-button>
          </n-input-group>
        </n-layout-content>
        <n-layout-content content-style="padding: 0.5rem 1rem 1rem 1rem;">
          <n-select
            v-model:value="search.condition.catalog"
            clearable
            filterable
            :options="catalogOption"
            placeholder="文件目录"
            @update:value="getListByCondition(1)"
          />
        </n-layout-content>
        <n-layout-content
          v-if="search.history.length > 0"
          content-style="padding-left: 1rem;padding-right: 1rem;display:-webkit-flex;overflow-x:auto;padding-bottom:0.8rem"
        >
          <n-tag
            v-for="(item, index) in search.history"
            :key="index"
            style="margin: 0 0.2rem"
            type="success"
            @click="clickHistory(item)"
          >
            <n-ellipsis line-clamp="1" :tooltip="false" style="max-width: 7rem">
              {{ item }}
            </n-ellipsis>
          </n-tag>
          <n-tag style="margin-left: 0.2rem" @click="deleteHistory()">
            <n-ellipsis line-clamp="1" :tooltip="false" style="max-width: 7rem">
              清除历史
            </n-ellipsis>
          </n-tag>
        </n-layout-content>
        <n-layout-content content-style="padding: 0rem 1rem 1rem 1rem;">
          <n-spin :show="search.loading" size="large">
            <template #description> 正在加载。。。 </template>
            <template #icon>
              <n-icon>
                <Reload />
              </n-icon>
            </template>
            <div v-show="search.list.length > 0">
              <n-scrollbar
                v-if="search.mode === 'list'"
                :style="
                  search.history.length > 0
                    ? 'max-height: calc(100vh - 18.5rem)'
                    : 'max-height: calc(100vh - 15.5rem)'
                "
                trigger="none"
              >
                <n-grid
                  ref="listShowRef"
                  cols="1 s:2 m:4 l:5 xl:6 2xl:7"
                  responsive="screen"
                  :x-gap="15"
                  :y-gap="12"
                >
                  <n-grid-item
                    v-for="(item, index) in search.list"
                    :key="index"
                  >
                    <n-card v-if="search.reloadList" :key="index">
                      <template #cover>
                        <div
                          style="
                            height: 16.8rem;
                            display: flex;
                            flex-flow: column;
                            align-items: center;
                            justify-content: center;
                          "
                        >
                          <n-image
                            v-if="item.open_width === 'image'"
                            object-fit="contain"
                            lazy
                            :src="baseUrl + item.url"
                          />
                          <div v-if="item.open_width === 'video'">
                            <div
                              style="
                                height: 16.8rem;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                              "
                            >
                              <n-image
                                :preview-disabled="true"
                                object-fit="contain"
                                lazy
                                :src="
                                  baseUrl + '/cover/?file_index=' + item.index
                                "
                              />
                              <n-icon size="40" style="position: absolute">
                                <PlayCircle
                                  style="
                                    text-align: center;
                                    vertical-align: middle;
                                    color: #63e2b7;
                                    cursor: pointer;
                                  "
                                  @click="showModal(item)"
                                />
                              </n-icon>
                            </div>
                          </div>
                          <AudioShowVime
                            v-if="item.open_width === 'audio'"
                            :url="baseUrl + item.url"
                          />
                        </div>
                      </template>
                      <div style="word-break: break-all; margin-top: 5px">
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
                          文件目录：{{ item.catalog }}
                        </n-ellipsis>
                      </div>
                    </n-card>
                  </n-grid-item>
                </n-grid>
              </n-scrollbar>
              <div v-if="search.mode === 'table'">
                <n-table size="small" :striped="true" :single-line="false">
                  <thead>
                    <tr>
                      <th style="width: 50%">文件名称</th>
                      <th style="width: 50%" class="table-catalog">文件目录</th>
                    </tr>
                  </thead>
                </n-table>
                <n-scrollbar
                  :style="
                    search.history.length > 0
                      ? 'max-height: calc(100vh - 21rem)'
                      : 'max-height: calc(100vh - 18rem)'
                  "
                  trigger="none"
                >
                  <n-table
                    ref="tableShowRef"
                    size="small"
                    :striped="true"
                    :single-line="false"
                  >
                    <tbody>
                      <tr v-for="(item, index) in search.list" :key="index">
                        <td style="width: 50%">
                          <div
                            style="
                              padding-right: 1rem;
                              display: -webkit-flex;
                              justify-content: space-between;
                              align-items: center;
                              word-break: break-all;
                            "
                          >
                            <n-ellipsis
                              expand-trigger="click"
                              line-clamp="1"
                              :tooltip="false"
                            >
                              <span style="color: #7fe7c4"
                                >{{ index + 1 }}.</span
                              >
                              {{ item.name }}
                            </n-ellipsis>
                            <n-button
                              strong
                              secondary
                              type="primary"
                              @click="showModal(item)"
                            >
                              <n-icon><Eye /></n-icon>
                            </n-button>
                          </div>
                        </td>
                        <td style="width: 50%" class="table-catalog">
                          {{ item.catalog }}
                        </td>
                      </tr>
                    </tbody>
                  </n-table>
                </n-scrollbar>
              </div>
            </div>
            <div v-show="search.list.length <= 0">
              <n-empty
                description="没有文件，随机看看别的"
                style="margin-top: 20px"
              >
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
            <div v-show="search.list.length > 0" style="margin-top: 1rem">
              <n-pagination
                :item-count="search.total"
                show-quick-jumper
                style="justify-content: center"
                :page="search.condition.page"
                :page-size="search.condition.rows"
                :page-slot="5"
                @update:page="(page:number)=>{getListByCondition(page)}"
              >
                <template #goto> 跳转 </template>
              </n-pagination>
            </div>
          </n-spin>
        </n-layout-content>
      </n-layout>
    </n-space>
    <!-- 弹窗 -->
    <n-modal
      v-model:show="show.modal.show"
      :z-index="999"
      preset="card"
      style="width: 100%; position: fixed; top: 0px; bottom: 0px"
    >
      <template #header>
        <n-ellipsis expand-trigger="click" line-clamp="1" :tooltip="false">
          {{ show.modal.name }}
        </n-ellipsis>
      </template>
      <n-scrollbar style="max-height: calc(100vh - 8rem)" trigger="none">
        <n-image
          v-if="show.modal.type === 'pic'"
          class="modal-pic"
          object-fit="scale-down"
          :src="show.source.pic.url"
        />
        <div
          v-if="show.modal.type === 'video'"
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            height: calc(100vh - 8rem);
          "
        >
          <!-- <VideoShowVime
            :url="show.source.video.url"
            :cover="show.source.video.cover"
          /> -->
          <VideoShowXiGua
            :index="show.source.video.index"
            :url="show.source.video.url"
            :cover="show.source.video.cover"
          />
        </div>
        <div v-if="show.modal.type === 'audio'" class="modal-audio">
          <AudioShowVime :url="show.source.audio.url" />
        </div>
      </n-scrollbar>
    </n-modal>
  </div>
</template>

<script lang="ts">
export default { name: 'Show' }
</script>
<script setup lang="ts">
import { AxiosError } from 'axios'
import { IosAirplane } from '@vicons/ionicons4'
import { RefreshCircleOutline, Reload } from '@vicons/ionicons5'
import { AppstoreOutlined, AlignLeftOutlined } from '@vicons/antd'

import { Eye, PlayCircle } from '@vicons/fa'
import { Network4, UpdateNow } from '@vicons/carbon'
import { UserCircle } from '@vicons/tabler'
import { GetListByCondition, FileInfo } from '@/api/list'
import { ReloadFile, GetNeighborList, EditShowStatus } from '@/api/system'
import {
  GetFiletypeOption,
  FileTypeOption,
  GetCatalogOption,
  CatalogOption,
} from '@/api/option'
import {
  NTable,
  NGrid,
  NIcon,
  SelectOption,
  SelectGroupOption,
  useMessage,
} from 'naive-ui'
import { h, reactive, ref, onMounted, nextTick } from 'vue'
import Cookies from 'js-cookie'
// import VideoShowVime from '@/views/components/VideoShowVime.vue'
import VideoShowXiGua from '@/views/components/VideoShowXiGua.vue'
import AudioShowVime from '@/views/components/AudioShowVime.vue'

import { onBeforeRouteLeave, RouteLocationNormalized } from 'vue-router'

const neighborStatus = ref<boolean>(false)
const message = useMessage()
function editBroadcastStatus() {
  new EditShowStatus()
    .setParam({ status: neighborStatus.value })
    .request()
    .then((res) => {
      message.success('修改成功')
    })
    .catch((err) => {
      message.error(err)
      neighborStatus.value = !neighborStatus.value
    })
}

const neighborUrl = ref('')
const baseUrl = import.meta.env.VITE_APP_BASE_API
const listShowRef = ref<InstanceType<typeof NGrid>>()
const tableShowRef = ref<InstanceType<typeof NTable>>()

const show = reactive<{
  modal: {
    show: boolean
    type: string
    name: string
  }
  source: {
    pic: { name: string; url: string }
    video: { name: string; url: string; cover: string; index: number }
    audio: { name: string; url: string }
  }
}>({
  modal: {
    show: false,
    type: '',
    name: '',
  },
  source: {
    pic: { name: '', url: '' },
    video: { name: '', url: '', cover: '', index: 0 },
    audio: { name: '', url: '' },
  },
})

function showModal(item: FileInfo) {
  var name = item.name
  var url = baseUrl + item.url
  show.modal.name = name
  switch (item.open_width) {
    case 'image':
      show.source.pic = { name, url }
      show.modal.type = 'pic'
      break
    case 'video':
      show.source.video = {
        name,
        url,
        cover: baseUrl + '/cover/?file_index=' + item.index,
        index: item.index,
      }
      show.modal.type = 'video'
      break
    case 'audio':
      show.source.audio = { name, url }
      show.modal.type = 'audio'
      break
  }
  show.modal.show = true
}

const search = reactive<{
  mode: string
  history: string[]
  reloadList: boolean
  list: FileInfo[]
  total: number
  loading: boolean
  condition: {
    name?: string
    placeholder: string
    fileType: string | null
    catalog: string | null
    page: number
    rows: number
  }
}>({
  // mode: 'table',
  mode: 'list',
  history: [],
  reloadList: true,
  list: [],
  loading: false,
  total: 0,
  condition: {
    placeholder: '输入文件名字',
    // fileType: '.mkv',
    fileType: null,
    catalog: null,
    page: 1,
    rows: 20,
  },
})

function searchFunction() {
  if (
    !search.condition.name &&
    search.condition.placeholder !== '输入文件名字'
  ) {
    search.condition.name = search.condition.placeholder
  }

  if (search.condition.name) {
    const history = String(Cookies.get('search.history') || '[]')
    search.history = JSON.parse(history)
    if (search.history.indexOf(search.condition.name) < 0) {
      if (search.history.length >= 5) {
        search.history.shift()
      }
      search.history.push(search.condition.name)
      Cookies.set('search.history', JSON.stringify(search.history))
    }
  }

  getListByCondition(1)
}
onMounted(() => {
  searchFunction()
})

function initHistory() {
  const history = String(Cookies.get('search.history') || '[]')
  search.history = JSON.parse(history)
}

initHistory()

function clickHistory(tag: string) {
  search.condition.name = tag
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

function getListByCondition(page = 1) {
  search.loading = true
  search.condition.page = page
  new GetListByCondition()
    .setProtocolDomain(neighborUrl.value)
    .setParam({
      name: search.condition.name,
      file_type: search.condition.fileType
        ? String(search.condition.fileType)
        : undefined,
      catalog: search.condition.catalog
        ? String(search.condition.catalog)
        : undefined,
      page: search.condition.page,
      rows: search.condition.rows,
    })
    .request()
    .then((res) => {
      listShowRef.value?.$el.scrollIntoView({ behavior: 'instant' })
      tableShowRef.value?.$el.scrollIntoView({ behavior: 'instant' })
      search.reloadList = false
      nextTick(() => {
        search.list = res.data.list
        search.total = res.data.total
        search.loading = false
        search.reloadList = true
      })
    })
    .catch((err: AxiosError) => {
      if (Number(err.response?.status) == 404) {
        search.list = []
        search.total = 0
        search.condition.page = 1
      }
      search.loading = false
    })
}

function seeOther() {
  search.condition.name = ''
  search.condition.catalog = null
  search.condition.fileType = null
  getListByCondition(1)
}

function reloadFile() {
  search.loading = true
  new ReloadFile()
    .request()
    .then((res) => {
      getFiletypeOption()
      getCatalogOption()
      getListByCondition()
    })
    .catch(() => {
      search.loading = false
    })
}

const neighborOptions = ref<{ value: string; label: string }[]>([])

function getNeighborList() {
  new GetNeighborList()
    .request()
    .then((res) => {
      neighborOptions.value = res.data.list.map((item) => {
        return {
          value: item.url,
          label: item.ip,
        }
      })
      neighborOptions.value.unshift({
        value: '',
        label: '本机文件',
      })
      neighborStatus.value = res.data.broadcast_status
    })
    .finally(() => {
      search.loading = false
    })
}
getNeighborList()

const loopGetNeighborList = setInterval(() => {
  getNeighborList()
}, 10000)

onBeforeRouteLeave(
  (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    if (to.path == '/login') {
      clearInterval(loopGetNeighborList)
    }
  }
)

function changeNeighor(a: string) {
  neighborUrl.value = a
  getListByCondition(1)
}

function renderNeighborOptionsIcon(option: SelectOption | SelectGroupOption) {
  return h(
    'span',
    {
      style: 'display: flex; align-items: center;justify-content: start;',
    },
    [
      h(
        UserCircle,
        { style: 'width:1rem' },
        {
          default: () => '',
        }
      ),
      h('span', null, {
        default: () => option.label,
      }),
    ]
  )
}
</script>

<style scoped lang="scss">
.modal-pic {
  :deep() {
    img {
      width: 100%;
    }
  }
}

.modal-audio {
  height: 16.8rem;
  display: -webkit-flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
}

@media screen and (min-width: 320px) and (max-width: 480px) {
  .table-catalog {
    display: none;
  }
}
</style>
