'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navigation from '../../src/components/Navigation'
import Footer from '../../src/components/Footer'
import { siteConfig } from '../../src/config/site'
import '../../src/styles/contact.css'

export default function ContactPage() {
  useEffect(() => {
    // Initialize page transition animations
    const pageContent = document.querySelector('.page-content')
    if (pageContent) {
      requestAnimationFrame(() => {
        pageContent.classList.add('visible')
      })
    }

    const header = document.querySelector('.contact-header-animate')
    if (header) {
      requestAnimationFrame(() => {
        header.classList.add('visible')
      })
    }

    const cards = document.querySelectorAll('.contact-card-animate')
    cards.forEach((card) => {
      requestAnimationFrame(() => {
        card.classList.add('visible')
      })
    })
  }, [])

  return (
    <>
      <Navigation />
      <main className="contact-page">
        <div className="contact-page-container page-content">
          <div className="contact-header contact-header-animate">
            <h1 className="contact-title">{siteConfig.contact.title}</h1>
            <p className="contact-subtitle">{siteConfig.contact.subtitle}</p>
          </div>

          <div className="contact-grid">
            <div className="contact-card contact-card-animate">
              <h2 className="contact-card-title">Contact Info</h2>
              <div className="contact-info-list">
                <div className="contact-info-item">
                  <div className="contact-icon-wrapper email-icon">
                    <Image
                      src="/svg/email.svg"
                      alt="email icon"
                      width={24}
                      height={24}
                      className="contact-icon"
                    />
                  </div>
                  <div className="contact-info-content">
                    <div className="contact-info-label">
                      {siteConfig.contact.info.email.label}
                    </div>
                    <a
                      href={siteConfig.contact.info.email.link}
                      className="contact-info-value"
                    >
                      {siteConfig.contact.info.email.value}
                    </a>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon-wrapper phone-icon">
                    <Image
                      src="/svg/phone.svg"
                      alt="phone icon"
                      width={24}
                      height={24}
                      className="contact-icon"
                    />
                  </div>
                  <div className="contact-info-content">
                    <div className="contact-info-label">
                      {siteConfig.contact.info.phone.label}
                    </div>
                    <a
                      href={siteConfig.contact.info.phone.link}
                      className="contact-info-value"
                    >
                      {siteConfig.contact.info.phone.value}
                    </a>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon-wrapper location-icon">
                    <Image
                      src="/svg/location.svg"
                      alt="location icon"
                      width={24}
                      height={24}
                      className="contact-icon"
                    />
                  </div>
                  <div className="contact-info-content">
                    <div className="contact-info-label">
                      {siteConfig.contact.info.location.label}
                    </div>
                    <div className="contact-info-value">
                      {siteConfig.contact.info.location.value}
                    </div>
                  </div>
                </div>
              </div>
              <div className="contact-message-button-wrapper">
                <Link href="/comments" className="contact-message-button">
                  {siteConfig.contact.messageButton}
                </Link>
              </div>
            </div>

            <div className="contact-card contact-card-animate">
              <h3 className="contact-card-subtitle">
                {siteConfig.contact.followMe.title}
              </h3>
              <div className="social-icons-list">
                {siteConfig.contact.followMe.links.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon-link"
                    title={social.name.toLowerCase()}
                  >
                    <Image
                      src={social.icon}
                      alt={`${social.name} icon`}
                      width={24}
                      height={24}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="contact-footer-text comments-content-animate">
            {siteConfig.contact.footerText.map((text, index) => (
              <p key={index}>{text}</p>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

