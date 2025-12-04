import Link from 'next/link'
import { siteConfig } from '../config/site'

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-text">
          {siteConfig.footer.copyright} • {siteConfig.footer.links.map((link, index) => (
            <span key={index}>
              <Link href={link.url} className="footer-link">{link.text}</Link>
              {index < siteConfig.footer.links.length - 1 && " • "}
            </span>
          ))}
        </div>
        <Link href={siteConfig.footer.github.url} className="footer-github">{siteConfig.footer.github.text}</Link>
      </div>
    </footer>
  )
}

