// registry.js
//===================================================================================

const registry = [];

export function getCommands() {
	return registry;
}

export function registerCommand(command) {
		const exist = registry.find((c) => c.name === commandName || c.aliases.includes(commandName));
	registry.push(command);
	console.info(`[Push]: ${command.name} `);
}
//===================================================================================

/**
 * @name CommandQueue
 * @param {object} player - [Player Object]
 * @param {object[]} query - [args...]
 * @returns {status[Success, Failed], message}
 */
export async function CommandQueue(player, query) {
	return new Promise((resolve, reject) => {
		const command = registry.find((c) => c.name === commandName || c.aliases.includes(commandName));
		if (command) {
			command.run(player, query);
			resolve({ status: "Success", message: `Running /${command.name}` });
		} else {
			player.sendMessage([
				{ text: "§c" },
				{
					translate: "commands.generic.unknown",
					with: [query[0]]
				}
			]);
			player.playSound("note.bass");
			resolve({ status: "Failed", message: "Unknown Command" });
		}
	});
}

//===================================================================================
