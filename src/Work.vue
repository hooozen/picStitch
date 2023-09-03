<template>
  <div class="head">
    <div class="head-left" @click="back">
      <svg t="1693720704253" class="text-icon back-icon" viewBox="0 0 1024 1024" version="1.1"
        xmlns="http://www.w3.org/2000/svg" p-id="4102" width="200" height="200">
        <path
          d="M538.288 198.624l-11.312-11.312a16 16 0 0 0-22.64 0L187.312 504.336a16 16 0 0 0 0 22.64L504.336 844a16 16 0 0 0 22.64 0l11.312-11.312a16 16 0 0 0 0-22.624l-294.4-294.4 294.4-294.4a16 16 0 0 0 0-22.64z"
          fill="#000000" p-id="4103"></path>
      </svg>
    </div>
    拼接
    <div class="head-right">
      <div :class="`btn${saveEnabled ? '' : ' btn--disabled'}`" @click="complete">完成</div>
    </div>
  </div>
  <div class="body image-work">
    <div v-if="!imageClipViews.length" class="empty-tip">
      <div @click="back" class="btn btn--disabled select-tip">请选择图片</div>
    </div>
    <viewer v-else @edit="edit" :image-clip-views="imageClipViews" ref="viewer"></viewer>
  </div>
  <editor v-if="isShowEditor" :image-clip-views="stitchImageViews" @cancel="isShowEditor = false" @confirm="confirmEdit">
  </editor>
  <div v-if="isShowResult" class="modal-mask" @click="isShowResult = false">
    <div class="modal__head">
      <div class="modal-tip">长按或右击图片保存</div>
    </div>
    <div class="result-view">
      <img @load="resultLoad" class="result-image" ref="resultImg" :src="resultURL" @click.stop="">
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Ref } from 'vue'

import { computed, nextTick, ref } from 'vue';

import ImageClipView from './class/base/ImageClipView';
import ImageViewManager from './class/base/ImageClipViewManager';

import Viewer from './class/vue/Viewer.vue';
import Editor from './class/vue/Editor.vue';

import './index.css'

import { useStore } from './stores'
import { useRouter } from 'vue-router';

import Loading from './components/Loading'
import type { LoadingHandler } from './components/Loading/src/method'

const store = useStore()
const router = useRouter()

const imageClipViews = store.imageClipViews

const imageManager: ImageViewManager = ImageViewManager.getInstance()
const isShowEditor: Ref<boolean> = ref(false)

const stitchImageViews = ref<[ImageClipView, ImageClipView] | []>([])

function edit(ids: [number, number]) {
  isShowEditor.value = true
  nextTick(() => {
    stitchImageViews.value = imageManager.copyImageView(...ids) as [ImageClipView, ImageClipView]
  })
}

const viewer = ref()

function confirmEdit() {
  isShowEditor.value = false
  viewer.value.update()
}

const saveEnabled = computed(() => imageClipViews.length > 0)
const resultImg = ref<HTMLImageElement>()

let loading: LoadingHandler
function complete() {
  if (!saveEnabled.value) return
  loading = Loading({ text: '生成中' })
  nextTick(() => {
    resultURL.value = viewer.value.save()
    isShowResult.value = true
  })
  /*
  resultImg.value!.onload = () => {
    console.log('img load')
  }
  */
  // resultImg.value!.src = resultURL.value
}

function resultLoad() {
  console.log('load')
  loading.close()
}

const isShowResult = ref<boolean>(false)
const resultURL = ref<string>('')

function back() {
  router.push({ name: 'manager' })
}
</script>

<style>
.body.image-work {
  overflow-y: auto;
}

.result-view {
  padding: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100% - 60px);
  flex-direction: column;
  box-sizing: border-box;
}

.result-image {
  width: 50%;
}

.empty-tip {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.select-tip {
  cursor: pointer;
  padding: 0.5em 1em;
}
</style>