/**
 * Resolves a lesson's playable iframe URL. Bunny Stream *API* URLs return 403 in iframes;
 * use the embed host instead when we have a library id + video guid.
 */
export function getLessonVideoSrc(lesson: Record<string, unknown> | null | undefined): string {
  if (!lesson) return '';

  const libraryId = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID || '' : '';

  const embedUrl = lesson.embed_url ?? lesson.embedUrl;
  if (typeof embedUrl === 'string' && embedUrl.trim()) return embedUrl.trim();

  let direct =
    (typeof lesson.video_url === 'string' && lesson.video_url) ||
    (typeof lesson.videoUrl === 'string' && lesson.videoUrl) ||
    '';
  direct = direct.trim();

  let result = direct;

  // Handle various Bunny Stream URL formats
  const isBunnyUrl = direct && (
    direct.includes('video.bunnycdn.com') || 
    direct.includes('iframe.mediadelivery.net') ||
    direct.includes('vz-') // Some bunny domains start with vz-
  );

  if (isBunnyUrl) {
    const guidMatch = direct.match(/\/([a-f0-9-]{36})/i);
    const libMatch = direct.match(/\/embed\/(\d+)\//i) || direct.match(/\/library\/(\d+)\//i);
    const lib = libraryId || libMatch?.[1];
    const guid = guidMatch?.[1];

    if (guid && lib) {
      result = `https://iframe.mediadelivery.net/embed/${lib}/${guid}`;
    }
  } else if (!direct) {
    const vid = lesson.video_id ?? lesson.videoId;
    if (typeof vid === 'string' && vid) {
      const lib = libraryId || (typeof lesson.library_id === 'string' ? lesson.library_id : '') || (typeof lesson.libraryId === 'string' ? lesson.libraryId : '');
      if (lib) {
        result = `https://iframe.mediadelivery.net/embed/${lib}/${vid}`;
      }
    }
  }

  if (result) {
    // Add start time if available
    const watched = Number(lesson.watched_seconds ?? lesson.watchedSeconds ?? 0);
    if (watched > 0) {
      const separator = result.includes('?') ? '&' : '?';
      return `${result}${separator}t=${watched}`;
    }
    return result;
  }

  return '';
}
