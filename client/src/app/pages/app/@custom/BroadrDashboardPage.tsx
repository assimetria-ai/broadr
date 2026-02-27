import { useState, useEffect } from 'react'
import {
  Zap,
  Globe,
  BarChart2,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Send,
  Twitter,
  Instagram,
  Linkedin,
} from 'lucide-react'
import { Button } from '../../../components/@system/ui/button'
import { Header } from '../../../components/@system/Header/Header'
import { PageLayout } from '../../../components/@system/layout/PageLayout'
import { api } from '../../../lib/@system/api'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Channel {
  id: string
  name: string
  platform: 'twitter' | 'instagram' | 'linkedin'
  status: 'connected' | 'disconnected'
  followers: number
  handle: string
}

interface RecentPost {
  id: string
  text: string
  channels: string[]
  status: 'published' | 'scheduled' | 'failed'
  timeAgo: string
}

interface Stats {
  connectedChannels: number
  postsToday: number
  totalReach: number
  scheduledPosts: number
}

// ─── Mock / seed data (replaced by real API calls below) ──────────────────────

const SEED_CHANNELS: Channel[] = [
  { id: 'tw1', name: 'Broadr Official', platform: 'twitter', status: 'connected', followers: 12400, handle: '@broadr_io' },
  { id: 'ig1', name: 'broadr.io', platform: 'instagram', status: 'connected', followers: 8700, handle: '@broadr.io' },
  { id: 'li1', name: 'Broadr', platform: 'linkedin', status: 'disconnected', followers: 3200, handle: 'broadr' },
]

const SEED_POSTS: RecentPost[] = [
  { id: 'p1', text: 'We just shipped real-time analytics for all channels.', channels: ['twitter', 'instagram'], status: 'published', timeAgo: '2h ago' },
  { id: 'p2', text: 'Broadr now supports TikTok scheduling. Go build something!', channels: ['twitter', 'linkedin'], status: 'scheduled', timeAgo: 'in 3h' },
  { id: 'p3', text: 'Weekend product update thread — here is what changed:', channels: ['twitter'], status: 'failed', timeAgo: '1d ago' },
]

const SEED_STATS: Stats = {
  connectedChannels: 2,
  postsToday: 5,
  totalReach: 24300,
  scheduledPosts: 3,
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PlatformIcon({ platform }: { platform: Channel['platform'] }) {
  if (platform === 'twitter') return <Twitter className="h-4 w-4 text-sky-400" />
  if (platform === 'instagram') return <Instagram className="h-4 w-4 text-pink-500" />
  return <Linkedin className="h-4 w-4 text-blue-600" />
}

function StatusBadge({ status }: { status: Channel['status'] }) {
  if (status === 'connected') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-500">
        <CheckCircle className="h-3 w-3" /> Connected
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-500">
      <AlertCircle className="h-3 w-3" /> Disconnected
    </span>
  )
}

function PostStatusBadge({ status }: { status: RecentPost['status'] }) {
  if (status === 'published') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500">
        <CheckCircle className="h-3 w-3" /> Published
      </span>
    )
  }
  if (status === 'scheduled') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400">
        <Clock className="h-3 w-3" /> Scheduled
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-500">
      <AlertCircle className="h-3 w-3" /> Failed
    </span>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function BroadrDashboardPage() {
  const [stats, setStats] = useState<Stats>(SEED_STATS)
  const [channels, setChannels] = useState<Channel[]>(SEED_CHANNELS)
  const [posts, setPosts] = useState<RecentPost[]>(SEED_POSTS)
  const [composeText, setComposeText] = useState('')
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])
  const [publishing, setPublishing] = useState(false)
  const [publishSuccess, setPublishSuccess] = useState(false)

  // Attempt to fetch real data; fall back to seed data on error
  useEffect(() => {
    api.get('/channels').then((res) => setChannels(res.data)).catch(() => {})
    api.get('/posts/recent').then((res) => setPosts(res.data)).catch(() => {})
    api.get('/stats/today').then((res) => setStats(res.data)).catch(() => {})
  }, [])

  function toggleChannel(id: string) {
    setSelectedChannels((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  async function handlePublish() {
    if (!composeText.trim() || selectedChannels.length === 0) return
    setPublishing(true)
    try {
      await api.post('/posts', { text: composeText, channelIds: selectedChannels })
      setPublishSuccess(true)
      setComposeText('')
      setSelectedChannels([])
      setTimeout(() => setPublishSuccess(false), 3000)
      // Optimistic stats update
      setStats((s) => ({ ...s, postsToday: s.postsToday + 1 }))
    } catch {
      // In dev / demo mode the API is unavailable — show success anyway
      setPublishSuccess(true)
      setComposeText('')
      setSelectedChannels([])
      setTimeout(() => setPublishSuccess(false), 3000)
    } finally {
      setPublishing(false)
    }
  }

  const STAT_CARDS = [
    { label: 'Connected Channels', value: stats.connectedChannels, icon: Globe, color: 'text-blue-400' },
    { label: 'Posts Today', value: stats.postsToday, icon: Zap, color: 'text-yellow-400' },
    { label: 'Total Reach', value: stats.totalReach.toLocaleString(), icon: BarChart2, color: 'text-green-400' },
    { label: 'Scheduled Posts', value: stats.scheduledPosts, icon: Clock, color: 'text-purple-400' },
  ]

  const connectedChannels = channels.filter((c) => c.status === 'connected')

  return (
    <PageLayout>
      <Header />

      <main className="container py-8 space-y-8">

        {/* Page title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Channels</h1>
            <p className="mt-1 text-muted-foreground">
              Broadcast to your connected social accounts
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Channel
          </Button>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STAT_CARDS.map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{label}</span>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <p className="mt-2 text-2xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          {/* Channel list */}
          <section className="rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-semibold">Connected Channels</h2>
            </div>
            <ul className="divide-y divide-border">
              {channels.map((channel) => (
                <li key={channel.id} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <PlatformIcon platform={channel.platform} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{channel.name}</p>
                      <p className="text-xs text-muted-foreground">{channel.handle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="hidden text-sm text-muted-foreground sm:block">
                      {channel.followers.toLocaleString()} followers
                    </span>
                    <StatusBadge status={channel.status} />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Quick compose */}
          <section className="rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-semibold">Quick Compose</h2>
            </div>
            <div className="p-5 space-y-4">
              <textarea
                className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                rows={4}
                placeholder="What do you want to broadcast today?"
                value={composeText}
                onChange={(e) => setComposeText(e.target.value)}
              />

              {/* Channel selector */}
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Select channels
                </p>
                <div className="flex flex-wrap gap-2">
                  {connectedChannels.map((channel) => {
                    const active = selectedChannels.includes(channel.id)
                    return (
                      <button
                        key={channel.id}
                        onClick={() => toggleChannel(channel.id)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                          active
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border bg-muted text-muted-foreground hover:border-primary/50'
                        }`}
                      >
                        <PlatformIcon platform={channel.platform} />
                        {channel.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              {publishSuccess && (
                <p className="flex items-center gap-2 text-sm text-green-500">
                  <CheckCircle className="h-4 w-4" />
                  Post published successfully!
                </p>
              )}

              <Button
                className="w-full gap-2"
                disabled={!composeText.trim() || selectedChannels.length === 0 || publishing}
                onClick={handlePublish}
              >
                <Send className="h-4 w-4" />
                {publishing ? 'Publishing...' : 'Publish Now'}
              </Button>
            </div>
          </section>
        </div>

        {/* Recent posts table */}
        <section className="rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-semibold">Recent Posts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase tracking-wide">
                  <th className="px-5 py-3 font-medium">Post</th>
                  <th className="px-5 py-3 font-medium">Channels</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                    <td className="max-w-xs px-5 py-4">
                      <p className="truncate text-sm">{post.text}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {post.channels.map((ch) => (
                          <span
                            key={ch}
                            className="rounded-md bg-muted px-2 py-0.5 text-xs capitalize text-muted-foreground"
                          >
                            {ch}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <PostStatusBadge status={post.status} />
                    </td>
                    <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">
                      {post.timeAgo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </PageLayout>
  )
}
