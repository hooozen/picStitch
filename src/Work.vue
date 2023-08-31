<template>
  <div>
    <div class="head">
      <div class="app-name">picStitch<span class="app-desc">长图拼接工具</span></div>
      <div class="head__btns">
        <label class="btn" for="selector"><svg t="1693095036448" class="text-icon" viewBox="0 0 1024 1024" version="1.1"
            xmlns="http://www.w3.org/2000/svg" p-id="13440" width="200" height="200">
            <path
              d="M928 444H820V330.4c0-17.7-14.3-32-32-32H473L355.7 186.2c-1.5-1.4-3.5-2.2-5.5-2.2H96c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h698c13 0 24.8-7.9 29.7-20l134-332c1.5-3.8 2.3-7.9 2.3-12 0-17.7-14.3-32-32-32zM136 256h188.5l119.6 114.4H748V444H238c-13 0-24.8 7.9-29.7 20L136 643.2V256z m635.3 512H159l103.3-256h612.4L771.3 768z"
              p-id="13441"></path>
          </svg>选择图片</label>
        <input id="selector" @change="selectImages" type="file" placeholder="请选择图片" accept="image/png image/jepg"
          multiple>
        <div :class="`btn ${saveBtnDisabled ? 'btn--disabled' : ''}`" @click="save">
          <svg t="1693095206139" class="text-icon" viewBox="0 0 1024 1024" version="1.1"
            xmlns="http://www.w3.org/2000/svg" p-id="17224" width="200" height="200">
            <path
              d="M166.016 64A102.4 102.4 0 0 0 64 166.016v627.968A102.4 102.4 0 0 0 166.016 896h627.968A102.4 102.4 0 0 0 896 793.984V258.752L701.248 64z m0 64H192v192c0 35.008 28.992 64 64 64h384c35.008 0 64-28.992 64-64V157.248l128 128v508.8a37.504 37.504 0 0 1-38.016 37.952H704v-192c0-35.008-28.992-64-64-64H320c-35.008 0-64 28.992-64 64v192H166.016A37.504 37.504 0 0 1 128 793.984V166.016C128 144.512 144.512 128 166.016 128zM256 128h192v128h128V128h64v192H256z m64 512h320v192H320z"
              fill="" p-id="17225"></path>
          </svg>
          保存
        </div>
      </div>
    </div>
    <div class="body">
      <viewer @edit="edit" :image-clip-views="imageClipViews" ref="viewer"></viewer>
    </div>
  </div>

  <div class="modal-outer" id="stitchModal" :style="{ display: modalDisplay }">
    <editor :image-clip-views="stitchImageViews" @cancel="isShowEditor = false" @confirm="confirmEdit"></editor>
  </div>
</template>
<script setup lang="ts">
import ImageClipView from './class/base/ImageClipView';
import ImageViewManager from './class/base/ImageClipViewManager';
import Viewer from './class/vue/Viewer.vue';
import Editor from './class/vue/Editor.vue';
import './index.css'
import { computed, nextTick, ref } from 'vue';
import type { Ref } from 'vue'


const imageManager: ImageViewManager = new ImageViewManager()
const imageClipViews: Ref<ImageClipView[]> = ref([])
const isShowEditor: Ref<boolean> = ref(false)

const modalDisplay = computed(() => isShowEditor.value ? 'block' : 'none')

const saveBtnDisabled = computed(() => imageClipViews.value.length <= 0)

function selectImages(e: Event) {
  const inputEl = e.target as HTMLInputElement
  const files: string[] = Array.prototype
    .map.call(inputEl.files, m => URL.createObjectURL(m)) as string[];
  if (!files.length) return;

  imageManager.initViews(files).then(views => {
    console.log('init image clip views: ', views)
    imageClipViews.value = views
  });
}

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

function save() {
  if (saveBtnDisabled.value) return
  console.log('save')
  viewer.value.save()
}
</script>