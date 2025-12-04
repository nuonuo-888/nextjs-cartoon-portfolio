'use client'

import { useEffect } from 'react'
import Navigation from '../../src/components/Navigation'
import Footer from '../../src/components/Footer'
import GiscusComments from '../../src/components/GiscusComments'
import { siteConfig } from '../../src/config/site'
import '../../src/styles/comments.css'

export default function CommentsPage() {
  useEffect(() => {
    // Initialize page transition animations
    const pageContent = document.querySelector('.page-content')
    if (pageContent) {
      requestAnimationFrame(() => {
        pageContent.classList.add('visible')
      })
    }

    const header = document.querySelector('.comments-header-animate')
    if (header) {
      requestAnimationFrame(() => {
        header.classList.add('visible')
      })
    }

    const contentElements = document.querySelectorAll('.comments-content-animate')
    contentElements.forEach((element) => {
      requestAnimationFrame(() => {
        element.classList.add('visible')
      })
    })
  }, [])

  const icons = [
    { type: 'circle', element: <circle cx="9" cy="9" r="3.2" fill="#fff" /> },
    {
      type: 'square',
      element: <rect x="5.2" y="5.2" width="7.6" height="7.6" rx="2" fill="#fff" />,
    },
    {
      type: 'triangle',
      element: <polygon points="9,5.2 12.8,12.8 5.2,12.8" fill="#fff" />,
    },
    {
      type: 'pentagon',
      element: <polygon points="9,5 13.2,8 11.8,13 6.2,13 4.8,8" fill="#fff" />,
    },
    {
      type: 'star',
      element: (
        <polygon
          points="9,5 10,8 13.2,8.3 10.8,10.3 11.6,13.5 9,11.7 6.4,13.5 7.2,10.3 4.8,8.3 8,8"
          fill="#fff"
        />
      ),
    },
    {
      type: 'heart',
      element: (
        <path
          d="M9 14.5s-3.5-2.5-3.5-4.7A2.2 2.2 0 0 1 9 7.5a2.2 2.2 0 0 1 3.5 2.3c0 2.2-3.5 4.7-3.5 4.7z"
          fill="#fff"
        />
      ),
    },
  ]

  return (
    <>
      <Navigation />
      <main className="comments-page">
        <div className="comments-page-container page-content">
          <div className="comments-header comments-header-animate">
            <h1 className="comments-title">{siteConfig.comments.title}</h1>
            <p className="comments-subtitle">{siteConfig.comments.subtitle}</p>
            <div className="comments-divider"></div>
          </div>

          <div className="guidelines-section comments-content-animate">
            <h2 className="guidelines-title">
              {siteConfig.comments.guidelines.title}
            </h2>
            <ul className="guidelines-list">
              {siteConfig.comments.guidelines.items.map((item, index) => {
                const icon = icons[index] || icons[0]
                return (
                  <li key={index} className="guideline-item">
                    <span className={`guideline-icon guideline-icon-${icon.type}`}>
                      <svg width="18" height="18" viewBox="0 0 18 18">
                        {icon.element}
                      </svg>
                    </span>
                    {item}
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="comments-section comments-content-animate">
            <GiscusComments />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

