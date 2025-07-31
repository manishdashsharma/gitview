import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request, { params }) {
  try {
    const { username } = await params;
    
    // Fetch user data
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/github/${username}`);
    
    if (!response.ok) {
      // Return a default error image
      return new ImageResponse(
        (
          <div
            style={{
              fontSize: 60,
              background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontFamily: 'Inter',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ marginRight: 20 }}>🔍</div>
              <div>Profile Not Found</div>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    }
    
    const data = await response.json();
    const userData = data.userData;
    
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 40,
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            padding: '60px',
            fontFamily: 'Inter',
            color: 'white',
          }}
        >
          {/* Left side - Profile info */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
              <img
                src={userData.avatar_url}
                width="120"
                height="120"
                style={{
                  borderRadius: '60px',
                  border: '4px solid #3b82f6',
                  marginRight: 30
                }}
                alt="Avatar"
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 48, fontWeight: 'bold', marginBottom: 8 }}>
                  {userData.name || userData.login}
                </div>
                <div style={{ fontSize: 32, color: '#60a5fa', marginBottom: 8 }}>
                  @{userData.login}
                </div>
                {userData.location && (
                  <div style={{ fontSize: 24, color: '#9ca3af', display: 'flex', alignItems: 'center' }}>
                    📍 {userData.location}
                  </div>
                )}
              </div>
            </div>
            
            {userData.bio && (
              <div style={{
                fontSize: 28,
                color: '#d1d5db',
                lineHeight: 1.4,
                marginBottom: 40,
                maxWidth: '600px'
              }}>
                {userData.bio.length > 100 ? userData.bio.substring(0, 100) + '...' : userData.bio}
              </div>
            )}
            
            {/* Stats */}
            <div style={{ display: 'flex', gap: 40, marginTop: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: 36, fontWeight: 'bold', color: '#3b82f6' }}>
                  {userData.public_repos}
                </div>
                <div style={{ fontSize: 20, color: '#9ca3af' }}>Repositories</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: 36, fontWeight: 'bold', color: '#10b981' }}>
                  {userData.followers}
                </div>
                <div style={{ fontSize: 20, color: '#9ca3af' }}>Followers</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: 36, fontWeight: 'bold', color: '#f59e0b' }}>
                  {userData.totalStars || 0}
                </div>
                <div style={{ fontSize: 20, color: '#9ca3af' }}>Stars</div>
              </div>
            </div>
          </div>
          
          {/* Right side - Branding */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            minWidth: '300px'
          }}>
            {/* GitView branding */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
              <div style={{
                width: 60,
                height: 60,
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                borderRadius: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 20
              }}>
                <div style={{ fontSize: 30 }}>📊</div>
              </div>
              <div>
                <div style={{ fontSize: 36, fontWeight: 'bold', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', backgroundClip: 'text', color: 'transparent' }}>
                  GitView
                </div>
                <div style={{ fontSize: 18, color: '#9ca3af' }}>
                  Analytics Platform
                </div>
              </div>
            </div>
            
            {/* Language stats */}
            {userData.topLanguages && userData.topLanguages.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <div style={{ fontSize: 24, marginBottom: 20, color: '#d1d5db' }}>
                  Top Languages
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {userData.topLanguages.slice(0, 3).map((lang, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ 
                        width: Math.max(20, lang.count * 4), 
                        height: 8, 
                        background: `hsl(${index * 60 + 200}, 70%, 60%)`,
                        borderRadius: 4
                      }}></div>
                      <div style={{ fontSize: 18, color: '#9ca3af', minWidth: '100px' }}>
                        {lang.language}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Commit stats */}
            {(userData.thisYearCommits > 0 || userData.lastYearCommits > 0) && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: 40 }}>
                <div style={{ fontSize: 24, marginBottom: 20, color: '#d1d5db' }}>
                  Commits
                </div>
                <div style={{ display: 'flex', gap: 20 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 'bold', color: '#10b981' }}>
                      {userData.thisYearCommits}
                    </div>
                    <div style={{ fontSize: 16, color: '#9ca3af' }}>This Year</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 'bold', color: '#6b7280' }}>
                      {userData.lastYearCommits}
                    </div>
                    <div style={{ fontSize: 16, color: '#9ca3af' }}>Last Year</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
    
  } catch (error) {
    console.error('OG Image generation error:', error);
    
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 60,
            background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontFamily: 'Inter',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: 20 }}>📊</div>
            <div>GitView Analytics</div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}