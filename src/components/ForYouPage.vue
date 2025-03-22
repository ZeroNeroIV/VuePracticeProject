<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card v-for="(post, index) in redditStore.posts" :key="index" class="mb-4">
          <v-card-title>
            {{ post.data.title }}
          </v-card-title>
          <v-card-subtitle>
            <v-avatar size="24" class="mr-2">
              <img :src="post.data.thumbnail" alt="Post Thumbnail" />
            </v-avatar>
            {{ post.data.author }} - {{ post.data.created_utc }}
          </v-card-subtitle>
          <v-card-text>
            <v-img :src="post.data.url" aspect-ratio="16/9" class="mb-4"></v-img>
            {{ post.data.selftext }}
            <v-btn color="primary" @click="goToPost(index)">Load More</v-btn>
          </v-card-text>
          <v-row>

          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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

onMounted(() => {
  redditStore.getRedditPosts()
})

</script>
