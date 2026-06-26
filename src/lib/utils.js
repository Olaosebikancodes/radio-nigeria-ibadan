import { format, formatDistanceToNow, parseISO } from "date-fns";

export const formatDate = (dateStr) => format(parseISO(dateStr), "dd MMM yyyy");

export const timeAgo = (dateStr) =>
  formatDistanceToNow(parseISO(dateStr), { addSuffix: true });

export const formatTime = (timeStr) => {
  const [h, m] = timeStr.split(":");
  const d = new Date();
  d.setHours(+h, +m);
  return format(d, "h:mm a");
};

export const formatDuration = (secs) => {
  if (!secs) return "--:--";
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

export const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const todayName = () =>
  new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();

export const getCurrentHHMM = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:00`;
};

export const isOnAir = (start, end) => {
  const now = getCurrentHHMM();
  return now >= start && now <= end;
};

export const truncate = (str = "", n = 120) =>
  str.length > n ? str.slice(0, n).trimEnd() + "…" : str;

// News article categories used in filtering. Add new categories here if needed.
export const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Politics", value: "politics" },
  { label: "Sports", value: "sports" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Health", value: "health" },
  { label: "Agriculture", value: "agriculture" },
  { label: "Education", value: "education" },
  { label: "General", value: "general" },
];

export const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

// Base URL for all images stored in Supabase Storage (the "images" bucket).
const IMG =
  "https://tfxpqxxzopsycpnmdyke.supabase.co/storage/v1/object/public/images";

// STATIONS_SEED is a fallback used only when the database returns no stations
// (e.g. during initial setup or if the "stations" table is empty).
// In normal operation, station data comes from the database and this is not used.
// The live stream URLs here point to the streaming server at centova57.instainternet.com.
export const STATIONS_SEED = [
  {
    name: "Premier FM",
    slug: "premier-93-5",
    frequency: "93.5",
    tagline: "Your Dependable Companion",
    location: "Ibadan, Oyo State",
    color: "#1A6B9A",
    stream_url: "https://centova57.instainternet.com/proxy/premier?mp=/stream",
    cover_image: `${IMG}/Premier%20FM.png`,
  },
  {
    name: "Amuludun 99.1 FM",
    slug: "amuludun-99-1",
    frequency: "99.1",
    tagline: "O ta won yo",
    location: "Moniya, Ibadan",
    color: "#8B5E3C",
    stream_url: "https://centova57.instainternet.com/proxy/amuludun?mp=/stream",
    cover_image: `${IMG}/Amuludun%20FM.png`,
  },
  {
    name: "Paramount 94.5 FM",
    slug: "paramount-94-5",
    frequency: "94.5",
    tagline: "Our integrity is paramount",
    location: "Abeokuta, Ogun State",
    color: "#5A3B9A",
    stream_url:
      "https://centova57.instainternet.com/proxy/paramount?mp=/stream",
    cover_image: `${IMG}/Paramount%20FM.png`,
  },
  {
    name: "Positive 102.5 FM",
    slug: "positive-102-5",
    frequency: "102.5",
    tagline: "The Positive Station",
    location: "Akure, Ondo State",
    color: "#C0392B",
    stream_url: "https://centova57.instainternet.com/proxy/positive?mp=/stream",
    cover_image: `${IMG}/Positive%20FM.png`,
  },
  {
    name: "Progress 100.5 FM",
    slug: "progress-100-5",
    frequency: "100.5",
    tagline: "Your Partner In Progress",
    location: "Ado Ekiti, Ekiti State",
    color: "#8B2020",
    stream_url: "https://centova57.instainternet.com/proxy/progress?mp=/stream",
    cover_image: `${IMG}/Progress%20FM.png`,
  },
  {
    name: "Gold 95.5 FM",
    slug: "gold-95-5",
    frequency: "95.5",
    tagline: "The Jewel of Osun State",
    location: "Ilesha, Osun State",
    color: "#B8860B",
    stream_url: "https://centova57.instainternet.com/proxy/gold?mp=/stream",
    cover_image: `${IMG}/Gold_FM.jpg-removebg-preview.png`,
  },
  {
    name: "Ogo-Ilu 89.3 FM",
    slug: "ogo-ilu-89-3",
    frequency: "89.3",
    tagline: "The society's pride",
    location: "Oko, Anambra State",
    color: "#2D7A3A",
    stream_url: "https://centova57.instainternet.com/proxy/ogoilu?mp=/stream",
    cover_image: `${IMG}/Ogo-Ilu%20FM.png`,
  },
  {
    name: "Asabari 88.3 FM",
    slug: "asabari-88-3",
    frequency: "88.3",
    tagline: "Ti wan tiwa",
    location: "Southwest Zone",
    color: "#6B4A9A",
    stream_url: "https://centova57.instainternet.com/proxy/asabari?mp=/stream",
    cover_image: `${IMG}/Asabari_FM-removebg-preview.png`,
  },
];

// Social media links shown in the Navbar and Footer.
// Update these URLs here if the station's Facebook or YouTube handles change.
export const SOCIAL_LINKS = {
  facebook: "https://facebook.com/radionigeriaibadan",
  youtube: "https://www.youtube.com/@pfm935ibadan",
};
