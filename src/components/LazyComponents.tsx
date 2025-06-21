import { lazy, Suspense } from 'react';
import { LoadingLogo } from './LoadingLogo';

// Lazy load heavy components
const PhotoModalLazy = lazy(() => import('./PhotoModal'));
const KeyboardShortcutsHelpLazy = lazy(() => import('./KeyboardShortcutsHelp'));

// Loading component for suspense fallback
const ComponentLoader = ({ size = 40 }: { size?: number }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '100px',
    width: '100%'
  }}>
    <LoadingLogo size={size} />
  </div>
);

// Wrapped lazy components with Suspense
export const PhotoModal = (props: any) => (
  <Suspense fallback={<ComponentLoader />}>
    <PhotoModalLazy {...props} />
  </Suspense>
);

export const KeyboardShortcutsHelp = (props: any) => (
  <Suspense fallback={<ComponentLoader size={30} />}>
    <KeyboardShortcutsHelpLazy {...props} />
  </Suspense>
);

// Export types for proper typing
export type { PhotoModalProps } from './PhotoModal';
export type { KeyboardShortcutsHelpProps } from './KeyboardShortcutsHelp';