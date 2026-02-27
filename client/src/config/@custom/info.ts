// @custom — Broadr product config
import type { info as SystemInfo } from '../@system/info'

export const customInfo: Partial<typeof SystemInfo> = {
  name: 'Broadr',
  tagline: 'The social media API that replaces everything.',
  url: import.meta.env.VITE_APP_URL ?? 'https://broadr.com',
  supportEmail: 'support@broadr.com',
}
