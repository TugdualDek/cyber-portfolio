// app/utils/terminal/commands.tsx
import React from "react";
import { FileNode, FileSystem } from "./filesystem";
import { findConfig } from "@remix-run/dev/dist/config";

export interface CommandDefinition {
  name: string;
  description: string;
  usage: string;
  execute: (args: string[], context: CommandContext) => CommandResult;
  hidden?: boolean;
}

export interface CommandContext {
  currentPath: string;
  setCurrentPath: React.Dispatch<React.SetStateAction<string>>;
  fileSystem: FileSystem;
}

export interface CommandResult {
  output: React.ReactNode;
  isError: boolean;
}

// Définition des commandes disponibles
export const commands: Record<string, CommandDefinition> = {
  ls: {
    name: "ls",
    description: "List the content of a directory",
    usage: "ls [-a] [-l] [path]",
    execute: (args, context) => {
      // Cette fonction sera implémentée dans le fichier commandFunctions.tsx
      // retourne rien pour le moment
      return { output: null, isError: false };
    },
  },

  cd: {
    name: "cd",
    description: "Change directory",
    usage: "cd [directory]",
    execute: (args, context) => {
      // Cette fonction sera implémentée dans le fichier commandFunctions.tsx
      return { output: null, isError: false };
    },
  },

  cat: {
    name: "cat",
    description: "Print the content of a file",
    usage: "cat [file]",
    execute: (args, context) => {
      // Cette fonction sera implémentée dans le fichier commandFunctions.tsx
      return { output: null, isError: false };
    },
  },
  help: {
    name: "help",
    description: "Display help information",
    usage: "help [command]",
    execute: (args, context) => {
      // Cette fonction sera implémentée dans le fichier commandFunctions.tsx
      return { output: null, isError: false };
    },
  },
  pwd: {
    name: "pwd",
    description: "Print the current working directory",
    usage: "pwd",
    execute: (args, context) => {
      // Cette fonction sera implémentée dans le fichier commandFunctions.tsx
      return { output: null, isError: false };
    },
  },
  contact: {
    name: "contact",
    description: "Contact me",
    usage: "contact",
    execute: (args, context) => {
      // Cette fonction sera implémentée dans le fichier commandFunctions.tsx
      return { output: null, isError: false };
    },
  },
  clear: {
    name: "clear",
    description: "Clear the terminal",
    usage: "clear",
    execute: (args, context) => {
      // Cette fonction sera implémentée dans le fichier commandFunctions.tsx
      return { output: null, isError: false };
    },
  },
  ping: {
    name: "ping",
    description: "Send ICMP packets to target",
    usage: "ping [options] <destination>",
    execute: (args, context) => {
      // Cette fonction sera implémentée dans le fichier commandFunctions.tsx
      return { output: null, isError: false };
    },
  },
  skills: {
    name: "skills",
    description: "Display my skills",
    usage: "skills",
    execute: (args, context) => {
      // Cette fonction sera implémentée dans le fichier commandFunctions.tsx
      return { output: null, isError: false };
    },
  },
  nmap: {
    name: "nmap",
    description: "Network exploration tool and security / port scanner",
    usage: "nmap [Scan Type] [Options] {target specification}",
    execute: (args, context) => {
      // Cette fonction sera implémentée dans le fichier commandFunctions.tsx
      return { output: null, isError: false };
    },
  },
  hash: {
    name: "hash",
    description: "Generate hash of a text",
    usage: "hash [options] <text>",
    execute: (args, context) => {
      // Cette fonction sera implémentée dans le fichier commandFunctions.tsx
      return { output: null, isError: false };
    },
  },
  whoami: {
    name: "whoami",
    description: "Print the current user",
    usage: "whoami",
    execute: (args, context) => {
      // Cette fonction sera implémentée dans le fichier commandFunctions.tsx
      return { output: null, isError: false };
    },
  },
  aboutme: {
    name: "aboutme",
    description: "About me",
    usage: "aboutme",
    execute: (args, context) => {
      // Cette fonction sera implémentée dans le fichier commandFunctions.tsx
      return { output: null, isError: false };
    },
  },
  find: {
    name: "find",
    description: "Search for files in a directory hierarchy",
    usage: "find [path] [expression]",
    execute: (args, context) => {
      // Cette fonction sera implémentée dans le fichier commandFunctions.tsx
      return { output: null, isError: false };
    },
  },
  projects: {
    name: "projects",
    description: "List of projects",
    usage: "projects",
    execute: (args, context) => {
      // Cette fonction sera implémentée dans le fichier commandFunctions.tsx
      return { output: null, isError: false };
    },
  },
  grep: {
    name: "grep",
    description: "Search for patterns in files",
    usage: "grep [options] pattern [file...]",
    execute: (args, context) => {
      // Cette fonction sera implémentée dans le fichier commandFunctions.tsx
      return { output: null, isError: false };
    },
  },
  exit: {
    name: "exit",
    description: "Exit the session",
    usage: "exit",
    execute: (args, context) => {
      // Cette fonction sera implémentée dans le fichier commandFunctions.tsx
      return { output: null, isError: false };
    },
  },
};
