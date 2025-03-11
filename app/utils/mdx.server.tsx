import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import matter from "gray-matter";
import { bundleMDX } from "mdx-bundler";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";

// Chemin vers les fichiers MDX - utiliser path.resolve pour un chemin absolu
const POSTS_PATH = path.resolve(process.cwd(), "app", "content", "blog");

// Cache pour améliorer les performances
const postsCache: Map<string, PostMeta[]> = new Map();
const postCache: Map<string, { meta: PostMeta; code: string }> = new Map();

// Type amélioré pour PostMeta
export type PostMeta = {
  title: string;
  date: string;
  executionDate?: string;
  excerpt: string;
  classification: "TOP SECRET" | "SECRET" | "CONFIDENTIAL" | "RESTRICTED" | "UNCLASSIFIED";
  caseNumber?: string; // Rendu optionnel
  category: string;
  slug: string;
  coverImage?: string;
  language?: "en" | "fr";
};

/**
 * Vérifie si un répertoire existe et le crée si nécessaire
 */
async function ensureDirectoryExists(directory: string): Promise<boolean> {
  if (!existsSync(directory)) {
    try {
      await fs.mkdir(directory, { recursive: true });
      return true;
    } catch (error) {
      console.error(`Failed to create directory ${directory}:`, error);
      return false;
    }
  }
  return true;
}

/**
 * Récupère tous les articles
 * @param {boolean} useCache - Utiliser le cache (par défaut) ou forcer le rechargement
 * @param {string} categoryFilter - Filtrer par catégorie (optionnel)
 */
export async function getAllPosts(useCache = true, categoryFilter?: string): Promise<PostMeta[]> {
  const cacheKey = categoryFilter || "all";
  
  // Utiliser le cache si disponible et demandé
  if (useCache && postsCache.has(cacheKey)) {
    return postsCache.get(cacheKey)!;
  }
  
  // Vérifier/créer le répertoire
  const directoryExists = await ensureDirectoryExists(POSTS_PATH);
  if (!directoryExists) return [];
  
  try {
    // Lire les fichiers du répertoire de manière asynchrone
    const fileNames = await fs.readdir(POSTS_PATH);
    
    // Traiter tous les fichiers MDX en parallèle pour de meilleures performances
    const postsPromises = fileNames
      .filter(fileName => /\.mdx?$/.test(fileName))
      .map(async fileName => {
        const filePath = path.join(POSTS_PATH, fileName);
        const source = await fs.readFile(filePath, "utf8");
        
        // Extraire les métadonnées avec gray-matter
        const { data } = matter(source);
        const slug = fileName.replace(/\.mdx?$/, "");
        
        // Créer l'objet PostMeta
        return {
          ...(data as Omit<PostMeta, "slug">),
          slug,
          // Générer un caseNumber s'il n'est pas défini
          caseNumber: data.caseNumber || `AUTO-${slug.substring(0, 6).toUpperCase()}`
        } as PostMeta;
      });
    
    // Attendre que toutes les promesses soient résolues
    const posts = await Promise.all(postsPromises);
    
    // Filtrer par catégorie si nécessaire
    const filteredPosts = categoryFilter
      ? posts.filter(post => post.category.toLowerCase() === categoryFilter.toLowerCase())
      : posts;
    
    // Trier par date (du plus récent au plus ancien)
    const sortedPosts = filteredPosts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Mettre en cache pour les requêtes futures
    postsCache.set(cacheKey, sortedPosts);
    
    return sortedPosts;
  } catch (error) {
    console.error("Error getting posts:", error);
    return [];
  }
}

/**
 * Récupère un article par son slug
 * @param {string} slug - Le slug de l'article
 * @param {boolean} useCache - Utiliser le cache (par défaut) ou forcer le rechargement
 */
export async function getPostBySlug(slug: string, useCache = true) {
  // Utiliser le cache si disponible et demandé
  if (useCache && postCache.has(slug)) {
    return postCache.get(slug);
  }
  
  const filePath = path.join(POSTS_PATH, `${slug}.mdx`);
  
  // Vérifier si le fichier existe
  if (!existsSync(filePath)) {
    return null;
  }
  
  try {
    const source = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(source);
    
    // Compiler le MDX avec des plugins améliorés
    const result = await bundleMDX({
      source: content,
      mdxOptions(options) {
        options.remarkPlugins = [
          ...(options.remarkPlugins ?? []),
          remarkGfm, // Support pour GitHub Flavored Markdown
        ];
        
        options.rehypePlugins = [
          ...(options.rehypePlugins ?? []),
          rehypeHighlight, // Coloration syntaxique
          rehypeSlug, // Génère des IDs pour les titres
          [rehypeAutolinkHeadings, { behavior: 'append' }], // Ajoute des liens aux titres
        ];
        
        return options;
      },
      esbuildOptions: (options) => {
        // Optimiser le build
        options.minify = process.env.NODE_ENV === 'production';
        options.target = ['es2020'];
        return options;
      },
    });

    // Créer l'objet de retour
    const post = {
      meta: {
        ...(data as Omit<PostMeta, "slug">),
        slug,
        // Générer un caseNumber s'il n'est pas défini
        caseNumber: data.caseNumber || `AUTO-${slug.substring(0, 6).toUpperCase()}`
      } as PostMeta,
      code: result.code,
    };
    
    // Mettre en cache pour les requêtes futures
    postCache.set(slug, post);
    
    return post;
  } catch (error) {
    console.error(`Error getting post ${slug}:`, error);
    return null;
  }
}

/**
 * Récupère toutes les catégories uniques
 */
export async function getAllCategories(): Promise<string[]> {
  const posts = await getAllPosts();
  const categoriesSet = new Set<string>();
  
  posts.forEach(post => {
    if (post.category) {
      categoriesSet.add(post.category);
    }
  });
  
  return Array.from(categoriesSet).sort();
}

/**
 * Récupère les articles récents
 * @param {number} count - Nombre d'articles à récupérer
 */
export async function getRecentPosts(count = 5): Promise<PostMeta[]> {
  const posts = await getAllPosts();
  return posts.slice(0, count);
}

/**
 * Nettoie le cache
 */
export function clearCache(): void {
  postsCache.clear();
  postCache.clear();
}
