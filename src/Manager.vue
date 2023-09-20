<template>
  <div class="head">
    <div class="head-left app-name">
      picStitch
    </div>
    <div class="head-right">
      <div :class="`btn${confirmDisabled ? ' btn--disabled' : ''}`" @click="toStitch">拼接</div>
    </div>
  </div>
  <div class="body image-manager">
    <div class="image-list" ref="imageListEl">
      <div v-for="image in imageList" class="image-outer" :key="image.id"
        :style="{ ...image.style, transform: `translate(${image.translateX}px, ${image.translateY}px) scale(${image.isDraging ? '1.1' : '1'})` }">
        <img :src="image.url" @mousedown.stop.prevent="dragStart($event, image)"
          @touchstart.prevent.stop="touchStart($event, image)" />
        <div class="image-badge">{{ image.order + 1 }}</div>
      </div>
      <div class="image-outer" ref="imageOuterEl" :style="addBtnStyle">
        <label v-if="!addImageDisabled" :class="`image-add ${addImageDisabled ? 'image-add--disabled' : ''}`"
          for="selector" @dragover.prevent.stop="" @dragenter.prevent.stop="" @drop.prevent.stop="dropImage">
          <input id="selector" @change="selectImages" type="file" placeholder="请选择图片" accept="image/*" multiple>
          <svg t="1693404804492" class="image-add-icon" viewBox="0 0 1024 1024" version="1.1"
            xmlns="http://www.w3.org/2000/svg" p-id="4022" width="200" height="200">
            <path
              d="M512 832a32 32 0 0 0 32-32v-256h256a32 32 0 0 0 0-64h-256V224a32 32 0 0 0-64 0v256H224a32 32 0 0 0 0 64h256v256a32 32 0 0 0 32 32"
              fill="" p-id="4023"></path>
          </svg>
        </label>
      </div>
    </div>
    <div v-if="!confirmDisabled" class="manager__foot">
      <div @click="removeAll" class="btn btn-normal">清空</div>
    </div>
    <Teleport to="body">
      <div class="image-delete" :style="{ display: deleteAreaDisplay }" @mouseup="removeImage" @touchend="removeImage">
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
    </Teleport>
  </div>
</template>
<script setup lang="ts">
import type { ComputedRef, Ref } from 'vue';
import Compressor from 'compressorjs'

import { CSSProperties, computed, onMounted, ref, watch } from 'vue';
import { useResizeObserver } from '@vueuse/core'
import ImageViewManager from './class/base/ImageClipViewManager';
import Tip from './components/Tip'
import Loading from './components/Loading'

import { useStore } from './stores'
import { useRouter } from 'vue-router';

const store = useStore()
const router = useRouter()


/** image file manager */
type ImageOuter = {
  id: number,
  order: number,
  url: string,
  isDraging: boolean,
  translateX: number,
  translateY: number,
  style: {
    zIndex: number,
    transition: string,
  }
}

const maxCnt = 9
let idCnt = 0
const imageList = ref<ImageOuter[]>([])
const addImageDisabled = computed(() => imageList.value.length >= maxCnt)

const imageManager = ImageViewManager.getInstance()

function selectImages(e: Event) {
  const inputEl = e.target as HTMLInputElement
  const files: FileList = inputEl.files!
  if (!_boforeAddImage(files)) return e.preventDefault()
  _addImage(files)
}

function dropImage(e: DragEvent) {
  const files: FileList = e.dataTransfer?.files!
  if (!_boforeAddImage(files)) return e.preventDefault()
  _addImage(files)
}

function removeAll() {
  imageList.value = []
  _updateDisplacement(true)
}

function removeImage() {
  if (!isDraging.value) return
  imageList.value.splice(imageList.value.findIndex(img => img.id === draggingImage.id), 1)
  _afterRemove(draggingImage)
}

function _boforeAddImage(files: FileList): boolean {
  if (files.length + imageList.value.length > maxCnt) {
    Tip({ text: '一次最多拼接 9 张图片' })
    return false
  }
  if (Array.prototype.some.call(files, (file: File) => !file.type.startsWith('image'))) {
    Tip({ text: '您上传了非图片文件' })
    return false
  }
  return true
}

function _afterRemove(removedImage: ImageOuter) {
  imageList.value.forEach(img => {
    if (img.order > removedImage.order) img.order--;
    [img.translateX, img.translateY] = _getDisplacementByOrder(img.order)
  })
  _updateDisplacement(true)
}

function _compressImages(files: FileList, maxWidth: number = 1080) {
  const tasks = Array.prototype.map.call<FileList, any, (File | Blob)[]>(files, (file: File) => new Promise<File | Blob>((resolve, reject) => {
    new Compressor(file, {
      maxWidth,
      success(result: File | Blob) {
        resolve(result)
      },
      error(err) {
        console.error(err.message);
        reject(err)
      },
    })
  }))
  return Promise.all<(File | Blob)[]>(tasks)
}

function _addImage(files: FileList) {
  const cnt = imageList.value.length
  if (files?.length! > maxCnt - cnt) return
  let loading = Loading({ text: '载入中' })
  _compressImages(files).then((files: (File | Blob)[]) => {
    // const images = Array.prototype.map.call<FileList, any[], ImageOuter[]>(
    const images = files.map(
      (m: File | Blob, i: number) => ({
        url: URL.createObjectURL(m),
        id: idCnt++,
        order: i + cnt,
        translateX: 0,
        translateY: 0,
        isDraging: false,
        style: {
          transition: '200ms ease-out',
          zIndex: 0
        },
      })).reverse()
    imageList.value.push(...images);
    _updateDisplacement(true)
  }).catch(() => {
    Tip({ text: '图片加载失败，请重试' })
  }).finally(() => {
    loading.close()
  })
}

const confirmDisabled = computed(() => imageList.value.length < 2)

function toStitch() {
  if (confirmDisabled.value) return
  const sortedFiles = imageList.value
    .sort((a, b) => a.order - b.order)
    .map(img => img.url)
  imageManager.initViews(sortedFiles).then(views => {
    // emits('updateImages', views)
    store.imageClipViews = views
    router.push({ name: 'work' })
  });
}

/** drag image */

const isDraging = ref<boolean>(false)
let draggingImage: ImageOuter
let draggingItemStartCenter = [0, 0]
let dragginStartPoint: [number, number] = [0, 0]

const deleteAreaDisplay = computed(() => isDraging.value ? 'flex' : 'none')

const draggingItemDynamicOrder = ref<number>(0)

function dragStart(e: MouseEvent | Touch, image: ImageOuter) {
  _initGrid()
  _updateAddPosition()
  isDraging.value = true
  draggingImage = image
  image.isDraging = true
  _updateStyle()
  draggingItemDynamicOrder.value = image.order

  const target = e.target as Element
  const { x, y } = target.getBoundingClientRect()
  draggingItemStartCenter = [x + outerElSize.width / 2, y + outerElSize.height / 2]
  dragginStartPoint = [e.clientX, e.clientY]
}

function draging(e: MouseEvent) {
  if (!isDraging.value) return
  draggingImage.translateX += e.movementX
  draggingImage.translateY += e.movementY
  _updateImageOrder(e)
}

function dragend() {
  if (isDraging.value) {
    [
      draggingImage.translateX,
      draggingImage.translateY
    ] = _getDisplacementByOrder(draggingImage.order)
    draggingImage.isDraging = false
    draggingImage.style.transition = '200ms ease-out'
  }
  isDraging.value = false
}


watch(draggingItemDynamicOrder, (order: number) => {
  imageList.value
    .filter(img => img !== draggingImage)
    .forEach(img => {
      if (img.order < draggingImage.order) {
        if (img.order < order) return;
        img.order++
      } else if (img.order > draggingImage.order) {
        if (img.order > order) return
        img.order--
      }
    })
  draggingImage.order = order
  _updateDisplacement(false)
})

function _updateDisplacement(updateAdd: boolean) {
  imageList.value.forEach(img => {
    if (img === draggingImage) return
    const [i, j] = _getDisplacementByOrder(img.order)
    img.translateX = i
    img.translateY = j
  })
  if (updateAdd) _updateAddPosition()
}

const iamgeRows = computed<number>(() => imageList.value.length / gridSize.value.cols)

function _getDisplacementByOrder(order: number) {
  const i = Math.min(iamgeRows.value, Math.floor(order / gridSize.value.cols))
  const j = order - i * gridSize.value.cols
  return [j * outerElSize.width, i * outerElSize.height]
}

function _updateImageOrder(e: MouseEvent | Touch) {
  let centerX = e.clientX - dragginStartPoint[0] + draggingItemStartCenter[0]
  let centerY = e.clientY - dragginStartPoint[1] + draggingItemStartCenter[1]
  const col = Math.min(gridSize.value.cols - 1, Math.floor((centerX - listElOffset.x) / outerElSize.width))
  const row = Math.min(maxGridRow.value, Math.floor((centerY - listElOffset.y) / outerElSize.height))

  let order = Math.max(0, row) * gridSize.value.cols + Math.max(0, col)
  draggingItemDynamicOrder.value = Math.min(order, imageList.value.length - 1)
}

function _updateStyle() {
  imageList.value
    .filter(img => img !== draggingImage)
    .forEach(img => {
      img.style.transition = '200ms ease-out'
      img.style.zIndex = 0
    })
  draggingImage.style.transition = 'none'
  draggingImage.style.zIndex = 99
}

const imageListEl = ref<HTMLDivElement>()
const imageOuterEl = ref<HTMLDivElement>()
let listElOffset: { x: number, y: number }
let outerElSize: { height: number, width: number } = { height: 0, width: 0 }
let gridSize: Ref<{ rows: number, cols: number }> = ref({ rows: 0, cols: 0 })

useResizeObserver(imageListEl, () => {
  _initGrid()
  _updateDisplacement(true)
})

const maxGridRow = computed(() => Math.floor((imageList.value.length - 0.5) / gridSize.value.cols))

function _initGrid() {
  const { x, y, width, height } = imageListEl.value?.getBoundingClientRect()!
  listElOffset = { x, y }
  outerElSize.height = imageOuterEl.value!.offsetWidth
  outerElSize.width = imageOuterEl.value!.offsetHeight
  gridSize.value = {
    cols: Math.floor(width / outerElSize.width),
    rows: Math.floor(height / outerElSize.height)
  }
}

onMounted(() => {
  // _initGrid()
  document.addEventListener('mousemove', draging)
  document.addEventListener('mouseleave', dragend)
  document.addEventListener('mouseup', dragend)
})

const addBtnStyle = ref<CSSProperties>({})

function _updateAddPosition() {
  const [x, y] = _getDisplacementByOrder(imageList.value.length)
  addBtnStyle.value = { transform: `translate(${x}px,${y}px)` }
}


/** touchscreen device */
const isTouchDevice: boolean = 'ontouchstart' in window
let touchStartTranslate: [number, number] = [0, 0]
let activeTouch: Ref<Touch | null> = ref(null)

if (isTouchDevice) {
  document.addEventListener('touchmove', touchMove)
  document.addEventListener('touchend', touchEnd)
  document.addEventListener('touchcancel', touchEnd)
}

function touchStart(e: TouchEvent, image: ImageOuter) {
  activeTouch.value = e.touches[0]
  dragStart(e.touches[0], image)
  touchStartTranslate = [image.translateX, image.translateY]
}

function touchMove(e: TouchEvent) {
  if (!isDraging.value) return
  const touch = e.touches[0]
  activeTouch.value = touch
  draggingImage.translateX = touchStartTranslate[0] + touch.clientX - dragginStartPoint[0]
  draggingImage.translateY = touchStartTranslate[1] + touch.clientY - dragginStartPoint[1]
  _updateImageOrder(touch)
}

const moveOnDelete: ComputedRef<boolean> =
  computed(() => document.documentElement.clientHeight - activeTouch.value!.clientY < 60)

function touchEnd() {
  if (!isDraging.value) return
  if (moveOnDelete.value) removeImage()
  activeTouch.value = null
  dragend()
}


</script>
<style>
.app-name {
  font-weight: bold;
}
</style>
<style scoped>
.body.image-manager {
  min-height: 100%;
  padding: 0 20px;
}

#selector {
  display: none;
}

.manager__foot {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

.clear-all {
  cursor: pointer;
}


.image-manager .image-list {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  min-height: min(100vw, 600px);
  align-content: flex-start;
  position: relative;
}

.image-manager .image-outer {
  height: 200px;
  width: 200px;
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
  padding: 10px;
  box-sizing: border-box;
  transition: 200ms ease-out;
}

.image-manager .image-list img {
  height: 100%;
  width: 100%;
  display: block;
  object-fit: cover;
  object-position: center center;
}

.image-manager .image-add {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;
  background-color: #f7f7f7;
}

.image-manager .image-add--disabled {
  cursor: not-allowed;
  background-color: #aaa;
  color: #aaa;
}

.image-manager .image-add--disabled .image-add-icon {
  fill: #707070;
}

.image-manager .image-outer:active {
  cursor: grab;
}

.image-manager .image-outer .image-badge {
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


@media screen and (max-width: 600px) {
  .image-manager .image-delete {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
    border-radius: 0;
  }

  .image-manager .image-outer {
    width: calc((100vw - 43px) / 3);
    height: calc((100vw - 43px) / 3);
  }
}

.image-add-icon {
  height: 5rem;
  width: 5rem;
  fill: rgba(100, 100, 100, 0.5)
}
</style>
<style>
.image-delete {
  align-items: center;
  background: rgb(213, 21, 4);
  border-radius: 0;
  bottom: 0;
  box-sizing: border-box;
  color: #fff;
  display: flex;
  height: 60px;
  justify-content: center;
  left: 0;
  margin: 0 auto;
  padding: 0 32px;
  position: fixed;
  right: 0;
  transition: 200ms ease-in;
  width: 100%;
  z-index: 999;
}

.image-delete:hover {
  opacity: 0.8;
}
</style>