<template>
  <transition @before-leave="$emit('close')" @after-leave="$emit('destroy')">
    <div v-show="visible" class="modal-mask">
      <div class="ps-loading" ref="messageRef">
        <svg class="circular" viewBox="0 0 50 50">
          <circle class="path" cx="25" cy="25" r="20" fill="none"></circle>
        </svg>
        <div class="loading-text">{{ text }}</div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { toRefs, ref, onMounted } from "vue";
const props = defineProps<{ text: string }>()

const { text } = toRefs(props)
const visible = ref<boolean>(false)

onMounted(() => {
  visible.value = true
})

defineExpose({ visible })

</script>
<style>
.ps-loading {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-text {
  color: #fff;
  padding: 0 8px;
}

.ps-loading .circular {
  height: 1.5rem;
  width: 1.5rem;
  animation: loading-rotate 2s linear infinite
}

.ps-loading .circular .path {
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-width: 2;
  stroke: var(--active-color);
  stroke-linecap: round;
}

@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40px;
  }

  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120px;
  }
}

@keyframes loading-rotate {
  100% {
    transform: rotate(360deg)
  }
}
</style>
