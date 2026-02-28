import { useState } from 'react'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Twitter,
  Instagram,
  Linkedin,
  Edit2,
  Trash2,
  Send,
} from 'lucide-react'
import { Header } from '../../../components/@system/Header/Header'
import { PageLayout } from '../../../components/@system/layout/PageLayout'
import { Button } from '../../../components/@system/ui/button'
import { useNavigate } from 'react-router-dom'

// ─── Seed Data ────────────────────────────────────────────────────────────────

const CHANNEL_ICONS = {
  twitter: { Icon: Twitter, color: 'text-[#1DA1F2]', bg: 'bg-[#1DA1F2]/15' },
  instagram: { Icon: Instagram, color: 'text-[#E1306C]', bg: 'bg-[#E1306C]/15' },
  linkedin: { Icon: Linkedin, color: 'text-[#0077B5]', bg: 'bg-[#0077B5]/15' },
}

function makeScheduledPosts() {
  const now = new Date()
  const posts = []
  const texts = [
    { text: '🚀 Excited to share our latest product update! Check out the new features we\'ve shipped this week.', channels: ['twitter', 'linkedin'] },
    { text: 'Behind the scenes look at our team building something amazing. What do you think we\'re working on? 👀', channels: ['instagram'] },
    { text: 'New blog post: "10 Ways to Grow Your Audience in 2026" — link in bio!', channels: ['twitter', 'instagram', 'linkedin'] },
    { text: 'We just hit 10k followers! Thank you so much for your support 🙏 This community means everything.', channels: ['twitter', 'instagram'] },
    { text: 'Sharing our quarterly insights on social media trends. What\'s working for your brand?', channels: ['linkedin'] },
    { text: 'Drop day! Our limited edition release goes live in 24 hours. Are you ready?', channels: ['twitter', 'instagram'] },
    { text: 'Weekly roundup: top industry news, tips, and what we\'ve been reading. Check it out! 📰', channels: ['linkedin'] },
  ]

  texts.forEach((p, i) => {
    const date = new Date(now)
    date.setDate(date.getDate() + Math.floor(i * 1.5))
    date.setHours(9 + (i % 3) * 3, i % 2 === 0 ? 0 : 30, 0, 0)
    posts.push({
      id: i + 1,
      text: p.text,
      channels: p.channels,
      scheduledAt: date.toISOString(),
      status: i < 2 ? 'published' : 'scheduled',
    })
  })

  return posts
}

const SEED_POSTS = makeScheduledPosts()

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function formatDateLabel(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

// ─── Post Card ────────────────────────────────────────────────────────────────

function PostCard({ post, onDelete }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`group rounded-xl border bg-card p-4 transition-all hover:shadow-sm ${
      post.status === 'published' ? 'border-green-200 bg-green-50/30' : 'border-border'
    }`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              post.status === 'published'
                ? 'bg-green-100 text-green-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {post.status === 'published' ? 'Published' : 'Scheduled'}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatDateLabel(post.scheduledAt)} at {formatTime(post.scheduledAt)}
            </span>
          </div>
          <p className={`text-sm text-foreground leading-relaxed ${!expanded && 'line-clamp-2'}`}>
            {post.text}
          </p>
          {post.text.length > 120 && (
            <button onClick={() => setExpanded(!expanded)} className="text-xs text-primary mt-1 hover:underline">
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
          <div className="flex items-center gap-1.5 mt-3">
            {post.channels.map(ch => {
              const def = CHANNEL_ICONS[ch]
              if (!def) return null
              const { Icon, color, bg } = def
              return (
                <span key={ch} className={`flex h-5 w-5 items-center justify-center rounded-full ${bg}`}>
                  <Icon className={`h-3 w-3 ${color}`} />
                </span>
              )
            })}
          </div>
        </div>
        {/* Actions */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          {post.status === 'scheduled' && (
            <button className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={() => onDelete(post.id)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Calendar Grid ────────────────────────────────────────────────────────────

function CalendarGrid({ year, month, posts, onDayClick, selectedDay }) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  function postsOnDay(d) {
    const day = new Date(year, month, d)
    return posts.filter(p => isSameDay(new Date(p.scheduledAt), day))
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="grid grid-cols-7 border-b border-border">
        {DAYS.map(d => (
          <div key={d} className="py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((d, i) => {
          if (!d) return <div key={`empty-${i}`} className="min-h-[80px] border-b border-r border-border/50 last:border-r-0 bg-muted/10" />
          const dayPosts = postsOnDay(d)
          const isToday = isSameDay(new Date(year, month, d), today)
          const isSelected = selectedDay === d

          return (
            <div
              key={d}
              onClick={() => onDayClick(d)}
              className={`min-h-[80px] border-b border-r border-border/50 last:border-r-0 p-1.5 cursor-pointer hover:bg-primary/5 transition-colors ${
                isSelected ? 'bg-primary/10' : ''
              }`}
            >
              <span className={`text-xs font-medium flex h-6 w-6 items-center justify-center rounded-full ${
                isToday ? 'bg-primary text-primary-foreground' : 'text-foreground'
              }`}>
                {d}
              </span>
              <div className="mt-1 space-y-0.5">
                {dayPosts.slice(0, 2).map((p) => (
                  <div
                    key={p.id}
                    className={`rounded px-1.5 py-0.5 text-[10px] truncate ${
                      p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {formatTime(p.scheduledAt)} · {p.channels[0]}
                  </div>
                ))}
                {dayPosts.length > 2 && (
                  <div className="text-[10px] text-muted-foreground px-1">+{dayPosts.length - 2} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function SchedulePage() {
  const navigate = useNavigate()
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [posts, setPosts] = useState(SEED_POSTS)
  const [selectedDay, setSelectedDay] = useState(now.getDate())
  const [view, setView] = useState('calendar') // 'calendar' | 'list'

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  function deletePost(id) {
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  const selectedDayPosts = posts.filter(p => {
    const d = new Date(p.scheduledAt)
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === selectedDay
  })

  const scheduledCount = posts.filter(p => p.status === 'scheduled').length
  const publishedCount = posts.filter(p => p.status === 'published').length

  return (
    <PageLayout>
      <Header />
      <main className="container py-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              Content Calendar
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {scheduledCount} scheduled · {publishedCount} published this month
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-border overflow-hidden">
              {['calendar', 'list'].map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-2 text-xs font-medium capitalize transition-colors ${
                    view === v ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <Button onClick={() => navigate('/app/compose')} className="flex items-center gap-2 font-semibold">
              <Plus className="h-4 w-4" />
              New Post
            </Button>
          </div>
        </div>

        {/* Month Nav */}
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h2 className="text-base font-semibold text-foreground min-w-[160px] text-center">
            {MONTHS[month]} {year}
          </h2>
          <button onClick={nextMonth} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {view === 'calendar' ? (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <CalendarGrid
                year={year}
                month={month}
                posts={posts}
                selectedDay={selectedDay}
                onDayClick={setSelectedDay}
              />
            </div>

            {/* Day Panel */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  {new Date(year, month, selectedDay).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/app/compose')}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </Button>
              </div>
              {selectedDayPosts.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-border bg-muted/20 py-10 flex flex-col items-center gap-2 text-muted-foreground">
                  <Send className="h-6 w-6 opacity-30" />
                  <p className="text-xs">No posts this day</p>
                </div>
              ) : (
                selectedDayPosts.map(p => (
                  <PostCard key={p.id} post={p} onDelete={deletePost} />
                ))
              )}
            </div>
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            {posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                <Calendar className="h-10 w-10 opacity-30" />
                <p className="text-sm font-medium">No posts scheduled</p>
                <Button onClick={() => navigate('/app/compose')} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Compose first post
                </Button>
              </div>
            ) : (
              posts.map(p => <PostCard key={p.id} post={p} onDelete={deletePost} />)
            )}
          </div>
        )}
      </main>
    </PageLayout>
  )
}
