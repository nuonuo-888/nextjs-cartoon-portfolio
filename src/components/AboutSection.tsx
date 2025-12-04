import { siteConfig } from '../config/site'

export default function AboutSection() {
  return (
    <section className="about-section">
      <div className="about-content">
        <h2 className="about-title">{siteConfig.about.title}</h2>
        <p className="about-text">{siteConfig.about.text}</p>
      </div>
    </section>
  )
}

