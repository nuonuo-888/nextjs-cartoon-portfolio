import type { Metadata } from 'next'
import '../src/styles/home.css'
import '../src/styles/page-transitions.css'

export const metadata: Metadata = {
  title: 'Astro Blog',
  description: 'A modern blog built with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ("scrollRestoration" in history) {
                history.scrollRestoration = "manual";
              }
              window.scrollTo(0, 0);
            `,
          }}
        />
      </head>
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener("DOMContentLoaded", () => {
                window.scrollTo(0, 0);
                setTimeout(() => {
                  window.scrollTo(0, 0);
                }, 0);
              });
              window.addEventListener("pageshow", (event) => {
                if (event.persisted) {
                  window.scrollTo(0, 0);
                }
              });
            `,
          }}
        />
      </body>
    </html>
  )
}

