import { environment } from '../../../environments/environment';

export function getBaseUrl(): string {
  const shellEnv = (window as any).__env;

  if (shellEnv && shellEnv.apiUrl) {
    const url = shellEnv.apiUrl;

    return url.endsWith('/') ? url.slice(0, -1) : url;
  }

  // Fallback for independent development (non-shell mode)
  return '';
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
