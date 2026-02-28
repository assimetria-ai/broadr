import { useEffect, useState } from 'react'
import {
  BarChart2,
  TrendingUp,
  TrendingDown,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Users,
  Twitter,
  Instagram,
  Linkedin,
  ChevronDown,
  ExternalLink,
} from 'lucide-react'
import { Header } from '../../../components/@system/Header/Header'
import { PageLayout } from '../../../components/@system/layout/PageLayout'
import { api } from '../../../lib/@system/api'

// ─── Seed Data ────────────────────────────────────────────────────────────────

const RANGES = ['Last 7 days', 'Last 14 days', 'Last 30 days', 'Last 90 days']

const CHANNEL_DEFS = [
  { id: 'twitter', label: 'Twitter / X', Icon: Twitter, color: 'text-[#1DA1F2]', bg: 'bg-[#1DA1F2]/10', borderColor: 'border-[#1DA1F2]/30' },
  { id: 'instagram', label: 'Instagram', Icon: Instagram, color: 'text-[#E1306C]', bg: 'bg-[#E1306C]/10', borderColor: 'border-[#E1306C]/30' },
  { id: 'linkedin', label: 'LinkedIn', Icon: Linkedin, color: 'text-[#0077B5]', bg: 'bg-[#0077B5]/10', borderColor: 'border-[#0077B5]/30' },
]

const SEED_OVERVIEW = {
  total_reach: 48_321,
  reach_change: 18.4,
  impressions: 134_209,
  impressions_change: 22.1,
  engagements: 3_841,
  engagement_change: 11.7,
  followers_gained: 284,
  followers_change: 8.3,
}

const SEED_BY_CHANNEL = [
  { channel: 'twitter', posts: 12, reach: 21_400, impressions: 58_300, likes: 892, comments: 234, shares: 156, followers: 4_821 },
  { channel: 'instagram', posts: 8, reach: 18_200, impressions: 49_100, likes: 1_821, comments: 432, shares: 298, followers: 8_392 },
  { channel: 'linkedin', posts: 5, reach: 8_721, impressions: 26_809, likes: 512, comments: 78, shares: 94, followers: 2_104 },
]

const SEED_TOP_POSTS = [
  { id: 1, text: 'New blog post: "10 Ways to Grow Your Audience in 2026" — link in bio!', channel: 'instagram', reach: 8_412, likes: 921, comments: 143, shares: 87, date: '2026-02-25' },
  { id: 2, text: '🚀 Excited to share our latest product update! Check out the new features we\'ve shipped this week.', channel: 'twitter', reach: 6_102, likes: 432, comments: 87, shares: 234, date: '2026-02-24' },
  { id: 3, text: 'Sharing our quarterly insights on social media trends. What\'s working for your brand?', channel: 'linkedin', reach: 4_821, likes: 289, comments: 56, shares: 78, date: '2026-02-23' },
  { id: 4, text: 'We just hit 10k followers! Thank you so much for your support 🙏', channel: 'instagram', reach: 4_201, likes: 1_032, comments: 198, shares: 45, date: '2026-02-22' },
  { id: 5, text: 'Weekly roundup: top industry news, tips, and what we\'ve been reading 📰', channel: 'twitter', reach: 3_841, likes: 198, comments: 34, shares: 89, date: '2026-02-21' },
]

const SEED_CHART = Array.from({ length: 14 }, (_, i) => {
  const d = new Date()
  d.setDate(d.getDate() - (13 - i))
  return {
    date: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    reach: Math.floor(2000 + Math.random() * 5000),
    engagements: Math.floor(100 + Math.random() * 500),
  }
})

// ─── Helpers ─────────────────────────────────────────────────────────────────

function ChangeIndicator({ value }) {
  const positive = value >= 0
  const Icon = positive ? TrendingUp : TrendingDown
  return (
    <span className={`flex items-center gap-0.5 text-xs font-medium ${positive ? 'text-green-600' : 'text-red-500'}`}>
      <Icon className="h-3 w-3" />
      {Math.abs(value)}%
    </span>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, change, icon }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex items-start gap-4 shadow-sm">
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-bold text-foreground truncate">{value}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-sm text-muted-foreground">{label}</p>
          <ChangeIndicator value={change} />
        </div>
      </div>
    </div>
  )
}

// ─── Channel Card ──────────────────────────────────────────────────────────────

function ChannelCard({ data }) {
  const def = CHANNEL_DEFS.find(c => c.id === data.channel)
  if (!def) return null
  const { Icon, color, bg, borderColor, label } = def

  return (
    <div className={`rounded-xl border ${borderColor} bg-card p-5 space-y-4 shadow-sm`}>
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-full ${bg}`}>
          <Icon className={`h-4.5 w-4.5 ${color}`} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">{label}</h3>
          <p className="text-xs text-muted-foreground">{data.followers.toLocaleString()} followers · {data.posts} posts</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: Eye, label: 'Reach', value: data.reach },
          { icon: Heart, label: 'Likes', value: data.likes },
          { icon: MessageCircle, label: 'Comments', value: data.comments },
          { icon: Share2, label: 'Shares', value: data.shares },
          { icon: BarChart2, label: 'Impressions', value: data.impressions },
        ].map(({ icon: I, label, value }) => (
          <div key={label} className="text-center">
            <I className={`h-3.5 w-3.5 mx-auto mb-0.5 ${color}`} />
            <p className="text-sm font-bold text-foreground">{value > 999 ? `${(value/1000).toFixed(1)}k` : value}</p>
            <p className="text-[10px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Mini Chart ───────────────────────────────────────────────────────────────

function MiniChart({ data, metric }) {
  const max = Math.max(...data.map(d => d[metric]))
  return (
    <div className="flex items-end gap-1 h-20">
      {data.map((d, i) => {
        const pct = max ? (d[metric] / max) * 100 : 0
        return (
          <div key={i} className="flex-1 flex flex-col items-center" title={`${d.date}: ${d[metric].toLocaleString()}`}>
            <div className="w-full rounded-t-sm bg-primary/70 hover:bg-primary transition-colors" style={{ height: `${pct}%` }} />
          </div>
        )
      })}
    </div>
  )
}

// ─── Top Post Row ─────────────────────────────────────────────────────────────

function TopPostRow({ post, rank }) {
  const def = CHANNEL_DEFS.find(c => c.id === post.channel)
  if (!def) return null
  const { Icon, color, bg } = def

  return (
    <div className="flex items-start gap-4 py-3 border-b border-border last:border-0 hover:bg-muted/20 px-4 transition-colors">
      <span className="text-sm font-bold text-muted-foreground w-5 shrink-0 pt-0.5">{rank}</span>
      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${bg} mt-0.5`}>
        <Icon className={`h-3.5 w-3.5 ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground line-clamp-2 leading-snug">{post.text}</p>
        <p className="text-xs text-muted-foreground mt-1">{post.date}</p>
      </div>
      <div className="text-right shrink-0 space-y-0.5">
        <p className="text-sm font-semibold text-foreground">{post.reach.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">reach</p>
      </div>
      <div className="text-right shrink-0 space-y-0.5 hidden sm:block">
        <p className="text-sm font-semibold text-foreground">{(post.likes + post.comments + post.shares).toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">engmt</p>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function BroadrAnalyticsPage() {
  const [range, setRange] = useState(RANGES[1])
  const [overview, setOverview] = useState(SEED_OVERVIEW)
  const [byChannel, setByChannel] = useState(SEED_BY_CHANNEL)
  const [topPosts, setTopPosts] = useState(SEED_TOP_POSTS)
  const [chart, setChart] = useState(SEED_CHART)
  const [chartMetric, setChartMetric] = useState('reach')
  const [rangeOpen, setRangeOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetchData() {
      setLoading(true)
      try {
        const res = await api.get('/broadr/analytics')
        if (!cancelled && res) {
          if (res.overview) setOverview(res.overview)
          if (res.byChannel) setByChannel(res.byChannel)
          if (res.topPosts) setTopPosts(res.topPosts)
          if (res.chart) setChart(res.chart)
        }
      } catch {
        // Keep seed data
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => { cancelled = true }
  }, [range])

  return (
    <PageLayout>
      <Header />
      <main className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <BarChart2 className="h-6 w-6 text-primary" />
              Analytics
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track reach, engagement, and growth across all your channels.
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => setRangeOpen(!rangeOpen)}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors shadow-sm"
            >
              {range}
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
            {rangeOpen && (
              <div className="absolute right-0 top-full mt-1 z-20 rounded-lg border border-border bg-card shadow-lg py-1 min-w-[160px]">
                {RANGES.map(r => (
                  <button key={r} onClick={() => { setRange(r); setRangeOpen(false) }}
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-muted transition-colors ${r === range ? 'text-primary font-medium' : 'text-foreground'}`}>
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Reach" value={overview.total_reach.toLocaleString()} change={overview.reach_change} icon={<Eye className="h-4 w-4" />} />
          <StatCard label="Impressions" value={overview.impressions.toLocaleString()} change={overview.impressions_change} icon={<BarChart2 className="h-4 w-4" />} />
          <StatCard label="Engagements" value={overview.engagements.toLocaleString()} change={overview.engagement_change} icon={<Heart className="h-4 w-4" />} />
          <StatCard label="New Followers" value={`+${overview.followers_gained}`} change={overview.followers_change} icon={<Users className="h-4 w-4" />} />
        </div>

        {/* Chart */}
        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">Performance Over Time</h2>
            <div className="flex gap-2">
              {['reach', 'engagements'].map(m => (
                <button key={m} onClick={() => setChartMetric(m)}
                  className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors ${
                    chartMetric === m ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-1 mb-1">
            {chart.map((d, i) => <div key={i} className="flex-1 text-center text-[8px] text-muted-foreground truncate">{d.date}</div>)}
          </div>
          <MiniChart data={chart} metric={chartMetric} />
        </section>

        {/* By Channel */}
        <section>
          <h2 className="text-base font-semibold text-foreground mb-4">By Channel</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {byChannel.map(ch => <ChannelCard key={ch.channel} data={ch} />)}
          </div>
        </section>

        {/* Top Posts */}
        <section className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Top Performing Posts
            </h2>
            <button className="flex items-center gap-1 text-xs text-primary hover:underline">
              View all <ExternalLink className="h-3 w-3" />
            </button>
          </div>
          <div>
            {topPosts.map((p, i) => <TopPostRow key={p.id} post={p} rank={i + 1} />)}
          </div>
        </section>
      </main>
    </PageLayout>
  )
}
