'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { siteConfig } from '../config/site'

export default function HeroSection() {
  useEffect(() => {
    // Initialize page transition animations
    const pageContent = document.querySelector('.page-content')
    if (pageContent) {
      requestAnimationFrame(() => {
        pageContent.classList.add('visible')
      })
    }

    // Trigger hero content animation
    const heroContent = document.querySelector('.hero-content-animate')
    if (heroContent) {
      requestAnimationFrame(() => {
        heroContent.classList.add('visible')
      })
    }

    // Trigger hero avatar animation
    const heroAvatar = document.querySelector('.hero-avatar-animate')
    if (heroAvatar) {
      requestAnimationFrame(() => {
        heroAvatar.classList.add('visible')
      })
    }

    // Trigger social icons animations
    const socialIcons = document.querySelectorAll('.social-icon-animate')
    socialIcons.forEach((icon) => {
      requestAnimationFrame(() => {
        icon.classList.add('visible')
      })
    })
  }, [])

  return (
    <section className="hero-section">
      <div className="hero-content-wrapper page-content">
        <div className="hero-left-col hero-content-animate">
          <p className="hero-normal-text">{siteConfig.hero.prefix}</p>
          <h1 className="hero-big-text">{siteConfig.hero.name}</h1>
          <p className="hero-intro-text">
            {siteConfig.hero.intro.split('\n').map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </p>
          <div className="hero-btn-row">
            <Link href="/posts" className="hero-btn">{siteConfig.hero.buttons.viewPosts}</Link>
            <Link href="/contact" className="hero-btn-alt">{siteConfig.hero.buttons.contactMe}</Link>
          </div>
        </div>
        <div className="hero-right-col">
          <Image
            src={siteConfig.hero.avatar}
            alt="avatar"
            width={400}
            height={400}
            className="hero-avatar hero-avatar-animate"
          />
          <div className="social-list">
            {siteConfig.hero.socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                className="social-icon-btn social-icon-animate"
                aria-label={social.name}
              >
                <Image src={social.icon} alt={social.name.toLowerCase()} width={24} height={24} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

