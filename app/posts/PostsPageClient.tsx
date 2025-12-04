'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '../../src/components/Navigation'
import Footer from '../../src/components/Footer'
import { siteConfig } from '../../src/config/site'
import { Post } from '../../../lib/posts'
import '../../src/styles/posts.css'

interface PostsPageClientProps {
  posts: Post[]
}

export default function PostsPageClient({ posts: initialPosts }: PostsPageClientProps) {
  const [posts] = useState(initialPosts)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTags, setActiveTags] = useState<string[]>([])

  useEffect(() => {
    // Initialize page transition animations
    const pageContent = document.querySelector('.page-content')
    if (pageContent) {
      requestAnimationFrame(() => {
        pageContent.classList.add('visible')
      })
    }

    const header = document.querySelector('.posts-header-animate')
    if (header) {
      requestAnimationFrame(() => {
        header.classList.add('visible')
      })
    }

    const contentElements = document.querySelectorAll('.posts-content-animate')
    contentElements.forEach((element) => {
      requestAnimationFrame(() => {
        element.classList.add('visible')
      })
    })
  }, [])

  useEffect(() => {
    // Search and filter logic
    const postItems = document.querySelectorAll('.post-item')
    const dateGroups = document.querySelectorAll('.date-group')

    postItems.forEach((item) => {
      const title =
        item.querySelector('.post-title a')?.textContent?.toLowerCase() || ''
      const excerpt =
        item.querySelector('.post-excerpt')?.textContent?.toLowerCase() || ''
      const postTags = Array.from(item.querySelectorAll('.post-tag')).map(
        (tag) => tag.textContent?.toLowerCase().replace(/\s+/g, '-') || ''
      )

      const matchesSearch =
        !searchTerm || title.includes(searchTerm) || excerpt.includes(searchTerm)
      const matchesTags =
        activeTags.length === 0 ||
        activeTags.some((tag) => postTags.includes(tag))

      if (matchesSearch && matchesTags) {
        ;(item as HTMLElement).style.display = 'block'
      } else {
        ;(item as HTMLElement).style.display = 'none'
      }
    })

    dateGroups.forEach((dateGroup) => {
      const visibleItems = dateGroup.querySelectorAll(
        '.post-item[style*="block"], .post-item:not([style*="none"])'
      )
      ;(dateGroup as HTMLElement).style.display =
        visibleItems.length > 0 ? 'block' : 'none'
    })
  }, [searchTerm, activeTags])

  useEffect(() => {
    // Post toggle functionality
    const postToggles = document.querySelectorAll('.post-toggle')
    const postSummaries = document.querySelectorAll('.post-summary')

    const handleToggleClick = (e: Event) => {
      e.stopPropagation()
      const postItem = (e.target as HTMLElement).closest('.post-item')
      if (postItem) {
        postItem.classList.toggle('expanded')
        const arrow = postItem.querySelector('.post-arrow')
        if (arrow) {
          arrow.textContent = postItem.classList.contains('expanded')
            ? '↑'
            : '↓'
        }
      }
    }

    const handleSummaryClick = (e: Event) => {
      if (
        (e.target as HTMLElement).closest('.post-title-link') ||
        (e.target as HTMLElement).closest('.post-toggle')
      ) {
        return
      }

      const postItem = (e.target as HTMLElement).closest('.post-item')
      if (postItem) {
        postItem.classList.toggle('expanded')
        const arrow = postItem.querySelector('.post-arrow')
        if (arrow) {
          arrow.textContent = postItem.classList.contains('expanded')
            ? '↑'
            : '↓'
        }
      }
    }

    postToggles.forEach((toggle) => {
      toggle.addEventListener('click', handleToggleClick)
    })

    postSummaries.forEach((summary) => {
      summary.addEventListener('click', handleSummaryClick)
    })

    return () => {
      postToggles.forEach((toggle) => {
        toggle.removeEventListener('click', handleToggleClick)
      })
      postSummaries.forEach((summary) => {
        summary.removeEventListener('click', handleSummaryClick)
      })
    }
  }, [])

  // Group posts by date
  const groupedPosts = posts.reduce((acc, post) => {
    if (!acc[post.date]) {
      acc[post.date] = []
    }
    acc[post.date].push(post)
    return acc
  }, {} as Record<string, Post[]>)

  // Extract all unique tags
  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags || []))
  ).sort()

  const handleTagClick = (tag: string) => {
    const normalizedTag = tag.toLowerCase().replace(/\s+/g, '-')
    setActiveTags((prev) =>
      prev.includes(normalizedTag)
        ? prev.filter((t) => t !== normalizedTag)
        : [...prev, normalizedTag]
    )
  }

  return (
    <>
      <Navigation />
      <main className="posts-page">
        <div className="posts-container page-content">
          <div className="posts-header posts-header-animate">
            <h1 className="posts-title">{siteConfig.posts.title}</h1>
            <p className="posts-subtitle">{siteConfig.posts.subtitle}</p>
          </div>

          <div className="search-filter-section posts-content-animate">
            <div className="search-box">
              <input
                type="text"
                placeholder={siteConfig.posts.searchPlaceholder}
                className="search-input"
                id="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
              />
              <svg
                className="search-icon"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="m19 19-4.35-4.35"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="tags-filter posts-content-animate">
            <span className="tags-label">Filter by tags:</span>
            <div className="tags-list">
              {allTags.map((tag) => {
                const normalizedTag = tag.toLowerCase().replace(/\s+/g, '-')
                return (
                  <button
                    key={tag}
                    className={`tag-button ${
                      activeTags.includes(normalizedTag) ? 'active' : ''
                    }`}
                    data-tag={normalizedTag}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="posts-list posts-content-animate">
            {Object.entries(groupedPosts).map(([date, datePosts]) => (
              <div key={date} className="date-group" data-date={date}>
                <h2 className="date-header">{date}</h2>
                <div className="date-card">
                  {(datePosts as Post[]).map((post) => (
                    <article
                      key={post.slug}
                      className="post-item"
                      data-post-id={post.slug}
                    >
                      <div className="post-summary">
                        <div className="title-icon-left"></div>
                        <h3 className="post-title">
                          <Link
                            href={`/posts/${post.slug}`}
                            className="post-title-link"
                          >
                            {post.title}
                          </Link>
                          <div className="title-icon-right"></div>
                        </h3>
                        {post.tags && post.tags.length > 0 && (
                          <div className="post-tags">
                            {post.tags.map((tag: string) => (
                              <span key={tag} className="post-tag">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <button
                          className="post-toggle"
                          aria-label="Toggle post details"
                        >
                          <span className="post-arrow">↓</span>
                        </button>
                      </div>
                      <div className="post-details">
                        <div className="post-content-wrapper">
                          <div className="post-excerpt-wrapper">
                            <p className="post-excerpt">{post.excerpt}</p>
                            <div className="post-footer">
                              <Link
                                href={`/posts/${post.slug}`}
                                className="post-read-more"
                              >
                                Read more →
                              </Link>
                              <span className="post-read-time">
                                ⏱️ {post.readTime}
                              </span>
                            </div>
                          </div>
                          <div className="post-image-container">
                            <Image
                              src={post.image || '/images/posts/craft-1141796_640.png'}
                              alt={post.title}
                              width={300}
                              height={200}
                              className="post-image"
                            />
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
