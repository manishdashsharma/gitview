import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  colorScheme: 'dark light',
};

export const metadata = {
  title: {
    default: "GitView - GitHub Analytics Platform",
    template: "%s | GitView"
  },
  description: "Beautiful GitHub profile analytics and insights. Discover patterns, metrics, and stories in any GitHub developer profile with advanced visualizations, commit activity, language statistics, and more.",
  keywords: [
    "github analytics",
    "github profile",
    "developer analytics",
    "github insights",
    "commit analysis",
    "programming languages",
    "repository stats",
    "github profile viewer",
    "developer metrics",
    "github dashboard"
  ],
  authors: [{ name: "Manish", url: "https://github.com/manishdashsharma" }],
  creator: "Manish",
  publisher: "GitView",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://gitview-analytics.easytechinnovate.site'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gitview-analytics.easytechinnovate.site',
    title: 'GitView - GitHub Analytics Platform',
    description: 'Beautiful GitHub profile analytics and insights. Discover patterns, metrics, and stories in any GitHub developer profile with advanced visualizations.',
    siteName: 'GitView',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GitView - GitHub Analytics Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitView - GitHub Analytics Platform',
    description: 'Beautiful GitHub profile analytics and insights. Discover patterns, metrics, and stories in any GitHub developer profile.',
    creator: '@manishdashsharma',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE || 'your-google-verification-code',
  },
  category: 'technology',
  classification: 'developer tools',
  referrer: 'origin-when-cross-origin',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'GitView',
  },
  applicationName: 'GitView',
};

export default function RootLayout({ children }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'GitView',
    description: 'Beautiful GitHub profile analytics and insights platform',
    url: 'https://gitview-analytics.easytechinnovate.site',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    creator: {
      '@type': 'Person',
      name: 'Manish',
      url: 'https://github.com/manishdashsharma'
    },
    featureList: [
      'GitHub Profile Analytics',
      'Commit Activity Visualization', 
      'Programming Language Statistics',
      'Repository Insights',
      'Profile View Tracking'
    ]
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <meta name="google-site-verification" content="fMsvzU8-CI4Ltsk6S5grjBI4Fs5kAb4NSASnQmDvN9A" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}
