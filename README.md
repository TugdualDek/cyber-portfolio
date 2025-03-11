# Cyberpunk Portfolio

A modern, cyberpunk-themed portfolio built with Remix, Tailwind CSS, and shadcn/ui. This portfolio features a dashboard, projects showcase, blog system with MDX support, an interactive terminal, and contact information.

![Portfolio Screenshot](/path/to/screenshot.png)

## 🚀 Tech Stack

- **Framework**: [Remix](https://remix.run/) - Modern React framework with server-side rendering
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Components**: [shadcn/ui](https://ui.shadcn.com/) - High-quality UI components
- **Content for blog**: [MDX](https://mdxjs.com/) - Markdown + JSX for rich content authoring
- **Deployment**: [Vercel](https://vercel.com/) - Edge-optimized hosting platform

## 🌐 Main Features

### Dashboard
The dashboard serves as the main entry point to the portfolio. It provides an overview and quick access to other sections.

### Projects
Showcase of technical projects with descriptions, technologies used, and links to repositories or live demos.

### Blog
A blog system built with MDX for sharing technical articles, project insights, and professional experiences.

### Interactive Terminal
A Debian-like terminal interface that visitors can use to discover hidden information through command-line interactions.

### Contact
Professional contact information and a form to reach out for opportunities.

## 📝 Adding Blog Posts
Blog posts are written in MDX format and stored in the app/content/blog directory. Here's how to create a new post:

1. Create a new .mdx file in the app/content/blog directory. The filename will be used as the URL slug.

2. Add the required frontmatter at the top of the file:

```mdx
---
title: "Your Post Title"
date: "YYYY-MM-DD"
executionDate: "YYYY-MM-DD"  # Optional: when the project/work was done
excerpt: "A brief summary of your post (appears in listings)"
classification: "UNCLASSIFIED"  # Options: TOP SECRET, SECRET, CONFIDENTIAL, RESTRICTED, UNCLASSIFIED
category: "Projects"  # Category for filtering
caseNumber: "ARISS-2023-001" # optionnal
coverImage: "/assets/blog/your-image.webp"  # Path to cover image (optional)
language: "en"  # Language: en or fr
---

Your content here...
```

3. Write your content using Markdown syntax. You can also use special components:
~~~mdx
# Main Heading

Normal paragraph text with **bold** and *italic*.

## Subheading

- List item 1
- List item 2

```jsx
// Code blocks with syntax highlighting
function example() {
  return "Hello World";
}
```

<TechnicalImage src="/assets/blog/image.webp" alt="Description" caption="Optional caption for the image" />
~~~

4. Place any images referenced in your post in the /public/assets/blog/ directory.

5. After adding the file, it will automatically appear in the blog listing.

## 🌟 Best Practices for Blog Posts

1. Images: Use WebP format for better performance. Optimal sizes:
- Cover images: 1200×630px
- In-content images: 800px wide
2. Code Snippets: Always specify the language for proper syntax highlighting
3.  Classification: Use the appropriate classification level based on content:
    - UNCLASSIFIED: General information, tutorials
    - RESTRICTED: Professional experiences
    - CONFIDENTIAL: Detailed technical analyses
    - SECRET/TOP SECRET: Reserved for special content
4.  Categories: Use consistent categories for better organization:
    - Projects
    - Tutorials
    - Experiences
    - Research
    - Notes



