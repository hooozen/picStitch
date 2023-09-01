<template>
  <div class="image-work">
    <viewer @edit="edit" :image-clip-views="imageClipViews" ref="viewer"></viewer>
  </div>
  <editor v-if="isShowEditor" :image-clip-views="stitchImageViews" @cancel="isShowEditor = false" @confirm="confirmEdit">
  </editor>
</template>
<script setup lang="ts">
import ImageClipView from './class/base/ImageClipView';
import ImageViewManager from './class/base/ImageClipViewManager';
import Viewer from './class/vue/Viewer.vue';
import Editor from './class/vue/Editor.vue';
import './index.css'
import { nextTick, ref, toRefs } from 'vue';
import type { Ref } from 'vue'

const props = defineProps<{ imageClipViews: ImageClipView[] }>()
const { imageClipViews } = toRefs(props)

const imageManager: ImageViewManager = ImageViewManager.getInstance()
const isShowEditor: Ref<boolean> = ref(false)

const stitchImageViews = ref<[ImageClipView, ImageClipView] | []>([])

function edit(ids: [number, number]) {
  isShowEditor.value = true
  console.log(ids,)
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
  viewer.value.save()
}

defineExpose({
  save
})
</script>