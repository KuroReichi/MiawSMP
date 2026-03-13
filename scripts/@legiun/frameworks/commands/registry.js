//===================================================================================

const registry = [];

export function getCommands() {
	return registry;
}

/**
 * --------------------------------------------------
 * @name registerCommand
 * @description Register command into registry and remove conflicting aliases.
 * @param {object} command Command configuration object
 * --------------------------------------------------
 */
export function registerCommand(command) {
	let exist = registry.find((c) => c.name === command.name);
	if (exist) {
		console.error(`${command.name} already registered.`);
		return;
	}
	command.aliases = command.aliases.filter((alias) => {
		let conflict = registry.find((c) => c.aliases.includes(alias));
		if (conflict) {
			console.info(`[Remove] Alias "${alias}" of ${command.name} removed (conflict with ${conflict.name})`);
			return false;
		}
		return true;
	});
	registry.push(command);
	console.info(`[Push]: ${command.name} has been registered.`);
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
		const command = registry.find((c) => c.name === query[0].toLowerCase() || c.aliases.includes(query[0].toLowerCase()));
		if (command) {
			command.run(player, query);
			resolve({ status: "Success", message: `Running /${command.name}` });
		} else {
			player.sendMessage([
				{ text: "§c" },
				{
					translate: "commands.generic.unknown",
					with: [`§7${query[0]}9c`]
				}
			]);
			player.playSound("note.bass");
			resolve({ status: "Failed", message: "Unknown Command" });
		}
	});
}

//===================================================================================
