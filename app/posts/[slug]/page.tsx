import PostPageClient from './PostPageClient'
import { getPostBySlug, getPostSlugs } from '../../../lib/posts'

interface PostPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  
  return <PostPageClient post={post} />
}

  useEffect(() => {
    // Ensure scroll position is at top
    window.scrollTo(0, 0)
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 0)

    // Initialize page transition animations
    const pageContent = document.querySelector('.page-content')
    if (pageContent) {
      requestAnimationFrame(() => {
        pageContent.classList.add('visible')
      })
    }

    const header = document.querySelector('.post-header-animate')
    if (header) {
      requestAnimationFrame(() => {
        header.classList.add('visible')
      })
    }

    const content = document.querySelector('.post-content-animate')
    if (content) {
      requestAnimationFrame(() => {
        content.classList.add('visible')
      })
    }

    // Apply heading spacing
    const applyHeadingSpacing = () => {
      const postContent = document.querySelector('.post-content')
      if (!postContent) return

      const rootStyles = getComputedStyle(document.documentElement)
      const getCSSVar = (name: string, fallback: string) =>
        rootStyles.getPropertyValue(name).trim() || fallback

      const headingConfig = [
        {
          selector: 'h2',
          marginTopVar: '--post-h2-margin-top',
          marginBottomVar: '--post-h2-margin-bottom',
          contentMarginTopVar: '--post-h2-content-margin-top',
          defaults: {
            marginTop: '3rem',
            marginBottom: '1.17rem',
            contentMarginTop: '1.17rem',
          },
          skipFirstMarginTop: true,
        },
        {
          selector: 'h3',
          marginTopVar: '--post-h3-margin-top',
          marginBottomVar: '--post-h3-margin-bottom',
          contentMarginTopVar: '--post-h3-content-margin-top',
          defaults: {
            marginTop: '2.5rem',
            marginBottom: '1rem',
            contentMarginTop: '1rem',
          },
          skipFirstMarginTop: false,
        },
        {
          selector: 'h4',
          marginTopVar: '--post-h4-margin-top',
          marginBottomVar: '--post-h4-margin-bottom',
          contentMarginTopVar: '--post-h4-content-margin-top',
          defaults: {
            marginTop: '2rem',
            marginBottom: '0.83rem',
            contentMarginTop: '0.83rem',
          },
          skipFirstMarginTop: false,
        },
      ]

      const contentTags = ['P', 'UL', 'OL', 'PRE']

      headingConfig.forEach((config) => {
        const headings = postContent.querySelectorAll(config.selector)
        const marginTop = getCSSVar(config.marginTopVar, config.defaults.marginTop)
        const marginBottom = getCSSVar(
          config.marginBottomVar,
          config.defaults.marginBottom
        )
        const contentMarginTop = getCSSVar(
          config.contentMarginTopVar,
          config.defaults.contentMarginTop
        )

        headings.forEach((heading) => {
          if (!(heading instanceof HTMLElement)) return

          if (
            config.skipFirstMarginTop &&
            heading.previousElementSibling === null
          ) {
            heading.style.marginTop = '0'
          } else {
            heading.style.marginTop = marginTop
          }
          heading.style.marginBottom = marginBottom

          const nextElement = heading.nextElementSibling
          if (
            nextElement instanceof HTMLElement &&
            contentTags.includes(nextElement.tagName)
          ) {
            nextElement.style.marginTop = contentMarginTop
          }
        })
      })
    }

    const overrideCodeStyles = () => {
      const codeBlocks = document.querySelectorAll(
        '.post-content pre, .post-content pre.astro-code'
      )
      codeBlocks.forEach((pre) => {
        if (pre instanceof HTMLElement) {
          pre.style.removeProperty('background-color')
          pre.style.removeProperty('color')
          pre.style.backgroundColor = '#f5f5f5'
          pre.style.borderRadius = '8px'
          pre.style.color = '#333'

          const code = pre.querySelector('code')
          if (code instanceof HTMLElement) {
            code.style.removeProperty('background-color')
            code.style.removeProperty('color')
            code.style.backgroundColor = 'transparent'
            code.style.color = '#333'

            const spans = code.querySelectorAll('span')
            spans.forEach((span) => {
              if (span instanceof HTMLElement) {
                span.style.removeProperty('color')
                span.style.color = '#333'
              }
            })
          }
        }
      })
    }

    applyHeadingSpacing()
    overrideCodeStyles()

    setTimeout(() => {
      applyHeadingSpacing()
      overrideCodeStyles()
    }, 100)
    setTimeout(() => {
      applyHeadingSpacing()
      overrideCodeStyles()
    }, 500)
  }, [])

  return (
    <>
      <Navigation />
      <main className="post-detail-page">
        <div className="post-detail-container page-content">
          <div className="post-header-card post-header-animate">
            <h1 className="post-detail-title">{post.title}</h1>
            {post.tags && post.tags.length > 0 && (
              <div className="post-detail-tags">
                {post.tags.map((tag) => (
                  <span key={tag} className="post-detail-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="post-detail-meta">
              <Link href="/posts" className="post-back-button">
                {' '}
                ← Back to Posts{' '}
              </Link>
              <div className="post-detail-meta-info">
                <Image
                  src="/image/20943608.jpeg"
                  alt={post.author || 'Someone'}
                  width={40}
                  height={40}
                  className="post-detail-avatar"
                />
                <span className="post-detail-author">
                  {post.author || 'Someone'}
                </span>
                <span className="post-detail-date">{post.date}</span>
                <span className="post-detail-read-time">{post.readTime}</span>
              </div>
            </div>
          </div>

          <div className="post-content post-content-animate">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export async function generateStaticParams() {
  const slugs = getPostSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

