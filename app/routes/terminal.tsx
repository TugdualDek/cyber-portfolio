// app/routes/terminal.tsx
import { useState, useRef, useEffect } from "react";
import { MetaFunction, LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  initialFileSystem,
  FileSystem,
  getDirectoryContents,
  pathExists,
  isDirectory,
  normalizePath,
} from "../constants/filesystem";
import { commands } from "../constants/commands";
import { executeCommand } from "~/utils/terminal/commandExecutor";
import { initializeCommandFunctions, isRootUser } from "~/utils/terminal/commandFunctions";

// Fonction loader pour récupérer l'adresse IP du client
export const loader: LoaderFunction = async ({ request }) => {
  // Récupérer l'IP du client depuis les en-têtes de la requête
  const headers = request.headers;
  const forwardedFor = headers.get("x-forwarded-for");
  const clientIP = forwardedFor
    ? forwardedFor.split(",")[0].trim()
    : request.headers.get("x-real-ip") || "192.168.13.84";

  return json({ clientIP });
};

export const meta: MetaFunction = () => [
  { title: "Terminal - Tugdual de Kerdrel" },
  { name: "description", content: "Terminal interactif - Tugdual de Kerdrel" },
];

interface HistoryItem {
  command: string;
  output: React.ReactNode;
  isError?: boolean;
  path: string; // Stocker le chemin au moment de l'exécution
}

export default function Terminal() {
  // Récupérer l'IP du client depuis le loader
  const { clientIP } = useLoaderData<{ clientIP: string }>();

  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentPath, setCurrentPath] = useState("/home/visitor");
  const [fileSystem, setFileSystem] = useState<FileSystem>(initialFileSystem);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Initialiser les fonctions de commande
  useEffect(() => {
    initializeCommandFunctions();
  }, []);

  const focusInput = (e: React.MouseEvent) => {
    // Ne pas rediriger le focus si l'utilisateur est en train de sélectionner du texte
    if (window.getSelection()?.toString()) {
      return;
    }
    
    // Ne pas rediriger le focus si l'utilisateur a cliqué sur un élément interactif
    if (
      e.target instanceof HTMLAnchorElement || 
      e.target instanceof HTMLButtonElement ||
      e.target instanceof HTMLInputElement
    ) {
      return;
    }
    
    inputRef.current?.focus();
  };

  // Scroll to bottom when history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Fonction pour obtenir le prompt du terminal basé sur le chemin
  const getPrompt = (path: string) => {
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
  };

  // Fonction pour générer une suggestion d'autocomplétion
  const generateCompletion = (inputValue: string): string | null => {
    // Si l'entrée est vide, pas de complétion
    if (!inputValue.trim()) {
      return null;
    }

    // Diviser l'entrée en commande et arguments
    const parts = inputValue.trim().split(/\s+/);
    const command = parts[0].toLowerCase();

    // Si nous n'avons que la commande (sans espace), suggérer des commandes
    if (parts.length === 1 && !inputValue.endsWith(" ")) {
      const commandSuggestions = Object.keys(commands)
        .filter((cmd) => cmd.startsWith(command))
        .sort();

      if (commandSuggestions.length > 0) {
        return commandSuggestions[0]; // Retourner la première suggestion
      }
      return null;
    }

    // Si nous avons une commande et des arguments, suggérer des chemins de fichiers
    if (parts.length > 1 || inputValue.endsWith(" ")) {
      // Obtenir le dernier argument (potentiellement un chemin)
      const lastArg = inputValue.endsWith(" ") ? "" : parts[parts.length - 1];

      // Déterminer le répertoire parent et le préfixe du fichier
      let parentDir = currentPath;
      let filePrefix = "";

      if (lastArg.includes("/")) {
        // Si le chemin contient des '/', séparer le répertoire parent et le préfixe
        const lastSlashIndex = lastArg.lastIndexOf("/");
        const dirPart = lastArg.substring(0, lastSlashIndex);
        filePrefix = lastArg.substring(lastSlashIndex + 1);

        // Normaliser le chemin du répertoire parent
        parentDir = normalizePath(dirPart || "/", currentPath);
      } else {
        filePrefix = lastArg;
      }

      // Vérifier si le répertoire parent existe et est un répertoire
      if (
        pathExists(parentDir, fileSystem) &&
        isDirectory(parentDir, fileSystem)
      ) {
        // Obtenir le contenu du répertoire
        const dirContents = getDirectoryContents(parentDir, fileSystem, true);

        // Filtrer les fichiers qui correspondent au préfixe
        const fileSuggestions = dirContents
          .filter((path) => {
            const fileName = path.split("/").pop() || "";
            return fileName.startsWith(filePrefix);
          })
          .map((path) => {
            const fileName = path.split("/").pop() || "";
            // Ajouter un '/' à la fin des répertoires
            if (isDirectory(path, fileSystem)) {
              return fileName + "/";
            }
            return fileName;
          })
          .sort();

        if (fileSuggestions.length > 0) {
          // Construire la suggestion complète
          const suggestion = fileSuggestions[0];
          const newParts = [...parts];

          if (inputValue.endsWith(" ")) {
            newParts.push(suggestion);
          } else {
            newParts[newParts.length - 1] = lastArg.includes("/")
              ? lastArg.substring(0, lastArg.lastIndexOf("/") + 1) + suggestion
              : suggestion;
          }

          return newParts.join(" ");
        }
      }
    }

    return null;
  };

  // Add initial welcome message
  useEffect(() => {
    const welcomeMessage = `Debian GNU/Linux 12 (Bookworm)
tugdual-portfolio: SSH-2.0-OpenSSH_8.4p1 Debian-5+deb11u1

  ████████╗██╗   ██╗ ██████╗ ██████╗ ██╗   ██╗ █████╗ ██╗     
  ╚══██╔══╝██║   ██║██╔════╝ ██╔══██╗██║   ██║██╔══██║██║     
     ██║   ██║   ██║██║  ███╗██║  ██║██║   ██║███████║██║         
     ██║   ╚██████╔╝╚██████╔╝██████╔╝╚██████╔╝██║  ██║███████╗
     ╚═╝    ╚═════╝  ╚═════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝
                                                               
Last connection: ${new Date().toUTCString()} from ${clientIP}
System: Debian GNU/Linux 12 (Bookworm)
Kernel: Linux 5.10.0-20-amd64 x86_64

Welcome to my interactive portfolio terminal!
You have been granted limited visitor access.
To discover my skills and projects, you'll need to explore the system...

Explore this terminal with Linux commands 
Find hidden secrets if you're curious
Or simply visit my classic website by typing 'exit'

This is a WIP. It is not finished, expect bugs and incomplete features.

Type 'help' to get the list of available commands.
Press Tab for autocompletion.`;

    setHistory([
      {
        command: "",
        output: (
          <div className="text-green-500 font-mono whitespace-pre-wrap">
            {welcomeMessage}
          </div>
        ),
        path: currentPath,
      },
    ]);
  }, [clientIP]);

  // Handle command execution
  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();

    // Skip empty commands
    if (!trimmedCmd) {
      return;
    }

    // Add to command history for up/down navigation
    setCommandHistory((prev) => [trimmedCmd, ...prev]);
    setHistoryIndex(-1);

    // Créer le contexte pour l'exécution de la commande
    const commandContext = {
      currentPath,
      setCurrentPath,
      fileSystem,
      setFileSystem,
    };

    // Exécuter la commande
    const result = executeCommand(trimmedCmd, commandContext);

    // Traitement spécial pour la commande clear
    if (trimmedCmd.toLowerCase() === "clear") {
      setHistory([]);
    } else {
      // Ajouter la commande et son résultat à l'historique avec le chemin actuel
      setHistory((prev) => [
        ...prev,
        {
          command: trimmedCmd,
          output: result.output,
          isError: result.isError,
          path: currentPath, // Stocker le chemin actuel avec la commande
        },
      ]);
    }

    // Clear input
    setInput("");
  };

  // Handle key presses
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input);
    } else if (e.key === "Tab") {
      e.preventDefault();

      // Générer une suggestion d'autocomplétion
      const completion = generateCompletion(input);

      // Si une suggestion est disponible, l'appliquer
      if (completion) {
        setInput(completion);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <div
      className="min-h-screen  text-green-500 font-mono p-2 sm:p-4"
      onClick={focusInput}
    >
      {/* Terminal window */}
      <div className="w-full max-w-5xl mx-auto border border-green-500/30 rounded-md overflow-hidden">
        {/* Terminal header */}
        <div className="px-2 sm:px-4 py-2 bg-gray-900 border-b border-green-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500/70"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500/70"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500/70"></div>
          </div>
          <span className="text-[10px] sm:text-xs text-green-500/60">
            {getPrompt(currentPath)}
          </span>
          <div></div> {/* Spacer for flex justify-between */}
        </div>

        {/* Terminal content */}
        <div
          ref={terminalRef}
          className="h-[85vh] p-2 sm:p-4 overflow-y-auto text-xs sm:text-sm space-y-2 bg-black"
        >
          {history.map((item, index) => (
            <div key={index} className="space-y-1">
              {item.command && (
                <div className="flex flex-wrap">
                  <span className="text-blue-400 mr-2 text-xs sm:text-sm whitespace-nowrap">
                    {getPrompt(item.path)}{" "}
                    {/* Utiliser le chemin stocké pour cette commande */}
                  </span>
                  <span className="text-green-500 text-xs sm:text-sm">
                    {item.command}
                  </span>
                </div>
              )}
              <div
                className={`pl-0 ${
                  item.isError ? "text-red-400" : "text-green-500/90"
                } text-xs sm:text-sm`}
              >
                {item.output}
              </div>
            </div>
          ))}

          {/* Input line */}
          <div className="flex flex-wrap items-center">
            <span className="text-blue-400 mr-2 text-xs sm:text-sm whitespace-nowrap">
              {getPrompt(currentPath)}
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-green-500 text-xs sm:text-sm min-w-0 caret-yellow-500"
              autoFocus
              spellCheck="false"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
