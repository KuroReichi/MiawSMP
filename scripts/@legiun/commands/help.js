import { registerCommand, getCommands } from "../frameworks/commands/registry.js";
import { configs } from "../../configs.js";

const PAGE_SIZE = 10;
const prefix = configs.commandPrefix;

/**
 * --------------------------------------------------
 * @name buildUsages
 * @description Generate all command usage paths from command tree
 * @function
 * @param {object} node
 * @param {string[]} path
 * --------------------------------------------------
 */
function buildUsages(node, path = []) {
	const usages = [];
	if (node.run) usages.push(path.join(" "));
	if (!node.children) return usages;

	for (const child of node.children) {
		if (child.type === "literal") {
			usages.push(...buildUsages(child, [...path, child.name]));
		} else if (child.type === "argument") {
			usages.push(...buildUsages(child, [...path, `<${child.name}:${child.argType}>`]));
		}
	}
	return usages;
}
/**
 * --------------------------------------------------
 * @name helpCommand
 * @description Display command list or command detail
 * @function
 * @param {Player} player
 * @param {object} args
 * --------------------------------------------------
 */
function helpCommand(player, args) {
	const commands = getCommands();
	const arg = args.query;

	if (!arg || !isNaN(arg)) {
		const page = Math.max(Number(arg) || 1, 1);
		const totalPages = Math.max(Math.ceil(commands.length / PAGE_SIZE), 1);
		const start = (page - 1) * PAGE_SIZE;
		const end = start + PAGE_SIZE;

		const list = commands.slice(start, end);

		player.sendMessage(`§2--- §aShowing help page §7${page} §aof §7${totalPages} §g(§6${prefix}§ehelp §7<page:int|command:string>§g) §2---§r`);
		for (const cmd of list) {
			const aliasText = cmd.aliases?.length ? ` §7[${cmd.aliases.join(", ")}]` : "";
			player.sendMessage(`  §2» §f${prefix}${cmd.name} §2(§a${aliasText}§2) §7- §f${cmd.description ?? ""}`);
		}
		player.sendMessage(`§7Use ${prefix}help <command:commandName> for the details`);
		return;
	}

	const name = arg.toLowerCase();
	const command = commands.find((c) => c.name === name || (c.aliases ?? []).includes(name));

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
		return;
	}

	player.sendMessage(`§2--- §aCommand§7: §f${command.name} §2---`);

	if (command.description) {
		player.sendMessage(`§a${command.description}`);
	}

	if (command.aliases?.length) {
		player.sendMessage(`§3Aliases§7: §f${command.aliases.join(", ")}`);
	}

	const usages = buildUsages(command, [`${prefix}${command.name}`]);

	player.sendMessage(`§eUsages:`);

	for (const usage of usages) {
		player.sendMessage({
			rawtext: [{ text: `  §3» §f${prefix}${usage}` }]
		});
	}
}

//===================================================================================

registerCommand({
	name: "help",
	aliases: ["?"],
	description: "Show command list or command details",
	children: [
		{
			type: "argument",
			name: "query",
			argType: "string",
			run: helpCommand
		}
	],
	run: helpCommand
});
