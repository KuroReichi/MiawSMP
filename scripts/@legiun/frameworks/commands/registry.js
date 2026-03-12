// registry.js
//===================================================================================

const registry = [];

export function getCommands() {
	return registry;
}

export function registerCommand(command) {
	registry.push(command);
	console.info(`[Push]: ${command.name} has been added`);
}
//===================================================================================

async function pendingCommand(command) {
	return new Promise((resolve, reject) => {
		registry;
	});
}
//===================================================================================
