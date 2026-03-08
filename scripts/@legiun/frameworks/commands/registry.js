// registry.js
//===================================================================================

const registry = [];

export function getCommands() {
	return registry;
}

//===================================================================================

export function registerCommand(command) {
	const index = registry.findIndex((c) => c.name === command.name);
	if (index !== -1) registry.splice(index, 1);
	registry.push(command);
	registry.sort((a, b) => a.name.localeCompare(b.name));
}

//===================================================================================

export function buildCommands(apiRegistry) {
	for (const command of registry) {
		apiRegistry.registerCommand(
			{
				name: command.name,
				description: command.description ?? "",
				permissionLevel: command.permissionLevel ?? 0
			},
			(root) => {
				command.build?.(root);
			}
		);
	}
}

//===================================================================================
