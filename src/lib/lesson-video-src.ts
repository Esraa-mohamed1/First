/**
 * Resolves a lesson's playable Bunny iframe URL.
 * - Prefer video_url (embed) over embed_url (often HLS .m3u8 — must not load in iframe)
 * - Rebuild incomplete mediadelivery URLs from video_id + library_id
 */

const GUID_RE = /([a-f0-9-]{36})/i;
const LIB_EMBED_RE = /\/embed\/(\d+)\//i;
const LIB_API_RE = /\/library\/(\d+)\//i;
const EMBED_HOST = 'https://iframe.mediadelivery.net';

export type LessonVideoContext = {
  libraryId?: string;
};

function isStreamManifest(url: string): boolean {
  return (
    /\.m3u8(\?|$)/i.test(url) ||
    (/\.b-cdn\.net/i.test(url) && !/\/embed\//i.test(url))
  );
}

function isBunnyRelatedUrl(url: string): boolean {
  return (
    /mediadelivery\.net/i.test(url) ||
    /video\.bunnycdn\.com/i.test(url) ||
    /^vz-/i.test(url)
  );
}

function isBunnyEmbedUrl(url: string): boolean {
  return /mediadelivery\.net\/embed\//i.test(url);
}

function extractGuid(url: string): string | null {
  const match = url.match(GUID_RE);
  return match?.[1] ?? null;
}

function extractLibraryFromUrl(url: string): string | null {
  const match = url.match(LIB_EMBED_RE) || url.match(LIB_API_RE);
  return match?.[1] ?? null;
}

function lessonLibraryId(
  lesson: Record<string, unknown>,
  context?: LessonVideoContext
): string {
  const fromLesson =
    lesson.library_id ?? lesson.libraryId ?? lesson.bunny_library_id;
  const raw = context?.libraryId ?? fromLesson ?? '';
  if (typeof raw === 'number') return String(raw);
  if (typeof raw === 'string') return raw.trim();
  return '';
}

function lessonVideoGuid(lesson: Record<string, unknown>): string {
  const id = lesson.video_id ?? lesson.videoId;
  if (typeof id === 'string' && id.trim()) return id.trim();
  if (typeof id === 'number') return String(id);
  return '';
}

function buildEmbedUrl(libraryId: string, videoGuid: string): string {
  return `${EMBED_HOST}/embed/${libraryId}/${videoGuid}`;
}

function normalizeBunnyEmbedUrl(
  url: string,
  libraryId: string,
  fallbackGuid: string
): string | null {
  const guid = extractGuid(url) || fallbackGuid;
  const lib = extractLibraryFromUrl(url) || libraryId;
  if (!guid || !lib) return null;
  return buildEmbedUrl(lib, guid);
}

function appendStartTime(url: string, lesson: Record<string, unknown>): string {
  const watched = Number(lesson.watched_seconds ?? lesson.watchedSeconds ?? 0);
  if (watched <= 0) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${watched}`;
}

export function getLessonVideoSrc(
  lesson: Record<string, unknown> | null | undefined,
  context?: LessonVideoContext
): string {
  if (!lesson) return '';

  const envLibraryId =
    typeof process !== 'undefined'
      ? process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID || ''
      : '';
  const libraryId = lessonLibraryId(lesson, context) || envLibraryId;
  const videoGuid = lessonVideoGuid(lesson);

  const videoUrl = String(lesson.video_url ?? lesson.videoUrl ?? '')
    .trim()
    .replace(/\\\//g, '/');
  if (videoUrl && !isStreamManifest(videoUrl)) {
    if (isBunnyEmbedUrl(videoUrl) || isBunnyRelatedUrl(videoUrl)) {
      const embed = normalizeBunnyEmbedUrl(videoUrl, libraryId, videoGuid);
      if (embed) return appendStartTime(embed, lesson);
    } else if (!isBunnyRelatedUrl(videoUrl)) {
      return appendStartTime(videoUrl, lesson);
    }
  }

  const embedUrl = String(lesson.embed_url ?? lesson.embedUrl ?? '')
    .trim()
    .replace(/\\\//g, '/');
  if (embedUrl && isBunnyEmbedUrl(embedUrl) && !isStreamManifest(embedUrl)) {
    const embed = normalizeBunnyEmbedUrl(embedUrl, libraryId, videoGuid);
    if (embed) return appendStartTime(embed, lesson);
  }

  if (videoGuid && libraryId) {
    return appendStartTime(buildEmbedUrl(libraryId, videoGuid), lesson);
  }

  return '';
}

export function getLessonVideoIds(
  lesson: Record<string, unknown> | null | undefined,
  context?: LessonVideoContext
): { videoId: string; libraryId: string } | null {
  if (!lesson) return null;
  const envLibraryId =
    typeof process !== 'undefined'
      ? process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID || ''
      : '';
  const libraryId = lessonLibraryId(lesson, context) || envLibraryId;
  const videoId =
    lessonVideoGuid(lesson) ||
    extractGuid(String(lesson.video_url ?? lesson.videoUrl ?? '')) ||
    extractGuid(String(lesson.embed_url ?? lesson.embedUrl ?? ''));
  if (!videoId || !libraryId) return null;
  return { videoId, libraryId };
}
