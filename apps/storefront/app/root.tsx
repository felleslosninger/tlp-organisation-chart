import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import { Container } from './components/ui/Container/Container';
import { Header } from './components/ui/Header/Header';

/* import classes from './root.module.css'; */
import { Spinner } from '@digdir/designsystemet-react';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1'
        />
        <link
          rel='stylesheet'
          href='/root.css'
        />
        <Meta />
        <Links />
      </head>
      <body>
        <Header />
        <Container>{children}</Container>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function HydrateFallback() {
  return (
    <div>
      <Spinner title='loading content' />
    </div>
  );
}
