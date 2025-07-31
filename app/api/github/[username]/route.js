import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(_, { params }) {
  try {
    const { username } = await params;
    
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    await dbConnect();

    // Check if user exists in our database
    let user = await User.findOne({ username });
    
    if (user) {
      return NextResponse.json({ 
        userData: user.githubData,
        cached: true,
        cachedAt: user.createdAt
      });
    }

    // Fetch from GitHub API
    const response = await fetch(`https://api.github.com/users/${username}`);
    
    if (!response.ok) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const githubData = await response.json();

    // Fetch comprehensive GitHub data
    const [reposResponse, eventsResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
      fetch(`https://api.github.com/users/${username}/events?per_page=100`)
    ]);

    const repos = reposResponse.ok ? await reposResponse.json() : [];
    const events = eventsResponse.ok ? await eventsResponse.json() : [];

    // Get commit statistics for current and previous year
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;
    
    const commitEvents = events.filter(event => event.type === 'PushEvent');
    const thisYearCommits = commitEvents.filter(event => 
      new Date(event.created_at).getFullYear() === currentYear
    ).reduce((sum, event) => sum + (event.payload?.commits?.length || 0), 0);
    
    const lastYearCommits = commitEvents.filter(event => 
      new Date(event.created_at).getFullYear() === previousYear
    ).reduce((sum, event) => sum + (event.payload?.commits?.length || 0), 0);

    // Get language statistics
    const languageStats = repos.reduce((acc, repo) => {
      if (repo.language) {
        acc[repo.language] = (acc[repo.language] || 0) + 1;
      }
      return acc;
    }, {});

    // Sort languages by usage
    const topLanguages = Object.entries(languageStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([lang, count]) => ({ language: lang, count }));

    // Get pinned repositories (we'll simulate this as GitHub's GraphQL API is needed for actual pinned repos)
    const pinnedRepos = repos
      .filter(repo => !repo.fork && repo.stargazers_count > 0)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6);

    // Calculate contribution streak and activity
    const recentActivity = events.slice(0, 30).map(event => ({
      type: event.type,
      repo: event.repo?.name,
      date: event.created_at,
      public: event.public
    }));

    // Get monthly commit activity for the last 12 months
    const monthlyActivity = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toISOString().slice(0, 7); // YYYY-MM format
      
      const monthCommits = commitEvents.filter(event => 
        event.created_at.startsWith(month)
      ).reduce((sum, event) => sum + (event.payload?.commits?.length || 0), 0);
      
      return {
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        commits: monthCommits
      };
    }).reverse();

    const enhancedData = {
      ...githubData,
      // Basic stats
      totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
      totalForks: repos.reduce((sum, repo) => sum + repo.forks_count, 0),
      totalRepos: repos.length,
      publicRepos: repos.filter(repo => !repo.private).length,
      
      // Repository data
      repositories: repos.slice(0, 10), // Top 10 repositories
      mostStarredRepo: repos.sort((a, b) => b.stargazers_count - a.stargazers_count)[0],
      pinnedRepositories: pinnedRepos,
      
      // Language and technology stats
      languages: [...new Set(repos.map(repo => repo.language).filter(Boolean))],
      topLanguages,
      
      // Commit and activity stats
      thisYearCommits,
      currentYear,
      lastYearCommits,
      commitGrowth: lastYearCommits > 0 ? ((thisYearCommits - lastYearCommits) / lastYearCommits * 100).toFixed(1) : 0,
      monthlyActivity,
      recentActivity,
      
      // Additional metrics
      totalWatchers: repos.reduce((sum, repo) => sum + repo.watchers_count, 0),
      totalSize: repos.reduce((sum, repo) => sum + repo.size, 0),
      forkedRepos: repos.filter(repo => repo.fork).length,
      hasOrganizations: githubData.company !== null,
      
      // Activity insights
      mostActiveMonth: monthlyActivity.reduce((max, current) => 
        current.commits > max.commits ? current : max, monthlyActivity[0]
      ),
      averageStarsPerRepo: repos.length > 0 ? 
        Math.round(repos.reduce((sum, repo) => sum + repo.stargazers_count, 0) / repos.length) : 0
    };

    // Save to database
    user = await User.create({
      username,
      githubData: enhancedData
    });

    return NextResponse.json({ 
      userData: enhancedData,
      cached: false
    });

  } catch (error) {
    console.error('GitHub API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}