import axios from 'axios';
import { Manifest, ManifestPageRef, PageLayoutManifest } from '@mfe/shared-types';

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const resolveGatewayOrigin = (): string => {
  const raw =
    (typeof process !== 'undefined' && process.env.VITE_GATEWAY_URL)
    || (typeof process !== 'undefined' && process.env.GATEWAY_URL)
    || 'http://localhost:8080/api';
  // static manifest root gateway kökünde; /api varsa kaldır
  return trimTrailingSlash(raw.replace(/\/api\/?$/, ''));
};

/**
 * Manifest kaynağını mümkün olduğunca aynı origin üzerinden çekerek CORS sorununu önle.
 * Öncelik sırası:
 * 1) VITE_MANIFEST_BASE / MANIFEST_BASE_URL (örn. "/manifest/v1" veya tam URL)
 * 2) resolveGatewayOrigin() + "/manifest/v1" (mevcut davranış)
 */
const envManifestBase =
  (typeof process !== 'undefined' && (process.env.VITE_MANIFEST_BASE ?? process.env.MANIFEST_BASE_URL)) ||
  (typeof window !== 'undefined' &&
    ((window as Window & { __env__?: Record<string, string>; __ENV__?: Record<string, string> }).__env__?.VITE_MANIFEST_BASE ||
      (window as Window & { __env__?: Record<string, string>; __ENV__?: Record<string, string> }).__ENV__?.VITE_MANIFEST_BASE));

const manifestBase =
  envManifestBase && envManifestBase.trim().length > 0
    ? envManifestBase.replace(/\/+$/, '')
    : `${resolveGatewayOrigin()}/manifest/v1`;

export const fetchManifest = async (): Promise<Manifest> => {
  const res = await axios.get<Manifest>(`${manifestBase}/manifest.json`);
  return res.data;
};

export const fetchPageLayout = async (pageId: string): Promise<PageLayoutManifest> => {
  const manifest = await fetchManifest();
  const pageRef: ManifestPageRef | undefined = manifest.pages?.[pageId];
  const layoutUrl = pageRef?.layoutUrl ?? `${manifestBase}/page-${pageId}.layout.json`;
  const res = await axios.get<PageLayoutManifest>(layoutUrl.startsWith('http') ? layoutUrl : `${manifestBase}/page-${pageId}.layout.json`);
  return res.data;
};
