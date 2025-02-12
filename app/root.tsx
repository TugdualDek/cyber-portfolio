import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { HeadersFunction, LinksFunction } from "@remix-run/node";

import styles from "./tailwind.css?url";
import { DynamicBackground } from "./components/DynamicBackground";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "preconnect", href: "https://api.fonts.coollabs.io" },
  {
    rel: "preconnect",
    href: "https://api.fonts.coollabs.io",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://api.fonts.coollabs.io/css2?family=Exo+2:ital,wght@0,100..900;1,100..900&display=swap",
  },
  { rel: "preload", as: "image", href: "/assets/tugdual.webp", fetchpriority: "high"  },
  { rel: "me", href: "https://mastodon.social/@ThugDrk" },
  { rel: "manifest", href: "/manifest.json" },
  {
    rel: "icon",
    type: "image/svg+xml",
    href: "/favicon.svg",
  },
];

export const headers: HeadersFunction = ({
  actionHeaders,
  errorHeaders,
  loaderHeaders,
  parentHeaders,
}) => ({
  "Cache-Control": "public, max-age=3600",
});

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen flex flex-col relative">
        <DynamicBackground />
        <div className="relative z-10 flex-grow">
          {children}
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
