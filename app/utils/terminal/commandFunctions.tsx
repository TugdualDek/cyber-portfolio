import {
  CommandContext,
  CommandResult,
  commands,
} from "../../constants/commands";
import {
  FileSystem,
  FileNode,
  normalizePath,
  getDirectoryContents,
  pathExists,
  isDirectory,
  getFileInfo,
} from "../../constants/filesystem";

export let isRootUser = false;

// Implémentation de la commande ls
export function executeLS(
  args: string[],
  context: CommandContext
): CommandResult {
  const { currentPath, fileSystem } = context;

  // Analyser les options
  const showHidden =
    args.includes("-a") || args.includes("-la") || args.includes("-al");
  const detailed =
    args.includes("-l") || args.includes("-la") || args.includes("-al");

  // Filtrer les arguments pour ne garder que le chemin
  const pathArgs = args.filter((arg) => !arg.startsWith("-"));
  const targetPath =
    pathArgs.length > 0 ? normalizePath(pathArgs[0], currentPath) : currentPath;

  // Vérifier si le chemin existe
  if (!pathExists(targetPath, fileSystem)) {
    return {
      output: <span>The directory does no exists: {targetPath}</span>,
      isError: true,
    };
  }

  // Vérifier si c'est un répertoire
  if (!isDirectory(targetPath, fileSystem)) {
    return {
      output: <span>{targetPath} is not a directory</span>,
      isError: true,
    };
  }

  // Obtenir le contenu du répertoire
  const files = getDirectoryContents(targetPath, fileSystem, showHidden);

  // Affichage détaillé (option -l)
  if (detailed) {
    return {
      output: (
        <div className="space-y-1">
          <div className="text-xs text-green-500/60">total {files.length}</div>
          {files.map((filePath: string) => {
            const fileInfo = getFileInfo(filePath, fileSystem);
            const fileName = filePath.split("/").pop();
            const isDir = fileInfo?.type === "directory";
            const isLink = fileInfo?.type === "link";
            const isExec = fileInfo?.executable;

            return (
              <div key={filePath} className="grid grid-cols-12 text-xs">
                <span className="col-span-3 text-green-500/80">
                  {fileInfo?.permissions}
                </span>
                <span className="col-span-2">{fileInfo?.owner}</span>
                <span className="col-span-2">{fileInfo?.group}</span>
                <span className="col-span-1">{fileInfo?.size || "- "}</span>
                <span className="col-span-2">{fileInfo?.lastModified}</span>
                <span
                  className={`col-span-2 ${
                    isDir
                      ? "text-blue-400"
                      : isExec
                      ? "text-green-400"
                      : isLink
                      ? "text-cyan-400"
                      : ""
                  }`}
                >
                  {fileName}
                  {isDir ? "/" : isLink ? " -> " + fileInfo.linkTarget : ""}
                </span>
              </div>
            );
          })}
        </div>
      ),
      isError: false,
    };
  }
  // Affichage simple
  else {
    return {
      output: (
        <div className="flex flex-wrap gap-4">
          {files.map((filePath: string) => {
            const fileInfo = getFileInfo(filePath, fileSystem);
            const fileName = filePath.split("/").pop();
            const isDir = fileInfo?.type === "directory";
            const isLink = fileInfo?.type === "link";
            const isExec = fileInfo?.executable;

            return (
              <span
                key={filePath}
                className={`${
                  isDir
                    ? "text-blue-400"
                    : isExec
                    ? "text-green-400"
                    : isLink
                    ? "text-cyan-400"
                    : ""
                }`}
              >
                {fileName}
                {isDir ? "/" : ""}
              </span>
            );
          })}
        </div>
      ),
      isError: false,
    };
  }
}

// Implémentation de la commande cd
export function executeCD(
  args: string[],
  context: CommandContext
): CommandResult {
  const { currentPath, setCurrentPath, fileSystem } = context;

  // cd sans argument ou cd ~ => retour au répertoire personnel
  if (args.length === 0 || args[0] === "~") {
    setCurrentPath("/home/visitor");
    return {
      output: null,
      isError: false,
    };
  }

  // Normaliser le chemin cible
  const targetPath = normalizePath(args[0], currentPath);

  // Vérifier si le chemin existe
  if (!pathExists(targetPath, fileSystem)) {
    return {
      output: <span>The directory does no exists: {targetPath}</span>,
      isError: true,
    };
  }

  // Vérifier si c'est un répertoire
  if (!isDirectory(targetPath, fileSystem)) {
    return {
      output: <span>{targetPath} is not a directory</span>,
      isError: true,
    };
  }

  // Changer le répertoire courant
  setCurrentPath(targetPath);
  return {
    output: null,
    isError: false,
  };
}

// Implémentation de la commande cat
export function executeCAT(
  args: string[],
  context: CommandContext
): CommandResult {
  if (args.length === 0) {
    return {
      output: <span>Usage: cat [file]</span>,
      isError: true,
    };
  }

  const { currentPath, fileSystem } = context;
  const filePath = normalizePath(args[0], currentPath);

  if (!pathExists(filePath, fileSystem)) {
    return {
      output: <span>cat: {args[0]}: No file or directory of this type!</span>,
      isError: true,
    };
  }

  if (isDirectory(filePath, fileSystem)) {
    return {
      output: <span>cat: {args[0]}: is a folder</span>,
      isError: true,
    };
  }

  const fileContent = fileSystem[filePath].content || "";

  // Utiliser <pre> pour préserver la mise en forme exacte
  return {
    output: <pre className="whitespace-pre-wrap">{fileContent}</pre>,
    isError: false,
  };
}

// Implémentation de la commande help
export function executeHELP(
  args: string[],
  context: CommandContext
): CommandResult {
  // Aide pour une commande spécifique
  if (args.length > 0) {
    const commandName = args[0].toLowerCase();
    const command = commands[commandName];

    if (command && !command.hidden) {
      return {
        output: (
          <div className="space-y-2">
            <div>
              <span className="text-green-500 font-bold">{command.name}</span> -{" "}
              {command.description}
            </div>
            <div>Usage: {command.usage}</div>
          </div>
        ),
        isError: false,
      };
    } else {
      return {
        output: <span>Command not found: {commandName}</span>,
        isError: true,
      };
    }
  }

  // Liste de toutes les commandes
  return {
    output: (
      <div className="space-y-1">
        <div className="font-bold text-green-500 mb-2">Available commands:</div>
        {Object.values(commands)
          .filter((cmd) => !cmd.hidden)
          .sort((a, b) => {
            return a.name.localeCompare(b.name);
          })
          .map((cmd) => (
            <div key={cmd.name} className="grid grid-cols-12 gap-2">
              <span className="col-span-2 text-green-500 font-bold">
                {cmd.name}
              </span>
              <span className="col-span-10">{cmd.description}</span>
            </div>
          ))}
        <div className="mt-2 text-green-500/60">
          Type 'help [command]' to get more information on a specific command.
        </div>
      </div>
    ),
    isError: false,
  };
}

// Implémentation de la commande pwd
export function executePWD(
  args: string[],
  context: CommandContext
): CommandResult {
  return {
    output: <span>{context.currentPath}</span>,
    isError: false,
  };
}

// Implémentation de la commande clear
export function executeCLEAR(
  args: string[],
  context: CommandContext
): CommandResult {
  // Cette commande est traitée spécialement dans le composant Terminal
  return {
    output: null,
    isError: false,
  };
}

export function executePING(
  args: string[],
  context: CommandContext
): CommandResult {
  //cette commande permet d'envoyer des pacquets ping à une adresse IP
  //elle est utilisée pour vérifier la connectivité réseau

  if (args.length === 0) {
    return {
      output: <span>Usage: ping [options] &lt;target&gt;</span>,
      isError: true,
    };
  }

  // Analyser les arguments pour trouver la destination et les options
  let destination = "";
  let count = 4; // Valeur par défaut

  // Parcourir les arguments pour trouver les options et la destination
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-c" && i + 1 < args.length) {
      // Option -c suivie d'un nombre
      count = parseInt(args[i + 1]);
      if (isNaN(count)) {
        return {
          output: (
            <span>
              ping: invalid option -- c: '{args[i + 1]}' is not a valid number
            </span>
          ),
          isError: true,
        };
      }
      i++; // Sauter le prochain argument car c'est le nombre
    } else if (args[i].startsWith("-")) {
      // Autre option non reconnue
      if (args[i] !== "-c") {
        return {
          output: <span>ping: unknown option: {args[i]}</span>,
          isError: true,
        };
      }
    } else {
      // Si ce n'est pas une option, c'est la destination
      destination = args[i];
    }
  }

  // Vérifier si une destination a été spécifiée
  if (!destination) {
    return {
      output: <span>ping: no target specified</span>,
      isError: true,
    };
  }

  // Vérifier si la destination est valide
  const ipRegex =
    /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)+([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$/;

  if (!ipRegex.test(destination)) {
    return {
      output: <span>ping: unknown name or service: {destination}</span>,
      isError: true,
    };
  }

  // Simuler une réponse ping
  const pingResults = [];
  let totalTime = 0;
  let minTime = 999;
  let maxTime = 0;

  for (let i = 0; i < count; i++) {
    // Générer un temps de réponse aléatoire entre 20 et 100 ms
    const time = Math.floor(Math.random() * 80) + 20;
    totalTime += time;
    minTime = Math.min(minTime, time);
    maxTime = Math.max(maxTime, time);

    pingResults.push(
      <div key={i}>
        64 bytes from {destination}: icmp_seq={i + 1} ttl=64 time={time} ms
      </div>
    );
  }

  const avgTime = Math.round(totalTime / count);

  return {
    output: (
      <div>
        <div>PING {destination} 56(84) bytes of data.</div>
        {pingResults}
        <div>--- {destination} ping statistics ---</div>
        <div>
          {count} transmitted packets, {count} received, 0% packet loss, time{" "}
          {count * 1000}ms
        </div>
        <div>
          rtt min/avg/max/mdev = {minTime}/{avgTime}/{maxTime}/
          {Math.round((maxTime - minTime) / 4)} ms
        </div>
      </div>
    ),
    isError: false,
  };
}

export function executeNMAP(
  args: string[],
  context: CommandContext
): CommandResult {
  //cette commande permet de scanner un réseau pour découvrir des hôtes et des services

  if (args.length === 0) {
    return {
      output: (
        <div>
          <div>Usage: nmap [options] &lt;target&gt;</div>
          <div>Options available:</div>
          <div>-sS: Scan TCP SYN (furtif)</div>
          <div>-sV: Version detection</div>
          <div>-p: Ports to scan (ex: -p 1-100)</div>
          <div>-A: Aggressive detection (OS, version, scripts, traceroute)</div>
        </div>
      ),
      isError: true,
    };
  }

  // Analyser les arguments pour trouver la cible et les options
  let target = "";
  let isSynScan = false;
  let isVersionDetection = false;
  let isAggressive = false;
  let ports = "1-1000"; // Par défaut

  // Parcourir les arguments pour trouver les options et la cible
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-sS") {
      isSynScan = true;
    } else if (args[i] === "-sV") {
      isVersionDetection = true;
    } else if (args[i] === "-A") {
      isAggressive = true;
    } else if (args[i] === "-p" && i + 1 < args.length) {
      ports = args[i + 1];
      i++; // Sauter le prochain argument car c'est la plage de ports
    } else if (!args[i].startsWith("-")) {
      // Si ce n'est pas une option, c'est la cible
      target = args[i];
    }
  }

  // Vérifier si une cible a été spécifiée
  if (!target) {
    return {
      output: <span>nmap: no target specified</span>,
      isError: true,
    };
  }

  // Vérifier si la cible est valide
  const ipRegex =
    /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)+([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$/;

  if (!ipRegex.test(target)) {
    return {
      output: (
        <span>nmap: Unable to solve "{target}": unknown name or service</span>
      ),
      isError: true,
    };
  }

  // Générer un scan aléatoire
  const openPorts: number[] = [];
  const portRange = ports.split("-");
  const startPort = parseInt(portRange[0]);
  const endPort = portRange.length > 1 ? parseInt(portRange[1]) : startPort;

  // Générer quelques ports ouverts aléatoires
  const numOpenPorts = Math.floor(Math.random() * 5) + 2; // 2 à 6 ports ouverts
  const commonPorts = [21, 22, 80, 443, 3306, 8080, 8443];

  for (let i = 0; i < numOpenPorts; i++) {
    if (
      i < commonPorts.length &&
      commonPorts[i] >= startPort &&
      commonPorts[i] <= endPort
    ) {
      openPorts.push(commonPorts[i]);
    } else {
      const randomPort =
        Math.floor(Math.random() * (endPort - startPort + 1)) + startPort;
      if (!openPorts.includes(randomPort)) {
        openPorts.push(randomPort);
      }
    }
  }

  openPorts.sort((a, b) => a - b);

  // Générer les services pour les ports ouverts
  const services = {
    21: { name: "ftp", version: "vsftpd 3.0.3" },
    22: { name: "ssh", version: "OpenSSH 8.2p1 Ubuntu 4ubuntu0.5" },
    53: { name: "domain", version: "dnsmasq 2.82" },
    80: { name: "http", version: "Apache httpd 2.4.41" },
    110: { name: "pop3", version: "Dovecot pop3d" },
    443: { name: "https", version: "nginx 1.18.0" },
    3306: { name: "mysql", version: "MySQL 8.0.27-0ubuntu0.20.04.1" },
    5432: { name: "postgresql", version: "PostgreSQL DB 13.4" },
    8080: { name: "http-proxy", version: "Apache Tomcat" },
    8443: { name: "https-alt", version: "Jetty 9.4.39.v20210325" },
  };

  // Générer le résultat du scan
  const scanResults = openPorts.map((port) => {
    const service =
      port in services
        ? services[port as keyof typeof services]
        : { name: "unknown", version: "unknown" };

    return (
      <div key={port}>
        {port}/tcp open {service.name}{" "}
        {isVersionDetection || isAggressive ? service.version : ""}
      </div>
    );
  });

  // Générer le temps d'exécution
  const scanTime = Math.floor(Math.random() * 10) + 5; // 5 à 15 secondes

  return {
    output: (
      <div>
        <div>
          Starting Nmap 7.80 ( https://nmap.org ) at{" "}
          {new Date().toLocaleString()}
        </div>
        <div>Nmap scan report for {target}</div>
        <div>
          Host is up (0.0{Math.floor(Math.random() * 90) + 10}s latency).
        </div>
        <div>
          Not shown: {endPort - startPort + 1 - openPorts.length} closed ports
        </div>
        <div>
          PORT STATE SERVICE{" "}
          {isVersionDetection || isAggressive ? "VERSION" : ""}
        </div>
        {scanResults}
        {isAggressive && (
          <div>
            <div>OS details: Linux 5.4.0-89-generic (Ubuntu 20.04)</div>
            <div>
              Network Distance: {Math.floor(Math.random() * 5) + 1} hops
            </div>
          </div>
        )}
        <div>
          Nmap done: 1 IP address (1 host up) scanned in {scanTime}.
          {Math.floor(Math.random() * 100)} seconds
        </div>
      </div>
    ),
    isError: false,
  };
}

export function executeHASH(
  args: string[],
  context: CommandContext
): CommandResult {
  //cette commande permet de générer des hash pour une chaîne de caractères
  if (args.length < 2) {
    return {
      output: (
        <div>
          <div>Usage: hash &lt;algorithm&gt; &lt;string&gt;</div>
          <div>Available algorithms: md5, sha1, sha256, sha512</div>
          <div>Example: hash md5 "Hello World"</div>
        </div>
      ),
      isError: true,
    };
  }

  const algorithm = args[0].toLowerCase();
  const text = args.slice(1).join(" ");

  // Vérifier si l'algorithme est supporté
  const supportedAlgorithms = ["md5", "sha1", "sha256", "sha512"];
  if (!supportedAlgorithms.includes(algorithm)) {
    return {
      output: <span>Unsuported algorithm: {algorithm}</span>,
      isError: true,
    };
  }

  // Fonction pour simuler un hash (puisque nous ne pouvons pas utiliser de vraies fonctions de hachage côté client)
  const simulateHash = (algo: string, input: string) => {
    // Cette fonction génère un hash simulé basé sur l'algorithme et l'entrée
    // Dans une vraie application, vous utiliseriez une bibliothèque comme crypto-js

    // Fonction simple pour générer un hash déterministe basé sur l'entrée
    const simpleHash = (str: string, length: number) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convertir en entier 32 bits
      }

      // Convertir en chaîne hexadécimale de la longueur spécifiée
      let hexHash = Math.abs(hash).toString(16);
      while (hexHash.length < length) {
        hexHash = "0" + hexHash;
        // Ajouter plus de caractères pour atteindre la longueur désirée
        if (hexHash.length < length) {
          hexHash += Math.abs(hash ^ (hash >> 16)).toString(16);
        }
      }

      return hexHash.substring(0, length);
    };

    // Longueurs des différents algorithmes
    const lengths = {
      md5: 32,
      sha1: 40,
      sha256: 64,
      sha512: 128,
    };

    // Générer un hash simulé
    return simpleHash(algo + input, lengths[algo as keyof typeof lengths]);
  };

  const hash = simulateHash(algorithm, text);

  return {
    output: (
      <div>
        <div>String: {text}</div>
        <div>Algorithm: {algorithm}</div>
        <div>Hash: {hash}</div>
      </div>
    ),
    isError: false,
  };
}

export function executeWHOAMI(
  args: string[],
  context: CommandContext
): CommandResult {
  return {
    output: <span>visitor</span>,
    isError: false,
  };
}

export function executeFIND(
  args: string[],
  context: CommandContext
): CommandResult {
  // Vérifier si des arguments ont été fournis
  if (args.length === 0) {
    return {
      output: (
        <div>
          <div>Usage: find [path] [options]</div>
          <div>Options:</div>
          <div>
            {" "}
            -name PATTERN - Search for files whose name matches the pattern
          </div>
          <div>
            {" "}
            -type TYPE - Search for files of a certain type (f: file, d:
            directory)
          </div>
          <div>Example: find /home -name "*.txt" -type f</div>
        </div>
      ),
      isError: true,
    };
  }

  const { currentPath, fileSystem } = context;

  // Déterminer le chemin de départ
  let startPath = args[0];
  let options: Record<string, string> = {};

  // Si le premier argument commence par un tiret, c'est une option
  if (startPath.startsWith("-")) {
    startPath = currentPath;
    parseOptions(args, options);
  } else {
    // Normaliser le chemin de départ
    startPath = normalizePath(startPath, currentPath);
    // Extraire les options à partir du deuxième argument
    parseOptions(args.slice(1), options);
  }

  // Vérifier si le chemin de départ existe
  if (!pathExists(startPath, fileSystem)) {
    return {
      output: <span>find: '{startPath}': No such file or directory</span>,
      isError: true,
    };
  }

  // Vérifier si le chemin de départ est un répertoire
  if (!isDirectory(startPath, fileSystem)) {
    return {
      output: <span>find: '{startPath}' is not a directory</span>,
      isError: true,
    };
  }

  // Collecter tous les chemins dans le système de fichiers
  const allPaths = Object.keys(fileSystem);

  // Filtrer les chemins qui commencent par le chemin de départ
  const pathsInStartDir = allPaths.filter(
    (path) => path === startPath || path.startsWith(startPath + "/")
  );

  // Appliquer les filtres basés sur les options
  const filteredPaths = pathsInStartDir.filter((path) => {
    // Filtre par type
    if ("type" in options) {
      const isDir = isDirectory(path, fileSystem);
      if (options.type === "f" && isDir) return false;
      if (options.type === "d" && !isDir) return false;
    }

    // Filtre par nom
    if ("name" in options) {
      const fileName = path.split("/").pop() || "";

      // Convertir le motif en expression régulière
      let pattern = options.name;

      // Échapper les caractères spéciaux de regex sauf * et ?
      pattern = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&");

      // Remplacer les jokers par leurs équivalents regex
      pattern = pattern.replace(/\*/g, ".*").replace(/\?/g, ".");

      // Créer la regex avec ancres pour correspondre exactement
      const regex = new RegExp(`^${pattern}$`);

      if (!regex.test(fileName)) return false;
    }

    return true;
  });

  // Formater les résultats
  if (filteredPaths.length === 0) {
    return {
      output: <span>No results found</span>,
      isError: false,
    };
  }

  return {
    output: (
      <div>
        {filteredPaths.map((path, index) => (
          <div key={index}>{path}</div>
        ))}
      </div>
    ),
    isError: false,
  };
}

// Fonction utilitaire pour extraire les options
function parseOptions(args: string[], options: Record<string, string>): void {
  for (let i = 0; i < args.length; i += 2) {
    if (args[i].startsWith("-") && i + 1 < args.length) {
      const optionName = args[i].substring(1);
      options[optionName] = args[i + 1];
    }
  }
}

export function executeEXIT(
  args: string[],
  context: CommandContext
): CommandResult {
  // cette commande te fais revenir ala page / de mon site
  if (isRootUser) {
    isRootUser = false;
    return {
      output: (
        <div className="space-y-2">
          <div className="text-red-500 font-bold text-lg">
            Goodbye, root user.
          </div>
          <div className="text-yellow-500 italic animate-pulse">
            <span className="font-semibold">May the Force be with you...</span>
          </div>
          <div className="text-green-500/70 text-xs mt-2">
            Terminating privileged session. All actions have been logged.
          </div>
        </div>
      ),
      isError: false,
    };
  } else {
    window.location.href = "/";
    return {
      output: (
        <div className="space-y-1">
          <div className="text-green-500">
            Thank you for visiting my portfolio terminal!
          </div>
          <div className="text-green-500/70">Redirecting to homepage...</div>
        </div>
      ),
      isError: false,
    };
  }
}

export function executeCONTACT(
  args: string[],
  context: CommandContext
): CommandResult {
  // cette commande affiche mes coordonnées de contact
  return {
    output: (
      <div>
        <div>
          <span className="text-green-500 font-bold">
            Email:{" "}
            <a href="mailto:tugdualk@hotmail.com">tugdualk@hotmail.com</a>
          </span>
          <br />
          <span className="text-green-500 font-bold">LinkedIn: </span>
          <a
            href="https://www.linkedin.com/in/tugdual-de-kerdrel/"
            target="_blank"
            rel="noreferrer"
            className="text-blue-400"
          >
            Tugdual de Kerdrel
          </a>
          <br />
          <span className="text-green-500 font-bold">CV: </span>
          <a
            href="https://tugdual.com/assets/cv.pdf"
            target="_blank"
            rel="noreferrer"
            className="text-blue-400"
          >
            Download it
          </a>
        </div>
        <div className="text-red-500 font-bold">
          To get more information about me, find the backdoor.
        </div>
      </div>
    ),
    isError: false,
  };
}

export function executeSKILLS(
  args: string[],
  context: CommandContext
): CommandResult {
  // cette commande affiche mes compétences
  return {
    output: (
      <div>
        <div>
          <span className="text-green-500 font-bold">🈸 Languages: </span> HTML,
          JavaScript, TypeScript, Python, Java, SQL, PHP
        </div>
        <div>
          <span className="text-green-500 font-bold">📺 Frontend: </span> React,
          Next.js, Remix.js, Tailwind CSS, HTML, CSS
        </div>
        <div>
          <span className="text-green-500 font-bold">⚙ Backend: </span> Node.js,
          Next.js, Flask, Spring Boot, Nest.js
        </div>
        <div>
          <span className="text-green-500 font-bold">💾 Databases: </span>{" "}
          MySQL, PostgreSQL
        </div>
        <div>
          <span className="text-green-500 font-bold">🖥 DevOps: </span> Docker,
          LXC, GitLab CI
        </div>
        <div>
          <span className="text-green-500 font-bold">🛠 Tools: </span>{" "}
          Raspberry-pi, Arduino, SDR, ZimaBoard
        </div>
        <div className="text-red-500 font-bold">
          To get more information about my skills, find the backdoor.
        </div>
      </div>
    ),
    isError: false,
  };
}

export function executeABOUTME(
  args: string[],
  context: CommandContext
): CommandResult {
  // cette commande affiche des informations sur moi
  return {
    output: (
      <div>
        <div>
          <span className="text-green-500 font-bold">About me</span>
          <br />
          <span className="text-green-500">Name: </span> Tugdual AUDREN de
          KERDREL
          <br />
          <span className="text-green-500">Role: </span> System Administrator at
          Bilendi
          <br />
          I'm a final-year engineering student at ISEP 👋, specializing in
          cybersecurity and networks📡. <br />
          Passionate about information systems security, I combine technical
          expertise and curiosity to meet the challenges of cybersecurity.{" "}
          <br />
          Experience in web development and a strong interest in artificial
          intelligence🤖.
        </div>
        <div className="text-red-500 font-bold">
          To get more information about me, find the backdoor.
        </div>
      </div>
    ),
    isError: false,
  };
}

export function executeGREP(
  args: string[],
  context: CommandContext
): CommandResult {
  // Vérifier si suffisamment d'arguments ont été fournis
  if (args.length < 1) {
    return {
      output: (
        <div>
          <span>Usage: grep [options] pattern [file...]</span>
          <br />
          <span>Options:</span>
          <br />
          <span> -i: Ignore case distinctions</span>
          <br />
          <span> -n: Prefix each line with line number</span>
          <br />
          <span> -r, -R: Recursive search in directories</span>
          <br />
          <span> -v: Invert the sense of matching</span>
        </div>
      ),
      isError: true,
    };
  }

  const { currentPath, fileSystem } = context;

  // Analyser les options
  let pattern = "";
  let files: string[] = [];
  let ignoreCase = false;
  let showLineNumbers = false;
  let invertMatch = false;
  let recursive = false;

  // Parcourir les arguments pour extraire les options et le motif
  let i = 0;
  while (i < args.length) {
    if (args[i].startsWith("-")) {
      // Traiter les options
      if (args[i].includes("i")) ignoreCase = true;
      if (args[i].includes("n")) showLineNumbers = true;
      if (args[i].includes("v")) invertMatch = true;
      if (args[i].includes("r") || args[i].includes("R")) recursive = true;
      i++;
    } else {
      // Le premier argument non-option est le motif
      pattern = args[i];
      i++;
      break;
    }
  }

  // Les arguments restants sont les fichiers ou dossiers
  files = args.slice(i);

  // Si aucun fichier n'est spécifié, utiliser le répertoire courant pour la recherche récursive
  // ou afficher une erreur pour la recherche non récursive
  if (files.length === 0) {
    if (recursive) {
      files = [currentPath];
    } else {
      return {
        output: <span>grep: no file specified</span>,
        isError: true,
      };
    }
  }

  // Créer l'expression régulière pour la recherche
  let regex: RegExp;
  try {
    regex = new RegExp(pattern, ignoreCase ? "i" : "");
  } catch (error) {
    return {
      output: <span>grep: invalid regular expression: {pattern}</span>,
      isError: true,
    };
  }

  // Résultats de la recherche
  const results: React.ReactNode[] = [];

  // Fonction récursive pour chercher dans un dossier
  const searchInDirectory = (dirPath: string, basePath: string = "") => {
    // Obtenir tous les fichiers et dossiers dans ce répertoire
    const contents = getDirectoryContents(dirPath, fileSystem, true);

    for (const itemPath of contents) {
      const itemInfo = getFileInfo(itemPath, fileSystem);
      if (!itemInfo) continue;

      // Si c'est un dossier et que la recherche est récursive, explorer ce dossier
      if (itemInfo.type === "directory" && recursive) {
        searchInDirectory(itemPath, basePath || dirPath);
      }
      // Si c'est un fichier, chercher le motif dans son contenu
      else if (itemInfo.type === "file") {
        const fileContent = itemInfo.content || "";
        const lines = fileContent.split("\n");

        // Rechercher le motif dans chaque ligne
        lines.forEach((line, lineIndex) => {
          const matches = regex.test(line);
          const shouldDisplay = invertMatch ? !matches : matches;

          if (shouldDisplay) {
            // Déterminer le nom à afficher (relatif au chemin de base pour la recherche récursive)
            let displayPath = itemPath;
            if (basePath && itemPath.startsWith(basePath)) {
              displayPath = itemPath.substring(basePath.length);
              if (displayPath.startsWith("/")) {
                displayPath = displayPath.substring(1);
              }
            }

            if (showLineNumbers) {
              results.push(
                <div key={`${itemPath}-${lineIndex}`}>
                  <span className="text-blue-400">{displayPath}</span>:
                  <span className="text-green-400">{lineIndex + 1}</span>:{line}
                </div>
              );
            } else {
              results.push(
                <div key={`${itemPath}-${lineIndex}`}>
                  <span className="text-blue-400">{displayPath}</span>:{line}
                </div>
              );
            }
          }
        });
      }
    }
  };

  // Parcourir chaque fichier ou dossier spécifié
  for (const file of files) {
    const filePath = normalizePath(file, currentPath);

    // Vérifier si le chemin existe
    if (!pathExists(filePath, fileSystem)) {
      results.push(
        <div key={`error-${filePath}`}>
          grep: {file}: No such file or directory
        </div>
      );
      continue;
    }

    // Si c'est un dossier
    if (isDirectory(filePath, fileSystem)) {
      if (recursive) {
        // Recherche récursive dans le dossier
        searchInDirectory(filePath, filePath);
      } else {
        results.push(
          <div key={`error-${filePath}`}>
            grep: {file}: Is a directory (use -r for recursive search)
          </div>
        );
      }
      continue;
    }

    // Si c'est un fichier, chercher le motif dans son contenu
    const fileInfo = getFileInfo(filePath, fileSystem);
    if (!fileInfo) continue;

    const fileContent = fileInfo.content || "";
    const lines = fileContent.split("\n");

    // Rechercher le motif dans chaque ligne
    lines.forEach((line, lineIndex) => {
      const matches = regex.test(line);
      const shouldDisplay = invertMatch ? !matches : matches;

      if (shouldDisplay) {
        if (files.length > 1 || recursive) {
          // Si plusieurs fichiers ou recherche récursive, afficher le nom du fichier
          if (showLineNumbers) {
            results.push(
              <div key={`${filePath}-${lineIndex}`}>
                <span className="text-blue-400">{file}</span>:
                <span className="text-green-400">{lineIndex + 1}</span>:{line}
              </div>
            );
          } else {
            results.push(
              <div key={`${filePath}-${lineIndex}`}>
                <span className="text-blue-400">{file}</span>:{line}
              </div>
            );
          }
        } else {
          // Si un seul fichier, ne pas afficher le nom du fichier
          if (showLineNumbers) {
            results.push(
              <div key={`${filePath}-${lineIndex}`}>
                <span className="text-green-400">{lineIndex + 1}</span>:{line}
              </div>
            );
          } else {
            results.push(<div key={`${filePath}-${lineIndex}`}>{line}</div>);
          }
        }
      }
    });
  }

  // Si aucun résultat n'a été trouvé
  if (results.length === 0) {
    return {
      output: null,
      isError: false,
    };
  }

  return {
    output: <div>{results}</div>,
    isError: false,
  };
}

export function executeCOWSAY(
  args: string[],
  context: CommandContext
): CommandResult {
  if (args.length === 0) {
    return {
      output: <span>Usage: cowsay &lt;message&gt;</span>,
      isError: true,
    };
  }

  const message = args.join(" ");
  const messageLines =
    message.length > 40 ? splitTextIntoLines(message, 40) : [message];

  const topBorder = " " + "_".repeat(messageLines[0].length + 2);
  const bottomBorder = " " + "-".repeat(messageLines[0].length + 2);

  const textLines = messageLines.map((line, index) => {
    if (messageLines.length === 1) {
      return `< ${line} >`;
    } else if (index === 0) {
      return `/ ${line} \\`;
    } else if (index === messageLines.length - 1) {
      return `\\ ${line} /`;
    } else {
      return `| ${line} |`;
    }
  });

  const cow = `
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
  `;

  return {
    output: (
      <pre className="whitespace-pre">
        {topBorder}
        {textLines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
        {bottomBorder}
        {cow}
      </pre>
    ),
    isError: false,
  };
}

// Fonction utilitaire pour diviser le texte en lignes
function splitTextIntoLines(text: string, maxLength: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    if ((currentLine + word).length <= maxLength) {
      currentLine += (currentLine ? " " : "") + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

export function executeL33T(
  args: string[],
  context: CommandContext
): CommandResult {
  if (args.length === 0) {
    return {
      output: <span>Usage: l33t &lt;text&gt;</span>,
      isError: true,
    };
  }

  const text = args.join(" ");
  const l33tMap: Record<string, string> = {
    a: "4",
    A: "4",
    e: "3",
    E: "3",
    i: "1",
    I: "1",
    o: "0",
    O: "0",
    s: "5",
    S: "5",
    t: "7",
    T: "7",
    l: "1",
    L: "1",
    z: "2",
    Z: "2",
  };

  const l33tText = text
    .split("")
    .map((char) => l33tMap[char] || char)
    .join("");

  return {
    output: (
      <div>
        <div>Original: {text}</div>
        <div>L33t: {l33tText}</div>
      </div>
    ),
    isError: false,
  };
}

export function executeBACKDOOR(
  args: string[],
  context: CommandContext
): CommandResult {
  const { currentPath, setCurrentPath, fileSystem, setFileSystem } = context;

  // Si aucun argument n'est fourni, afficher l'aide
  if (args.length === 0) {
    return {
      output: (
        <div className="space-y-2">
          <div className="text-yellow-500">
            <div>Backdoor access detected. Authentication required.</div>
            <div>Usage: backdoor [password] [command]</div>
          </div>
          <div className="text-gray-400">
            This is a hidden command that provides privileged access to the
            system. You need to provide the correct password to use it.
          </div>
        </div>
      ),
      isError: false,
    };
  }

  // Le premier argument est le mot de passe
  const password = args[0];
  const correctPassword = "h4ck3r"; // Mot de passe simple pour l'exemple

  // Vérifier le mot de passe
  if (password !== correctPassword) {
    return {
      output: (
        <div className="text-red-500">
          <div>Access denied: Invalid authentication credentials.</div>
          <div>This attempt has been logged.</div>
        </div>
      ),
      isError: true,
    };
  }

  // Si le mot de passe est correct mais qu'il n'y a pas de sous-commande
  if (args.length === 1) {
    return {
      output: (
        <div className="space-y-2">
          <div className="text-green-500 font-bold">
            Backdoor access granted. Welcome, Administrator.
          </div>
          <div className="text-yellow-500">Available backdoor commands:</div>
          <div className="grid grid-cols-12 gap-2">
            <span className="col-span-3 text-green-500 font-bold">
              backdoor h4ck3r root
            </span>
            <span className="col-span-9">Elevate privileges to root user</span>
          </div>
          <div className="grid grid-cols-12 gap-2">
            <span className="col-span-3 text-green-500 font-bold">
              backdoor h4ck3r reveal
            </span>
            <span className="col-span-9">
              Reveal hidden files and directories
            </span>
          </div>
          <div className="grid grid-cols-12 gap-2">
            <span className="col-span-3 text-green-500 font-bold">
              backdoor h4ck3r secret
            </span>
            <span className="col-span-9">
              Access secret project information
            </span>
          </div>
          <div className="grid grid-cols-12 gap-2">
            <span className="col-span-3 text-green-500 font-bold">
              backdoor h4ck3r projects
            </span>
            <span className="col-span-9">View my confidential projects</span>
          </div>
          <div className="grid grid-cols-12 gap-2">
            <span className="col-span-3 text-green-500 font-bold">
              backdoor h4ck3r experience
            </span>
            <span className="col-span-9">
              View my detailed professional experience
            </span>
          </div>
        </div>
      ),
      isError: false,
    };
  }

  // Si le mot de passe est correct et qu'il y a une sous-commande
  const subcommand = args[1].toLowerCase();

  // Traiter les différentes sous-commandes
  switch (subcommand) {
    case "root":
      // Changer l'utilisateur en root
      isRootUser = true;
      return {
        output: (
          <div>
            <div className="text-green-500">
              Privileges elevated. You are now operating as root user.
            </div>
            <div className="text-yellow-500">
              With great power comes great responsibility.
            </div>
          </div>
        ),
        isError: false,
      };

    case "reveal":
      // Révéler les fichiers cachés dans le système
      const hiddenFiles = Object.keys(fileSystem).filter(
        (path) => fileSystem[path].hidden
      );

      return {
        output: (
          <div>
            <div className="text-green-500 font-bold">
              Hidden files and directories revealed:
            </div>
            <div className="space-y-1 mt-2">
              {hiddenFiles.length > 0 ? (
                hiddenFiles.map((path, index) => (
                  <div key={index} className="text-yellow-500">
                    {path} ({fileSystem[path].type})
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No hidden files found.</div>
              )}
            </div>
          </div>
        ),
        isError: false,
      };

    case "secret":
      // Accéder à des informations secrètes sur les projets
      return {
        output: (
          <div className="space-y-2">
            <div className="text-green-500 font-bold">
              SECRET PROJECT INFORMATION
            </div>
            <div className="text-yellow-500">Project Codename: PHOENIX</div>
            <div>
              A cutting-edge cybersecurity framework designed to detect and
              neutralize advanced persistent threats in real-time.
            </div>
            <div className="text-yellow-500 mt-2">Project Codename: NEBULA</div>
            <div>
              Distributed cloud infrastructure with zero-trust architecture and
              quantum-resistant encryption.
            </div>
            <div className="text-yellow-500 mt-2">
              Project Codename: CHIMERA
            </div>
            <div>
              AI-powered threat intelligence platform that combines multiple
              data sources to predict and prevent cyber attacks.
            </div>
            <div className="text-red-500 mt-4">
              WARNING: This information is classified. Unauthorized access is
              strictly prohibited.
            </div>
          </div>
        ),
        isError: false,
      };

    case "projects":
      // Afficher des projets confidentiels
      return {
        output: (
          <div className="space-y-3">
            <div className="text-green-500 font-bold">
              CONFIDENTIAL PROJECTS
            </div>

            <div className="border border-green-500/30 p-3 rounded">
              <div className="text-yellow-500 font-bold">
                Web Application VUlnerability Scanner (September 2024 - January
                2025)
              </div>
              <div className="text-gray-300">
                Development of a web vulnerability scanning with distributed
                architecture architecture (Python/Next.js/Redis) and
                configurable configurable YAML workflow system. Lead of a
                development team.
              </div>
              <div className="text-green-500/70 mt-1">
                Technologies: Python, Flask, Next.js, Redis, PostgreSQL, Docker,
                YAML
              </div>
            </div>

            <div className="border border-green-500/30 p-3 rounded">
              <div className="text-yellow-500 font-bold">
                Trade Invest (2023)
              </div>
              <div className="text-gray-300">
              Creation of a fictitious trading platform for the InvestDay contest organized by the IsepInvest association.
              It was possible to buy and sell stocks and cryptocurrencies with the real rates of the US market.
              </div>
              <div className="text-green-500/70 mt-1">
                Technologies: Next.js, PostgreSQL, Docker
              </div>
            </div>

            <div className="border border-green-500/30 p-3 rounded">
              <div className="text-yellow-500 font-bold">
                Carmen (2023)
              </div>
              <div className="text-gray-300">
              Project during the first year of the engineering cycle at ISEP with the aim of acquiring skills in different fields (computer science, telecom, signal, electronics).
              Creation of a project to help hospitals.
              </div>
              <div className="text-green-500/70 mt-1">
                Technologies: HTML, CSS, Javascript, PHP, SQL, MySQL
              </div>
            </div>
          </div>
        ),
        isError: false,
      };

    case "experience":
      // Afficher une expérience professionnelle détaillée
      return {
        output: (
          <div className="space-y-3">
            <div className="text-green-500 font-bold">
              DETAILED PROFESSIONAL EXPERIENCE
            </div>

            <div className="border border-green-500/30 p-3 rounded">
              <div className="text-yellow-500 font-bold">
                System, Network and Security Administrator - Bilendi
                (2023-Present)
              </div>
              <div className="text-gray-300">
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Contribute to Bilendi's growth by ensuring the stability of
                    the information system
                  </li>
                  <li>
                    Help secure information systems in a context of
                    international expansion
                  </li>
                  <li>Help improve IS supervision and maintenance processes</li>
                  <li>
                    Contribute to technical documentation and the implementation
                    of internal procedures
                  </li>
                  <li>Provide IT support to employees</li>
                </ul>
              </div>
            </div>

            <div className="border border-green-500/30 p-3 rounded">
              <div className="text-yellow-500 font-bold">
                Intern - Adamantia (June - July 2021)
              </div>
              <div className="text-gray-300">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Perform an information system audit</li>
                  <li>
                    Organize a computer security awareness activity for
                    employees
                  </li>
                  <li>Internal process automation</li>
                </ul>
              </div>
            </div>

            <div className="border border-green-500/30 p-3 rounded">
              <div className="text-yellow-500 font-bold">Technical Skills</div>
              <div className="text-gray-300">
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <span className="text-green-500">Languages:</span> HTML,
                    PHP, Python, JavaScript, TypeScript, Bash, SQL, Java
                  </li>
                  <li>
                    <span className="text-green-500">Security:</span> OWASP,
                    Penetration Testing
                  </li>
                  <li>
                    <span className="text-green-500">Infrastructure: </span>
                    Docker, LXC, Ansible
                  </li>
                  <li>
                    <span className="text-green-500">Monitoring:</span>{" "}
                    Prometheus, Grafana, Zabbix
                  </li>
                  <li>
                    <span className="text-green-500">Networking:</span> TCP/IP,
                    DNS, VPN, Firewalls, IDPS, Reverse proxy
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ),
        isError: false,
      };

    default:
      return {
        output: (
          <div className="text-red-500">
            Unknown backdoor subcommand: {subcommand}
          </div>
        ),
        isError: true,
      };
  }
}

// Modifiez la fonction getPrompt dans terminal.tsx pour utiliser isRootUser
export function getPrompt(path: string) {
  // Extraire le nom d'utilisateur et le nom d'hôte
  const username = isRootUser ? "root" : "visitor";
  const hostname = "tugdual-server";

  // Obtenir le nom du répertoire courant complet
  let currentDir = path;

  // Si nous sommes à la racine, utiliser '/' comme nom de répertoire
  if (path === "/") {
    currentDir = "/";
  }

  // Retourner le prompt formaté
  return `${username}@${hostname}:${currentDir}$`;
}

export function executeQUIT(
  args: string[],
  context: CommandContext
): CommandResult {
  // qtopper la session root si l'utilisateur est root. SInon ne rien faire
  if (isRootUser) {
    isRootUser = false;
    return {
      output: (
        <div className="space-y-2">
          <div className="text-red-500 font-bold text-lg">
            Goodbye, root user.
          </div>
          <div className="text-yellow-500 italic animate-pulse">
            <span className="font-semibold">May the Force be with you...</span>
          </div>
          <div className="text-green-500/70 text-xs mt-2">
            Terminating privileged session. All actions have been logged.
          </div>
        </div>
      ),
      isError: false,
    };
  } else {
    return {
      output: null,
      isError: false,
    };
  }
}

// Initialiser les fonctions d'exécution des commandes
export function initializeCommandFunctions() {
  commands.ls.execute = executeLS;
  commands.cd.execute = executeCD;
  commands.cat.execute = executeCAT;
  commands.help.execute = executeHELP;
  commands.pwd.execute = executePWD;
  commands.clear.execute = executeCLEAR;
  commands.ping.execute = executePING;
  commands.nmap.execute = executeNMAP;
  commands.hash.execute = executeHASH;
  commands.whoami.execute = executeWHOAMI;
  commands.find.execute = executeFIND;
  commands.exit.execute = executeEXIT;
  commands.contact.execute = executeCONTACT;
  commands.skills.execute = executeSKILLS;
  commands.aboutme.execute = executeABOUTME;
  commands.grep.execute = executeGREP;
  commands.cowsay.execute = executeCOWSAY;
  commands.l33t.execute = executeL33T;
  commands.backdoor.execute = executeBACKDOOR;
}
