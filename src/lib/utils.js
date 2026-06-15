import { format, formatDistanceToNow, parseISO } from 'date-fns'

export const formatDate = (dateStr) =>
  format(parseISO(dateStr), 'dd MMM yyyy')

export const timeAgo = (dateStr) =>
  formatDistanceToNow(parseISO(dateStr), { addSuffix: true })

export const formatTime = (timeStr) => {
  const [h, m] = timeStr.split(':')
  const d = new Date(); d.setHours(+h, +m)
  return format(d, 'h:mm a')
}

export const formatDuration = (secs) => {
  if (!secs) return '--:--'
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export const slugify = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const todayName = () =>
  new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()

export const getCurrentHHMM = () => {
  const now = new Date()
  return `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:00`
}

export const isOnAir = (start, end) => {
  const now = getCurrentHHMM()
  return now >= start && now <= end
}

export const truncate = (str = '', n = 120) =>
  str.length > n ? str.slice(0, n).trimEnd() + '…' : str

export const CATEGORIES = [
  { label: 'All',           value: 'all' },
  { label: 'Politics',      value: 'politics' },
  { label: 'Sports',        value: 'sports' },
  { label: 'Entertainment', value: 'entertainment' },
  { label: 'Health',        value: 'health' },
  { label: 'Agriculture',   value: 'agriculture' },
  { label: 'Education',     value: 'education' },
  { label: 'General',       value: 'general' },
]

export const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']

// TODO: Replace Station 8 name, frequency, location and color when you get details
export const STATIONS_SEED = [
  { name:'Premier 93.5 FM',   slug:'premier-93-5',   frequency:'93.5',  tagline:'Your Dependable Companion', location:'Ibadan, Oyo State',    color:'#1A6B9A', stream_url:'' },
  { name:'Amuludun 99.1 FM',  slug:'amuludun-99-1',  frequency:'99.1',  tagline:'O Tawonyo — Stand Out',      location:'Ibadan, Oyo State',    color:'#8B5E3C', stream_url:'' },
  { name:'Paramount 94.5 FM', slug:'paramount-94-5', frequency:'94.5',  tagline:'The Voice of Ogun State',    location:'Abeokuta, Ogun State', color:'#5A3B9A', stream_url:'' },
  { name:'Positive 102.5 FM', slug:'positive-102-5', frequency:'102.5', tagline:'Stay Positive',               location:'Ondo State',           color:'#1B7A4A', stream_url:'' },
  { name:'Gold 95.5 FM',      slug:'gold-95-5',      frequency:'95.5',  tagline:'Pure Gold',                   location:'Ilesa, Osun State',    color:'#B8860B', stream_url:'' },
  { name:'Progress 105.5 FM', slug:'progress-105-5', frequency:'105.5', tagline:'Moving Forward',              location:'Southwest Zone',       color:'#8B2020', stream_url:'' },
  { name:'Choice 95.9 FM',    slug:'choice-95-9',    frequency:'95.9',  tagline:'Your First Choice',           location:'Southwest Zone',       color:'#2D6A4F', stream_url:'' },
  // TODO: Update name, slug, frequency, tagline, location, color below
  { name:'Station 8 FM',      slug:'station-8',      frequency:'XX.X',  tagline:'Coming Soon',                 location:'Southwest Zone',       color:'#6B4A9A', stream_url:'' },
]

// TODO: Replace with real social media URLs when you get them from management
export const SOCIAL_LINKS = {
  facebook:  'https://facebook.com/radionigeriaibadan',
  twitter:   'https://twitter.com/radionigeriaibadan',
  instagram: 'https://instagram.com/radionigeriaibadan',
  youtube:   'https://youtube.com/@radionigeriaibadan',
}
