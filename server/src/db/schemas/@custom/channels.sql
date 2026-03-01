-- @custom channels table (Broadr social media channels)
CREATE TABLE IF NOT EXISTS channels (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER REFERENCES users(id) ON DELETE CASCADE,
  platform     TEXT NOT NULL, -- 'twitter'|'instagram'|'linkedin'|'facebook'|'tiktok'
  handle       TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  follower_count INTEGER DEFAULT 0,
  status       TEXT NOT NULL DEFAULT 'connected', -- 'connected'|'disconnected'|'expired'
  metadata     JSONB DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_channels_user_id ON channels(user_id);
CREATE INDEX IF NOT EXISTS idx_channels_platform ON channels(platform);
CREATE INDEX IF NOT EXISTS idx_channels_status ON channels(status);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER REFERENCES users(id) ON DELETE CASCADE,
  content      TEXT NOT NULL,
  channel_ids  JSONB NOT NULL DEFAULT '[]',
  status       TEXT NOT NULL DEFAULT 'published', -- 'published'|'scheduled'|'failed'|'draft'
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  media_urls   JSONB DEFAULT '[]',
  platform_ids JSONB DEFAULT '{}', -- platform → post id after publishing
  error_message TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_scheduled_at ON posts(scheduled_at);
