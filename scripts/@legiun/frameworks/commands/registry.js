//===================================================================================

const commandMap = new Map();
const rootCommands = new Map();

export function getCommands() {
	return [...rootCommands.values()];
}

/**
 * --------------------------------------------------
 * @name registerCommand
 * @description Register command and its aliases into a single lookup map.
 * @function
 * @param {object} command
 * --------------------------------------------------
 */
export function registerCommand(command) {
	if (commandMap.has(command.name)) {
		console.error(`"${command.name}" already registered.`);
		return;
	}
	command.aliases ??= [];
	command.children ??= [];

	rootCommands.set(command.name, command);
	commandMap.set(command.name, command);

	for (const alias of command.aliases) {
		if (commandMap.has(alias)) {
			console.warn(`[Shift]: Ignoring alias of ${command.name} > "${alias}", conflict with other comamnds aliases.`);
			continue;
		}
		commandMap.set(alias, command);
	}

	console.info(`[Push] Command "${command.name}" registered.`);
}

/**
 * --------------------------------------------------
 * @name CommandQueue
 * @description Resolve command and traverse its literal/argument tree.
 * @function
 * @param {Player} player
 * @param {string[]} args
 * --------------------------------------------------
 */
export async function CommandQueue(player, args) {
	const name = args[0]?.toLowerCase();
	const command = commandMap.get(name);
	if (!command) {
		player.sendMessage({
			rawtext: [
				{ text: "§c" },
				{
					translate: "commands.generic.unknown",
					with: [`§7${name}§c`]
				}
			]
		});
		player.playSound("note.bass");
		return { status: "Failed", message: "Unknown command" };
	}
	const success = await traverse(player, command, args, 1, {});
	if (!success) {
		player.sendMessage({
			rawtext: [
				{ text: "§c" },
				{
					translate: "commands.generic.syntax",
					with: [`§7${args.join(" ")}§c`]
				}
			]
		});
		player.playSound("note.bass");
		return { status: "Failed", message: "Invalid usage" };
	}
	return { status: "Success", message: `Running /${command.name}` };
}

//===================================================================================

async function traverse(player, node, args, index, context) {
	if (index >= args.length) {
		if (node.run) {
			await node.run(player, context);
			return true;
		}
		return false;
	}
	const token = args[index].toLowerCase();
	// Literal
	const literal = node.children?.find((n) => n.type === "literal" && n.name === token);
	if (literal) {
		return traverse(player, literal, args, index + 1, context);
	}

	// Argument
	const argument = node.children?.find((n) => n.type === "argument");
	if (argument) {
		context[argument.name] = parseArgument(argument.argType, args[index]);
		return traverse(player, argument, args, index + 1, context);
	}
	return false;
}

function parseArgument(type, value) {
	switch (type) {
		case "number":
			return Number(value);
		case "string":
			return value;
		case "player":
			return value;
		default:
			return value;
	}
}

//===================================================================================
