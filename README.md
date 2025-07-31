# 📊 GitView - GitHub Analytics Platform

<div align="center">

![GitView Banner](https://github.com/manishdashsharma/gitview/blob/main/public/image.png)

**World-class GitHub profile analytics with beautiful visualizations**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-green?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

[🚀 Live Demo](https://gitview-analytics.vercel.app) • [📖 Documentation](#documentation) • [🛠️ Deploy Now](#quick-deploy)

</div>

## ✨ Features

### 🎯 **Core Analytics**
- **Comprehensive GitHub Data** - Repository stats, commit activity, language breakdown
- **Real-time Insights** - Live GitHub data with smart caching
- **Beautiful Visualizations** - Interactive charts powered by ApexCharts
- **Dark GitHub Theme** - Sleek, professional interface inspired by GitHub

### 📈 **Advanced Analytics**
- **Commit Activity Charts** - Monthly activity with year-over-year comparisons
- **Language Analytics** - Programming language distribution with visual breakdowns
- **Repository Insights** - Pinned repositories, most starred projects, fork analysis
- **Growth Metrics** - Follower trends, star growth, contribution patterns

### 🔗 **Social Features**
- **Smart Sharing** - Generate beautiful social media cards automatically
- **Profile URLs** - Direct shareable links to any GitHub profile analysis
- **Open Graph Integration** - Rich previews on Twitter, LinkedIn, Facebook
- **Export Ready** - Perfect for portfolios, resumes, and presentations

### 📊 **Platform Analytics**
- **Visitor Tracking** - Platform-wide and per-profile analytics
- **Usage Insights** - 7/15/30 day visitor trends with beautiful charts
- **Performance Metrics** - Real-time usage statistics and growth tracking

## 🚀 Quick Start

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/gitview)

### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/gitview.git
cd gitview

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see GitView in action! 🎉

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/gitview
# Or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/gitview

# GitHub API (Optional - for higher rate limits)
GITHUB_TOKEN=your_github_personal_access_token

# Next.js Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
# For production: https://your-domain.com

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### GitHub Token Setup (Recommended)

1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Generate a new token with `public_repo` scope
3. Add it to your `.env.local` file
4. Enjoy higher API rate limits! 🚀

## 🛠️ Tech Stack

<div align="center">

| Frontend | Backend | Database | Deployment |
|----------|---------|----------|------------|
| Next.js 15 | Node.js | MongoDB | Vercel |
| React 18 | REST API | Mongoose | Docker |
| Tailwind CSS | GitHub API | Atlas | Railway |
| Framer Motion | @vercel/og | - | Netlify |
| ApexCharts | - | - | AWS |

</div>

## 🎯 Use Cases

### 👨‍💻 **For Developers**
- **Portfolio Enhancement** - Showcase your GitHub activity professionally
- **Interview Preparation** - Visual representation of your coding journey
- **Team Analysis** - Compare team members' contributions and skills

### 🏢 **For Companies**
- **Developer Hiring** - Evaluate candidates' GitHub activity and skills
- **Team Insights** - Understand your development team's technology stack
- **Open Source Tracking** - Monitor community contributions and engagement

### 🎓 **For Educators**
- **Student Assessment** - Track students' coding progress and activity
- **Course Planning** - Understand popular technologies and trends
- **Project Showcasing** - Display class projects and achievements

## 🚀 Deployment Guide

### Vercel (Recommended)

1. **Fork this repository**
2. **Connect to Vercel** - Import your forked repository
3. **Add Environment Variables** - Configure your MongoDB URI and other settings
4. **Deploy** - Your GitView instance will be live in minutes!



### Manual Deployment

```bash
# Build for production
npm run build

# Start the production server
npm start
```

## 🔧 Customization

### 🎨 **Theming**
- Modify `tailwind.config.js` for custom colors
- Update `app/globals.css` for global styles
- Customize animations in component files

### 📊 **Analytics**
- Add custom metrics in `/api/github/[username]/route.js`
- Create new chart components in `/components`
- Extend database models in `/models`

### 🌐 **Branding**
- Update logo and branding in `/app/page.js`
- Modify social media cards in `/app/api/og/[username]/route.js`
- Customize footer and navigation components

## 📖 API Documentation

### Core Endpoints

```http
GET /api/github/[username]
# Returns comprehensive GitHub user data and analytics

GET /api/visitors
# Returns platform visitor analytics

GET /api/profile-views/[username]
# Returns profile-specific view analytics

GET /api/og/[username]
# Generates Open Graph social media images
```

### Example Response

```json
{
  "userData": {
    "login": "octocat",
    "name": "The Octocat",
    "public_repos": 8,
    "followers": 9001,
    "totalStars": 12543,
    "thisYearCommits": 1247,
    "topLanguages": [
      {"language": "JavaScript", "count": 15},
      {"language": "Python", "count": 8}
    ],
    "pinnedRepositories": [...],
    "monthlyActivity": [...]
  }
}
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🐛 **Bug Reports**
- Use GitHub Issues to report bugs
- Include steps to reproduce and expected behavior
- Add screenshots if applicable

### ✨ **Feature Requests**
- Suggest new features via GitHub Issues
- Explain the use case and expected behavior
- Consider contributing the implementation!

### 💻 **Code Contributions**

```bash
# Fork the repository
git clone https://github.com/yourusername/gitview.git

# Create a feature branch
git checkout -b feature/amazing-feature

# Make your changes and test thoroughly
npm run dev
npm run build

# Commit your changes
git commit -m "Add amazing feature"

# Push and create a Pull Request
git push origin feature/amazing-feature
```

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License - Feel free to use this project for personal and commercial purposes!
```

## 🙏 Acknowledgments

- **GitHub API** - For providing comprehensive developer data
- **Vercel** - For seamless deployment and hosting
- **MongoDB** - For reliable data storage
- **Open Source Community** - For inspiration and support

## 📞 Support & Contact

<div align="center">

### 🛟 Need Help?

[![GitHub Issues](https://img.shields.io/badge/GitHub-Issues-red?style=for-the-badge&logo=github)](https://github.com/manishdashsharma/gitview/issues)
[![Discussions](https://img.shields.io/badge/GitHub-Discussions-blue?style=for-the-badge&logo=github)](https://github.com/manishdashsharma/gitview/discussions)

### 👨‍💻 Created by

**Manish Dash Sharma**

[![GitHub](https://img.shields.io/badge/GitHub-manishdashsharma-black?style=for-the-badge&logo=github)](https://github.com/manishdashsharma)
[![Twitter](https://img.shields.io/badge/Twitter-@manishds-blue?style=for-the-badge&logo=twitter)](https://x.com/manishdsharma08)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/manish-dash-sharma-0082b8185/)

</div>

---

<div align="center">

**⭐ Star this repository if GitView helped you! ⭐**

*Built with ❤️ for the developer community*

</div>
