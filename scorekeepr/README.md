# 🏆 ScoreKeepr - Gamified Leaderboard SaaS

A simple, shareable leaderboard creator for teams, communities, and gamers. Track ping pong scores, sales competitions, habit streaks, and more.

## 💰 Business Model

- **Free Tier**: 1 board, up to 5 players
- **Pro Tier**: $5/mo for unlimited boards + custom branding
- **Target**: $500/mo revenue (100 paying users)

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Storage**: LocalStorage (MVP) → Supabase (v2)
- **Deployment**: Vercel
- **Analytics**: Vercel Analytics

## ✅ MVP Feature Checklist

### Phase 1: Core Features (MVP - Week 1)
- [x] Project setup with Next.js + Tailwind
- [ ] Landing page with hero, features, CTA
- [ ] Create leaderboard flow
  - [ ] Name your board
  - [ ] Add players (up to 5 for free)
  - [ ] Choose game type (Higher is Better / Lower is Better)
- [ ] Leaderboard view
  - [ ] Display players ranked by score
  - [ ] Increment/decrement score buttons
  - [ ] Real-time sorting
  - [ ] Confetti animation for winner
- [ ] Shareable link generation
  - [ ] Unique board ID (nanoid)
  - [ ] Copy link button
  - [ ] LocalStorage persistence

### Phase 2: Premium Features (Week 2)
- [ ] Paywall UI (modal)
- [ ] "Upgrade to Pro" CTA when creating 2nd board
- [ ] Custom branding options (Pro only)
  - [ ] Upload logo
  - [ ] Custom color scheme
  - [ ] Remove "Made with ScoreKeepr" footer
- [ ] Board management dashboard
  - [ ] View all your boards
  - [ ] Archive/delete boards
- [ ] Stripe integration (placeholder for now)

### Phase 3: Growth & Polish (Week 3)
- [ ] SEO optimization
  - [ ] Meta tags
  - [ ] OpenGraph images
  - [ ] Sitemap
- [ ] Social sharing
  - [ ] "Share to Twitter" button
  - [ ] "Share to LinkedIn" button
- [ ] Mobile responsive design
- [ ] Loading states and error handling
- [ ] Analytics tracking (board creation, shares)

### Phase 4: Launch Prep (Week 4)
- [ ] Domain setup
- [ ] Legal pages (Privacy, Terms)
- [ ] Launch on Product Hunt
- [ ] Post on Reddit (r/SideProject, r/webdev)
- [ ] Indie Hackers post

## 📁 Project Structure

```
scorekeepr/
├── app/
│   ├── page.tsx              # Landing page
│   ├── create/
│   │   └── page.tsx          # Create leaderboard flow
│   ├── board/
│   │   └── [id]/
│   │       └── page.tsx      # Leaderboard view
│   ├── pricing/
│   │   └── page.tsx          # Pricing page
│   └── layout.tsx
├── components/
│   ├── Hero.tsx
│   ├── FeatureGrid.tsx
│   ├── Leaderboard.tsx
│   ├── PlayerCard.tsx
│   └── PaywallModal.tsx
├── lib/
│   ├── storage.ts            # LocalStorage helpers
│   └── utils.ts
└── types/
    └── index.ts              # TypeScript types
```

## 🎯 Success Metrics

- **Week 1**: Deploy MVP, get 10 boards created
- **Week 2**: 100 boards created, 5 signups for waitlist
- **Month 1**: 1,000 boards created, 50 paying users ($250/mo)
- **Month 2**: 100 paying users ($500/mo) ✅ Goal reached

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📈 Marketing Plan

1. **Product Hunt launch** (prepare hunt ship page)
2. **Reddit posts** in r/SideProject, r/webdev, r/Entrepreneur
3. **Twitter thread** showcasing the build journey
4. **Indie Hackers** post with revenue updates
5. **SEO**: Target "free leaderboard", "score tracker", "ping pong scoreboard"

## 💡 Future Ideas (Post-$500/mo)

- Mobile app (React Native)
- Board templates (Sales, Habits, Sports)
- Integrations (Slack, Discord bots)
- Public board gallery
- Embeddable widgets

---

Built with ⚡ by a solo founder. Let's ship fast and iterate.
