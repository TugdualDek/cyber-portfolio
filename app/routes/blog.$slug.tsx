import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { useMemo, memo } from "react";
import { getMDXComponent } from "mdx-bundler/client";
import { getPostBySlug } from "~/utils/mdx.server";
import { Footer } from "~/components/footer/Footer";
import { Navbar } from "~/components/navbar/Navbar";

// Types pour améliorer la sécurité de type
interface PostMeta {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  category: string;
  caseNumber?: string;
  coverImage?: string;
  classification: string;
  executionDate?: string;
  language?: string;
}

export const loader: LoaderFunction = async ({ params }) => {
  const slug = params.slug;
  if (!slug) throw new Response("Not found", { status: 404 });

  const post = await getPostBySlug(slug);
  if (!post) throw new Response("Not found", { status: 404 });

  // Utilisation de la fonction json() de Remix pour un meilleur typage
  return Response.json(post);
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [
      { title: "Not Found - Tugdual de Kerdrel" },
      { name: "description", content: "Article not found" },
    ];
  }
  
  return [
    { title: `${data.meta.title} - Tugdual de Kerdrel` },
    { name: "description", content: data.meta.excerpt },
    // Ajoutons quelques meta tags pour améliorer le SEO
    { property: "og:title", content: data.meta.title },
    { property: "og:description", content: data.meta.excerpt },
    ...(data.meta.coverImage ? [{ property: "og:image", content: data.meta.coverImage }] : []),
  ];
};

// Classification styles constants - extraction dans un objet pour éviter les recalculs
const CLASSIFICATION_STYLES = {
  'TOP SECRET': {
    banner: 'bg-red-900/80 text-red-200 border-b border-red-600/50',
    stamp: 'bg-red-900/60 border-red-700 text-red-200',
    border: 'border-red-700/50'
  },
  'SECRET': {
    banner: 'bg-orange-900/80 text-orange-200 border-b border-orange-600/50',
    stamp: 'bg-orange-900/60 border-orange-700 text-orange-200',
    border: 'border-orange-700/50'
  },
  'CONFIDENTIAL': {
    banner: 'bg-yellow-900/80 text-yellow-100 border-b border-yellow-600/50',
    stamp: 'bg-yellow-900/60 border-yellow-700 text-yellow-100',
    border: 'border-yellow-700/50'
  },
  'RESTRICTED': {
    banner: 'bg-blue-900/80 text-blue-200 border-b border-blue-600/50',
    stamp: 'bg-blue-900/60 border-blue-700 text-blue-200',
    border: 'border-blue-700/50'
  },
  'DEFAULT': {
    banner: 'bg-green-900/80 text-green-200 border-b border-green-600/50',
    stamp: 'bg-green-900/60 border-green-700 text-green-200',
    border: 'border-green-700/50'
  }
};

// Composants MDX optimisés avec memo pour ceux qui sont complexes
const MDXComponents = {
  h1: (props: any) => <h1 className="text-2xl text-cyber-primary font-bold mb-4 mt-8" {...props} />,
  h2: (props: any) => <h2 className="text-xl text-cyber-primary font-bold mb-3 mt-6" {...props} />,
  h3: (props: any) => <h3 className="text-lg text-cyber-primary font-semibold mb-3 mt-5" {...props} />,
  p: (props: any) => <p className="mb-4 leading-relaxed text-white/90" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-5 mb-4 text-white/90 space-y-1" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-5 mb-4 text-white/90 space-y-1" {...props} />,
  li: (props: any) => <li className="mb-1" {...props} />,
  a: (props: any) => (
    <a className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer" {...props} />
  ),
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-yellow-500/40 pl-4 py-1 my-4 bg-black/20" {...props} />
  ),
  // Optimisation des composants complexes avec memo
  code: memo((props: any) => {
    if (props.className) {
      return (
        <div className="mb-6">
          <div className="bg-black/60 text-xs px-3 py-1 border-t border-x border-yellow-500/30 text-cyber-primary/70 font-mono">
            {props.className.replace('language-', '')}
          </div>
          <div className="mb-4 overflow-x-auto bg-black/40 border border-yellow-500/30">
            <pre className="py-3 px-3">
              <code {...props} />
            </pre>
          </div>
        </div>
      );
    }
    return <code className="bg-black/40 text-cyber-primary px-1.5 py-0.5 rounded text-sm" {...props} />;
  }),
  img: memo((props: any) => (
    <div className="my-6 border border-yellow-500/40 shadow-lg">
      <img className="w-full" loading="lazy" decoding="async" {...props} alt={props.alt || "Field Evidence"} />
    </div>
  )),
  table: (props: any) => (
    <div className="overflow-x-auto mb-6 border border-yellow-500/30">
      <table className="min-w-full" {...props} />
    </div>
  ),
  th: (props: any) => (
    <th className="bg-yellow-900/30 text-cyber-primary px-4 py-2 border border-yellow-500/30 text-left" {...props} />
  ),
  td: (props: any) => <td className="px-4 py-2 border border-yellow-500/20 text-white/90" {...props} />,
  hr: (props: any) => <hr className="my-6 border-t border-yellow-500/30" {...props} />,
};

// Technical image component optimisé avec memo
export const TechnicalImage = memo(({ src, alt, caption }: { src: string; alt: string; caption?: string }) => {
  return (
    <figure className="my-6 border border-yellow-500/40 bg-black/40">
      <div className="px-3 py-1.5 border-b border-yellow-500/40 bg-black/60 flex justify-between items-center">
        <span className="text-xs text-cyber-primary uppercase tracking-wider">Technical Evidence</span>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-yellow-500/70"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500/40"></div>
        </div>
      </div>
      <img src={src} alt={alt} className="w-full" loading="lazy" />
      {caption && (
        <figcaption className="px-3 py-2 text-sm text-white/80 border-t border-yellow-500/40 bg-black/60">
          {caption}
        </figcaption>
      )}
    </figure>
  );
});

// Composants de l'article mémoïsés pour éviter les re-rendus inutiles
const BackButton = memo(() => (
  <Link 
    to="/blog" 
    className="inline-flex items-center mb-6 px-3 py-1.5 bg-black/40 border border-yellow-500/40 rounded 
              hover:bg-yellow-900/20 hover:border-yellow-500/60 transition-all duration-200"
    prefetch="intent"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
    </svg>
    <span>Return to Reports</span>
  </Link>
));

const DocumentHeader = memo(({ meta, formattedPublishDate, formattedExecutionDate, classStyles }: 
  { meta: PostMeta, formattedPublishDate: string, formattedExecutionDate: string | null, classStyles: any }) => (
  <>
    {/* Bannière modifiée pour être plus subtile */}
    <div className={`w-full py-1.5 text-center font-mono font-bold tracking-[0.25em] text-sm ${classStyles.banner}`}>
      {meta.classification}
    </div>
    
    <div className="relative border-b border-yellow-500/20">
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-5 pointer-events-none">
        <span className="text-[200px] font-bold text-yellow-500">TK</span>
      </div>
      
      <div className="p-8 relative">
        <div className="flex flex-wrap justify-between text-cyber-primary/80 text-xs mb-6">
          <div>REF: CYB-{meta.caseNumber || meta.date.replace(/-/g, '')}</div>
          <div>DATE: {formattedPublishDate}</div>
        </div>
        
        <div className="mt-12 mb-8">
          <h1 className="text-center text-3xl font-bold text-cyber-primary mb-2">{meta.title}</h1>
          <div className="w-1/3 mx-auto border-b-2 border-yellow-500/40"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 max-w-2xl mx-auto text-sm">
          <div>
            <span className="text-cyber-primary/70">CASE NUMBER:</span>
            <span className="ml-2 text-white/90">#{meta.caseNumber || meta.date.replace(/-/g, '')}</span>
          </div>
          <div>
            <span className="text-cyber-primary/70">CATEGORY:</span>
            <span className="ml-2 text-white/90">{meta.category}</span>
          </div>
          <div>
            <span className="text-cyber-primary/70">PUBLICATION DATE:</span>
            <span className="ml-2 text-white/90">{formattedPublishDate}</span>
          </div>
          {formattedExecutionDate && (
            <div>
              <span className="text-cyber-primary/70">EXECUTION DATE:</span>
              <span className="ml-2 text-white/90">{formattedExecutionDate}</span>
            </div>
          )}
          {meta.language === "fr" && (
            <div>
              <span className="text-cyber-primary/70">LANGUAGE:</span>
              <span className="ml-2 text-white/90">FRENCH</span>
            </div>
          )}
        </div>
        
        {/* Badge de classification avec effet stamp dans le header */}
        <div className="absolute top-20 right-8 hidden md:block">
          <div className={`transform rotate-12 border-2 ${classStyles.stamp} px-4 py-2 text-xs font-mono font-bold opacity-80`}>
            {meta.classification}
          </div>
        </div>
      </div>
    </div>
  </>
));

const DocumentCover = memo(({ coverImage, title }: { coverImage?: string, title: string }) => {
  if (!coverImage) return null;
  return (
    <div className="border-b border-yellow-500/20">
      <div className="relative">
        <div className="absolute top-0 left-0 bg-black/60 text-cyber-primary px-3 py-1 text-xs z-10">
          PRIMARY EVIDENCE
        </div>
        <img 
          src={coverImage} 
          alt={title}
          className="w-full object-cover max-h-[500px]"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
});

const ExecutiveSummary = memo(({ excerpt }: { excerpt: string }) => (
  <div className="p-8 border-b border-yellow-500/20 bg-black/20">
    <h2 className="text-sm uppercase tracking-wider text-cyber-primary/80 mb-3">Executive Summary</h2>
    <p className="text-white/90">{excerpt}</p>
  </div>
));

const DocumentFooter = memo(({ meta, classStyles }: { meta: PostMeta, classStyles: any }) => (
  <div className="p-6 border-t border-yellow-500/20 flex justify-between items-center text-xs bg-black/30">
    <div className="text-cyber-primary/70">
      DOCUMENT ID: TDK-{meta.date.substring(0, 4)}-{meta.caseNumber || meta.slug}
    </div>
    <div className="flex items-center space-x-3">
      <div className={`${classStyles.border} border px-2 py-0.5`}>
        {meta.classification}
      </div>
      <div className="text-cyber-primary/70">
        Page 1 of 1
      </div>
    </div>
  </div>
));

export default function BlogPost() {
  const { meta, code } = useLoaderData<typeof loader>();
  
  // Get the MDX component from the code - optimisé
  const Component = useMemo(() => getMDXComponent(code), [code]);
  
  // Format dates - mémoisation des dates pour éviter les recalculs
  const formattedDates = useMemo(() => {
    const publishDate = new Date(meta.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const executionDate = meta.executionDate 
      ? new Date(meta.executionDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : null;
      
    return { publishDate, executionDate };
  }, [meta.date, meta.executionDate]);

  // Classification styling - optimisé pour éviter les calculs répétitifs
  const classStyles = useMemo(() => {
    const key = meta.classification.toUpperCase() as keyof typeof CLASSIFICATION_STYLES;
    return CLASSIFICATION_STYLES[key] || CLASSIFICATION_STYLES.DEFAULT;
  }, [meta.classification]);

  // Utilise un attribut key unique basé sur le slug pour forcer la réinitialisation complète du composant lors du changement d'article
  return (
    <div key={`blog-post-${meta.slug}`} className="min-h-screen text-cyber-primary">
      <div className="relative z-10">
        <Navbar />
        
        <main className="container mx-auto px-4 md:px-6 pt-8 pb-16">
          <BackButton />

          <div className="max-w-6xl mx-auto bg-navy-950/90 border border-yellow-500/30 backdrop-blur-md shadow-xl">
            <DocumentHeader 
              meta={meta}
              formattedPublishDate={formattedDates.publishDate}
              formattedExecutionDate={formattedDates.executionDate}
              classStyles={classStyles}
            />
            
            <DocumentCover coverImage={meta.coverImage} title={meta.title} />
            
            <ExecutiveSummary excerpt={meta.excerpt} />
            
            <div className="p-8">
              <div className="prose prose-invert prose-yellow max-w-none">
                <Component components={{...MDXComponents, TechnicalImage}} />
              </div>
            </div>
            
            <DocumentFooter meta={meta} classStyles={classStyles} />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
