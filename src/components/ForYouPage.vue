<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <div v-for="(post, index) in redditStore.posts" :key="index" class="card mb-4">
          <div class="card-header">
            <h2 class="card-title text-truncate">{{ post.data.title }}</h2>
            <div class="author-info">
              <div class="avatar">
                <img
                  :src="post.data.thumbnail"
                  alt="Post Thumbnail"
                  width="32"
                  height="32"
                  @error="handleImageError"
                  v-if="post.data.thumbnail && post.data.thumbnail !== 'self' && post.data.thumbnail !== 'default'"
                />
                <div v-else class="avatar-placeholder">
                  <i class="fas fa-user"></i>
                </div>
              </div>
              <span class="author-text text-truncate">{{ post.data.author }} • {{ post.data.created_utc }}</span>
            </div>
          </div>
          <div class="card-body">
            <img
              v-if="post.data.url && isImageUrl(post.data.url)"
              :src="post.data.url"
              alt="Post Image"
              class="post-image"
              @error="handleImageError"
            />
            <p class="post-text line-clamp">{{ post.data.selftext }}</p>
            <button class="btn-primary" @click="goToPost(index)">
              <span>Read More</span>
              <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { title } from '@/main.ts'
import router from '@/config/router-setup';
import { useRedditStore } from '@/stores/reddit';
import { onMounted } from 'vue';

title.value = 'For You'

const redditStore = useRedditStore()

const goToPost = (index: number) => {
  router.push('/post/' + redditStore.posts[index].data.id)
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.style.display = 'none';
}

const isImageUrl = (url: string): boolean => {
  return url.match(/\.(jpeg|jpg|gif|png)$/) !== null;
}

onMounted(() => {
  redditStore.getRedditPosts()
})
</script>

<style scoped>
.container {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #1a1a1a;
  min-height: 100vh;
}

.card {
  border: 1px solid #333;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  background-color: #242424;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
}

.card-header {
  padding: 1.25rem;
  border-bottom: 1px solid #333;
  background-color: #2a2a2a;
  border-radius: 12px 12px 0 0;
}

.card-title {
  margin: 0;
  font-size: 1.75rem;
  color: #e0e0e0;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
}

.text-truncate {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.author-info {
  display: flex;
  align-items: center;
  margin-top: 0.75rem;
}

.avatar {
  margin-right: 0.75rem;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.avatar img {
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #444;
}

.avatar-placeholder {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #444;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
}

.author-text {
  color: #888;
  font-size: 0.9rem;
  max-width: calc(100% - 48px);
}

.card-body {
  padding: 1.25rem;
}

.post-image {
  width: 100%;
  height: auto;
  aspect-ratio: 16/9;
  object-fit: cover;
  margin-bottom: 1.25rem;
  border-radius: 8px;
  border: 1px solid #333;
}

.post-text {
  margin-bottom: 1.25rem;
  line-height: 1.6;
  color: #d0d0d0;
  font-size: 1.1rem;
}

.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.btn-primary {
  background-color: #7289da;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary:hover {
  background-color: #5b73c7;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(114, 137, 218, 0.3);
}

.btn-primary i {
  font-size: 0.9rem;
}
</style>
