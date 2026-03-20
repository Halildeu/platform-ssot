import { Manifest, PageLayoutManifest } from '@mfe/shared-types';
export declare const fetchManifest: () => Promise<Manifest>;
export declare const fetchPageLayout: (pageId: string) => Promise<PageLayoutManifest>;
