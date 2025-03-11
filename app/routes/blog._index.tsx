// app/routes/blog._index.tsx
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link, Form } from "@remix-run/react";
import { useState, useEffect, memo, useMemo } from "react";
import { getAllPosts, PostMeta } from "~/utils/mdx.server";
import { Navbar } from "~/components/navbar/Navbar";
import { Footer } from "~/components/footer/Footer";
import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [
  { title: "Classified Reports - Tugdual de Kerdrel" },
  { name: "description", content: "Field Reports & Analysis - Tugdual de Kerdrel" },
];

// Type pour les données du loader
type LoaderData = {
  posts: PostMeta[],
  allCategories: string[],
  searchQuery: string,
  categoryFilter: string
};

// Optimisation du loader avec une meilleure typologie
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("q")?.toLowerCase() || "";
  const categoryFilter = url.searchParams.get("category")?.toLowerCase() || "";
  
  const allPosts = await getAllPosts();
  
  // Extrait les catégories avec Set pour éviter les doublons (plus performant)
  const categoriesSet = new Set<string>();
  allPosts.forEach(post => {
    if (post.category) categoriesSet.add(post.category.toLowerCase());
  });
  const allCategories = Array.from(categoriesSet).sort();
  
  // Filtrage optimisé des posts
  const filteredPosts = searchQuery || categoryFilter
    ? allPosts.filter(post => {
        const matchesSearch = !searchQuery || 
          post.title.toLowerCase().includes(searchQuery) ||
          post.excerpt.toLowerCase().includes(searchQuery);
        
        const matchesCategory = !categoryFilter || 
          (post.category && post.category.toLowerCase() === categoryFilter);
        
        return matchesSearch && matchesCategory;
      })
    : allPosts;
  
  // Tri optimisé des posts
  filteredPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Utilisation de json() au lieu de Response.json() pour une meilleure typographie
  return Response.json({ 
    posts: filteredPosts,
    allCategories,
    searchQuery,
    categoryFilter
  });
};

// Mapping de classification optimisé avec constantes
const CLASSIFICATION_STYLES = {
  'TOP SECRET': 'bg-red-600/80 border-red-400 text-white',
  'SECRET': 'bg-orange-600/80 border-orange-400 text-white',
  'CONFIDENTIAL': 'bg-cyber-primary/80 border-cyber-primary text-black',
  'RESTRICTED': 'bg-blue-600/80 border-blue-400 text-white',
  'DEFAULT': 'bg-green-600/80 border-green-400 text-white'
};

// Composant optimisé avec memo pour éviter les rendus inutiles
const ClassifiedReportCard = memo(({ post }: { post: PostMeta }) => {
  // Mémoisation du formatage de la date
  const formattedDate = useMemo(() => {
    return new Date(post.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, [post.date]);
  
  // Fonction optimisée pour les couleurs de classification
  const getClassificationColor = (classification: string) => {
    const key = classification.toUpperCase();
    return CLASSIFICATION_STYLES[key as keyof typeof CLASSIFICATION_STYLES] || CLASSIFICATION_STYLES.DEFAULT;
  };
  
  return (
    <Link to={`/blog/${post.slug}`} className="group block w-full">
      <div className="relative p-6 border border-cyber-primary/30 bg-black/40 rounded-md 
                    hover:border-cyber-primary/60 transition-all duration-300 
                    transform hover:-translate-y-1 flex flex-col md:flex-row gap-4">
        {/* Classification stamp */}
        <div className="absolute -right-2 -top-2 rotate-12 z-10">
          <div className={`${getClassificationColor(post.classification)} px-2 py-1 text-xs font-bold border border-dashed`}>
            {post.classification}
          </div>
        </div>
        
        {/* Cover image - chargement optimisé avec loading="lazy" */}
        {post.coverImage && (
          <div className="w-full md:w-1/4 h-20 md:h-auto overflow-hidden border border-cyber-primary/20 flex-shrink-0">
            <img 
              src={post.coverImage} 
              alt={post.title}
              loading="lazy"
              className="w-full h-full object-cover filter brightness-75 group-hover:brightness-90 transition-all"
            />
          </div>
        )}
        
        <div className="flex-1">
          {/* Meta info */}
          <div className="text-xs text-cyber-primary mb-1 flex flex-wrap gap-2">
            <span>CASE #{post.caseNumber || post.date.replace(/-/g, '')}</span>
            <span>•</span>
            <span>{formattedDate}</span>
            {post.language === "fr" && <span>• [FR]</span>}
          </div>
          
          <h3 className="text-xl font-medium text-cyber-primary mb-2 group-hover:text-cyber-primary/90">
            {post.title}
          </h3>
          
          <div className="text-sm text-white/70 mb-4">{post.excerpt}</div>
          
          {/* Footer */}
          <div className="flex items-center justify-between mt-auto">
            <span className="bg-cyber-primary/20 border border-cyber-primary/30 px-2 py-0.5 text-xs text-cyber-primary">
              {post.category}
            </span>
            
            <span className="text-xs text-cyber-primary group-hover:translate-x-1 transition-transform flex items-center">
              <span>VIEW REPORT</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
});

// Optimisation de la forme de recherche avec memo
const SearchAndFilter = memo(() => {
  const { allCategories, searchQuery, categoryFilter } = useLoaderData<LoaderData>();
  const [localSearch, setLocalSearch] = useState(searchQuery || "");
  
  // Mise à jour du champ de recherche local lorsque l'URL change
  useEffect(() => {
    setLocalSearch(searchQuery || "");
  }, [searchQuery]);

  return (
    <div className="mb-6">
      <Form method="get" className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-cyber-primary/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input 
            type="search" 
            name="q" 
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            placeholder="Search reports..." 
            className="block w-full pl-10 pr-3 py-2 bg-black/50 border border-cyber-primary/30 rounded-md text-white/90 
                       placeholder:text-cyber-primary/40 focus:outline-none focus:ring-1 focus:ring-cyber-primary/50"
          />
        </div>
        
        {allCategories.length > 0 && (
          <select 
            name="category"
            className="bg-black/50 border border-cyber-primary/30 rounded-md px-3 py-2 text-white/90
                       focus:outline-none focus:ring-1 focus:ring-cyber-primary/50"
            defaultValue={categoryFilter || ""}
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {allCategories.map(category => (
              <option key={category} value={category}>{category.toUpperCase()}</option>
            ))}
          </select>
        )}
        
        <button 
          type="submit" 
          className="px-4 py-2 bg-cyber-primary/20 border border-cyber-primary/40 rounded-md text-cyber-primary
                     hover:bg-cyber-primary/30 hover:border-cyber-primary/60 transition-colors"
        >
          Filter
        </button>
        
        {(searchQuery || categoryFilter) && (
          <Link 
            to="/blog" 
            className="px-4 py-2 bg-black/50 border border-cyber-primary/30 rounded-md text-cyber-primary/80
                       hover:bg-black/70 hover:text-cyber-primary transition-colors text-center"
          >
            Clear
          </Link>
        )}
      </Form>
    </div>
  );
});

// Affichage des filtres actifs en tant que composant séparé
const ActiveFilters = memo(({ searchQuery, categoryFilter }: { searchQuery: string, categoryFilter: string }) => {
  if (!searchQuery && !categoryFilter) return null;
  
  return (
    <div className="mb-6 text-sm text-cyber-primary/70 flex items-center gap-2">
      <span>Active filters:</span>
      <div className="flex flex-wrap gap-2">
        {searchQuery && (
          <span className="bg-cyber-primary/20 border border-cyber-primary/30 px-2 py-0.5 text-xs rounded-full">
            Search: {searchQuery}
          </span>
        )}
        {categoryFilter && (
          <span className="bg-cyber-primary/20 border border-cyber-primary/30 px-2 py-0.5 text-xs rounded-full">
            Category: {categoryFilter.toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
});

// Composant principal optimisé
export default function BlogIndex() {
  const { posts, searchQuery, categoryFilter } = useLoaderData<LoaderData>();
  
  // Mémoisation pour éviter les recalculs inutiles lors du rendu
  const hasActiveFilters = useMemo(() => 
    Boolean(searchQuery || categoryFilter), 
    [searchQuery, categoryFilter]
  );

  return (
    <div className="min-h-screen text-cyber-primary">
      <div className="relative z-10">
        <Navbar />
        
        <main className="container mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="bg-navy-800/30 backdrop-blur-sm border border-cyber-primary/20 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold tracking-wider text-cyber-primary relative">
                <span className="relative z-10">CLASSIFIED REPORTS</span>
                <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-cyber-primary/50"></span>
              </h1>
              <div className="text-cyber-primary/70 text-xs border border-cyber-primary/30 px-3 py-1 rounded">
                {posts.length} DOCUMENT{posts.length !== 1 ? "S" : ""}
              </div>
            </div>
            
            {/* Composants optimisés */}
            <SearchAndFilter />
            <ActiveFilters searchQuery={searchQuery} categoryFilter={categoryFilter} />
            
            {/* Info box - n'afficher que si aucun filtre n'est actif */}
            {!hasActiveFilters && (
              <div className="mb-8 p-4 border-l-4 border-cyber-primary/50 bg-black/30">
                <p className="text-sm text-white/80">
                  The following reports contain detailed information about missions, projects, and technical analyses. 
                  Access is granted on a need-to-know basis. All documents are subject to classification protocols.
                </p>
              </div>
            )}
            
            {/* Liste des rapports - rendu conditionnel optimisé */}
            {posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post) => (
                  <ClassifiedReportCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-cyber-primary mb-2 text-2xl">! NO RESULTS FOUND !</div>
                <p className="text-white/70">
                  {hasActiveFilters ? 
                    "No documents match your search criteria." :
                    "No declassified documents available at this time."
                  }
                </p>
                {hasActiveFilters && (
                  <div className="mt-6">
                    <Link 
                      to="/blog" 
                      className="px-4 py-2 bg-cyber-primary/20 border border-cyber-primary/40 rounded-md text-cyber-primary
                               hover:bg-cyber-primary/30 hover:border-cyber-primary/60 transition-colors"
                    >
                      Clear Filters
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
