<template>
  <Teleport to="body">
    <div class="modal-mask">
      <div class="modal-main stitch-modal">
        <div class="modal__head">
          <div class="modal-tip">
            拖拽来调整两张图片的接缝处
          </div>
        </div>
        <div class="modal__body">
          <canvas id="stitchCanvas" width="600" ref="canvasEl" @mousedown="mouseDownHandler" @mousemove="mouseMoveHandler"
            @mouseleave="mouseDown = false" @mouseup="mouseDown = false" @touchstart.prevent="touchStartHandler"
            @touchmove.prevent="touchMoveHandler" @touchend.prevent="mouseDown = false"
            @touchcancel.prevent="mouseDown = false">
          </canvas>
        </div>
        <div class="modal__foot">
          <div class="btn-wraps">
            <div class="btn" @click="$emit('cancel')">取消</div>
            <div class="btn" @click="confirm">确定</div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
import { ref, onMounted, toRefs, watchEffect } from 'vue'
import type { Ref } from 'vue'
import JointCanvas from '../base/JointCanvas';
import ImageClipView from '../base/ImageClipView';

const props = defineProps<{ imageClipViews: [ImageClipView, ImageClipView] | [] }>()
const emits = defineEmits(['confirm', 'cancel'])

const { imageClipViews } = toRefs(props)
const canvasEl = ref() as Ref<HTMLCanvasElement>
const canvas = new JointCanvas()

onMounted(() => {
  canvas.init(canvasEl.value)
})

watchEffect(() => {
  if (imageClipViews.value.length < 1) return
  canvas.setCanvasViewsFromClipView(imageClipViews.value)
  canvas.draw()
})

let mouseDown = false
let mouseStartY = 0

function mouseDownHandler(e: MouseEvent) {
  mouseDown = true
  mouseStartY = e.offsetY
}

function mouseMoveHandler(e: MouseEvent) {
  if (!mouseDown) return
  if (e.movementY === 0) return
  canvas.dragImage(mouseStartY, e.movementY);
}

function confirm() {
  console.log(imageClipViews.value)
  imageClipViews.value.forEach(view => view.applyToParent())
  emits('confirm')
}

let touchStartClientY = 0
let lastTouchClientY = 0

function touchStartHandler(e: TouchEvent) {
  mouseDown = true
  const target = e.target as HTMLCanvasElement
  touchStartClientY = e.touches[0].clientY
  mouseStartY = touchStartClientY - target.getBoundingClientRect().y
  lastTouchClientY = touchStartClientY
}

function touchMoveHandler(e: TouchEvent) {
  if (!mouseDown) return
  const touch = e.touches[0]
  const movementY = touch.clientY - lastTouchClientY
  lastTouchClientY = touch.clientY
  if (movementY === 0) return
  canvas.dragImage(mouseStartY, movementY);
}

</script>
<style scoped>
#stitchCanvas {
  width: 100%;
  height: 100%;
}

#stitchCanvas:hover {
  cursor: pointer;
}

#stitchCanvas:active {
  cursor: grab;
}
</style>