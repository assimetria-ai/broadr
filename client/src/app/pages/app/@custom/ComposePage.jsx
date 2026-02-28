import { useState } from 'react'
import {
  Send,
  Clock,
  Image,
  Smile,
  Link2,
  Hash,
  X,
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Youtube,
  CheckCircle,
  AlertCircle,
  Calendar,
  ChevronDown,
} from 'lucide-react'
import { Header } from '../../../components/@system/Header/Header'
import { PageLayout } from '../../../components/@system/layout/PageLayout'
import { Button } from '../../../components/@system/ui/button'

// ─── Channels ────────────────────────────────────────────────────────────────

const CHANNELS = [
  { id: 'twitter', label: 'Twitter / X', icon: Twitter, color: 'text-[#1DA1F2]', bg: 'bg-[#1DA1F2]/10', limit: 280, connected: true },
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-[#E1306C]', bg: 'bg-[#E1306C]/10', limit: 2200, connected: true },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-[#0077B5]', bg: 'bg-[#0077B5]/10', limit: 3000, connected: true },
  { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-[#1877F2]', bg: 'bg-[#1877F2]/10', limit: 63206, connected: false },
  { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-[#FF0000]', bg: 'bg-[#FF0000]/10', limit: 5000, connected: false },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getCharCount(text, limit) {
  return { remaining: limit - text.length, pct: Math.min(100, (text.length / limit) * 100) }
}

// ─── Channel Toggle ───────────────────────────────────────────────────────────

function ChannelToggle({ channel, selected, onToggle }) {
  const Icon = channel.icon
  const enabled = channel.connected

  return (
    <button
      onClick={() => enabled && onToggle(channel.id)}
      disabled={!enabled}
      className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
        selected && enabled
          ? `${channel.bg} border-current ${channel.color} shadow-sm`
          : enabled
          ? 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
          : 'border-border bg-muted/30 text-muted-foreground/40 cursor-not-allowed'
      }`}
    >
      <Icon className={`h-4 w-4 ${selected && enabled ? channel.color : ''}`} />
      <span className="hidden sm:inline">{channel.label}</span>
      {!enabled && <span className="text-[10px] bg-muted rounded px-1 py-0.5 ml-auto">Connect</span>}
      {enabled && selected && <CheckCircle className="h-3.5 w-3.5 ml-auto" />}
    </button>
  )
}

// ─── Preview Card ─────────────────────────────────────────────────────────────

function PreviewCard({ channel, text, mediaUrl }) {
  const Icon = channel.icon
  const { remaining } = getCharCount(text, channel.limit)
  const overLimit = remaining < 0

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className={`flex h-7 w-7 items-center justify-center rounded-full ${channel.bg}`}>
          <Icon className={`h-4 w-4 ${channel.color}`} />
        </div>
        <span className="text-sm font-medium text-foreground">{channel.label}</span>
        {overLimit && (
          <span className="ml-auto flex items-center gap-1 text-xs text-red-500">
            <AlertCircle className="h-3.5 w-3.5" />
            {Math.abs(remaining)} over limit
          </span>
        )}
        {!overLimit && <span className="ml-auto text-xs text-muted-foreground">{remaining} left</span>}
      </div>
      <div className="rounded-lg bg-muted/40 p-3 min-h-[60px]">
        {text ? (
          <p className={`text-sm leading-relaxed whitespace-pre-wrap ${overLimit ? 'text-red-500' : 'text-foreground'}`}>
            {text.slice(0, channel.limit)}
            {overLimit && <span className="text-red-500">{text.slice(channel.limit)}</span>}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">Your post preview will appear here...</p>
        )}
        {mediaUrl && (
          <img src={mediaUrl} alt="media" className="mt-2 rounded-lg w-full object-cover max-h-48" />
        )}
      </div>
      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            overLimit ? 'bg-red-500' : getCharCount(text, channel.limit).pct > 80 ? 'bg-amber-400' : 'bg-primary'
          }`}
          style={{ width: `${Math.min(100, getCharCount(text, channel.limit).pct)}%` }}
        />
      </div>
    </div>
  )
}

// ─── Schedule Modal ───────────────────────────────────────────────────────────

function ScheduleModal({ onClose, onSchedule }) {
  const now = new Date()
  now.setMinutes(now.getMinutes() + 30)
  const defaultDatetime = now.toISOString().slice(0, 16)
  const [datetime, setDatetime] = useState(defaultDatetime)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="rounded-2xl border border-border bg-card shadow-xl w-full max-w-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Schedule Post
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Date & Time</label>
          <input
            type="datetime-local"
            value={datetime}
            onChange={e => setDatetime(e.target.value)}
            className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1 flex items-center gap-2" onClick={() => { onSchedule(datetime); onClose() }}>
            <Calendar className="h-4 w-4" />
            Schedule
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function ComposePage() {
  const [text, setText] = useState('')
  const [selectedChannels, setSelectedChannels] = useState(new Set(['twitter', 'instagram']))
  const [mediaUrl, setMediaUrl] = useState('')
  const [showSchedule, setShowSchedule] = useState(false)
  const [posting, setPosting] = useState(false)
  const [result, setResult] = useState(null) // 'sent' | 'scheduled' | null

  const connected = CHANNELS.filter(c => c.connected)
  const activeChannels = connected.filter(c => selectedChannels.has(c.id))
  const canPost = text.trim().length > 0 && activeChannels.length > 0 && !posting

  function toggleChannel(id) {
    setSelectedChannels(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function handlePost() {
    if (!canPost) return
    setPosting(true)
    await new Promise(r => setTimeout(r, 1500))
    setPosting(false)
    setResult('sent')
    setTimeout(() => { setResult(null); setText(''); setMediaUrl('') }, 3000)
  }

  function handleSchedule(datetime) {
    setResult('scheduled')
    setTimeout(() => { setResult(null); setText(''); setMediaUrl('') }, 3000)
  }

  function insertHashtag() {
    setText(prev => prev + (prev.endsWith(' ') || !prev ? '#' : ' #'))
  }

  return (
    <PageLayout>
      <Header />
      {showSchedule && <ScheduleModal onClose={() => setShowSchedule(false)} onSchedule={handleSchedule} />}
      <main className="container py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Send className="h-6 w-6 text-primary" />
              Compose Post
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Write once, publish to multiple channels instantly.
            </p>
          </div>

          {/* Success Banner */}
          {result && (
            <div className={`rounded-xl border p-4 flex items-center gap-3 ${
              result === 'sent' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-blue-50 border-blue-200 text-blue-700'
            }`}>
              <CheckCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">
                {result === 'sent'
                  ? `Posted to ${activeChannels.length} channel${activeChannels.length > 1 ? 's' : ''} successfully!`
                  : 'Post scheduled successfully!'}
              </p>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left: Compose */}
            <div className="space-y-4">
              {/* Channel Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Publish to</label>
                <div className="flex flex-wrap gap-2">
                  {CHANNELS.map(ch => (
                    <ChannelToggle
                      key={ch.id}
                      channel={ch}
                      selected={selectedChannels.has(ch.id)}
                      onToggle={toggleChannel}
                    />
                  ))}
                </div>
              </div>

              {/* Text Area */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Content</label>
                <div className="rounded-xl border border-border bg-card overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary transition-all">
                  <textarea
                    className="w-full resize-none bg-transparent px-4 pt-4 pb-2 text-sm text-foreground outline-none min-h-[160px] leading-relaxed placeholder:text-muted-foreground"
                    placeholder="What's on your mind? Write something great..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                  />
                  {/* Toolbar */}
                  <div className="flex items-center gap-1 border-t border-border px-3 py-2">
                    <button
                      onClick={() => document.getElementById('media-input')?.click()}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="Add image"
                    >
                      <Image className="h-4 w-4" />
                    </button>
                    <button
                      onClick={insertHashtag}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="Add hashtag"
                    >
                      <Hash className="h-4 w-4" />
                    </button>
                    <button
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="Add emoji"
                    >
                      <Smile className="h-4 w-4" />
                    </button>
                    <button
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="Add link"
                    >
                      <Link2 className="h-4 w-4" />
                    </button>
                    <div className="ml-auto text-xs text-muted-foreground">
                      {text.length} chars
                    </div>
                  </div>
                </div>
                <input
                  id="media-input"
                  type="url"
                  className="hidden"
                  placeholder="Image URL"
                  onChange={e => setMediaUrl(e.target.value)}
                />
              </div>

              {/* Media URL (visible if image button clicked) */}
              {mediaUrl !== undefined && (
                <div className="relative">
                  <input
                    type="url"
                    value={mediaUrl}
                    onChange={e => setMediaUrl(e.target.value)}
                    placeholder="Paste image URL (https://...)"
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-muted-foreground pr-8"
                  />
                  {mediaUrl && (
                    <button
                      onClick={() => setMediaUrl('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSchedule(true)}
                  disabled={!text.trim()}
                  className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <Clock className="h-4 w-4" />
                  Schedule
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
                <Button
                  onClick={handlePost}
                  disabled={!canPost}
                  className="flex-1 flex items-center justify-center gap-2 font-semibold"
                >
                  {posting ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Publish Now
                      {activeChannels.length > 0 && (
                        <span className="rounded-full bg-white/20 px-1.5 text-xs">{activeChannels.length}</span>
                      )}
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Right: Live Previews */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Live Preview</p>
              {activeChannels.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/20 py-12 text-muted-foreground gap-2">
                  <Send className="h-8 w-8 opacity-30" />
                  <p className="text-sm">Select a channel to see preview</p>
                </div>
              ) : (
                activeChannels.map(ch => (
                  <PreviewCard key={ch.id} channel={ch} text={text} mediaUrl={mediaUrl} />
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </PageLayout>
  )
}
