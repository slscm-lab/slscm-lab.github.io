import { SocialPost } from '../types';
import postsData from '../data/generated/social_posts.json';

const posts: SocialPost[] = postsData as unknown as SocialPost[];

export function getSocialPosts(): SocialPost[] {
  return posts;
}
