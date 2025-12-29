// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
// import { generateFabricMod } from "./generation";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand(
		"fabric-mod-generator.createMod",
		async () => {
			try {
				// Step 1: Get Mod Name
				const modName = await vscode.window.showInputBox({
					prompt: 'Enter your mod name (e.g. "My New Mod")',
					placeHolder: "My New Mod",
					//   Validation Checks
					validateInput: (input) => {
						if (
							!input ||
							input.trim() === "" ||
							input.trim().length === 0 ||
							input.trim().length > 64
						) {
							return "Mod name cannot be empty or longer than 64 characters";
						}
						return null;
					},
				});

				if (!modName) {
					return;
				}

				// Step 2: Get Package Name
				const modPackage = await vscode.window.showInputBox({
					prompt: 'Enter your mod package name (e.g. "com.example.mynewmod")',
					placeHolder: "com.example.mynewmod",
					value: `com.example.${modName.toLowerCase().replace(/\s+/g, "")}`,
					//   Validation Checks
					validateInput: (input) => {
						if (
							!input ||
							input.trim() === "" ||
							input.trim().length === 0 ||
							input.trim().length > 64
						) {
							return "Package name is required";
						}
						if (!/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/.test(input)) {
							return "Invalid package name format (e.g., com.example.mynewmod)";
						}
						return null;
					},
				});

				if (!modPackage) {
					return;
				}
			} catch (error) {
				vscode.window.showErrorMessage(
					`Failed to create Fabric mod: ${error instanceof Error ? error.message : "Unknown error"
					}`
				);
			}
		}
	);

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
