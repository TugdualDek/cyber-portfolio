// app/utils/terminal/commandExecutor.tsx
import { commands, CommandContext, CommandResult } from "../../constants/commands";
//import { initializeCommandFunctions } from "./commandFunctions";

// Initialiser les fonctions d'exécution des commandes
//initializeCommandFunctions();

// Fonction principale pour exécuter une commande
export function executeCommand(
  commandLine: string,
  context: CommandContext
): CommandResult {
  // Ignorer les commandes vides
  const trimmedCommand = commandLine.trim();
  if (!trimmedCommand) {
    return {
      output: null,
      isError: false
    };
  }
  
  // Analyser la commande et les arguments
  const args = trimmedCommand.split(/\s+/);
  const commandName = args[0].toLowerCase();
  const commandArgs = args.slice(1);
  
  // Vérifier si la commande existe
  const command = commands[commandName];
  if (!command) {
    return {
      output: (
        <span>
          Unknown command: {commandName}. Type 'help' to see all available commands.
        </span>
      ),
      isError: true
    };
  }
  
  // Exécuter la commande
  try {
    return command.execute(commandArgs, context);
  } catch (error) {
    return {
      output: <span>Error during the execution of the command: {(error as Error).message}</span>,
      isError: true
    };
  }
}
