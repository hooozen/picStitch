<template>
  <div class="global-tip">
    <svg t="1693368471053" class="text-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
      p-id="34936" width="200" height="200">
      <path
        d="M512 298.666667a213.333333 213.333333 0 0 0-128 384v170.666666a85.333333 85.333333 0 0 0 85.333333 85.333334h85.333334a85.333333 85.333333 0 0 0 85.333333-85.333334v-170.666666a213.333333 213.333333 0 0 0-128-384zM512 256a42.666667 42.666667 0 0 0 42.666667-42.666667V128a42.666667 42.666667 0 0 0-85.333334 0v85.333333a42.666667 42.666667 0 0 0 42.666667 42.666667zM896 469.333333h-85.333333a42.666667 42.666667 0 0 0 0 85.333334h85.333333a42.666667 42.666667 0 0 0 0-85.333334zM213.333333 469.333333H128a42.666667 42.666667 0 0 0 0 85.333334h85.333333a42.666667 42.666667 0 0 0 0-85.333334zM326.826667 273.92L265.386667 213.333333a42.666667 42.666667 0 0 0-59.306667 62.72l61.44 59.306667a42.666667 42.666667 0 0 0 31.146667 11.946667 42.666667 42.666667 0 0 0 30.72-13.226667 42.666667 42.666667 0 0 0-2.56-60.16zM818.773333 215.466667a42.666667 42.666667 0 0 0-60.16 0l-61.44 58.453333a42.666667 42.666667 0 0 0 0 60.16 42.666667 42.666667 0 0 0 30.72 13.226667 42.666667 42.666667 0 0 0 29.44-11.946667l61.44-59.306667a42.666667 42.666667 0 0 0 0-60.586666z"
        p-id="34937"></path>
    </svg> {{ tip }}
  </div>
</template>
<script setup lang="ts">
import { toRefs } from 'vue';
const props = defineProps<{ tip: string }>()
const { tip } = toRefs(props)
</script>
<style>
.global-tip {
  display: flex;
  position: fixed;
  justify-content: center;
  align-items: center;
  margin: auto;
  animation: slideDown 300ms ease-out both;
  background-color: #fdf6ec;
  border: 1px solid #faecd8;
  color: #e6a23c;
  left: 50%;
  transform: translate(-50%);
  padding: 8px 16px;
}

.global-tip .text-icon {
  font-size: 1em;
  fill: #ff9600;
  margin-right: 8px;
}


@keyframes slideDown {
  from {
    top: 20px
  }

  to {
    top: 0
  }
}
</style>