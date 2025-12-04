import PostsPageClient from './PostsPageClient'
import { getAllPosts } from '../../lib/posts'

export default function PostsPage() {
  const posts = getAllPosts()
  
  return <PostsPageClient posts={posts} />
}
