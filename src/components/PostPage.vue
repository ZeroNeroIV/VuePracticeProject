<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <v-card :title="postData?.data.title" :subtitle="subtitle" :text="postData?.data.selftext" variant="tonal"
            class="mb-4 mt-4">
            <v-avatar size="24" class="mr-2">
              <img :src="postData?.data.thumbnail" alt="Post Thumbnail" />
            </v-avatar>
            <v-img :src="postData?.data.url" class="mb-4"></v-img>
            <v-row class="justify-center">
              <v-btn color="primary" @click="goBack">Go Back</v-btn>
              <v-btn color="secondary" @click="goToReddit">View on Reddit</v-btn>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { title } from '@/main.ts'
import { useRedditStore, type RedditPost } from '@/stores/reddit'
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const redditStore = useRedditStore()

const postId = router.currentRoute.value.params.id as string
const postData = ref<RedditPost | null>(null)
const subtitle = computed(() => {
  return postData.value ? `${postData.value.data.author} - ${postData.value.data.created_utc}` : ''
})

title.value = 'Post Details'

const fetchPostData = async () => {
  const temp = await redditStore.getRedditPostDataById(postId)
  if (temp) {
    postData.value = temp
  } else {
    console.error('Post not found')
  }
}

const goBack = () => {
  router.back()
}

const goToReddit = () => {
  if (postData.value) {
    window.open(`https://www.reddit.com${postData.value.data.permalink}`, '_blank')
  }
}

onMounted(async () => {
  await fetchPostData()
  title.value = postData.value?.data.title || 'Post Details'
})
</script>
