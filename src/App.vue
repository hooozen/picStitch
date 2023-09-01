<template>
  <div class="head">
    <div class="app-name">picStitch<span class="app-desc">长图拼接工具</span></div>
    <div class="head__btns">
      <template v-if="workStatus">
        <div class="btn btn-normal" @click="workStatus = false">返回</div>
        <div class="btn" @click="save">
          <svg t="1693095206139" class="text-icon" viewBox="0 0 1024 1024" version="1.1"
            xmlns="http://www.w3.org/2000/svg" p-id="17224" width="200" height="200">
            <path
              d="M166.016 64A102.4 102.4 0 0 0 64 166.016v627.968A102.4 102.4 0 0 0 166.016 896h627.968A102.4 102.4 0 0 0 896 793.984V258.752L701.248 64z m0 64H192v192c0 35.008 28.992 64 64 64h384c35.008 0 64-28.992 64-64V157.248l128 128v508.8a37.504 37.504 0 0 1-38.016 37.952H704v-192c0-35.008-28.992-64-64-64H320c-35.008 0-64 28.992-64 64v192H166.016A37.504 37.504 0 0 1 128 793.984V166.016C128 144.512 144.512 128 166.016 128zM256 128h192v128h128V128h64v192H256z m64 512h320v192H320z"
              fill="" p-id="17225"></path>
          </svg>
          保存
        </div>
      </template>
    </div>
  </div>
  <div class="body" :style="bodyStyle">
    <div class="slider-item manager">
      <image-manger @update-images="updateImages" style="overflow: hidden;"></image-manger>
    </div>
    <div class="slider-item work">
      <image-work :image-clip-views="imageClipViews" ref="workRef"></image-work>
    </div>
  </div>
</template>

<script setup lang="ts">
import './index.css'
import { CSSProperties, computed, ref, Ref, shallowRef } from 'vue';
import ImageManger from './Manager.vue'
import ImageWork from './Work.vue'
import ImageClipView from './class/base/ImageClipView';

const workStatus = ref<boolean>(false)

const bodyStyle = computed<CSSProperties>(() => {
  if (workStatus.value)
    return { transform: 'translateX(-50%)' }
  return { transform: 'translateX(0)' }
})

const imageClipViews: Ref<ImageClipView[]> = shallowRef<ImageClipView[]>([])

function updateImages(images: ImageClipView[]) {
  imageClipViews.value = images
  workStatus.value = true
}

const workRef = ref()

function save() {
  workRef.value.save()
}

</script>

<style>
.head {
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #bfbfbf;
  background: #f7f7f7;
  box-sizing: border-box;
  justify-content: space-between;
  height: 60px;
}

.head__btns {
  display: flex;
}

.app-name {
  font-size: 1.75rem;
  font-weight: bold;
  display: flex;
  flex-direction: column;
}

.app-desc {
  font-size: 0.75rem;
  font-weight: normal;
  margin-left: 0.25em;
}

.body {
  width: 200%;
  display: flex;
  transition: transform 300ms ease-in;
  transform: translateX(0);
  align-items: flex-start;
  height: calc(100% - 60px);
}

.slider-item {
  flex: 1;
  height: 100%;
  overflow: hidden auto;
}
</style>
