<template>
  <div class="dark-theme">
    <div class="container">
      <div class="row">
        <div class="col p-3">
          <div class="card mt-4 mb-4">
            <div class="card-body p-4" v-if="postData">
              <h2 class="card-title mb-3 p-2" v-html="markdownTitle"></h2>
              <div class="meta-info mb-4 p-2">
                <h3 class="card-subtitle">{{ subtitle }}</h3>
              </div>
              <div class="card-text markdown-content mb-4 p-5" v-html="markdownContent"></div>
              <div class="button-container p-2">
                <button class="btn btn-primary me-3" @click="goBack">
                  <span class="btn-text">← Go Back</span>
                </button>
                <button class="btn btn-secondary" @click="goToReddit">
                  <span class="btn-text">View on Reddit</span>
                </button>
              </div>
            </div>
            <div class="card-body p-4" v-else>
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
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const router = useRouter()
const redditStore = useRedditStore()

const postId = router.currentRoute.value.params.id as string
const postData = ref<RedditPost | null>(null)
const error = ref<string | null>(null)

const markdownTitle = computed(() => {
  if (!postData.value) return '';
  return DOMPurify.sanitize(marked.parse(postData.value.data.title).toString());
})

const markdownContent = computed(() => {
  if (!postData.value) return '';
  return DOMPurify.sanitize(marked.parse(postData.value.data.selftext).toString());
})

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
    window.open(`https://www.reddit.com/r/${postData.value.data.subreddit}/comments/${postData.value.data.id}`, '_blank')
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
  margin: 0;
  padding: 20px 0;
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
  margin: 20px 0;
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

.markdown-content {
  color: #e0e0e0;
  line-height: 1.6;
  font-size: 16px;
  margin: 20px 0;
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  color: #ffffff;
  margin: 1.2em 0 0.8em;
}

.markdown-content :deep(p) {
  margin: 1em 0;
}

.markdown-content :deep(a) {
  color: #2196f3;
  text-decoration: none;
  margin: 0.5em 0;
}

.markdown-content :deep(a:hover) {
  text-decoration: underline;
}

.markdown-content :deep(code) {
  background-color: #363636;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: monospace;
  margin: 0 0.2em;
}

.markdown-content :deep(pre) {
  background-color: #363636;
  padding: 1em;
  border-radius: 6px;
  overflow-x: auto;
  margin: 1.5em 0;
}

.markdown-content :deep(blockquote) {
  border-left: 4px solid #4a4a4a;
  margin: 1.5em 0;
  padding: 0.5em 0 0.5em 1em;
  color: #b0b0b0;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
  margin-bottom: 15px;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  font-weight: 500;
  transition: all 0.3s ease;
  margin: 0 5px;
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
