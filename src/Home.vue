<template>
  <div class="home-page">
    <div class="head">
      <div class="app-name">picStitch<span class="app-desc">长图拼接工具</span></div>
      <div class="head__btns">
        <div :class="`btn ${confirmDisabled ? 'btn--disabled' : ''}`" @click="confirm">
          <svg t="1693095206139" class="text-icon" viewBox="0 0 1024 1024" version="1.1"
            xmlns="http://www.w3.org/2000/svg" p-id="17224" width="200" height="200">
            <path
              d="M166.016 64A102.4 102.4 0 0 0 64 166.016v627.968A102.4 102.4 0 0 0 166.016 896h627.968A102.4 102.4 0 0 0 896 793.984V258.752L701.248 64z m0 64H192v192c0 35.008 28.992 64 64 64h384c35.008 0 64-28.992 64-64V157.248l128 128v508.8a37.504 37.504 0 0 1-38.016 37.952H704v-192c0-35.008-28.992-64-64-64H320c-35.008 0-64 28.992-64 64v192H166.016A37.504 37.504 0 0 1 128 793.984V166.016C128 144.512 144.512 128 166.016 128zM256 128h192v128h128V128h64v192H256z m64 512h320v192H320z"
              fill="" p-id="17225"></path>
          </svg>
          拼接
        </div>
      </div>
    </div>
    <div class="body">
      <div class="image-list">
        <div v-for="(image, i) in imageList" class="image-outer" @drop.prevent.stop="dragDropHandler($event, i)"
          @dragover.prevent.stop="" @dragenter.prevent.stop="">
          <img :src="image.url" draggable="true" @dragstart="dragStartHandler($event, image.id)" @dragend="dragEndHandler"
            @touchstart.prevent="">
          <div class="image-badge">{{ i + 1 }}</div>
        </div>
        <div class="image-outer">
          <label v-if="!addImageDisabled" :class="`image-add ${addImageDisabled ? 'image-add--disabled' : ''}`"
            for="selector" @dragover.prevent.stop="" @dragenter.prevent.stop="" @drop.prevent.stop="dropImage"
            @click="addImage">
            <input id="selector" @change="selectImages" type="file" placeholder="请选择图片" accept="image/*" multiple>
            <svg t="1693404804492" class="image-add-icon" viewBox="0 0 1024 1024" version="1.1"
              xmlns="http://www.w3.org/2000/svg" p-id="4022" width="200" height="200">
              <path
                d="M512 832a32 32 0 0 0 32-32v-256h256a32 32 0 0 0 0-64h-256V224a32 32 0 0 0-64 0v256H224a32 32 0 0 0 0 64h256v256a32 32 0 0 0 32 32"
                fill="" p-id="4023"></path>
            </svg>
            <div class="add-tip">{{ tipText }}</div>
          </label>
        </div>
      </div>
      <div class="image-delete" :style="{ display: deleteAreaDisplay }" @dragenter.prevent.stop=""
        @dragover.prevent.stop="" @drop="removeImage">
        <svg t="1693466461618" class="text-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="16190" width="200" height="200">
          <path
            d="M768 384c-19.2 0-32 12.8-32 32l0 377.6c0 25.6-19.2 38.4-38.4 38.4L326.4 832c-25.6 0-38.4-19.2-38.4-38.4L288 416C288 396.8 275.2 384 256 384S224 396.8 224 416l0 377.6c0 57.6 44.8 102.4 102.4 102.4l364.8 0c57.6 0 102.4-44.8 102.4-102.4L793.6 416C800 396.8 787.2 384 768 384z"
            fill="" p-id="16191"></path>
          <path
            d="M460.8 736l0-320C460.8 396.8 448 384 435.2 384S396.8 396.8 396.8 416l0 320c0 19.2 12.8 32 32 32S460.8 755.2 460.8 736z"
            fill="" p-id="16192"></path>
          <path
            d="M627.2 736l0-320C627.2 396.8 608 384 588.8 384S563.2 396.8 563.2 416l0 320C563.2 755.2 576 768 588.8 768S627.2 755.2 627.2 736z"
            fill="" p-id="16193"></path>
          <path
            d="M832 256l-160 0L672 211.2C672 166.4 633.6 128 588.8 128L435.2 128C390.4 128 352 166.4 352 211.2L352 256 192 256C172.8 256 160 268.8 160 288S172.8 320 192 320l640 0c19.2 0 32-12.8 32-32S851.2 256 832 256zM416 211.2C416 198.4 422.4 192 435.2 192l153.6 0c12.8 0 19.2 6.4 19.2 19.2L608 256l-192 0L416 211.2z"
            fill="" p-id="16194"></path>
        </svg>
        拖到此处删除
      </div>
    </div>
  </div>
  <tip tip="测试消息"></tip>
</template>
<script setup lang="ts">
import Tip from './components/Tip'
import { computed, ref } from 'vue';
import ImageClipView from './class/base/ImageClipView';
import ImageViewManager from './class/base/ImageClipViewManager';


type OrderedImage = {
  id: number,
  url: string
}

const imageManager = new ImageViewManager()

const maxCnt = 10
const imageList = ref<OrderedImage[]>([])
const imageClipViews = ref<ImageClipView[]>([])

const addImageDisabled = computed(() => imageList.value.length >= maxCnt)

const tipText = ref<string>('')

function _addImage(files: FileList) {
  const cnt = imageList.value.length
  if (files?.length! > maxCnt - cnt) return
  imageList.value.push(...Array.prototype.map.call<FileList, any[], OrderedImage[]>(
    files!, (m: File, i: number) => ({
      url: URL.createObjectURL(m),
      id: i + cnt
    })));
}

function selectImages(e: Event) {
  const inputEl = e.target as HTMLInputElement
  _addImage(inputEl.files!)
}

function addImage(e: MouseEvent) {
  if (addImageDisabled.value) e.preventDefault()
}

function dropImage(e: DragEvent) {
  const files: FileList = e.dataTransfer?.files!
  _addImage(files)
}

const confirmDisabled = computed(() => imageList.value.length === 0)

function confirm() {
  if (confirmDisabled) return
  imageManager.initViews(imageList.value.map(img => img.url))
    .then(views => {
      console.log('init image clip views: ', views)
      imageClipViews.value = views
    });
}

let draggingImageId: number
const deleteAreaDisplay = ref<string>('none')

function dragStartHandler(e: DragEvent, id: number) {
  console.log('drag start')
  draggingImageId = id
  deleteAreaDisplay.value = 'flex'
  e.dataTransfer!.effectAllowed = 'move'
}

function dragEndHandler() {
  deleteAreaDisplay.value = 'none'
}

function dragDropHandler(e: DragEvent, idx: number) {
  const sourceIdx = imageList.value.findIndex(img => img.id === draggingImageId)
  const source = imageList.value.splice(sourceIdx, 1)[0]
  imageList.value.splice(idx, 0, source)
  const target = e.currentTarget as HTMLDivElement
  if (target.className !== 'image-outer') return
}

</script>
<style>
.home-page .image-list {
  display: flex;
  flex-wrap: wrap;
}

.home-page .image-outer {
  height: 200px;
  width: 200px;
  position: relative;
  cursor: pointer;
  padding: 10px;
  box-sizing: border-box;
}

.home-page .image-list img {
  height: 100%;
  width: 100%;
  display: block;
  object-fit: cover;
  object-position: center center;
  box-shadow: 4px 4px 13px 1px rgba(0, 0, 0, 0.4);
}

.home-page .image-add {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;
  border: 1px dashed #555;
  background-color: rgba(0, 0, 0, 0.1);
}

.home-page .image-add--disabled {
  cursor: not-allowed;
  background-color: rgba(255, 255, 255, 0.2);
  color: #aaa;
}

.home-page .image-add--disabled .image-add-icon {
  fill: rgba(100, 100, 100, 0.3);
}

.home-page .image-outer:active {
  cursor: grab;
}

.home-page .image-outer .image-badge {
  height: 1.25rem;
  width: 1.25rem;
  font-size: 0.75rem;
  background-color: var(--active-color);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0.6;
}

.home-page .image-delete {
  transition: 200ms ease-in;
  display: flex;
  align-items: center;
  margin: 0 auto;
  width: max-content;
  padding: 16px 32px;
  color: #fff;
  background: rgb(213, 21, 4);
  border-radius: 4px;
  justify-content: center;
  box-sizing: border-box;
}

@media screen and (max-width: 600px) {
  .home-page .image-delete {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 999;
    border-radius: 0;
  }

  .home-page .image-outer {
    width: 33.3vw;
    height: 33.3vw;
  }

  .home-page .image-add {}
}

.image-add-icon {
  height: 5rem;
  width: 5rem;
  fill: rgba(100, 100, 100, 0.5)
}
</style>