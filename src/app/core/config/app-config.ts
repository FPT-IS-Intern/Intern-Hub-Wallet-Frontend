import { environment } from '../../../environments/environment';

export function getBaseUrl(): string {
  const shellEnv = (window as any).__env;

  if (shellEnv && shellEnv.apiUrl) {
    // Ensure the URL doesn't have a trailing slash if it's meant to be concatenated with paths starting with /
    const url = shellEnv.apiUrl;
    return url.endsWith('/') ? url.slice(0, -1) : url;
  }

  // Fallback for independent development (non-shell mode)
  // We can use the Proxy URL if needed, but the goal is to use an absolute URL eventually.
  console.warn('Shell environment not found! Using fallback/default API URL.');
  return 'https://internhub-v2.bbtech.io.vn/api';
}

export function getMfeBaseUrl(): string {
  const baseUrl = environment.mfeBaseUrl || '';
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
}

export function getPublicAssetUrl(assetPath: string): string {
  const normalizedAssetPath = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
  const mfeBaseUrl = getMfeBaseUrl();

  return mfeBaseUrl ? `${mfeBaseUrl}${normalizedAssetPath}` : normalizedAssetPath;
}
