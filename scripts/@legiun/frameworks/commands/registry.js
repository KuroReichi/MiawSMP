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

async function pendingCommand(query) {
	return new Promise((resolve, reject) => {
		for(command of registry) {
			if(command.name === query[0] || command.aliases) 
		}
	});
}
//===================================================================================
