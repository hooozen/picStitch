<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import './index.css'


window.addEventListener('beforeunload', e => {
  e.preventDefault()
  e.returnValue = ''
})

document.querySelectorAll('.modal-mask').forEach(el => {
  el.addEventListener(('touchstart'), e => e.preventDefault())
  el.addEventListener(('touchmove'), e => e.preventDefault())
  el.addEventListener(('touchend'), e => e.preventDefault())
})

</script>

<style>
.slider-item {
  flex: 1;
  height: 100%;
  overflow: hidden auto;
}
</style>
