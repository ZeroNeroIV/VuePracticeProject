<template>
  <div class="container">
    <div class="search-container">
      <div class="search-wrapper">
        <input
          type="text"
          v-model="redditStore.subreddit"
          @input="handleSubredditChange"
          placeholder="Enter subreddit name..."
          class="search-input"
        />
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div v-for="(post, index) in uniquePosts" :key="post.data.id" class="card mb-4">
          <div class="card-header">
            <h2 class="card-title" v-html="truncateText(formatMarkdown(post.data.title), 100)"></h2>
            <div class="author-info">
              <div class="avatar">
                <div class="avatar-placeholder">
                  <i class="fas fa-user"></i>
                </div>
              </div>
              <span class="author-text">{{ truncateText(post.data.author, 20) }} • {{ formatDate(post.data.created_utc) }}</span>
            </div>
          </div>
          <div class="card-body">
            <p class="post-text line-clamp" v-html="truncateText(formatMarkdown(post.data.selftext), 300)"></p>
            <button class="btn-primary" @click="goToPost(index)">
              <span>Read More</span>
              <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
        <div v-if="loading" class="loading-indicator">
          Loading more posts...
        </div>
        <div ref="loadingTrigger" class="loading-trigger"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { title } from '@/main.ts'
import router from '@/config/router-setup';
import { useRedditStore, type RedditPost } from '@/stores/reddit';
import { onMounted, ref, reactive, watch, computed } from 'vue';
import {marked} from 'marked';
import DOMPurify from 'dompurify';

title.value = 'For You'

const redditStore = useRedditStore()
const posts = reactive<RedditPost[]>([])
const loading = ref(false)
const loadingTrigger = ref<HTMLElement | null>(null)
const page = ref(1)

// Compute unique posts based on post ID
const uniquePosts = computed(() => {
  const seen = new Set();
  return posts.filter(post => {
    const duplicate = seen.has(post.data.id);
    seen.add(post.data.id);
    return !duplicate;
  });
});

const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

const handleSubredditChange = async () => {
  // Clear current posts before fetching new ones
  redditStore.posts.length = 0;
  posts.length = 0;
  page.value = 1;
  await redditStore.getRedditPosts(redditStore.subreddit.replace(' ', ''))
  posts.push(...redditStore.posts);
}

const loadMorePosts = async () => {
  if (loading.value) return;

  loading.value = true;
  page.value++;

  try {
    await redditStore.getRedditPosts(redditStore.subreddit, page.value);
    const newPosts = redditStore.posts.filter(newPost =>
      !posts.some(existingPost => existingPost.data.id === newPost.data.id)
    );
    posts.push(...newPosts);
  } catch (error) {
    console.error('Error loading more posts:', error);
  } finally {
    loading.value = false;
  }
}

const formatMarkdown = (text: string): string => {
  if (!text) return '';
  const rawHtml = marked.parse(text);
  return DOMPurify.sanitize(rawHtml.toString());
}

const goToPost = (index: number) => {
  router.push('/post/' + uniquePosts.value[index].data.id)
}

const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString();
}

onMounted(() => {
  redditStore.getRedditPosts();

  // Set up Intersection Observer for infinite scrolling
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        loadMorePosts();
      }
    },
    { threshold: 0.1 }
  );

  if (loadingTrigger.value) {
    observer.observe(loadingTrigger.value);
  }
})

// Watch for changes in posts to refresh content
watch(() => redditStore.posts, () => {
  // Content will automatically refresh due to Vue's reactivity
}, { deep: true })
</script>

<style scoped>
.container {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #1a1a1a;
  min-height: 100vh;
}

.search-container {
  margin-bottom: 2rem;
}

.search-wrapper {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #333;
  border-radius: 8px;
  background-color: #2a2a2a;
  color: #e0e0e0;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #7289da;
  box-shadow: 0 0 0 2px rgba(114, 137, 218, 0.3);
}

.search-input::placeholder {
  color: #666;
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

.loading-indicator {
  text-align: center;
  padding: 1rem;
  color: #888;
}

.loading-trigger {
  height: 20px;
  margin-bottom: 20px;
}

/* Additional styles for markdown content */
:deep(.post-text) {
  h1, h2, h3, h4, h5, h6 {
    color: #e0e0e0;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }

  p {
    margin-bottom: 1rem;
  }

  a {
    color: #7289da;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  code {
    background-color: #333;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: monospace;
  }

  pre {
    background-color: #333;
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
  }

  blockquote {
    border-left: 4px solid #7289da;
    padding-left: 1rem;
    margin-left: 0;
    color: #888;
  }

  ul, ol {
    padding-left: 2rem;
    margin-bottom: 1rem;
  }
}
</style>
