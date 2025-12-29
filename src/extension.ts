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
					prompt: 'Choose a name for your new mod (e.g. "My New Mod")',
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
					prompt: 'Choose a unique package name for your new mod. The package name should be unique to you. If you are unsure about this use "name.modid" (e.g. "com.example.mynewmod")',
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

				// Step 3: Get Minecraft Version
				const minecraftVersions = [
					'1.21.11',
					'1.21.10',
					'26.1-snapshot-1',
					'1.21.9',
					'1.21.8',
					'1.21.7',
					'1.21.6',
					'1.21.5',
					'1.21.4',
					'1.21.3',
					'1.21.2',
					'1.21.1',
					'1.21',
					'1.20.6',
					'1.20.5',
					'1.20.4',
					'1.20.3',
					'1.20.2',
					'1.20.1',
					'1.20',
					'1.19.4',
					'1.19.3',
					'1.19.2',
					'1.19.1',
					'1.19',
					'1.18.2',
					'1.18.1',
					'1.18',
					'1.17.1',
					'1.17',
					'1.16.5',
					'1.16.4',
					'1.16.3',
					'1.16.2',
					'1.16.1',
					'1.16',
					'1.15.2',
					'1.15.1',
					'1.15',
					'1.14.4',
				];

				const minecraftVersion = await vscode.window.showQuickPick(
					minecraftVersions,
					{
						placeHolder: 'Select the version of Minecraft that you wish to use for your mod (e.g. "1.20.1")',
						canPickMany: false
					}
				);

				if (!minecraftVersion) {
					return;
				}

				// Step 4: Get Advanced Options
				const advancedOptions = await vscode.window.showQuickPick(
					[
						{
							label: 'Kotlin Programming Language',
							description: 'Kotlin is a alternative programming language that can be used to develop mods. The Fabric Kotlin language adapter is used to enable support for creating Fabric Kotlin mods.',
							picked: false
						},
						{
							label: 'Mojang Mappings',
							description: 'Use Mojang\'s official mappings rather than Yarn. Note that Mojang\'s mappings come with a usable yet more restrictive license than Yarn. Use them at your own risk.',
							picked: false
						},
						{
							label: 'Data Generation',
							description: 'This option configures the Fabric Data Generation API in your mod. This allows you to generate resources such as recipes from code at build time.',
							picked: false
						},
						{
							label: 'Split client and common sources',
							description: 'A common source of server crashes comes from calling client only code when installed on a server. This option configures your mod to be built from two source sets, client and main. This enforces a clear separation between the client and server code.',
							picked: false
						}
					],
					{
						placeHolder: 'Select advanced options (optional)',
						canPickMany: true
					}
				);

				const options = {
					useKotlin: advancedOptions?.some(o => o.label === 'Kotlin Support') ?? false,
					useMojangMappings: advancedOptions?.some(o => o.label === 'Mojang Mappings') ?? false,
					useDataGeneration: advancedOptions?.some(o => o.label === 'Data Generation') ?? false,
					splitSources: advancedOptions?.some(o => o.label === 'Split Sources') ?? false
				};

				// Step 5: Choose location
				const workspaceFolders = vscode.workspace.workspaceFolders;
				let targetFolder: vscode.Uri;

				if (workspaceFolders && workspaceFolders.length > 0) {
					const useWorkspace = await vscode.window.showQuickPick(
						['Current Workspace', 'Choose Different Folder'],
						{
							placeHolder: 'Finally, where should the mod be created?'
						}
					);

					if (!useWorkspace) {
						return;
					}

					if (useWorkspace === 'Current Workspace') {
						targetFolder = workspaceFolders[0].uri;
					} else {
						const selected = await vscode.window.showOpenDialog({
							canSelectFiles: false,
							canSelectFolders: true,
							canSelectMany: false,
							openLabel: 'Select Folder'
						});

						if (!selected || selected.length === 0) {
							return;
						}

						targetFolder = selected[0];
					}
				} else {
					const selected = await vscode.window.showOpenDialog({
						canSelectFiles: false,
						canSelectFolders: true,
						canSelectMany: false,
						openLabel: 'Select Folder'
					});

					if (!selected || selected.length === 0) {
						return;
					}

					targetFolder = selected[0];
				}
			} catch (error) {
				vscode.window.showErrorMessage(
					`Failed to create Fabric mod: ${error instanceof Error ? error.message : 'Unknown error'}`
				);
			}
		}
	);

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
