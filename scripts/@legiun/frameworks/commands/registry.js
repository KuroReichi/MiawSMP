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
	system.runTimeout(() => {
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
	}, 5);
}

//===================================================================================

async function traverse(player, node, args, index, context) {
	if (index >= args.length) {
		if (node.run) {
			await node.run(player, context);
			return { success: true };
		}
		return { success: false, error: "syntax" };
	}
	const token = args[index].toLowerCase();

	// LITERAL MATCH
	const literal = node.children?.find((n) => n.type === "literal" && n.name === token);
	if (literal) {
		return traverse(player, literal, args, index + 1, context);
	}

	// ARGUMENT MATCH
	const argument = node.children?.find((n) => n.type === "argument");
	if (argument) {
		const parsed = validateArgument(player, argument, args[index]);
		if (!parsed.success) return parsed;
		context[argument.name] = parsed.value;

		return traverse(player, argument, args, index + 1, context);
	}
	return { success: false, error: "syntax", token };
}

function validateArgument(player, argument, value) {
	switch (argument.argType) {
		case "string":
			return { success: true, value };
		case "number":
			const num = Number(value);
			if (Number.isNaN(num)) {
				player.sendMessage({
					rawtext: [
						{ text: "§c" },
						{
							translate: "commands.generic.num.invalid",
							with: [`§7${value}§c`]
						}
					]
				});
				return { success: false };
			}
			return { success: true, value: num };
		case "boolean":
			if (value === "true" || value === "false") {
				return { success: true, value: value === "true" };
			}
			return { success: false };
		case "player":
			const target = [...world.getPlayers()].find((p) => p.name.toLowerCase() === value.toLowerCase());
			if (!target) {
				player.sendMessage({
					rawtext: [
						{ text: "§c" },
						{
							translate: "commands.generic.player.notFound"
						}
					]
				});
				return { success: false };
			}
			return { success: true, value: target };
		case "enum":
			if (argument.values?.includes(value)) {
				return { success: true, value };
			}
			return { success: false };
		default:
			return { success: true, value };
	}
}

//===================================================================================
