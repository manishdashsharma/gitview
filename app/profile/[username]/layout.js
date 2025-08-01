export async function generateMetadata({ params }) {
  try {
    const { username } = await params;
    
    // Fetch user data for meta tags with better caching
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://gitview-analytics.easytechinnovate.site'}/api/github/${username}`, {
      cache: 'force-cache',
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      return {
        title: `${username} - GitHub Profile Not Found | GitView`,
        description: 'GitHub profile analytics and insights',
      };
    }
    
    const data = await response.json();
    const userData = data.userData;
    
    const title = `${userData.name || userData.login} (@${userData.login}) - GitHub Analytics | GitView`;
    const description = userData.bio 
      ? `${userData.bio} • ${userData.public_repos} repositories • ${userData.followers} followers • View detailed GitHub analytics and insights.`
      : `@${userData.login} • ${userData.public_repos} repositories • ${userData.followers} followers • View detailed GitHub analytics and insights on GitView.`;
    
    const imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://gitview-analytics.easytechinnovate.site'}/api/og/${username}`;
    
    return {
      title,
      description,
      keywords: [
        userData.login,
        userData.name || userData.login,
        'github analytics',
        'github profile',
        'developer analytics',
        'repository statistics',
        'commit analysis',
        ...(userData.topLanguages?.map(l => l.language.toLowerCase()) || ['programming'])
      ],
      authors: [{ name: userData.name || userData.login, url: userData.html_url }],
      creator: userData.name || userData.login,
      
      // Open Graph tags for social media
      openGraph: {
        title,
        description,
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://gitview-analytics.easytechinnovate.site'}/profile/${username}`,
        siteName: 'GitView - GitHub Analytics',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${userData.name || userData.login}'s GitHub Analytics`,
          },
        ],
        locale: 'en_US',
        type: 'profile',
      },
      
      // Twitter Card tags
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
        creator: userData.twitter_username ? `@${userData.twitter_username}` : undefined,
      },
      
      // Additional meta tags
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://gitview-analytics.easytechinnovate.site'}/profile/${username}`,
      },
      
      // Schema.org structured data
      other: {
        'application/ld+json': JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: userData.name || userData.login,
          alternateName: userData.login,
          description: userData.bio || `GitHub developer with ${userData.public_repos} repositories`,
          url: userData.html_url,
          image: userData.avatar_url,
          sameAs: [
            userData.html_url,
            ...(userData.blog ? [userData.blog] : []),
            ...(userData.twitter_username ? [`https://twitter.com/${userData.twitter_username}`] : [])
          ],
          worksFor: userData.company ? {
            '@type': 'Organization',
            name: userData.company
          } : undefined,
          address: userData.location ? {
            '@type': 'PostalAddress',
            addressLocality: userData.location
          } : undefined,
          knowsAbout: userData.topLanguages?.map(l => l.language) || ['Programming'],
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${process.env.NEXT_PUBLIC_BASE_URL || 'https://gitview-analytics.easytechinnovate.site'}/profile/${username}`
          }
        })
      },
      
      // Robots and indexing
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
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'GitHub Profile Analytics | GitView',
      description: 'Beautiful GitHub profile analytics and insights',
    };
  }
}

export default function ProfileLayout({ children }) {
  return children;
}