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

/**
 * @name pendingCommand
 * @param {object[]} query - [args...]
 * @description verifying exact words
 */
async function pendingCommand(query) {
	return new Promise((resolve, reject) => {
		for(let command of registry) {
			if(command.name === query[0] || command.aliases.includes(query[0])) {
				
			} else {
				continue;
			}
		}
	});
}
//===================================================================================
