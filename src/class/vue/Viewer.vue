<template>
  <div class="viewer-canvas-outer">
    <div v-for="(item, i) in imageSeparators" :key="i" class="image-sep" :style="{ top: `${item.offsetY}px` }"
      @click="edit(item.ids)">
    </div>
    <canvas class="viewer-canvas" width="600" ref="canvasEl">
    </canvas>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, toRefs, watchEffect } from 'vue'
import type { Ref } from 'vue'
import FlexCanvas from '../base/FlexCanvas';
import ImageClipView from '../base/ImageClipView';
type ImageSeparator = { ids: [number, number], offsetY: number }

const emits = defineEmits(['edit'])
const props = defineProps<{ imageClipViews: ImageClipView[] }>()

const { imageClipViews } = toRefs(props)
const canvasEl = ref() as Ref<HTMLCanvasElement>
const canvas = new FlexCanvas()

const imageSeparators: Ref<ImageSeparator[]> = ref([])

onMounted(() => {
  canvas.init(canvasEl.value)
})

watchEffect(() => {
  if (imageClipViews.value.length < 1) return
  canvas.setCanvasViewsFromClipView(imageClipViews.value)
  canvas.draw()
  setImageSeparators()
})

function setImageSeparators() {
  const seps: ImageSeparator[] = []
  canvas.imageViews.reduce((pre, curt) => {
    seps.push({
      offsetY: curt.offsetY / canvas.scaleRatio,
      ids: [pre.clipView.id, curt.clipView.id]
    });
    return curt;
  });
  imageSeparators.value = seps
}

function edit(ids: [number, number]) {
  emits('edit', ids)
}

function update() {
  canvas.draw()
  setImageSeparators()
}

function save() {
  canvas.save()
}

defineExpose({ update, save })

</script>

<style>
.viewer-canvas-outer {
  margin: 20px auto;
  width: 600px;
  position: relative;
}

.viewer-canvas {
  width: 100%;
}

.image-sep {
  height: 0;
  cursor: pointer;
  position: absolute;
  left: 0;
  right: 0;
}

.image-sep::before {
  position: absolute;
  display: block;
  width: 100%;
  top: 50%;
  margin-top: -1px;
  left: 0;
  height: 2px;
  content: '';
  background-color: var(--active-color);
  opacity: 0.8;
}

.image-sep::after {
  position: absolute;
  display: block;
  height: 20px;
  width: 40px;
  content: '';
  border-radius: 6px;
  background: url("data:image/svg+xml;charset=utf-8,%3Csvg t='1693367128540' class='icon' viewBox='0 0 1025 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='9801' width='200' height='200'%3E%3Cpath d='M984.379175 219.266512l-95.091514 95.091514-183.413584-177.79367 97.901471-97.901471a127.70405 127.70405 0 1 1 180.603627 180.603627z m-150.779761 150.715898L248.936682 954.645142 0 1024l68.269193-249.894622L650.760594 191.613977l182.83882 178.368433z' fill='white' p-id='9802'%3E%3C/path%3E%3C/svg%3E") center center / 12px 12px no-repeat;
  background-color: var(--active-color);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  animation: 500ms ease-out infinite alternate blink;
}

@keyframes blink {
  from {
    scale: 90%;
  }

  to {
    scale: 110%;
  }
}
</style>