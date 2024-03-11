import { RemixBrowser } from '@remix-run/react';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';

import '@digdir/designsystemet-css';
import '@digdir/designsystemet-theme';
/* import 'root.css'; */

startTransition(() => {
  hydrateRoot(
    // @ts-expect-error TS2345
    document.querySelector('#app'),
    <StrictMode>
      <RemixBrowser />
    </StrictMode>,
  );
});
