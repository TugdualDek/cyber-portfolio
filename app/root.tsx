import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
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
        <meta name="google-site-verification" content="fCAUaoB1Kgs5L39XVbjpGfdCSgKVP1oc73ATiLge3yY" />
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
        <script async defer src="https://scripts.withcabin.com/hello.js"></script>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}


export function ErrorBoundary() {
  const error = useRouteError();
  
  // Déterminer le code d'erreur et le message
  const errorCode = isRouteErrorResponse(error) ? error.status : "404";
  const errorMessage = isRouteErrorResponse(error) 
    ? error.statusText 
    : error instanceof Error 
      ? error.message 
      : "Page Not Found";
  
  return (
    <html lang="en">
      <head>
        <title>Error {errorCode} - System Error</title>
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen flex flex-col relative">
        <DynamicBackground />
        
        
        <div className="min-h-screen flex items-center justify-center p-4 z-10">
          <div className="w-full max-w-md border border-red-500/30 bg-black/90 rounded-md overflow-hidden">
            {/* Header du terminal */}
            <div className="bg-black px-4 py-2 border-b border-red-500/30 flex items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              </div>
              <span className="text-red-500/80 text-sm ml-4">ERROR_{errorCode}</span>
            </div>
            
            {/* Contenu */}
            <div className="p-6 text-center">
              <h1 className="text-6xl text-red-500 font-bold mb-4">
                {errorCode}
              </h1>
              
              <p className="text-xl text-red-400 mb-6">
                {errorMessage}
              </p>
              
              <div className="mb-6 border border-green-500/30 p-3 mx-auto max-w-xs bg-black/80 text-left">
                <p className="text-green-500/90 font-mono text-sm">
                  <span className="text-blue-400">visitor@tugdual:~$</span> file not_found <br />
                  Error: Cannot access file. <br />
                  <span className="text-blue-400">visitor@tugdual:~$</span> <span className="animate-pulse">▮</span>
                </p>
              </div>
              
              <Link 
                to="/" 
                className="inline-block px-4 py-2 bg-black border border-green-500/50 hover:border-green-500 text-green-500 transition-colors rounded-sm"
              >
                Return to Command Center
              </Link>
            </div>
          </div>
        </div>
        
        <Scripts />
      </body>
    </html>
  );
}