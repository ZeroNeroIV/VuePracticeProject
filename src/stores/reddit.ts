import axios from 'axios';
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

// Default fallback image URL for missing media
export const FALLBACK_IMAGE_URL = 'https://www.reddit.com/static/noimage.jpg';

export interface RedditPostData {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  url: string;
  thumbnail: string | undefined;
  created_utc: number;
  num_comments: number;
  score: number;
  selftext: string;
  preview?: {
    images: Array<{
      source: {
        url: string;
        width: number;
        height: number;
      };
      resolutions: Array<{
        url: string;
        width: number;
        height: number;
      }>;
    }>;
  } | null;
}

export interface RedditPost {
  kind: string;
  data: RedditPostData;
}

export interface RedditApiResponse {
  kind: string;
  data: {
    after: string | null;
    children: RedditPost[];
  };
}

export const useRedditStore = defineStore('reddit', () => {
  const posts = reactive<RedditPost[]>([]);
  const after = ref<string | null>(null);
  const error = ref<string | null>(null);
  const subreddit = ref<string>('VueJS');
  const isLoading = ref<boolean>(false);


  const processPostImages = (post: RedditPost): RedditPost => {
    console.log('Processing post images for post:', post.data.id);
    const processedPost = { ...post };
    try {
      // Process preview images
      if (processedPost.data.preview?.images) {
        console.log('Processing preview images');
        processedPost.data.preview.images = processedPost.data.preview.images.map(image => ({
          ...image,
          source: {
            ...image.source,
            url: image.source.url
          },
          resolutions: image.resolutions.map(resolution => ({
            ...resolution,
            url: resolution.url
          }))
        }));
      } else {
        processedPost.data.preview = null;
      }

      // Process thumbnail
      if (!processedPost.data.thumbnail ||
          ['self', 'default', 'nsfw', 'spoiler'].includes(processedPost.data.thumbnail)) {
        processedPost.data.thumbnail = FALLBACK_IMAGE_URL;
      } else {
        console.log('Processing thumbnail');
        processedPost.data.thumbnail = processedPost.data.thumbnail;
      }

      // Process main URL if it's an image
      if (!processedPost.data.url) {
        processedPost.data.url = FALLBACK_IMAGE_URL;
      } else if (processedPost.data.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ||
          processedPost.data.url.includes('i.redd.it') ||
          processedPost.data.url.includes('preview.redd.it')) {
        console.log('Processing main URL');
        processedPost.data.url = processedPost.data.url;
      }

      console.log('Finished processing post images');
      return processedPost;
    } catch (e) {
      console.error('Error processing post images:', e);
      return {
        ...post,
        data: {
          ...post.data,
          thumbnail: FALLBACK_IMAGE_URL,
          url: post.data.url || FALLBACK_IMAGE_URL,
          preview: null
        }
      };
    }
  };

  const getRedditPosts = async (querySubreddit: string | null = subreddit.value, page: number = 1): Promise<void> => {
    console.log('Fetching Reddit posts for subreddit:', querySubreddit);
    isLoading.value = true;
    error.value = null;

    if (querySubreddit !== subreddit.value) {
      after.value = null;
    }

    if (querySubreddit)
      subreddit.value = querySubreddit;

    const url = after.value
      ? `https://www.reddit.com/r/${querySubreddit}/new.json?limit=5&after=${after.value}`
      : `https://www.reddit.com/r/${querySubreddit}/new.json?limit=5`;

    console.log('Requesting URL:', url);

    try {
      const response = await axios.get<RedditApiResponse>(url, {
        headers: {
          'Accept': 'application/json',
        }
      });
      console.log('API Response:', response.data);

      const dataList = response.data.data.children.map(post => processPostImages(post));
      after.value = response.data.data.after;
      posts.push(...dataList);
      console.log('Successfully added posts:', dataList.length);
    } catch (err) {
      error.value = 'Error fetching Reddit posts';
      console.error('Error fetching Reddit posts:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const getRedditPostDataById = async (id: string): Promise<RedditPost | undefined> => {
    console.log('Fetching Reddit post by ID:', id);
    const post = posts.find(post => post.data.id === id);
    if (post) {
      console.log('Post found in local store:', post);
      return post;
    }

    try {
      const url = `https://www.reddit.com/r/${subreddit.value}/comments/${id}.json`;
      console.log('Requesting URL:', url);

      const response = await axios.get<RedditApiResponse>(url, {
        headers: {
          'Accept': 'application/json',
        }
      });
      console.log('API Response:', response.data);

      if (Array.isArray(response.data) && response.data[0]?.data?.children?.[0]?.data?.id === id) {
        const postData = response.data[0].data.children[0];
        const processedPost = processPostImages(postData);
        console.log('Successfully processed post:', processedPost);
        return processedPost;
      }
      error.value = `Post with id ${id} not found`;
      console.log('Post not found');
      return undefined;
    } catch (err) {
      error.value = `Error fetching post with id ${id}`;
      console.error(`Error fetching post with id ${id}:`, err);
      return undefined;
    }
  };

  return { posts, subreddit, isLoading, error, getRedditPosts, getRedditPostDataById };
});
