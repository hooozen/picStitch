<template>
  <Teleport to="body">
    <div class="modal-outer">
      <div class="modal-main stitch-modal">
        <div class="modal__head">
          <div class="modal-tip">
            <svg t="1693368471053" class="text-icon" viewBox="0 0 1024 1024" version="1.1"
              xmlns="http://www.w3.org/2000/svg" p-id="34936" width="200" height="200">
              <path
                d="M512 298.666667a213.333333 213.333333 0 0 0-128 384v170.666666a85.333333 85.333333 0 0 0 85.333333 85.333334h85.333334a85.333333 85.333333 0 0 0 85.333333-85.333334v-170.666666a213.333333 213.333333 0 0 0-128-384zM512 256a42.666667 42.666667 0 0 0 42.666667-42.666667V128a42.666667 42.666667 0 0 0-85.333334 0v85.333333a42.666667 42.666667 0 0 0 42.666667 42.666667zM896 469.333333h-85.333333a42.666667 42.666667 0 0 0 0 85.333334h85.333333a42.666667 42.666667 0 0 0 0-85.333334zM213.333333 469.333333H128a42.666667 42.666667 0 0 0 0 85.333334h85.333333a42.666667 42.666667 0 0 0 0-85.333334zM326.826667 273.92L265.386667 213.333333a42.666667 42.666667 0 0 0-59.306667 62.72l61.44 59.306667a42.666667 42.666667 0 0 0 31.146667 11.946667 42.666667 42.666667 0 0 0 30.72-13.226667 42.666667 42.666667 0 0 0-2.56-60.16zM818.773333 215.466667a42.666667 42.666667 0 0 0-60.16 0l-61.44 58.453333a42.666667 42.666667 0 0 0 0 60.16 42.666667 42.666667 0 0 0 30.72 13.226667 42.666667 42.666667 0 0 0 29.44-11.946667l61.44-59.306667a42.666667 42.666667 0 0 0 0-60.586666z"
                p-id="34937"></path>
            </svg>
            拖拽来调整两张图片的接缝处
          </div>
        </div>
        <div class="modal__body">
          <canvas id="stitchCanvas" width="600" ref="canvasEl" @mousedown="mouseDownHandler"
            @mouseleave="mouseDown = false" @mouseup="mouseDown = false" @mousemove="mouseMoveHandler"></canvas>
        </div>
        <div class="modal__foot">
          <div class="btn-wraps">
            <input class="btn" type="button" value="取消" @click="$emit('cancel')" />
            <input class="btn" type="button" value="确定" @click="confirm" />
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