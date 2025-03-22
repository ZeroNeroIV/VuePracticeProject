import axios from 'axios';
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export interface RedditPost {
  kind: string;
  data: RedditPostData;
}

interface RedditPostData {
  approved_at_utc: number | null;
  subreddit: string;
  selftext: string;
  author_fullname: string;
  saved: boolean;
  mod_reason_title: string | null;
  gilded: number;
  clicked: boolean;
  title: string;
  link_flair_richtext: FlairRichText[];
  subreddit_name_prefixed: string;
  hidden: boolean;
  pwls: number;
  link_flair_css_class: string;
  downs: number;
  thumbnail_height: number | null;
  top_awarded_type: string | null;
  hide_score: boolean;
  name: string;
  quarantine: boolean;
  link_flair_text_color: string;
  upvote_ratio: number;
  author_flair_background_color: string | null;
  subreddit_type: string;
  ups: number;
  total_awards_received: number;
  media_embed: unknown;
  thumbnail_width: number | null;
  author_flair_template_id: string | null;
  is_original_content: boolean;
  user_reports: unknown[];
  secure_media: unknown | null;
  is_reddit_media_domain: boolean;
  is_meta: boolean;
  category: string | null;
  secure_media_embed: unknown;
  link_flair_text: string;
  can_mod_post: boolean;
  score: number;
  approved_by: string | null;
  is_created_from_ads_ui: boolean;
  author_premium: boolean;
  thumbnail: string;
  edited: boolean;
  author_flair_css_class: string | null;
  author_flair_richtext: FlairRichText[];
  gildings: Record<string, number>;
  post_hint: string;
  content_categories: string[] | null;
  is_self: boolean;
  mod_note: string | null;
  created: number;
  link_flair_type: string;
  wls: number;
  removed_by_category: string | null;
  banned_by: string | null;
  author_flair_type: string;
  domain: string;
  allow_live_comments: boolean;
  selftext_html: string | null;
  likes: number | null;
  suggested_sort: string | null;
  banned_at_utc: number | null;
  view_count: number | null;
  archived: boolean;
  no_follow: boolean;
  is_crosspostable: boolean;
  pinned: boolean;
  over_18: boolean;
  preview: Preview;
  all_awardings: unknown[];
  awarders: unknown[];
  media_only: boolean;
  link_flair_template_id: string;
  can_gild: boolean;
  spoiler: boolean;
  locked: boolean;
  author_flair_text: string | null;
  treatment_tags: string[];
  visited: boolean;
  removed_by: string | null;
  num_reports: number | null;
  distinguished: string | null;
  subreddit_id: string;
  author_is_blocked: boolean;
  mod_reason_by: string | null;
  removal_reason: string | null;
  link_flair_background_color: string;
  id: string;
  is_robot_indexable: boolean;
  report_reasons: unknown[] | null;
  author: string;
  discussion_type: string | null;
  num_comments: number;
  send_replies: boolean;
  contest_mode: boolean;
  mod_reports: unknown[];
  author_patreon_flair: boolean;
  author_flair_text_color: string | null;
  permalink: string;
  stickied: boolean;
  url: string;
  subreddit_subscribers: number;
  created_utc: number;
  num_crossposts: number;
  media: RedditMedia | null;
  is_video: boolean;
}

interface FlairRichText {
  e: string;
  t: string;
}

interface Preview {
  images: PreviewImage[];
  enabled: boolean;
}

interface PreviewImage {
  source: ImageSource;
  resolutions: ImageSource[];
  variants: Record<string, unknown>;
  id: string;
}

interface ImageSource {
  url: string;
  width: number;
  height: number;
}


interface RedditMedia {
  reddit_video?: {
    fallback_url: string;
  };
}

interface RedditApiResponse {
  data: {
    children: RedditPost[];
    after: string | null;
  };
}

export const useRedditStore = defineStore('reddit', () => {
  const posts = reactive<RedditPost[]>([]);
  const after = ref<string | null>(null);
  const error = ref<string | null>(null);
  const subreddit = ref<string | null>('VueJS');
  const isLoading = ref<boolean>(false);

  const getRedditPosts = async (querySubreddit: string | null = subreddit.value): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    if (querySubreddit !== subreddit.value)
      after.value = null;
    subreddit.value = querySubreddit;

    const url = after.value
      ? `https://www.reddit.com/r/${querySubreddit}/new.json?limit=5&after=${after.value}`
      : `https://www.reddit.com/r/${querySubreddit}/new.json?limit=5`;

    try {
      const response = await axios.get<RedditApiResponse>(url);
      const dataList = response.data.data.children;
      after.value = response.data.data.after;
      posts.push(...dataList);
      return
    }
    catch (err) {
      console.error('Error fetching Reddit posts:', err);
      return;
    }
    finally {
      isLoading.value = false;
    }
  }

  const getRedditPostDataById = async (id: string): Promise<RedditPost | undefined> => {
    const post = posts.find(post => post.data.id === id);
    if (!post) {
      const response = await axios.get<RedditApiResponse>(`https://www.reddit.com/r/${subreddit.value}/comments/${id}.json`);
      if (response.status >= 200 && response.status < 300) {
        const dataList = response.data.data.children;
        if (dataList.length > 0) {
          const postData = dataList[0];
          if (postData.data.id === id) {
            return postData;
          }
        }
        error.value = `Error fetching post with id ${id}`;
        console.error(`Error fetching post with id ${id}`);
        return undefined;
      }
      error.value = `Post with id ${id} not found`;
      console.error(`Post with id ${id} not found`);
      return undefined;
    }
    return post;
  }

  return { posts, isLoading, error, getRedditPosts, getRedditPostDataById };

})
