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
      output: <span>{targetPath} id not a directory</span>,
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
      output: <span>Usage: ping [options] &lt;destination&gt;</span>,
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
              ping: option invalide -- c: '{args[i + 1]}' n'est pas un nombre
              valide
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
          output: <span>ping: option non reconnue: {args[i]}</span>,
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
      output: <span>ping: aucune destination spécifiée</span>,
      isError: true,
    };
  }

  // Vérifier si la destination est valide
  const ipRegex =
    /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)+([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$/;

  if (!ipRegex.test(destination)) {
    return {
      output: <span>ping: nom ou service inconnu: {destination}</span>,
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
        64 octets de {destination}: icmp_seq={i + 1} ttl=64 temps={time} ms
      </div>
    );
  }

  const avgTime = Math.round(totalTime / count);

  return {
    output: (
      <div>
        <div>PING {destination} 56(84) octets de données.</div>
        {pingResults}
        <div>--- {destination} statistiques ping ---</div>
        <div>
          {count} paquets transmis, {count} reçus, 0% packet loss, time{" "}
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
          <div>Usage: nmap [options] &lt;cible&gt;</div>
          <div>Options principales:</div>
          <div>-sS: Scan TCP SYN (furtif)</div>
          <div>-sV: Détection de version</div>
          <div>-p: Spécifier les ports à scanner (ex: -p 1-100)</div>
          <div>-A: Détection agressive (OS, version, scripts, traceroute)</div>
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
      output: <span>nmap: aucune cible spécifiée</span>,
      isError: true,
    };
  }

  // Vérifier si la cible est valide
  const ipRegex =
    /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)+([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$/;

  if (!ipRegex.test(target)) {
    return {
      output: (
        <span>
          nmap: Impossible de résoudre "{target}": Nom ou service inconnu
        </span>
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
    80: { name: "http", version: "Apache httpd 2.4.41" },
    443: { name: "https", version: "nginx 1.18.0" },
    3306: { name: "mysql", version: "MySQL 8.0.27-0ubuntu0.20.04.1" },
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
          <div>Usage: hash &lt;algorithme&gt; &lt;texte&gt;</div>
          <div>Algorithmes disponibles: md5, sha1, sha256, sha512</div>
          <div>Exemple: hash md5 "Hello World"</div>
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
      output: <span>Algorithme non supporté: {algorithm}</span>,
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
        <div>Texte: {text}</div>
        <div>Algorithme: {algorithm}</div>
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
          <div>Usage: find [chemin] [options]</div>
          <div>Options:</div>
          <div>
            {" "}
            -name PATTERN Recherche les fichiers dont le nom correspond au motif
          </div>
          <div>
            {" "}
            -type TYPE Recherche les fichiers d'un certain type (f: fichier, d:
            répertoire)
          </div>
          <div>
            {" "}
            -size [+/-]N Recherche les fichiers de taille N (+ pour plus grand,
            - pour plus petit)
          </div>
          <div> -maxdepth N Limite la profondeur de recherche à N niveaux</div>
          <div>Exemple: find /home -name "*.txt" -type f</div>
        </div>
      ),
      isError: true,
    };
  }

  const { currentPath, fileSystem } = context;

  // Analyser les arguments
  let startPath = args[0];
  let options: { [key: string]: string } = {};

  // Si le premier argument ne commence pas par un tiret, c'est le chemin de départ
  // Sinon, utiliser le chemin courant
  if (!startPath.startsWith("-")) {
    // Normaliser le chemin de départ
    startPath = normalizePath(startPath, currentPath);

    // Extraire les options (paires clé-valeur)
    for (let i = 1; i < args.length; i += 2) {
      if (args[i].startsWith("-") && i + 1 < args.length) {
        options[args[i].substring(1)] = args[i + 1];
      }
    }
  } else {
    // Si le premier argument est une option, utiliser le chemin courant
    startPath = currentPath;

    // Extraire les options (paires clé-valeur)
    for (let i = 0; i < args.length; i += 2) {
      if (args[i].startsWith("-") && i + 1 < args.length) {
        options[args[i].substring(1)] = args[i + 1];
      }
    }
  }

  // Vérifier si le chemin de départ existe
  if (!pathExists(startPath, fileSystem)) {
    return {
      output: (
        <span>find: '{startPath}': Aucun fichier ou dossier de ce type</span>
      ),
      isError: true,
    };
  }

  // Vérifier si le chemin de départ est un répertoire
  if (!isDirectory(startPath, fileSystem)) {
    return {
      output: <span>find: '{startPath}' n'est pas un répertoire</span>,
      isError: true,
    };
  }

  // Fonction pour vérifier si un fichier correspond aux critères de recherche
  const matchesCriteria = (path: string): boolean => {
    // Vérifier le type de fichier
    if (options.type) {
      const isDir = isDirectory(path, fileSystem);
      if (options.type === "f" && isDir) return false;
      if (options.type === "d" && !isDir) return false;
    }

    // Vérifier le nom du fichier
    if (options.name) {
      const fileName = path.split("/").pop() || "";
      const pattern = options.name.replace(/\*/g, ".*").replace(/\?/g, ".");
      const regex = new RegExp(`^${pattern}$`);
      if (!regex.test(fileName)) return false;
    }

    // Vérifier la taille du fichier (simulation)
    if (options.size) {
      // Dans un vrai système, on vérifierait la taille réelle du fichier
      // Ici, on simule simplement en fonction du nom du fichier
      const fileName = path.split("/").pop() || "";
      const fileSize = fileName.length * 100; // Taille simulée en octets

      const sizeValue = options.size;
      if (sizeValue.startsWith("+")) {
        const minSize = parseInt(sizeValue.substring(1));
        if (fileSize <= minSize) return false;
      } else if (sizeValue.startsWith("-")) {
        const maxSize = parseInt(sizeValue.substring(1));
        if (fileSize >= maxSize) return false;
      } else {
        const exactSize = parseInt(sizeValue);
        if (fileSize !== exactSize) return false;
      }
    }

    return true;
  };

  // Fonction récursive pour parcourir l'arborescence
  const findFiles = (dir: string, depth: number = 0): string[] => {
    // Vérifier la profondeur maximale
    const maxDepth = options.maxdepth ? parseInt(options.maxdepth) : Infinity;
    if (depth > maxDepth) return [];

    const results: string[] = [];

    // Ajouter le répertoire courant s'il correspond aux critères
    if (matchesCriteria(dir)) {
      results.push(dir);
    }

    // Si c'est un répertoire, parcourir son contenu
    if (isDirectory(dir, fileSystem)) {
      const contents = getDirectoryContents(dir, fileSystem);

      for (const item of contents) {
        // Récursivement trouver les fichiers dans les sous-répertoires
        const itemResults = findFiles(item, depth + 1);
        results.push(...itemResults);
      }
    }

    return results;
  };

  // Exécuter la recherche
  const foundFiles = findFiles(startPath);

  // Formater les résultats
  if (foundFiles.length === 0) {
    return {
      output: <span>Aucun résultat trouvé.</span>,
      isError: false,
    };
  }

  return {
    output: (
      <div>
        {foundFiles.map((file, index) => (
          <div key={index}>{file}</div>
        ))}
      </div>
    ),
    isError: false,
  };
}

export function executeEXIT(
  args: string[],
  context: CommandContext
): CommandResult {
  // cette commande te fais revenir ala page / de mon site
  window.location.href = "/";
  return {
    output: <span>You are leaving the terminal. Goodbye!</span>,
    isError: false,
  };
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
          <span className="text-green-500 font-bold">Email: <a href="mailto:tugdualk@hotmail.com" >tugdualk@hotmail.com</a></span>
          <br/>
          <span className="text-green-500 font-bold">LinkedIn: </span>
          <a
            href="https://www.linkedin.com/in/tugdual-de-kerdrel/"
            target="_blank"
            rel="noreferrer"
            className="text-blue-400"
          >
            Tugdual de Kerdrel
          </a>
          <br/>
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
          <span className="text-green-500 font-bold">🈸 Languages: </span> HTML, JavaScript,
          TypeScript, Python, Java, SQL, PHP
        </div>
        <div>
          <span className="text-green-500 font-bold">📺 Frontend: </span> React, Next.js,
          Remix.js, Tailwind CSS, HTML, CSS
        </div>
        <div>
          <span className="text-green-500 font-bold">⚙ Backend: </span> Node.js, Next.js,
          Flask, Spring Boot, Nest.js
        </div>
        <div>
          <span className="text-green-500 font-bold">💾 Databases: </span> MySQL, PostgreSQL
        </div>
        <div>
          <span className="text-green-500 font-bold">🖥 DevOps: </span> Docker, LXC, GitLab CI
        </div>
        <div>
          <span className="text-green-500 font-bold">🛠 Tools: </span> Raspberry-pi, Arduino, SDR, ZimaBoard
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
          <br/><span className="text-green-500">Name: </span> Tugdual AUDREN de KERDREL
          <br/><span className="text-green-500">Role: </span> System Administrator at Bilendi
          <br/>I'm a final-year
          engineering student at ISEP 👋, specializing in cybersecurity and
          networks📡. <br/>Passionate about information systems security, I combine
          technical expertise and curiosity to meet the challenges of
          cybersecurity. <br/>Experience in web development and a strong interest in
          artificial intelligence🤖.
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
                  <span className="text-green-400">{lineIndex + 1}</span>:
                  {line}
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
                <span className="text-green-400">{lineIndex + 1}</span>:
                {line}
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
}
