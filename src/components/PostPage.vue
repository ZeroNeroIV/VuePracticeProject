<template>
  <div class="dark-theme">
    <div class="container">
      <div class="row">
        <div class="col">
          <div class="card mt-4 mb-4">
            <div class="card-body" v-if="postData">
              <h2 class="card-title">{{ postData.data.title }}</h2>
              <div class="meta-info">
                <div class="avatar-container">
                  <img :src="postData.data.thumbnail" alt="Post Thumbnail" class="thumbnail" />
                </div>
                <h3 class="card-subtitle">{{ subtitle }}</h3>
              </div>
              <img :src="postData.data.url" alt="Post Image" class="main-image mb-4" />
              <p class="card-text">{{ postData.data.selftext }}</p>
              <div class="button-container">
                <button class="btn btn-primary" @click="goBack">
                  <span class="btn-text">← Go Back</span>
                </button>
                <button class="btn btn-secondary" @click="goToReddit">
                  <span class="btn-text">View on Reddit</span>
                </button>
              </div>
            </div>
            <div class="card-body" v-else>
              <p>Loading post data...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
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
const error = ref<string | null>(null)
const subtitle = computed(() => {
  return postData.value ? `${postData.value.data.author} - ${new Date(postData.value.data.created_utc * 1000).toLocaleDateString()}` : ''
})

const fetchPostData = async () => {
  try {
    const temp = await redditStore.getRedditPostDataById(postId)
    if (temp) {
      postData.value = temp
      title.value = temp.data.title || 'Post Details'
    } else {
      error.value = 'Post not found'
      console.error('Post not found')
    }
  } catch (err) {
    error.value = 'An error occurred while fetching post data'
    console.error('Error fetching post data:', err)
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

onMounted(() => {
  fetchPostData()
})
</script>

<style scoped>
.dark-theme {
  background-color: #1a1a1a;
  color: #ffffff;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.card {
  border: 1px solid #333;
  border-radius: 12px;
  background-color: #2d2d2d;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.card-body {
  padding: 25px;
}

.card-title {
  font-size: 28px;
  margin-bottom: 15px;
  color: #ffffff;
  font-weight: 600;
}

.meta-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.card-subtitle {
  font-size: 16px;
  color: #a0a0a0;
  margin: 0;
}

.thumbnail {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 15px;
  border: 2px solid #404040;
}

.main-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 20px;
}

.card-text {
  color: #e0e0e0;
  line-height: 1.6;
  font-size: 16px;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 25px;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #2196f3;
  color: white;
}

.btn-secondary {
  background-color: #424242;
  color: white;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.btn-text {
  font-size: 15px;
}
</style>
