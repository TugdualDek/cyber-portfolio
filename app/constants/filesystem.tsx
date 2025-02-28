// app/data/filesystem.tsx

export interface FileNode {
  type: "file" | "directory" | "link";
  content?: string;
  permissions: string;
  owner: string;
  group: string;
  size?: number;
  lastModified: string;
  hidden?: boolean;
  executable?: boolean;
  linkTarget?: string;
}

export type FileSystem = Record<string, FileNode>;

export const initialFileSystem: FileSystem = {
  "/": {
    type: "directory",
    permissions: "drwxr-xr-x",
    owner: "root",
    group: "root",
    lastModified: "Jan 1 2023",
  },
  "/home": {
    type: "directory",
    permissions: "drwxr-xr-x",
    owner: "root",
    group: "root",
    lastModified: "Jan 1 2023",
  },
  "/home/visitor": {
    type: "directory",
    permissions: "drwxr-xr-x",
    owner: "visitor",
    group: "users",
    lastModified: "Jan 1 2023",
  },
  "/home/tugdual": {
    type: "directory",
    permissions: "drwxr-x---",
    owner: "tugdual",
    group: "users",
    lastModified: "Feb 20 2023",
  },
  "/home/visitor/README.txt": {
  type: "file",
  content: `Welcome to my interactive portfolio!

This terminal allows you to explore my professional profile as if you were on a real Linux system.

Useful commands:
- ls: List files in your current directory
- cd: Change directory
- cat: Display file contents
- help: Show help menu
  
Explore the system to learn more about my profile and skills.
  
Tip: the best developers are curious and like to explore... 🔍👨‍💻`,
    permissions: "-rw-r--r--",
    owner: "visitor",
    group: "users",
    size: 423,
    lastModified: "Feb 26 2023",
  },
  "/home/visitor/.bash_history": {
    type: "file",
    content: `ls -la
cd /
pwd
cd /home
ls
cd tugdual
ls -la
cat .secret_note.txt
cowsay "Hello there, curious visitor!"
exit`,
    permissions: "-rw-------",
    owner: "visitor",
    group: "users",
    size: 57,
    lastModified: "Feb 27 2023",
    hidden: true,
  },
  "/home/visitor/.secret": {
    type: "file",
    content: `There's a special command 'l33t' that doesn't appear in the help. It might be useful or not ;) .`,
    permissions: "-rw-------",
    owner: "visitor",
    group: "users",
    size: 82,
    lastModified: "Feb 25 2023",
    hidden: true,
  },
  "/home/tugdual/.profile": {
    type: "file",
    content: `export PATH=$PATH:/usr/local/bin
export EDITOR=vim
export LANG=en_US.UTF-8
alias ll='ls -la'
alias projects='cd /home/tugdual/projects'`,
    permissions: "-rw-r-----",
    owner: "tugdual",
    group: "users",
    size: 112,
    lastModified: "Jan 15 2023",
    hidden: true,
  },
  "/home/tugdual/.ssh": {
    type: "directory",
    permissions: "drwx------",
    owner: "tugdual",
    group: "users",
    lastModified: "Jan 10 2023",
    hidden: true,
  },
  "/home/tugdual/.ssh/id_rsa": {
    type: "file",
    content: `-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn
NhAAAAAwEAAQAAAYEAtEd3SBJdSfnQYL32xwCJLYfnM3FmLgZlJdM6KsxcJH6QfJaxhzO8
0uV8o8YzNzK2zQvXK9YlZ3j3o1v1L9zq7wZ4j1qyv3J9XQAAAMEA1v8YzZ4W9jv3Kp2aB8
[REDACTED]
This file might contain a hint for the "security" challenge...
-----END OPENSSH PRIVATE KEY-----`,
    permissions: "-rw-------",
    owner: "tugdual",
    group: "users",
    size: 1675,
    lastModified: "Jan 10 2023",
    hidden: true,
  },
  "/home/tugdual/projects": {
    type: "directory",
    permissions: "drwxr-x---",
    owner: "tugdual",
    group: "users",
    lastModified: "Feb 15 2023",
  },
  "/home/tugdual/projects/README.md": {
    type: "file",
    content: `# My Projects

This directory contains my main projects. Each subdirectory corresponds to a specific project.

## Notable Projects

TODO

For more details on each project, explore the corresponding directories.

To get more details, try to find the backdoor in the system...`,
    permissions: "-rw-r-----",
    owner: "tugdual",
    group: "users",
    size: 409,
    lastModified: "Feb 15 2023",
  },
  "/home/tugdual/projects/terminal-portfolio": {
    type: "directory",
    permissions: "drwxr-x---",
    owner: "tugdual",
    group: "users",
    lastModified: "Feb 25 2023",
  },
  "/home/tugdual/ABOUT.txt": {
    type: "file",
    content: `# About Me

## Profile
I'm a final-year engineering student at ISEP 👋, specializing in cybersecurity and networks📡.
Passionate about information systems security, I combine technical expertise and curiosity to meet the challenges of cybersecurity.
Experience in web development and a strong interest in artificial intelligence🤖.

## Key Skills
- Languages: HTML, JavaScript, TypeScript, Python, Java, SQL, PHP
- Front-end: React, Next.js, Remix.js, Tailwind CSS, HTML, CSS
- Back-end: Node.js, Next.js, Flask, Spring Boot, Nest.js
- Databases: PostgreSQL, MySQL, MariaDB
- DevOps: Docker, LXC, CI/CD
- Tools: Raspberry-pi, Arduino, SDR, ZimaBoard
- Security: Penetration testing, OWASP Top 10

## Professionnal Experiences
- System, Network and Security Administrator @ Bilendi (2023 - present)
- Cybersecurity intern @ Adamantia (2021)

## Student associations Experiences
- Technical Manager @ JuniorISEP (April 2023 - April 2024)
- Developper @ IsepInvest (November 2021 - August 2024)

## Education
- ISEP Paris (September 2020 - September 2025)
- UWTSD Swansea (February 2025 - April 2025)
- CVUT Prague (February 2022 - June 2022)
- Lycée la Rochefoucauld Paris (September 2017 - July 2020)
- Collège Stanislas Paris (September 2013 - July 2017)

## Contact
Email: tugdualk@hotmail.com
LinkedIn: linkedin.com/in/tugdual-de-kerdrel/
GitHub: github.com/TugdualDek

To get more details, try to find the backdoor in the system...`,
    permissions: "-rw-r--r--",
    owner: "tugdual",
    group: "users",
    size: 737,
    lastModified: "Feb 15 2023",
  },
  "/home/tugdual/.secret_note.txt": {
    type: "file",
    content: `Great, you found my secret note!
You seem to have a good spirit of exploration. If you want to discover more about my confidential projects, look for the hidden password somewhere in the system.
Hint: the password is base64 encoded and is in a hidden file. Use the 'grep' command to locate it.
Once you get it, try to find the backddor in the systemto get more details on me...`,
    permissions: "-rw-------",
    owner: "tugdual",
    group: "users",
    size: 350,
    lastModified: "Feb 20 2023",
    hidden: true,
  },
  "/var": {
    type: "directory",
    permissions: "drwxr-xr-x",
    owner: "root",
    group: "root",
    lastModified: "Jan 1 2023",
  },
  "/var/log": {
    type: "directory",
    permissions: "drwxr-x---",
    owner: "root",
    group: "adm",
    lastModified: "Jan 1 2023",
  },
  "/var/log/auth.log": {
    type: "file",
    content: `Feb 25 08:23:15 portfolio sshd[1234]: Failed password for tugdual from 192.168.1.105 port 58790 ssh2
Feb 25 08:23:20 portfolio sshd[1234]: Failed password for tugdual from 192.168.1.105 port 58791 ssh2
Feb 25 08:23:25 portfolio sshd[1234]: Accepted password for tugdual from 192.168.1.105 port 58792 ssh2
Feb 25 08:23:25 portfolio sshd[1234]: pam_unix(sshd:session): session opened for user tugdual by (uid=0)
Feb 25 08:24:10 portfolio sudo: tugdual : TTY=pts/0 ; PWD=/home/tugdual ; USER=root ; COMMAND=cat /etc/passwd
Feb 25 08:25:05 portfolio sudo: tugdual : TTY=pts/0 ; PWD=/home/tugdual ; USER=root ; COMMAND=grep -R pass /
Feb 25 08:30:12 portfolio sshd[1234]: Received disconnect from 192.168.1.105 port 58792:11: disconnected by user 
`,
    permissions: "-rw-r-----",
    owner: "syslog",
    group: "adm",
    size: 742,
    lastModified: "Feb 25 2023",
  },
  "/var/www": {
    type: "directory",
    permissions: "drwxr-xr-x",
    owner: "www-data",
    group: "www-data",
    lastModified: "Jan 1 2023",
  },
  "/var/www/html": {
    type: "directory",
    permissions: "drwxr-xr-x",
    owner: "www-data",
    group: "www-data",
    lastModified: "Jan 1 2023",
  },
  "/var/www/html/index.html": {
    type: "file",
    content: `<!DOCTYPE html>
<html>
<head>
<title>Tugdual's Portfolio</title>
</head>
<body>
  <h1>Tugdual's Portfolio</h1>
  <p>Welcome to my professional website.</p>
  <!-- TODO: Remove this note before production -->
  <!-- Admin password: c3VwZXJwYXNzd29yZA== -->
</body>
</html>`,
    permissions: "-rw-r--r--",
    owner: "www-data",
    group: "www-data",
    size: 237,
    lastModified: "Jan 15 2023",
  },
  "/usr": {
    type: "directory",
    permissions: "drwxr-xr-x",
    owner: "root",
    group: "root",
    lastModified: "Jan 1 2023",
  },
  "/usr/bin": {
    type: "directory",
    permissions: "drwxr-xr-x",
    owner: "root",
    group: "root",
    lastModified: "Jan 1 2023",
  },
  "/usr/bin/secret-decoder": {
    type: "file",
    content: `#!/bin/bash
# This script is a special decoder

if [ $# -ne 1 ]; then
  echo "Usage: \$0 <encoded_string>"
  exit 1
fi

echo "Decoding: \$1"
echo "--------------"
echo \$1 | base64 -d

exit 0`,
    permissions: "-rwxr-xr-x",
    owner: "root",
    group: "root",
    size: 172,
    lastModified: "Jan 10 2023",
    executable: true,
  },
  "/etc": {
    type: "directory",
    permissions: "drwxr-xr-x",
    owner: "root",
    group: "root",
    lastModified: "Jan 1 2023",
  },
  "/etc/passwd": {
    type: "file",
    content: `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
tugdual:x:1000:1000:Tugdual,,,:/home/tugdual:/bin/bash
visitor:x:1001:1001:Visitor,,,:/home/visitor:/bin/bash`,
    permissions: "-rw-r--r--",
    owner: "root",
    group: "root",
    size: 531,
    lastModified: "Jan 1 2023",
  },
  "/etc/motd": {
    type: "file",
    content: `Portfolio System v1.0
----------------------

Welcome to the interactive portfolio terminal!

This system is designed to showcase my professional profile and projects in a unique and interactive way.
Explore the system to learn more about my skills and experience.

WARNING: this system is regularly monitored and audited for security purposes.
`,
    permissions: "-rw-r--r--",
    owner: "root",
    group: "root",
    size: 301,
    lastModified: "Jan 1 2023",
  },
  "/bin": {
    type: "directory",
    permissions: "drwxr-xr-x",
    owner: "root",
    group: "root",
    lastModified: "Jan 1 2023",
  },
  "/tmp": {
    type: "directory",
    permissions: "drwxrwxrwt",
    owner: "root",
    group: "root",
    lastModified: "Jan 1 2023",
  },
  "/tmp/.backdoor": {
    type: "file",
    content: `Well done! You found the hidden backdoor file.
If you found this, you might be a skilled explorer or hacker.

Try the 'backdoor' command to see what it does.`,
    permissions: "-rw-r--r--",
    owner: "root",
    group: "root",
    size: 156,
    lastModified: "Feb 25 2023",
    hidden: true,
  },
  "/.hidden-vault": {
    type: "directory",
    permissions: "drwx------",
    owner: "root",
    group: "root",
    lastModified: "Feb 26 2023",
    hidden: true,
  },
  "/.hidden-vault/password.b64": {
    type: "file",
    content: `VGhlU3VwZXJTZWNyZXRQYXNzd29yZA==`,
    permissions: "-rw-------",
    owner: "root",
    group: "root",
    size: 28,
    lastModified: "Feb 26 2023",
    hidden: true,
  },
};

/**
 * Normalise un chemin en gérant les chemins relatifs et absolus
 */
export function normalizePath(path: string, currentPath: string): string {
  // Si le chemin est absolu, le retourner tel quel
  if (path.startsWith("/")) {
    return cleanPath(path);
  }

  // Si le chemin est relatif, le combiner avec le chemin courant
  const combinedPath = currentPath.endsWith("/")
    ? currentPath + path
    : currentPath + "/" + path;

  return cleanPath(combinedPath);
}

/**
 * Nettoie un chemin en gérant les '..' et '.'
 */
function cleanPath(path: string): string {
  const parts = path.split("/").filter(Boolean);
  const result: string[] = [];

  for (const part of parts) {
    if (part === ".") {
      // Ignorer les références au répertoire courant
      continue;
    } else if (part === "..") {
      // Remonter d'un niveau
      result.pop();
    } else {
      // Ajouter le segment de chemin
      result.push(part);
    }
  }

  return "/" + result.join("/");
}

/**
 * Vérifie si un chemin existe dans le système de fichiers
 */
export function pathExists(path: string, fileSystem: FileSystem): boolean {
  // Le chemin racine existe toujours
  if (path === "/") return true;

  // Vérifier si le chemin existe dans le système de fichiers
  return path in fileSystem;
}

/**
 * Vérifie si un chemin est un répertoire
 */
export function isDirectory(path: string, fileSystem: FileSystem): boolean {
  if (!pathExists(path, fileSystem)) return false;

  return fileSystem[path].type === "directory";
}

/**
 * Récupère les informations d'un fichier ou répertoire
 */
export function getFileInfo(
  path: string,
  fileSystem: FileSystem
): FileNode | undefined {
  if (!pathExists(path, fileSystem)) return undefined;

  return fileSystem[path];
}

/**
 * Récupère le contenu d'un répertoire
 */
export function getDirectoryContents(
  dirPath: string,
  fileSystem: FileSystem,
  showHidden: boolean = false
): string[] {
  if (!isDirectory(dirPath, fileSystem)) {
    return [];
  }

  // Normaliser le chemin du répertoire pour s'assurer qu'il se termine par '/'
  const normalizedDirPath = dirPath.endsWith("/") ? dirPath : dirPath + "/";

  // Trouver tous les fichiers et répertoires qui sont des enfants directs du répertoire
  const contents = Object.keys(fileSystem)
    .filter((path) => {
      // Vérifier si le chemin est un enfant direct du répertoire
      if (path === dirPath) return false; // Exclure le répertoire lui-même

      // Vérifier si le chemin est un enfant direct
      const relativePath = path.startsWith(normalizedDirPath)
        ? path.substring(normalizedDirPath.length)
        : null;

      if (!relativePath) return false;

      // Vérifier s'il n'y a pas de '/' dans le chemin relatif (enfant direct)
      return !relativePath.includes("/");
    })
    .filter((path) => {
      // Filtrer les fichiers cachés si nécessaire
      if (showHidden) return true;

      const fileName = path.split("/").pop() || "";
      return !fileName.startsWith(".");
    });

  return contents;
}

/**
 * Crée un nouveau fichier ou répertoire
 */
export function createNode(
  path: string,
  node: FileNode,
  fileSystem: FileSystem
): FileSystem {
  // Vérifier si le chemin existe déjà
  if (pathExists(path, fileSystem)) {
    throw new Error(`Le chemin existe déjà: ${path}`);
  }

  // Vérifier si le répertoire parent existe
  const parentPath = path.substring(0, path.lastIndexOf("/")) || "/";
  if (
    !pathExists(parentPath, fileSystem) ||
    !isDirectory(parentPath, fileSystem)
  ) {
    throw new Error(`Le répertoire parent n'existe pas: ${parentPath}`);
  }

  // Créer une copie du système de fichiers avec le nouveau nœud
  return {
    ...fileSystem,
    [path]: node,
  };
}

/**
 * Supprime un fichier ou répertoire
 */
export function removeNode(path: string, fileSystem: FileSystem): FileSystem {
  // Vérifier si le chemin existe
  if (!pathExists(path, fileSystem)) {
    throw new Error(`Le chemin n'existe pas: ${path}`);
  }

  // Vérifier si c'est un répertoire avec des enfants
  if (isDirectory(path, fileSystem)) {
    const children = getDirectoryContents(path, fileSystem, true);
    if (children.length > 0) {
      throw new Error(`Le répertoire n'est pas vide: ${path}`);
    }
  }

  // Créer une copie du système de fichiers sans le nœud
  const newFileSystem = { ...fileSystem };
  delete newFileSystem[path];

  return newFileSystem;
}
