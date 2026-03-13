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
 * @name CommandQueue
 * @param {object} player - [Player Object]
 * @param {object[]} query - [args...]
 * @description verifying exact words of first arguments.
 */
export async function CommandQueue(player, query) {
	return new Promise((resolve, reject) => {
		const command = registry.find((c) => c.name === commandName || c.aliases.includes(commandName));
		if (command) {
		} else {
			player.sendMessage([
				{
					"translate": "",
					"with": []
				}
			]);
		}
	});
}

async function runCommand(args) {}
//===================================================================================
