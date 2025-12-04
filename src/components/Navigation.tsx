'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { siteConfig } from '../config/site'

export default function Navigation() {
  const currentPath = usePathname()

  return (
    <nav>
      <Link href="/" className="site-name">{siteConfig.name}</Link>
      <ul className="nav-menu">
        <li>
          <Link
            href="/"
            className={`menu-link ${currentPath === "/" ? "active" : ""}`}
          >
            {siteConfig.navigation.home}
          </Link>
        </li>
        <li>
          <Link
            href="/posts"
            className={`menu-link ${currentPath.startsWith("/posts") ? "active" : ""}`}
          >
            {siteConfig.navigation.posts}
          </Link>
        </li>
        <li>
          <Link
            href="/contact"
            className={`menu-link ${currentPath.startsWith("/contact") ? "active" : ""}`}
          >
            {siteConfig.navigation.contact}
          </Link>
        </li>
        <li>
          <Link
            href="/comments"
            className={`menu-link ${currentPath.startsWith("/comments") ? "active" : ""}`}
          >
            {siteConfig.navigation.comments}
          </Link>
        </li>
      </ul>
    </nav>
  )
}

