export async function generateMetadata({ params }) {
  try {
    const { username } = await params;
    
    // Fetch user data for meta tags
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/github/${username}`, {
      cache: 'no-store'
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
    
    const imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/og/${username}`;
    
    return {
      title,
      description,
      keywords: `${userData.login}, GitHub, analytics, profile, repositories, commits, ${userData.topLanguages?.map(l => l.language).join(', ') || 'programming'}`,
      authors: [{ name: userData.name || userData.login, url: userData.html_url }],
      creator: userData.name || userData.login,
      
      // Open Graph tags for social media
      openGraph: {
        title,
        description,
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/profile/${username}`,
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
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/profile/${username}`,
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