//===================================================================================
const registry = new Map();
export function getCommands() {
	return [...registry.values()];
}

/**
 * --------------------------------------------------
 * @name registerCommand
 * @description Register root command
 * @function
 * @param {object} command
 * --------------------------------------------------
 */
export function registerCommand(command) {
	if (registry.has(command.name)) {
		console.error(`Command "${command.name}" already registered.`);
		return;
	}
	command.aliases ??= [];
	command.children ??= [];
	registry.set(command.name, command);
	console.info(`[Push] Command "${command.name}" registered.`);
}

/**
 * --------------------------------------------------
 * @name CommandQueue
 * @description Execute command tree
 * @function
 * @param {Player} player
 * @param {string[]} args
 * --------------------------------------------------
 */
export async function CommandQueue(player, args) {
	const rootName = args[0]?.toLowerCase();
	let command = registry.get(rootName);
	if (!command) {
		command = [...registry.values()].find((c) => (c.aliases ?? []).includes(rootName));
	}
	if (!command) {
		player.sendMessage(`§cUnknown command.`);
		player.playSound("note.bass");
		return { status: "Failed", message: "Unknown command" };
	}
	const result = await traverse(player, command, args, 1, {});
	if (!result) {
		player.sendMessage(`§cInvalid usage.`);
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
		context[argument.name] = parseArgument(argument.type, args[index]);
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
