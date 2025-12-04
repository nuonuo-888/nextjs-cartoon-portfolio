import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { postImages, defaultPostImage } from '../src/config/posts-images'

const postsDirectory = path.join(process.cwd(), 'src/content/posts')

export interface Post {
  slug: string
  title: string
  date: string
  author?: string
  tags?: string[]
  readTime: string
  excerpt?: string
  image?: string
  content: string
}

// Convert date format from "6/27/2025" to "June 27, 2025"
export function formatDate(dateString: string): string {
  const [month, day, year] = dateString.split('/')
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Extract plain text from markdown content
function extractExcerptFromMarkdown(
  content: string,
  maxLength: number = 300
): string {
  let text = content
    .replace(/^#+\s+/gm, '') // Remove headers
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links, keep text
    .replace(/\*\*([^\*]+)\*\*/g, '$1') // Remove bold
    .replace(/\*([^\*]+)\*/g, '$1') // Remove italic
    .replace(/`([^`]+)`/g, '$1') // Remove inline code
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/\n+/g, ' ') // Replace newlines with space
    .trim()

  if (text.length > maxLength) {
    text = text.substring(0, maxLength)
    const lastPeriod = text.lastIndexOf('.')
    const lastSpace = text.lastIndexOf(' ')
    const cutPoint = lastPeriod > maxLength * 0.7 ? lastPeriod + 1 : lastSpace
    if (cutPoint > maxLength * 0.7) {
      text = text.substring(0, cutPoint)
    }
    text += '...'
  }

  return text
}

export function getPostSlugs(): string[] {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames.map((fileName) => fileName.replace(/\.md$/, ''))
}

export function getPostBySlug(slug: string): Post {
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  let excerpt = data.excerpt
  if (!excerpt) {
    excerpt = extractExcerptFromMarkdown(content, 300)
  }

  const image = data.image || postImages[slug] || defaultPostImage

  return {
    slug,
    title: data.title,
    date: formatDate(data.date),
    author: data.author,
    tags: data.tags || [],
    readTime: data.readTime || '5 min read',
    excerpt,
    image,
    content,
  }
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs()
  const posts = slugs.map((slug) => getPostBySlug(slug))

  // Sort by date (newest first)
  posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return posts
}

