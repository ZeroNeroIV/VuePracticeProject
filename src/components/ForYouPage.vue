<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { title } from '@/App.vue'

const ForYouPage = defineComponent({
  name: 'ForYouPage',
  setup() {
    title.value = 'For You'
    return {}
  },
})

export default ForYouPage
</script>
