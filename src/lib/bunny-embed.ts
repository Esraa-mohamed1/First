import crypto from 'crypto';

const EMBED_HOST = 'https://iframe.mediadelivery.net';

export function buildBunnyEmbedUrl(libraryId: string, videoId: string): string {
  return `${EMBED_HOST}/embed/${libraryId}/${videoId}`;
}

export function signBunnyEmbedUrl(
  libraryId: string,
  videoId: string,
  tokenKey: string,
  expiresInSeconds = 3600
): string {
  const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const token = crypto
    .createHash('sha256')
    .update(tokenKey + videoId + expires)
    .digest('hex');
  return `${buildBunnyEmbedUrl(libraryId, videoId)}?token=${token}&expires=${expires}`;
}

export function resolveSignedBunnyEmbedUrl(
  libraryId: string,
  videoId: string
): string {
  const tokenKey =
    process.env.BUNNY_EMBED_TOKEN_KEY ||
    process.env.BUNNY_STREAM_TOKEN_KEY ||
    '';
  if (tokenKey) {
    return signBunnyEmbedUrl(libraryId, videoId, tokenKey);
  }
  return buildBunnyEmbedUrl(libraryId, videoId);
}
